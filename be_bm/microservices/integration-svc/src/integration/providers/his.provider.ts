import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import axios, { AxiosInstance, AxiosError } from 'axios';

export interface HisLoginRequest {
  username: string;
  password: string;
  deviceId?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface HisUserInfo {
  loginName: string;
  userName: string;
  applicationCode: string;
  gCode: string;
  email: string;
  mobile: string;
  roles?: Array<{
    roleCode: string;
    roleName: string;
  }>;
}

export interface HisLoginResponse {
  Success?: boolean; // For compatibility
  success?: boolean; // For proto (lowercase)
  message?: string;
  tokenCode?: string;
  renewCode?: string;
  loginTime?: string;
  expireTime?: string;
  validAddress?: string;
  loginAddress?: string;
  versionApp?: string;
  machineName?: string;
  lastAccessTime?: string;
  user?: HisUserInfo;
  Data?: {
    ValidAddress: string;
    TokenCode: string;
    RenewCode: string;
    LoginTime: string;
    ExpireTime: string;
    LoginAddress: string;
    User: {
      LoginName: string;
      UserName: string;
      ApplicationCode: string;
      GCode: string;
      Email: string;
      Mobile: string;
    };
    VersionApp: string;
    MachineName: string;
    LastAccessTime: string;
    AuthorSystemCode: string | null;
    AuthenticationCode: string | null;
    RoleDatas: Array<{
      RoleCode: string;
      RoleName: string;
    }>;
  };
  Param: any;
}

@Injectable()
export class HisProvider {
  private readonly axiosInstance: AxiosInstance;
  private readonly externalApiUrl: string;
  private readonly apiEndpoint: string;
  private readonly hisVersion: string;
  private readonly machineName: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(HisProvider.name);
    
    const fullUrl = 
      this.configService.get('EXTERNAL_AUTH_URL') || 
      process.env.EXTERNAL_AUTH_URL || 
      'http://192.168.7.200:1401/api/Token/Login';
    
    // Extract base URL and endpoint
    const urlParts = fullUrl.split('/api/');
    this.externalApiUrl = urlParts[0] || fullUrl;
    this.apiEndpoint = urlParts[1] ? `/api/${urlParts[1]}` : '/api/Token/Login';
    
    this.hisVersion = 
      this.configService.get('HIS_VERSION') || 
      process.env.HIS_VERSION || 
      '2.377.0';
    
    this.machineName = 
      this.configService.get('HIS_MACHINE_NAME') || 
      process.env.HIS_MACHINE_NAME || 
      'DESKTOP-HPQH46O';

    this.axiosInstance = axios.create({
      baseURL: this.externalApiUrl,
      timeout: 10000, // 10 seconds
      headers: {
        'Content-Type': 'application/json',
        // Authorization header will be set dynamically in login method
      },
    });

    // Add request interceptor for logging
    this.axiosInstance.interceptors.request.use(
      (config) => {
        this.logger.debug('HisProvider#request', {
          url: config.url,
          method: config.method,
        });
        return config;
      },
      (error) => {
        this.logger.error('HisProvider#requestError', { error: error.message });
        return Promise.reject(error);
      }
    );

    // Add response interceptor for logging
    this.axiosInstance.interceptors.response.use(
      (response) => {
        this.logger.debug('HisProvider#response', {
          status: response.status,
          url: response.config.url,
        });
        return response;
      },
      (error: AxiosError) => {
        this.logger.error('HisProvider#responseError', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * Generate Basic Auth header for HIS API
   * Format: HIS:username:password:version:machineName
   * Example: HIS:vht2:t123456:2.377.0:DESKTOP-HPQH46O
   */
  private generateBasicAuth(username: string, password: string): string {
    const authString = `HIS:${username}:${password}:${this.hisVersion}:${this.machineName}`;
    const base64Auth = Buffer.from(authString).toString('base64');
    return `Basic ${base64Auth}`;
  }

  /**
   * Login to HIS system
   */
  async login(request: HisLoginRequest): Promise<HisLoginResponse> {
    this.logger.info('HisProvider#login.call', { username: request.username });

    try {
      // Generate Basic Auth header dynamically
      const basicAuth = this.generateBasicAuth(request.username, request.password);
      
      // Gọi API external để authenticate
      // Header Authorization: Basic base64(HIS:username:password:version:machineName)
      // Từ curl example: chỉ có header Authorization, không có body → có thể là GET
      this.logger.info('HisProvider#login.request', {
        url: `${this.externalApiUrl}${this.apiEndpoint}`,
        fullUrl: `${this.externalApiUrl}${this.apiEndpoint}`,
        baseUrl: this.externalApiUrl,
        endpoint: this.apiEndpoint,
        username: request.username,
        basicAuthPrefix: basicAuth.substring(0, 30) + '...',
      });

      // Thử GET method trước (vì curl example không có body)
      let response;
      try {
        this.logger.info('HisProvider#login.tryingGet', { username: request.username });
        response = await this.axiosInstance.get<HisLoginResponse>(
          this.apiEndpoint,
          {
            headers: {
              'Authorization': basicAuth,
            },
          }
        );
        this.logger.info('HisProvider#login.getSuccess', {
          status: response.status,
          statusText: response.statusText,
          hasData: !!response.data,
          dataKeys: response.data ? Object.keys(response.data) : [],
        });
      } catch (getError: any) {
        // Nếu GET trả về 405, thử POST
        if (getError.response?.status === 405) {
          this.logger.info('HisProvider#login.get405.tryingPost', { username: request.username });
          try {
            response = await this.axiosInstance.post<HisLoginResponse>(
              this.apiEndpoint,
              null, // Empty body
              {
                headers: {
                  'Authorization': basicAuth,
                },
              }
            );
            this.logger.info('HisProvider#login.postSuccess', {
              status: response.status,
              statusText: response.statusText,
              hasData: !!response.data,
              dataKeys: response.data ? Object.keys(response.data) : [],
            });
          } catch (postError: any) {
            // Nếu POST với empty body cũng fail, thử với body
            if (postError.response?.status === 405 || postError.response?.status === 400) {
              this.logger.info('HisProvider#login.postEmptyBodyFailed.tryingWithBody', { 
                username: request.username 
              });
              response = await this.axiosInstance.post<HisLoginResponse>(
                this.apiEndpoint,
                {
                  username: request.username,
                  password: request.password,
                  deviceId: request.deviceId,
                  ipAddress: request.ipAddress,
                  userAgent: request.userAgent,
                },
                {
                  headers: {
                    'Authorization': basicAuth,
                  },
                }
              );
            } else {
              throw postError;
            }
          }
        } else {
          throw getError;
        }
      }

      this.logger.info('HisProvider#login.response', {
        status: response.status,
        statusText: response.statusText,
        hasData: !!response.data,
        Success: response.data?.Success,
        dataType: typeof response.data,
        dataKeys: response.data ? Object.keys(response.data) : [],
      });

      // Check response structure
      if (!response.data) {
        this.logger.error('HisProvider#login.noData', {
          status: response.status,
          headers: response.headers,
        });
        throw new Error('External authentication failed: No response data');
      }

      // Check if Success field exists (from HIS API response)
      // Response format: { Success: true, Data: { ... }, Param: null }
      const isSuccess = response.data.Success === true;
      const hasData = !!response.data.Data;

      this.logger.info('HisProvider#login.responseCheck', {
        Success: response.data.Success,
        hasData,
        hasUser: !!response.data.Data?.User,
        hasTokenCode: !!response.data.Data?.TokenCode,
        hasRenewCode: !!response.data.Data?.RenewCode,
        responseDataString: JSON.stringify(response.data).substring(0, 1000), // Log full response để debug
      });

      if (isSuccess && hasData && response.data.Data?.User) {
        this.logger.info('HisProvider#login.success', { 
          loginName: response.data.Data.User.LoginName,
          tokenCode: response.data.Data.TokenCode?.substring(0, 20) + '...',
          expireTime: response.data.Data.ExpireTime,
        });
        // Return the response as-is (it already has Success and Data structure)
        return response.data;
      } else {
        // Log chi tiết để debug
        this.logger.warn('HisProvider#login.failed', { 
          Success: response.data.Success,
          isSuccess,
          hasData,
          hasUser: !!response.data.Data?.User,
          dataKeys: response.data ? Object.keys(response.data) : [],
          dataDataKeys: response.data?.Data ? Object.keys(response.data.Data) : [],
          responseData: JSON.stringify(response.data).substring(0, 1000), // Log full response
        });
        throw new Error('External authentication failed: Invalid credentials or response format');
      }
    } catch (error: any) {
      this.logger.error('HisProvider#login.error', { 
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
      });
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Invalid credentials');
      }
      
      if (error.response?.status === 405) {
        throw new Error(`Method not allowed (405). API may require different HTTP method or URL format. URL: ${error.config?.url}, Method: ${error.config?.method}`);
      }
      
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        throw new Error('External service timeout');
      }
      
      if (error.code === 'ECONNREFUSED') {
        throw new Error(`Connection refused. Check if HIS API is accessible at ${this.externalApiUrl}${this.apiEndpoint}`);
      }
      
      throw new Error(`External authentication error: ${error.message} (Status: ${error.response?.status || 'N/A'})`);
    }
  }

  /**
   * Renew token from HIS system
   * Endpoint: /api/Token/Renew
   * Header: RenewCode: <renewCode>
   */
  async renewToken(renewCode: string): Promise<HisLoginResponse> {
    this.logger.info('HisProvider#renewToken.call', { 
      renewCodePrefix: renewCode?.substring(0, 20) + '...' 
    });

    try {
      const renewEndpoint = '/api/Token/Renew';
      
      this.logger.info('HisProvider#renewToken.request', {
        url: `${this.externalApiUrl}${renewEndpoint}`,
        renewCodePrefix: renewCode?.substring(0, 20) + '...',
      });

      // Thử GET method trước (vì curl example không có body)
      let response;
      try {
        this.logger.info('HisProvider#renewToken.tryingGet');
        response = await this.axiosInstance.get<HisLoginResponse>(
          renewEndpoint,
          {
            headers: {
              'RenewCode': renewCode,
            },
          }
        );
        this.logger.info('HisProvider#renewToken.getSuccess', {
          status: response.status,
          hasData: !!response.data,
        });
      } catch (getError: any) {
        // Nếu GET trả về 405, thử POST
        if (getError.response?.status === 405) {
          this.logger.info('HisProvider#renewToken.get405.tryingPost');
          try {
            response = await this.axiosInstance.post<HisLoginResponse>(
              renewEndpoint,
              null, // Empty body
              {
                headers: {
                  'RenewCode': renewCode,
                },
              }
            );
            this.logger.info('HisProvider#renewToken.postSuccess', {
              status: response.status,
              hasData: !!response.data,
            });
          } catch (postError: any) {
            // Nếu POST với empty body cũng fail, thử với body
            if (postError.response?.status === 405 || postError.response?.status === 400) {
              this.logger.info('HisProvider#renewToken.postEmptyBodyFailed.tryingWithBody');
              response = await this.axiosInstance.post<HisLoginResponse>(
                renewEndpoint,
                {
                  renewCode: renewCode,
                },
                {
                  headers: {
                    'RenewCode': renewCode,
                  },
                }
              );
            } else {
              throw postError;
            }
          }
        } else {
          throw getError;
        }
      }

      this.logger.info('HisProvider#renewToken.response', {
        status: response.status,
        Success: response.data?.Success,
        hasData: !!response.data?.Data,
      });

      if (!response.data) {
        this.logger.error('HisProvider#renewToken.noData', {
          status: response.status,
        });
        throw new Error('Token renewal failed: No response data');
      }

      const isSuccess = response.data.Success === true;
      const hasData = !!response.data.Data;

      this.logger.info('HisProvider#renewToken.responseCheck', {
        Success: response.data.Success,
        isSuccess,
        hasData,
        hasTokenCode: !!response.data.Data?.TokenCode,
        hasRenewCode: !!response.data.Data?.RenewCode,
        dataKeys: response.data ? Object.keys(response.data) : [],
        dataDataKeys: response.data?.Data ? Object.keys(response.data.Data) : [],
        responseDataString: JSON.stringify(response.data).substring(0, 1000), // Log full response để debug
      });

      if (isSuccess && hasData) {
        this.logger.info('HisProvider#renewToken.success', {
          tokenCode: response.data.Data?.TokenCode?.substring(0, 20) + '...',
          expireTime: response.data.Data?.ExpireTime,
        });
        return response.data;
      } else {
        // Log chi tiết để debug
        this.logger.warn('HisProvider#renewToken.failed', {
          Success: response.data.Success,
          isSuccess,
          hasData,
          dataKeys: response.data ? Object.keys(response.data) : [],
          dataDataKeys: response.data?.Data ? Object.keys(response.data.Data) : [],
          responseData: JSON.stringify(response.data).substring(0, 1000), // Log full response
        });
        throw new Error('Token renewal failed: Invalid response format');
      }
    } catch (error: any) {
      this.logger.error('HisProvider#renewToken.error', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });

      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Invalid renew code');
      }

      if (error.response?.status === 405) {
        throw new Error(`Method not allowed (405). API may require different HTTP method.`);
      }

      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        throw new Error('External service timeout');
      }

      throw new Error(`Token renewal error: ${error.message} (Status: ${error.response?.status || 'N/A'})`);
    }
  }
}

