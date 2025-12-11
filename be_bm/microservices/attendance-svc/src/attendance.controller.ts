import { Controller, Post, Body, Req, Logger, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { RedisService } from './redis/redis.service';

@Controller('webhook')
export class AttendanceController {
    private readonly logger = new Logger(AttendanceController.name);

    constructor(private readonly redisService: RedisService) { }

    @Post('hikvision')
    @UseInterceptors(AnyFilesInterceptor())
    async receiveEvent(@Body() body: any, @UploadedFiles() files: any[], @Req() req: any) {
        // Simplified logging - detailed logs available via Pino HTTP interceptor

        try {
            const eventPayload = {
                timestamp: new Date().toISOString(),
                headers: req.headers,
                body: body,
                files: files ? files.map(f => ({
                    fieldname: f.fieldname,
                    originalname: f.originalname,
                    size: f.size,
                    mimetype: f.mimetype
                })) : [],
            };

            // Uncomment for debugging:
            // this.logger.log(`Event payload: ${JSON.stringify(eventPayload, null, 2)}`);

            // Push to Redis asynchronously (don't await to respond quickly)
            this.redisService.pushEvent(eventPayload).catch(err => {
                this.logger.error('Failed to push event to Redis', err);
            });

            // Respond immediately to avoid timeout
            return { status: 'success', message: 'Event received and queued' };
        } catch (error) {
            this.logger.error('Error processing webhook event', error);
            return { status: 'error', message: 'Failed to process event' };
        }
    }
}
