import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PollingConfig } from './entities/polling-config.entity';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';

@Injectable()
export class IsapiClientService {
    private readonly logger = new Logger(IsapiClientService.name);

    constructor(private readonly httpService: HttpService) { }

    async searchEvents(config: PollingConfig, startTime: Date, endTime: Date, searchResultPosition: number = 0, searchID?: string): Promise<{ events: any[], hasMore: boolean }> {
        const url = `http://${config.ipAddress}:${config.port}/ISAPI/AccessControl/AcsEvent?format=json`;

        // Use provided searchID for pagination, or generate new one for first request
        // Consistent searchID allows ISAPI to cache search results for faster pagination
        const finalSearchID = searchID || crypto.randomUUID();

        // Format time with timezone (ISAPI accepts both formats, but timezone is more explicit)
        // Convert to Vietnam timezone (+07:00) for consistency with Postman format
        const formatTimeWithTimezone = (date: Date): string => {
            // Convert UTC time to Vietnam timezone (+07:00)
            // Create a new Date object in VN timezone by adding 7 hours to UTC
            const vnTime = new Date(date.getTime() + (7 * 60 * 60 * 1000));
            // Format as YYYY-MM-DDTHH:mm:ss+07:00
            const year = vnTime.getUTCFullYear();
            const month = String(vnTime.getUTCMonth() + 1).padStart(2, '0');
            const day = String(vnTime.getUTCDate()).padStart(2, '0');
            const hours = String(vnTime.getUTCHours()).padStart(2, '0');
            const minutes = String(vnTime.getUTCMinutes()).padStart(2, '0');
            const seconds = String(vnTime.getUTCSeconds()).padStart(2, '0');
            return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+07:00`;
        };

        const payload = {
            AcsEventCond: {
                searchID: finalSearchID,
                searchResultPosition: searchResultPosition,
                maxResults: 100,
                major: 5, // Major event type (attendance events)
                minor: 75, // Minor event type 75 (specific attendance event)
                startTime: formatTimeWithTimezone(startTime),
                endTime: formatTimeWithTimezone(endTime),
                eventAttribute: "attendance" // Filter for attendance events only
            }
        };

        this.logger.log(`[${config.name}] Requesting events: searchID=${finalSearchID}, position=${searchResultPosition}`);
        this.logger.log(`[${config.name}] Request time range: ${startTime.toISOString()} to ${endTime.toISOString()}`);
        this.logger.log(`[${config.name}] Request payload: ${JSON.stringify(payload, null, 2)}`);

        try {
            const result = await this.requestWithDigest(url, 'POST', payload, config.username, config.password);
            this.logger.log(`[${config.name}] Response received: ${result.events?.length || 0} events, hasMore: ${result.hasMore}`);
            return result;
        } catch (error) {
            this.logger.error(`[${config.name}] Failed to fetch events from ${config.ipAddress}: ${error.message}`);
            if (error.response) {
                this.logger.error(`[${config.name}] Response status: ${error.response.status}`);
                this.logger.error(`[${config.name}] Response data: ${JSON.stringify(error.response.data)}`);
            }
            throw error;
        }
    }

    private async requestWithDigest(url: string, method: string, data: any, username: string, pass: string): Promise<any> {
        // Step 1: Request to get 401 with WWW-Authenticate header
        try {
            await firstValueFrom(this.httpService.request({ url, method, data, validateStatus: status => status === 401 }));
        } catch (ignored) { /* Request is expected to fail or return 401 */ }

        // Hacky way: We expect the *next* request to succeed if we knew the nonce.
        // But axios interceptor logic for Digest is complex. 
        // Let's implement a simple direct loop:
        // 1. Send Request -> Catch 401 -> Parse Header
        // 2. Generate Auth Header
        // 3. Resend Request

        let authHeader = null;
        try {
            // this.logger.debug(`[RequestWithDigest] Sending initial request to ${url} with data: ${JSON.stringify(data)}`);
            await firstValueFrom(this.httpService.request({ url, method, data }));
        } catch (error) {
            if (error.response && error.response.status === 401) {
                const wwwAuth = error.response.headers['www-authenticate'];
                if (wwwAuth && wwwAuth.includes('Digest')) {
                    authHeader = this.generateDigestAuth(wwwAuth, username, pass, method, '/ISAPI/AccessControl/AcsEvent?format=json');
                }
            } else {
                if (error.response) {
                    this.logger.error(`Request failed with status ${error.response.status}`);
                    this.logger.error(`Response Data: ${JSON.stringify(error.response.data)}`);
                }
                throw error;
            }
        }

        if (authHeader) {
            try {
                const response = await firstValueFrom(this.httpService.request({
                    url, method, data,
                    headers: { 'Authorization': authHeader }
                }));

                // ISAPI Response Parsing logic will be here if I don't return immediately, 
                // but the original code assigned to 'var response' and then continued.
                // Re-integrating the flow:

                // ISAPI Response Parsing
                // Expected structure: { AcsEvent: { searchID, totalMatches, responseStatusStrg, numOfMatches, InfoList } }
                this.logger.log(`[ISAPI] Response status: ${response.status}`);
                this.logger.log(`[ISAPI] Response data keys: ${Object.keys(response.data || {}).join(', ')}`);
                
                const acsEvent = response.data?.AcsEvent;
                
                if (!acsEvent) {
                    this.logger.warn(`[ISAPI] Response does not contain AcsEvent object. Full response: ${JSON.stringify(response.data)}`);
                    return { events: [], hasMore: false };
                }

                // Log response metadata for debugging
                this.logger.log(`[ISAPI] Response metadata: searchID=${acsEvent.searchID}, totalMatches=${acsEvent.totalMatches}, numOfMatches=${acsEvent.numOfMatches}, responseStatusStrg=${acsEvent.responseStatusStrg}`);
                this.logger.log(`[ISAPI] InfoList is array: ${Array.isArray(acsEvent.InfoList)}, length: ${acsEvent.InfoList?.length || 0}`);

                // Handle case where Match is No Match
                if (acsEvent.responseStatusStrg === 'NO MATCH') {
                    return { events: [], hasMore: false };
                }

                // Handle case where totalMatches is 0
                if (acsEvent.totalMatches === 0) {
                    return { events: [], hasMore: false };
                }

                // Parse InfoList if present
                if (acsEvent.InfoList && Array.isArray(acsEvent.InfoList)) {
                    // responseStatusStrg can be: "MORE" (has more data), "OK" (no more data)
                    const hasMore = acsEvent.responseStatusStrg === 'MORE';
                    this.logger.log(`Received ${acsEvent.InfoList.length} events (hasMore: ${hasMore}, totalMatches: ${acsEvent.totalMatches})`);
                    return { events: acsEvent.InfoList, hasMore };
                }

                // If InfoList is missing but totalMatches > 0, log warning
                if (acsEvent.totalMatches > 0) {
                    this.logger.warn(`Response has totalMatches=${acsEvent.totalMatches} but InfoList is missing or not an array`);
                }

                return { events: [], hasMore: false };

            } catch (error) {
                if (error.response) {
                    this.logger.error(`[Authenticated Request] Request failed with status ${error.response.status}`);
                    this.logger.error(`[Authenticated Request] Response Data: ${JSON.stringify(error.response.data)}`);
                }
                throw error;
            }
        }

        throw new Error('Authentication failed or not Digest');
    }

    private generateDigestAuth(header: string, user: string, pass: string, method: string, uri: string): string {
        // Parse HA1 params
        const params = this.parseAuthHeader(header);
        const realm = params['realm'];
        const nonce = params['nonce'];
        const qop = params['qop'];
        const opaque = params['opaque'];

        const ha1 = crypto.createHash('md5').update(`${user}:${realm}:${pass}`).digest('hex');
        const ha2 = crypto.createHash('md5').update(`${method}:${uri}`).digest('hex');

        const nc = '00000001';
        const cnonce = crypto.randomBytes(8).toString('hex');

        const response = crypto.createHash('md5').update(`${ha1}:${nonce}:${nc}:${cnonce}:${qop}:${ha2}`).digest('hex');

        return `Digest username="${user}", realm="${realm}", nonce="${nonce}", uri="${uri}", qop=${qop}, nc=${nc}, cnonce="${cnonce}", response="${response}", opaque="${opaque}"`;
    }

    private parseAuthHeader(header: string): Record<string, string> {
        const regex = /([a-z0-9_-]+)=(?:"([^"]+)"|([a-z0-9_-]+))/gi;
        const params: Record<string, string> = {};
        let match;
        while ((match = regex.exec(header)) !== null) {
            params[match[1]] = match[2] || match[3];
        }
        return params;
    }
}
