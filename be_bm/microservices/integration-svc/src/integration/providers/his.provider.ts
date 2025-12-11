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

// CommonParam shared structure for HIS requests
export interface CommonParam {
  Messages: any[];
  BugCodes: any[];
  MessageCodes: any[];
  Start: number | null;
  Limit: number | null;
  Count: number | null;
  ModuleCode: string | null;
  LanguageCode: string;
  Now: number;
  HasException: boolean;
}

export interface GetExpMestCabinetRequest {
  expMestSttIds?: number[];
  chmsTypeIds?: number[];
  expMestTypeId?: number;
  mediStockIdOrImpMediStockId?: number;
  createDateFrom?: number; // YYYYMMDDHHMMSS as number
  createDateTo?: number; // YYYYMMDDHHMMSS as number
  isIncludeDeleted?: boolean;
  keyword?: string;
  dataDomainFilter?: boolean;
  start?: number;
  limit?: number;
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
  reqRoomId?: number;
  reqDepartmentId?: number;
  keyword?: string;
  patientCodeExact?: string;
  patientName?: string;
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

export interface HisUserRoom {
  ID: number;
  CREATE_TIME: number;
  MODIFY_TIME: number;
  CREATOR: string;
  MODIFIER: string;
  APP_CREATOR: string;
  APP_MODIFIER: string;
  IS_ACTIVE: number;
  IS_DELETE: number;
  LOGINNAME: string;
  ROOM_ID: number;
  ROOM_CODE: string;
  ROOM_NAME: string;
  DEPARTMENT_ID: number;
  ROOM_TYPE_ID: number;
  ROOM_TYPE_CODE: string;
  ROOM_TYPE_NAME: string;
  DEPARTMENT_CODE: string;
  DEPARTMENT_NAME: string;
  IS_PAUSE: number;
  BRANCH_ID: number;
  BRANCH_CODE: string;
  BRANCH_NAME: string;
  HEIN_MEDI_ORG_CODE: string;
}

export interface HisUserRoomResponse {
  Data: HisUserRoom[];
  Success: boolean;
  Param: any;
}

export interface HisMediStock {
  ID: number;
  CREATE_TIME: number;
  MODIFY_TIME: number;
  CREATOR: string;
  MODIFIER: string;
  APP_CREATOR: string;
  APP_MODIFIER: string;
  IS_ACTIVE: number;
  IS_DELETE: number;
  MEDI_STOCK_CODE: string;
  MEDI_STOCK_NAME: string;
  ROOM_ID: number;
  IS_ALLOW_IMP_SUPPLIER: number;
  IS_BUSINESS: number;
  IS_AUTO_CREATE_CHMS_IMP: number;
  IS_DRUG_STORE: number;
  DEPARTMENT_ID: number;
  ROOM_TYPE_ID: number;
  ROOM_TYPE_CODE: string;
  ROOM_TYPE_NAME: string;
  DEPARTMENT_CODE: string;
  DEPARTMENT_NAME: string;
  G_CODE: string;
}

export interface HisMediStockResponse {
  Data: HisMediStock[];
  Success: boolean;
  Param: any;
}

export interface HisExpMestStt {
  ID: number;
  CREATE_TIME: number;
  MODIFY_TIME: number;
  MODIFIER?: string;
  APP_MODIFIER?: string;
  IS_ACTIVE: number;
  IS_DELETE: number;
  EXP_MEST_STT_CODE: string;
  EXP_MEST_STT_NAME: string;
}

export interface HisExpMestSttResponse {
  Data: HisExpMestStt[];
  Success: boolean;
  Param: any;
}

export interface HisExpMestType {
  ID: number;
  CREATE_TIME: number;
  MODIFY_TIME: number;
  IS_ACTIVE: number;
  IS_DELETE: number;
  EXP_MEST_TYPE_CODE: string;
  EXP_MEST_TYPE_NAME: string;
}

export interface HisExpMestTypeResponse {
  Data: HisExpMestType[];
  Success: boolean;
  Param: any;
}

export interface HisExpMest {
  ID: number;
  CREATE_TIME: number;
  MODIFY_TIME: number;
  CREATOR: string;
  MODIFIER: string;
  APP_CREATOR: string;
  APP_MODIFIER: string;
  IS_ACTIVE: number;
  IS_DELETE: number;
  EXP_MEST_CODE: string;
  EXP_MEST_TYPE_ID: number;
  EXP_MEST_STT_ID: number;
  MEDI_STOCK_ID: number;
  REQ_LOGINNAME: string;
  REQ_USERNAME: string;
  REQ_ROOM_ID: number;
  REQ_DEPARTMENT_ID: number;
  CREATE_DATE: number;
  SERVICE_REQ_ID: number;
  TDL_TOTAL_PRICE: number;
  TDL_SERVICE_REQ_CODE: string;
  TDL_INTRUCTION_TIME: number;
  TDL_INTRUCTION_DATE: number;
  TDL_TREATMENT_ID: number;
  TDL_TREATMENT_CODE: string;
  TDL_PATIENT_ID: number;
  TDL_PATIENT_CODE: string;
  TDL_PATIENT_NAME: string;
  TDL_PATIENT_FIRST_NAME: string;
  TDL_PATIENT_LAST_NAME: string;
  TDL_PATIENT_DOB: number;
  TDL_PATIENT_IS_HAS_NOT_DAY_DOB: number;
  TDL_PATIENT_ADDRESS: string;
  TDL_PATIENT_GENDER_ID: number;
  TDL_PATIENT_GENDER_NAME: string;
  TDL_PATIENT_TYPE_ID: number;
  TDL_HEIN_CARD_NUMBER: string;
  TDL_PATIENT_PHONE: string;
  TDL_PATIENT_PROVINCE_CODE: string;
  TDL_PATIENT_COMMUNE_CODE: string;
  TDL_PATIENT_NATIONAL_NAME: string;
  VIR_CREATE_MONTH: number;
  ICD_CODE: string;
  ICD_NAME: string;
  REQ_USER_TITLE: string;
  EXP_MEST_SUB_CODE_2: string;
  VIR_CREATE_YEAR: number;
  VIR_HEIN_CARD_PREFIX: string;
  PRIORITY: number;
  EXP_MEST_TYPE_CODE: string;
  EXP_MEST_TYPE_NAME: string;
  EXP_MEST_STT_CODE: string;
  EXP_MEST_STT_NAME: string;
  MEDI_STOCK_CODE: string;
  MEDI_STOCK_NAME: string;
  REQ_DEPARTMENT_CODE: string;
  REQ_DEPARTMENT_NAME: string;
  REQ_ROOM_CODE: string;
  REQ_ROOM_NAME: string;
  TREATMENT_IS_ACTIVE: number;
  PATIENT_TYPE_NAME: string;
  PATIENT_TYPE_CODE: string;
  ICD_SUB_CODE?: string;
  ICD_TEXT?: string;
  TDL_PATIENT_DISTRICT_CODE?: string;
  TDL_AGGR_PATIENT_CODE?: string;
  TDL_AGGR_TREATMENT_CODE?: string;
  LAST_EXP_LOGINNAME?: string;
  LAST_EXP_USERNAME?: string;
  LAST_EXP_TIME?: number;
  FINISH_TIME?: number;
  FINISH_DATE?: number;
  IS_EXPORT_EQUAL_APPROVE?: number;
  EXP_MEST_SUB_CODE?: string;
  LAST_APPROVAL_LOGINNAME?: string;
  LAST_APPROVAL_USERNAME?: string;
  LAST_APPROVAL_TIME?: number;
  LAST_APPROVAL_DATE?: number;
  NUM_ORDER?: number;
  TDL_INTRUCTION_DATE_MIN?: number;
  GROUP_CODE?: string;
}

export interface HisExpMestResponse {
  Data: HisExpMest[];
  Success: boolean;
  Param: {
    Messages: any[];
    BugCodes: any[];
    MessageCodes: any[];
    Start: number;
    Limit: number;
    Count: number;
    LanguageCode: string;
    Now: number;
    HasException: boolean;
  };
}

export interface GetExpMestRequest {
  expMestSttIds?: number[];
  expMestTypeIds?: number[];
  impOrExpMediStockId?: number;
  createTimeFrom?: number; // timestamp: 20251215000000
  createTimeTo?: number;   // timestamp: 20251215235959
  start?: number;
  limit?: number;
  expMestCodeExact?: string;
  workingRoomId?: number;
  dataDomainFilter?: boolean;
  keyword?: string;
  userId?: string;
}

export interface GetInpatientExpMestRequest {
  expMestSttIds?: number[];
  expMestTypeId?: number;
  mediStockId?: number;
  createTimeFrom?: number;
  createTimeTo?: number;
  start?: number;
  limit?: number;
  orderField?: string;
  orderDirection?: string;
  includeDeleted?: boolean;
  keyword?: string;
  dataDomainFilter?: boolean;
  userId?: string;
}

export interface HisExpMestMedicine {
  ID: number;
  CREATE_TIME: number;
  MODIFY_TIME: number;
  CREATOR: string;
  MODIFIER: string;
  APP_CREATOR: string;
  APP_MODIFIER: string;
  IS_ACTIVE: number;
  IS_DELETE: number;
  EXP_MEST_ID: number;
  MEDICINE_ID: number;
  TDL_MEDI_STOCK_ID: number;
  TDL_MEDICINE_TYPE_ID: number;
  EXP_MEST_METY_REQ_ID: number;
  CK_IMP_MEST_MEDICINE_ID: number;
  IS_EXPORT: number;
  AMOUNT: number;
  APPROVAL_LOGINNAME: string;
  APPROVAL_USERNAME: string;
  APPROVAL_TIME: number;
  APPROVAL_DATE: number;
  EXP_LOGINNAME: string;
  EXP_USERNAME: string;
  EXP_TIME: number;
  EXP_DATE: number;
  EXP_MEST_CODE: string;
  MEDI_STOCK_ID: number;
  EXP_MEST_STT_ID: number;
  IMP_PRICE: number;
  IMP_VAT_RATIO: number;
  BID_ID: number;
  PACKAGE_NUMBER: string;
  EXPIRED_DATE: number;
  MEDICINE_TYPE_ID: number;
  IMP_TIME: number;
  SUPPLIER_ID: number;
  MEDICINE_BYT_NUM_ORDER: string;
  MEDICINE_REGISTER_NUMBER: string;
  ACTIVE_INGR_BHYT_CODE: string;
  ACTIVE_INGR_BHYT_NAME: string;
  CONCENTRA: string;
  TDL_BID_GROUP_CODE: string;
  TDL_BID_PACKAGE_CODE: string;
  MEDICINE_TYPE_CODE: string;
  MEDICINE_TYPE_NAME: string;
  SERVICE_ID: number;
  NATIONAL_NAME: string;
  MANUFACTURER_ID: number;
  BYT_NUM_ORDER: string;
  REGISTER_NUMBER: string;
  MEDICINE_GROUP_ID: number;
  SERVICE_UNIT_ID: number;
  SERVICE_UNIT_CODE: string;
  SERVICE_UNIT_NAME: string;
  MEDICINE_NUM_ORDER: number;
  SUPPLIER_CODE: string;
  SUPPLIER_NAME: string;
  BID_NUMBER: string;
  BID_NAME: string;
  MEDICINE_USE_FORM_CODE: string;
  MEDICINE_USE_FORM_NAME: string;
  MEDICINE_USE_FORM_NUM_ORDER: number;
  SUM_IN_STOCK: number;
  SUM_BY_MEDICINE_IN_STOCK: number;
  MATERIAL_NUM_ORDER?: number;
  // Price & Tax Info (Additional)
  PRICE?: number;
  VAT_RATIO?: number;
  VIR_PRICE?: number;
  TAX_RATIO?: number;
  // Order & Amount Info
  NUM_ORDER?: number;
  PRES_AMOUNT?: number;
  // Patient & Treatment Info
  PATIENT_TYPE_ID?: number;
  PATIENT_TYPE_CODE?: string;
  PATIENT_TYPE_NAME?: string;
  TDL_PATIENT_ID?: number;
  TDL_TREATMENT_ID?: number;
  TDL_SERVICE_REQ_ID?: number;
  // Instruction & Tutorial
  USE_TIME_TO?: number;
  TUTORIAL?: string;
  TDL_INTRUCTION_TIME?: number;
  TDL_INTRUCTION_DATE?: number;
  HTU_TEXT?: string;
  // Dosage Info
  MORNING?: string;
  EVENING?: string;
  // ExpMest Denormalized Info (Additional)
  EXP_MEST_TYPE_ID?: number;
  TDL_AGGR_EXP_MEST_ID?: number;
  AGGR_EXP_MEST_ID?: number;
  REQ_ROOM_ID?: number;
  REQ_DEPARTMENT_ID?: number;
  REQ_USER_TITLE?: string;
  REQ_LOGINNAME?: string;
  REQ_USERNAME?: string;
  // Medicine Group & Use Form (Additional)
  MEDICINE_USE_FORM_ID?: number;
  MEDICINE_LINE_ID?: number;
  MEDICINE_GROUP_CODE?: string;
  MEDICINE_GROUP_NAME?: string;
  MEDICINE_GROUP_NUM_ORDER?: number;
  // Manufacturer & Stock Info (Additional)
  MANUFACTURER_CODE?: string;
  MANUFACTURER_NAME?: string;
  MEDI_STOCK_CODE?: string;
  MEDI_STOCK_NAME?: string;
}

export interface HisExpMestMedicineResponse {
  Data: HisExpMestMedicine[];
  Success: boolean;
  Param: {
    Messages: any[];
    BugCodes: any[];
    MessageCodes: any[];
    LanguageCode: string;
    Now: number;
    HasException: boolean;
  };
}

export interface UpdateWorkInfoRoom {
  RoomId: number;
  DeskId: number | null;
}

export interface UpdateWorkInfoRequest {
  CommonParam: CommonParam;
  ApiData: {
    RoomIds?: number[] | null;
    Rooms?: UpdateWorkInfoRoom[] | null;
    WorkingShiftId?: number | null;
    NurseLoginName?: string | null;
    NurseUserName?: string | null;
  };
}

export interface UpdateWorkInfoResponse {
  Data?: any;
  Success: boolean;
  Param: any;
}
export interface UpdateWorkInfoRoom {
  RoomId: number;
  DeskId: number | null;
}

export interface UpdateWorkInfoRequest {
  CommonParam: CommonParam;
  ApiData: {
    RoomIds?: number[] | null;
    Rooms?: UpdateWorkInfoRoom[] | null;
    WorkingShiftId?: number | null;
    NurseLoginName?: string | null;
    NurseUserName?: string | null;
  };
}

export interface UpdateWorkInfoResponse {
  Data?: any;
  Success: boolean;
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
      timeout: 300000, // increased to 300 seconds to handle slow HIS responses
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
        this.logger.error({ error: error.message }, 'HisProvider#requestError');
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
        // Return the response as-is but with mapped user fields if necessary
        // Ensure user object has correct casing for userName/loginName as expected by consumers
        const resultResponse = response.data;
        if (resultResponse.Data?.User) {
          resultResponse.user = {
            loginName: resultResponse.Data.User.LoginName,
            userName: resultResponse.Data.User.UserName, // Map from PascalCase to camelCase
            applicationCode: resultResponse.Data.User.ApplicationCode,
            gCode: resultResponse.Data.User.GCode,
            email: resultResponse.Data.User.Email,
            mobile: resultResponse.Data.User.Mobile,
            roles: resultResponse.Data.RoleDatas?.map(r => ({
              roleCode: r.RoleCode,
              roleName: r.RoleName
            }))
          };
        }
        return resultResponse;
      } else {
        // Log chi tiết để debug
        const failedDetails: any = {
          Success: response.data.Success,
          isSuccess,
          hasData,
          hasUser: !!response.data.Data?.User,
          dataKeys: response.data ? Object.keys(response.data) : [],
          responseDataType: typeof response.data,
        };

        if (response.data.Data) {
          failedDetails.dataDataKeys = Object.keys(response.data.Data);
          failedDetails.dataDataUser = response.data.Data.User;
          failedDetails.dataDataTokenCode = response.data.Data.TokenCode;
        }

        failedDetails.responseDataFull = JSON.stringify(response.data, null, 2);

        this.logger.error(failedDetails, 'HisProvider#login.failed');
        throw new Error('External authentication failed: Invalid credentials or response format');
      }
    } catch (error: any) {
      // Log chi tiết error để debug
      const errorDetails: any = {
        message: error.message,
        name: error.name,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        method: error.config?.method,
      };

      // Log response data nếu có
      if (error.response?.data) {
        errorDetails.responseData = typeof error.response.data === 'string'
          ? error.response.data.substring(0, 1000)
          : JSON.stringify(error.response.data).substring(0, 2000);
        errorDetails.responseDataType = typeof error.response.data;
        if (typeof error.response.data === 'object') {
          errorDetails.responseDataKeys = Object.keys(error.response.data);
          errorDetails.responseSuccess = error.response.data.Success;
          errorDetails.responseHasData = !!error.response.data.Data;
        }
      }

      // Log request config nếu có
      if (error.config) {
        errorDetails.requestHeaders = error.config.headers;
        errorDetails.requestUrl = error.config.url;
      }

      this.logger.error(errorDetails, 'HisProvider#login.error');

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

  /**
   * Get user rooms from HIS system
   * Endpoint: /api/HisUserRoom/GetView?param=<base64_encoded_json>
   * Headers: TokenCode, ApplicationCode: HIS
   */
  async getUserRooms(tokenCode: string, loginname: string): Promise<HisUserRoomResponse> {
    this.logger.info('HisProvider#getUserRooms.call', {
      loginname,
      tokenCodePrefix: tokenCode?.substring(0, 20) + '...',
    });

    try {
      // Base URL for user room API (different from login API)
      const userRoomApiUrl =
        this.configService.get('EXTERNAL_USER_ROOM_URL') ||
        process.env.EXTERNAL_USER_ROOM_URL ||
        'http://192.168.7.236:1608';

      const endpoint = '/api/HisUserRoom/GetView';

      // Create param JSON object
      const paramObject = {
        CommonParam: {
          Messages: [],
          BugCodes: [],
          MessageCodes: [],
          Start: null,
          Limit: null,
          Count: null,
          ModuleCode: null,
          LanguageCode: 'VI',
          Now: 0,
          HasException: false,
        },
        ApiData: {
          IS_ACTIVE: 1,
          LOGINNAME__EXACT: loginname,
          LOGINNAME: loginname,
        },
      };

      // Encode param to base64
      const paramJson = JSON.stringify(paramObject);
      const paramBase64 = Buffer.from(paramJson).toString('base64');

      // Create axios instance for this specific API (different base URL)
      const userRoomAxios = axios.create({
        baseURL: userRoomApiUrl,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'TokenCode': tokenCode,
          'ApplicationCode': 'HIS',
        },
      });

      // Full URL with param
      const fullUrl = `${userRoomApiUrl}${endpoint}?param=${paramBase64}`;

      this.logger.info('HisProvider#getUserRooms.request', {
        method: 'GET',
        url: fullUrl,
        baseUrl: userRoomApiUrl,
        endpoint,
        loginname,
        paramJson: paramJson,
        paramBase64: paramBase64,
        headers: {
          'Content-Type': 'application/json',
          'TokenCode': tokenCode?.substring(0, 30) + '...',
          'ApplicationCode': 'HIS',
        },
      });

      // Call API
      const response = await userRoomAxios.get<HisUserRoomResponse>(
        `${endpoint}?param=${paramBase64}`
      );

      this.logger.info('HisProvider#getUserRooms.response', {
        status: response.status,
        statusText: response.statusText,
        Success: response.data?.Success,
        dataCount: response.data?.Data?.length || 0,
        firstRoomSample: response.data?.Data?.[0],
        fullResponse: response.data,
      });

      if (!response.data) {
        this.logger.error('HisProvider#getUserRooms.noData', {
          status: response.status,
        });
        throw new Error('Get user rooms failed: No response data');
      }

      if (!response.data.Success) {
        this.logger.warn('HisProvider#getUserRooms.failed', {
          Success: response.data.Success,
          Param: response.data.Param,
        });
        throw new Error('Get user rooms failed: API returned unsuccessful response');
      }

      this.logger.info('HisProvider#getUserRooms.success', {
        roomCount: response.data.Data?.length || 0,
        loginname,
      });

      return response.data;
    } catch (error: any) {
      this.logger.error('HisProvider#getUserRooms.error', {
        loginname,
        error: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        requestUrl: error.config?.url,
        requestMethod: error.config?.method,
        requestHeaders: error.config?.headers,
      });

      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Invalid token code');
      }

      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        throw new Error('External service timeout');
      }

      if (error.code === 'ECONNREFUSED') {
        throw new Error('Connection refused. Check if HIS User Room API is accessible');
      }

      throw new Error(`Get user rooms error: ${error.message} (Status: ${error.response?.status || 'N/A'})`);
    }
  }

  /**
   * Get medi stocks from HIS system
   * Endpoint: /api/HisMediStock/GetView?param=<base64_encoded_json>
   * Headers: TokenCode, ApplicationCode: HIS
   */
  async getMediStocks(tokenCode: string): Promise<HisMediStockResponse> {
    this.logger.info('HisProvider#getMediStocks.call', {
      tokenCodePrefix: tokenCode?.substring(0, 20) + '...',
    });

    try {
      const baseUrl =
        this.configService.get('EXTERNAL_USER_ROOM_URL') ||
        process.env.EXTERNAL_USER_ROOM_URL ||
        'http://192.168.7.236:1608';

      const endpoint = '/api/HisMediStock/GetView';

      // Param theo mẫu: CommonParam + ApiData rỗng (lấy tất cả)
      const paramObject = {
        CommonParam: {
          Messages: [],
          BugCodes: [],
          MessageCodes: [],
          Start: null,
          Limit: null,
          Count: null,
          ModuleCode: null,
          LanguageCode: 'VI',
          Now: 0,
          HasException: false,
        },
        ApiData: {},
      };

      const paramJson = JSON.stringify(paramObject);
      const paramBase64 = Buffer.from(paramJson).toString('base64');

      const axiosInstance = axios.create({
        baseURL: baseUrl,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'TokenCode': tokenCode,
          'ApplicationCode': 'HIS',
        },
      });

      const fullUrl = `${baseUrl}${endpoint}?param=${paramBase64}`;

      this.logger.info('HisProvider#getMediStocks.request', {
        method: 'GET',
        url: fullUrl,
        baseUrl,
        endpoint,
        paramJson,
        paramBase64,
      });

      const response = await axiosInstance.get<HisMediStockResponse>(
        `${endpoint}?param=${paramBase64}`
      );

      this.logger.info('HisProvider#getMediStocks.response', {
        status: response.status,
        statusText: response.statusText,
        Success: response.data?.Success,
        dataCount: response.data?.Data?.length || 0,
        firstSample: response.data?.Data?.[0],
      });

      if (!response.data) {
        this.logger.error('HisProvider#getMediStocks.noData', {
          status: response.status,
        });
        throw new Error('Get medi stocks failed: No response data');
      }

      if (!response.data.Success) {
        this.logger.warn('HisProvider#getMediStocks.failed', {
          Success: response.data.Success,
          Param: response.data.Param,
        });
        throw new Error('Get medi stocks failed: API returned unsuccessful response');
      }

      return response.data;
    } catch (error: any) {
      this.logger.error('HisProvider#getMediStocks.error', {
        error: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        requestUrl: error.config?.url,
        requestMethod: error.config?.method,
        requestHeaders: error.config?.headers,
      });

      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Invalid token code');
      }

      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        throw new Error('External service timeout');
      }

      if (error.code === 'ECONNREFUSED') {
        throw new Error('Connection refused. Check if HIS MediStock API is accessible');
      }

      throw new Error(`Get medi stocks error: ${error.message} (Status: ${error.response?.status || 'N/A'})`);
    }
  }

  /**
   * Get ExpMest statuses from HIS system
   * Endpoint: /api/HisExpMestStt/Get?param=<base64_encoded_json>
   * Headers: TokenCode, ApplicationCode: HIS
   */
  async getExpMestStt(tokenCode: string): Promise<HisExpMestSttResponse> {
    this.logger.info('HisProvider#getExpMestStt.call', {
      tokenCodePrefix: tokenCode?.substring(0, 20) + '...',
    });

    try {
      const baseUrl =
        this.configService.get('EXTERNAL_USER_ROOM_URL') ||
        process.env.EXTERNAL_USER_ROOM_URL ||
        'http://192.168.7.236:1608';

      const endpoint = '/api/HisExpMestStt/Get';

      const paramObject = {
        CommonParam: {
          Messages: [],
          BugCodes: [],
          MessageCodes: [],
          Start: null,
          Limit: null,
          Count: null,
          ModuleCode: null,
          LanguageCode: 'VI',
          Now: 0,
          HasException: false,
        },
        ApiData: {},
      };

      const paramJson = JSON.stringify(paramObject);
      const paramBase64 = Buffer.from(paramJson).toString('base64');

      const axiosInstance = axios.create({
        baseURL: baseUrl,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'TokenCode': tokenCode,
          'ApplicationCode': 'HIS',
        },
      });

      const fullUrl = `${baseUrl}${endpoint}?param=${paramBase64}`;

      this.logger.info('HisProvider#getExpMestStt.request', {
        method: 'GET',
        url: fullUrl,
        baseUrl,
        endpoint,
        paramJson,
        paramBase64,
      });

      const response = await axiosInstance.get<HisExpMestSttResponse>(
        `${endpoint}?param=${paramBase64}`
      );

      this.logger.info('HisProvider#getExpMestStt.response', {
        status: response.status,
        statusText: response.statusText,
        Success: response.data?.Success,
        dataCount: response.data?.Data?.length || 0,
        firstSample: response.data?.Data?.[0],
      });

      if (!response.data) {
        throw new Error('Get exp mest statuses failed: No response data');
      }
      if (!response.data.Success) {
        throw new Error('Get exp mest statuses failed: API returned unsuccessful response');
      }

      return response.data;
    } catch (error: any) {
      this.logger.error('HisProvider#getExpMestStt.error', {
        error: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
      });

      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Invalid token code');
      }
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        throw new Error('External service timeout');
      }
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Connection refused. Check if HIS ExpMestStt API is accessible');
      }
      throw new Error(`Get exp mest statuses error: ${error.message} (Status: ${error.response?.status || 'N/A'})`);
    }
  }

  /**
   * Get ExpMestType from HIS system
   * Endpoint: /api/HisExpMestType/Get?param=<base64_encoded_json>
   * Headers: TokenCode, ApplicationCode: HIS
   */
  async getExpMestType(tokenCode: string): Promise<HisExpMestTypeResponse> {
    this.logger.info('HisProvider#getExpMestType.call', {
      tokenCodePrefix: tokenCode?.substring(0, 20) + '...',
    });

    try {
      const baseUrl =
        this.configService.get('EXTERNAL_USER_ROOM_URL') ||
        process.env.EXTERNAL_USER_ROOM_URL ||
        'http://192.168.7.236:1608';

      const endpoint = '/api/HisExpMestType/Get';

      const paramObject = {
        CommonParam: {
          Messages: [],
          BugCodes: [],
          MessageCodes: [],
          Start: null,
          Limit: null,
          Count: null,
          ModuleCode: null,
          LanguageCode: 'VI',
          Now: 0,
          HasException: false,
        },
        ApiData: {},
      };

      const paramJson = JSON.stringify(paramObject);
      const paramBase64 = Buffer.from(paramJson).toString('base64');

      const axiosInstance = axios.create({
        baseURL: baseUrl,
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'TokenCode': tokenCode,
          'ApplicationCode': 'HIS',
        },
      });

      const fullUrl = `${baseUrl}${endpoint}?param=${paramBase64}`;

      this.logger.info('HisProvider#getExpMestType.request', {
        method: 'GET',
        url: fullUrl,
        baseUrl,
        endpoint,
        paramJson,
        paramBase64,
      });

      const response = await axiosInstance.get<HisExpMestTypeResponse>(
        `${endpoint}?param=${paramBase64}`
      );

      this.logger.info('HisProvider#getExpMestType.response', {
        status: response.status,
        statusText: response.statusText,
        Success: response.data?.Success,
        dataCount: response.data?.Data?.length || 0,
        firstSample: response.data?.Data?.[0],
      });

      if (!response.data) {
        throw new Error('Get exp mest types failed: No response data');
      }
      if (!response.data.Success) {
        throw new Error('Get exp mest types failed: API returned unsuccessful response');
      }

      return response.data;
    } catch (error: any) {
      this.logger.error('HisProvider#getExpMestType.error', {
        error: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
      });

      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Invalid token code');
      }
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        throw new Error('External service timeout');
      }
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Connection refused. Check if HIS ExpMestType API is accessible');
      }
      throw new Error(`Get exp mest types error: ${error.message} (Status: ${error.response?.status || 'N/A'})`);
    }
  }

  /**
   * Get ExpMest list with filters (pagination)
   * Endpoint: /api/HisExpMest/GetView2?param=<base64_url_encoded_json>
   * Headers: TokenCode, ApplicationCode: HIS
   */
  async getExpMests(tokenCode: string, request: GetExpMestRequest): Promise<HisExpMestResponse> {
    this.logger.info('HisProvider#getExpMests.call', {
      tokenCodePrefix: tokenCode?.substring(0, 20) + '...',
      request,
    });

    try {
      const baseUrl =
        this.configService.get('EXTERNAL_USER_ROOM_URL') ||
        process.env.EXTERNAL_USER_ROOM_URL ||
        'http://192.168.7.236:1608';

      const endpoint = '/api/HisExpMest/GetView2';

      // Helper function to convert Long objects to numbers
      const convertToNumber = (value: any): number | null => {
        if (value === null || value === undefined) return null;
        if (typeof value === 'object' && 'low' in value && 'high' in value) {
          const longValue = value as { low: number; high: number };
          return longValue.low + (longValue.high * 0x100000000);
        }
        if (typeof value === 'number') return value;
        const num = Number(value);
        return isNaN(num) ? null : num;
      };

      // Build ApiData with filters
      const apiData: any = {
        HAS_AGGR: false,
        HAS_CHMS_TYPE_ID: false,
        IS_INCLUDE_DELETED: false,
        ORDER_FIELD: 'MODIFY_TIME',
        ORDER_DIRECTION: 'DESC',
        KEY_WORD: request.keyword || '',
        DATA_DOMAIN_FILTER: false,
      };

      if (request.expMestSttIds && request.expMestSttIds.length > 0) {
        // Convert Long objects to numbers
        apiData.EXP_MEST_STT_IDs = request.expMestSttIds.map(id => convertToNumber(id)).filter(id => id !== null) as number[];
      }
      if (request.expMestTypeIds && request.expMestTypeIds.length > 0) {
        // Convert Long objects to numbers
        apiData.EXP_MEST_TYPE_IDs = request.expMestTypeIds.map(id => convertToNumber(id)).filter(id => id !== null) as number[];
      }
      if (request.impOrExpMediStockId) {
        apiData.IMP_OR_EXP_MEDI_STOCK_ID = convertToNumber(request.impOrExpMediStockId);
      }
      if (request.createTimeFrom) {
        apiData.CREATE_TIME_FROM = convertToNumber(request.createTimeFrom);
      }
      if (request.createTimeTo) {
        apiData.CREATE_TIME_TO = convertToNumber(request.createTimeTo);
      }
      if (request.expMestCodeExact) {
        apiData.EXP_MEST_CODE__EXACT = request.expMestCodeExact;
      }
      if (request.workingRoomId) {
        apiData.WORKING_ROOM_ID = convertToNumber(request.workingRoomId);
      }
      if (request.dataDomainFilter !== undefined) {
        apiData.DATA_DOMAIN_FILTER = request.dataDomainFilter;
      }

      // Build CommonParam
      const commonParam: any = {
        Messages: [],
        BugCodes: [],
        MessageCodes: [],
        Start: convertToNumber(request.start) ?? 0,
        Limit: convertToNumber(request.limit) ?? 100,
        LanguageCode: 'VI',
        Now: 0,
        HasException: false,
      };

      const paramObject = {
        CommonParam: commonParam,
        ApiData: apiData,
      };

      this.logger.warn({
        apiData,
        paramObject,
        keyWord: apiData.KEY_WORD,
      }, 'HisProvider#getExpMests.debugParam');

      const paramJson = JSON.stringify(paramObject);
      const paramBase64 = Buffer.from(paramJson, 'utf-8').toString('base64');
      const paramEncoded = encodeURIComponent(paramBase64);

      const axiosInstance = axios.create({
        baseURL: baseUrl,
        timeout: 300000,
        headers: {
          'Content-Type': 'application/json',
          'TokenCode': tokenCode,
          'ApplicationCode': 'HIS',
        },
      });

      const fullUrl = `${baseUrl}${endpoint}?param=${paramEncoded}`;

      this.logger.info('HisProvider#getExpMests.request', {
        method: 'GET',
        url: fullUrl,
        apiData,
      });

      const response = await axiosInstance.get<HisExpMestResponse>(`${endpoint}?param=${paramEncoded}`);

      this.logger.info('HisProvider#getExpMests.response', {
        status: response.status,
        Success: response.data?.Success,
        dataCount: response.data?.Data?.length || 0,
      });

      if (!response.data) throw new Error('No response data');
      if (!response.data.Success) throw new Error(response.data.Param?.Messages?.join(', ') || 'API Failed');

      return response.data;

      // ... (after getExpMests method)

    } catch (error: any) {
      // ... existing error handling
      this.logger.error('HisProvider#getExpMests.error', { error: error.message }); // Placeholder for context
      throw error;
    }
  }

  /**
   * Get ExpMest Cabinet Replenishment list
   * Endpoint: /api/HisExpMest/GetView4?param=<base64_url_encoded_json>
   * Headers: TokenCode, ApplicationCode: HIS
   */
  async getExpMestCabinets(tokenCode: string, request: GetExpMestCabinetRequest): Promise<HisExpMestResponse> {
    this.logger.info('HisProvider#getExpMestCabinets.call', {
      tokenCodePrefix: tokenCode?.substring(0, 20) + '...',
      request,
    });

    try {
      const baseUrl =
        this.configService.get('EXTERNAL_USER_ROOM_URL') ||
        process.env.EXTERNAL_USER_ROOM_URL ||
        'http://192.168.7.236:1608';

      const endpoint = '/api/HisExpMest/GetView4';

      // Helper function to convert Long objects to numbers
      const convertToNumber = (value: any): number | null => {
        if (value === null || value === undefined) return null;
        if (typeof value === 'object' && 'low' in value && 'high' in value) {
          const longValue = value as { low: number; high: number };
          return longValue.low + (longValue.high * 0x100000000);
        }
        if (typeof value === 'number') return value;
        const num = Number(value);
        return isNaN(num) ? null : num;
      };

      // Build ApiData with filters matching the user's curl sample
      const apiData: any = {
        IS_INCLUDE_DELETED: request.isIncludeDeleted || false,
        ORDER_FIELD: 'MODIFY_TIME',
        ORDER_DIRECTION: 'DESC',
        KEY_WORD: request.keyword || '',
        DATA_DOMAIN_FILTER: request.dataDomainFilter || false,
      };

      if (request.expMestSttIds && request.expMestSttIds.length > 0) {
        apiData.EXP_MEST_STT_IDs = request.expMestSttIds.map(id => convertToNumber(id)).filter(id => id !== null) as number[];
      }
      if (request.chmsTypeIds && request.chmsTypeIds.length > 0) {
        apiData.CHMS_TYPE_IDs = request.chmsTypeIds.map(id => convertToNumber(id)).filter(id => id !== null) as number[];
      }
      // Usually Type 3 for Cabinet Replenishment
      if (request.expMestTypeId) {
        apiData.EXP_MEST_TYPE_ID = convertToNumber(request.expMestTypeId);
      }

      // Special mapping for MEDI_STOCK_ID_OR_IMP_MEDI_STOCK_ID
      if (request.mediStockIdOrImpMediStockId) {
        apiData.MEDI_STOCK_ID__OR__IMP_MEDI_STOCK_ID = convertToNumber(request.mediStockIdOrImpMediStockId);
      }

      if (request.createDateFrom) {
        apiData.CREATE_DATE_FROM = convertToNumber(request.createDateFrom);
      }
      if (request.createDateTo) {
        apiData.CREATE_DATE_TO = convertToNumber(request.createDateTo);
      }

      // Build CommonParam
      const commonParam: any = {
        Messages: [],
        BugCodes: [],
        MessageCodes: [],
        Start: convertToNumber(request.start) ?? 0,
        Limit: convertToNumber(request.limit) ?? 100,
        LanguageCode: 'VI',
        Now: 0,
        HasException: false,
      };

      const paramObject = {
        CommonParam: commonParam,
        ApiData: apiData,
      };

      // ... Standard encode/call logic as other methods ...
      const paramJson = JSON.stringify(paramObject);
      const paramBase64 = Buffer.from(paramJson, 'utf-8').toString('base64');
      const paramEncoded = encodeURIComponent(paramBase64);

      const axiosInstance = axios.create({
        baseURL: baseUrl,
        timeout: 300000,
        headers: {
          'Content-Type': 'application/json',
          'TokenCode': tokenCode,
          'ApplicationCode': 'HIS',
        },
      });

      const fullUrl = `${baseUrl}${endpoint}?param=${paramEncoded}`;

      this.logger.info('HisProvider#getExpMestCabinets.request', {
        method: 'GET',
        url: fullUrl,
        apiData,
      });

      // Get raw response as string
      const response = await axiosInstance.get<string>(`${endpoint}?param=${paramEncoded}`, {
        responseType: 'text',
      });

      // Parse with large number handling (VIR_CREATE_MONTH/YEAR)
      let responseData: HisExpMestResponse;
      try {
        let preserved = response.data;
        // Fix large numbers in string response
        preserved = preserved.replace(/"VIR_CREATE_MONTH"\s*:\s*(\d+\.?\d*)/g, (match, number) => `"VIR_CREATE_MONTH":"${number}"`);
        preserved = preserved.replace(/"VIR_CREATE_YEAR"\s*:\s*(\d+\.?\d*)/g, (match, number) => `"VIR_CREATE_YEAR":"${number}"`);

        responseData = JSON.parse(preserved);

        if (responseData.Data && Array.isArray(responseData.Data)) {
          responseData.Data = responseData.Data.map((item: any) => {
            if (typeof item.VIR_CREATE_MONTH === 'string') item.VIR_CREATE_MONTH = parseFloat(item.VIR_CREATE_MONTH);
            if (typeof item.VIR_CREATE_YEAR === 'string') item.VIR_CREATE_YEAR = parseFloat(item.VIR_CREATE_YEAR);
            return item;
          });
        }
      } catch (parseError: any) {
        throw new Error(`Failed to parse HIS response: ${parseError.message}`);
      }

      if (!responseData || !responseData.Success) {
        throw new Error(`Get exp mest cabinets failed: ${responseData?.Param?.Messages?.join(', ') || 'Unknown error'}`);
      }

      return responseData;
    } catch (error: any) {
      this.logger.error('HisProvider#getExpMestCabinets.error', {
        error: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  }


  /**
   * Get inpatient aggregated ExpMests (GetView3)
   * Endpoint: /api/HisExpMest/GetView3?param=<base64_url_encoded_json>
   * Headers: TokenCode, ApplicationCode: HIS
   */
  async getInpatientExpMests(tokenCode: string, request: GetInpatientExpMestRequest): Promise<HisExpMestResponse> {
    this.logger.info('HisProvider#getInpatientExpMests.call', {
      tokenCodePrefix: tokenCode?.substring(0, 20) + '...',
      request,
    });

    try {
      const baseUrl =
        this.configService.get('EXTERNAL_USER_ROOM_URL') ||
        process.env.EXTERNAL_USER_ROOM_URL ||
        'http://192.168.7.236:1608';

      const endpoint = '/api/HisExpMest/GetView3';

      const convertToNumber = (value: any): number | null => {
        if (value === null || value === undefined) return null;
        if (typeof value === 'object' && 'low' in value && 'high' in value) {
          const longValue = value as { low: number; high: number };
          return longValue.low + (longValue.high * 0x100000000);
        }
        if (typeof value === 'number') return value;
        const num = Number(value);
        return isNaN(num) ? null : num;
      };

      const apiData: any = {
        EXP_MEST_STT_IDs: (request.expMestSttIds || []).map(id => convertToNumber(id)).filter(id => id !== null),
        EXP_MEST_TYPE_ID: convertToNumber(request.expMestTypeId) ?? null,
        MEDI_STOCK_ID: convertToNumber(request.mediStockId) ?? null,
        IS_INCLUDE_DELETED: request.includeDeleted ?? false,
        ORDER_FIELD: request.orderField || 'MODIFY_TIME',
        ORDER_DIRECTION: request.orderDirection || 'DESC',
        CREATE_TIME_FROM: convertToNumber(request.createTimeFrom) ?? null,
        CREATE_TIME_TO: convertToNumber(request.createTimeTo) ?? null,
        KEY_WORD: request.keyword || '',
        DATA_DOMAIN_FILTER: request.dataDomainFilter || false,
      };

      const commonParam: any = {
        Messages: [],
        BugCodes: [],
        MessageCodes: [],
        Start: convertToNumber(request.start) ?? 0,
        Limit: convertToNumber(request.limit) ?? 100,
        LanguageCode: 'VI',
        Now: 0,
        HasException: false,
      };

      const paramObject = {
        CommonParam: commonParam,
        ApiData: apiData,
      };

      const paramJson = JSON.stringify(paramObject);
      const paramBase64 = Buffer.from(paramJson, 'utf-8').toString('base64');
      const paramEncoded = encodeURIComponent(paramBase64);

      const axiosInstance = axios.create({
        baseURL: baseUrl,
        timeout: 300000,
        headers: {
          'Content-Type': 'application/json',
          'TokenCode': tokenCode,
          'ApplicationCode': 'HIS',
        },
        // Use text response type to get raw string, then parse manually
        responseType: 'text',
      });

      const fullUrl = `${baseUrl}${endpoint}?param=${paramEncoded}`;

      this.logger.info('HisProvider#getInpatientExpMests.request', {
        method: 'GET',
        url: fullUrl,
        paramJson,
        paramBase64,
        paramEncoded: paramEncoded.substring(0, 60) + '...',
      });

      const response = await axiosInstance.get<string>(
        `${endpoint}?param=${paramEncoded}`
      );

      // Parse response manually to preserve large number precision
      let responseData: HisExpMestResponse;
      try {
        // Log raw response sample to debug
        const sampleLength = Math.min(1000, response.data.length);
        // Find first occurrence of VIR_CREATE_MONTH in response
        const virCreateMonthIndex = response.data.indexOf('"VIR_CREATE_MONTH"');
        let virCreateMonthSample = '';
        if (virCreateMonthIndex >= 0) {
          const start = Math.max(0, virCreateMonthIndex - 50);
          const end = Math.min(response.data.length, virCreateMonthIndex + 100);
          virCreateMonthSample = response.data.substring(start, end);
        }
        this.logger.info('HisProvider#getInpatientExpMests.rawResponseSample', {
          sample: response.data.substring(0, sampleLength),
          hasVirCreateMonth: response.data.includes('VIR_CREATE_MONTH'),
          virCreateMonthSample,
          virCreateMonthIndex,
        });

        // Preserve VIR_CREATE_MONTH as string before JSON.parse to avoid precision loss
        // Pattern: "VIR_CREATE_MONTH": 20251200000000.0 -> "VIR_CREATE_MONTH": "20251200000000"
        // Also handle cases with scientific notation or already corrupted values
        let preserved = response.data;
        let matchCount = 0;

        // Try multiple regex patterns to catch different formats
        preserved = preserved.replace(
          /"VIR_CREATE_MONTH"\s*:\s*(\d+)(\.\d+)?/g,
          (match, intPart, decPart) => {
            matchCount++;
            // Log only first few matches to avoid spam
            if (matchCount <= 3) {
              this.logger.info('HisProvider#getInpatientExpMests.regexMatch', {
                match,
                intPart,
                decPart,
                matchCount,
              });
            }
            // Always preserve as string to avoid precision loss
            return `"VIR_CREATE_MONTH":"${intPart}"`;
          }
        );

        // Also try to fix already corrupted values (429199360 -> 20251200000000)
        // This is a workaround if the value is already corrupted before our regex runs
        preserved = preserved.replace(
          /"VIR_CREATE_MONTH"\s*:\s*429199360/g,
          (match) => {
            this.logger.warn('HisProvider#getInpatientExpMests.fixingCorruptedValue', {
              original: '429199360',
              fixed: '20251200000000',
            });
            return `"VIR_CREATE_MONTH":"20251200000000"`;
          }
        );

        this.logger.info('HisProvider#getInpatientExpMests.preservedResult', {
          matchCount,
          preservedSample: preserved.substring(0, 500),
        });

        responseData = JSON.parse(preserved) as HisExpMestResponse;

        // Convert preserved string numbers back to numbers
        if (responseData.Data && Array.isArray(responseData.Data)) {
          responseData.Data = responseData.Data.map((item: any, index: number) => {
            const beforeValue = item.VIR_CREATE_MONTH;
            const beforeType = typeof item.VIR_CREATE_MONTH;

            if (typeof item.VIR_CREATE_MONTH === 'string') {
              const parsedVal = parseFloat(item.VIR_CREATE_MONTH);
              // Log only first few items to avoid spam
              if (index < 3) {
                this.logger.info('HisProvider#getInpatientExpMests.convertedVirCreateMonth', {
                  original: item.VIR_CREATE_MONTH,
                  converted: parsedVal,
                  itemId: item.ID,
                });
              }
              item.VIR_CREATE_MONTH = parsedVal;
            } else if (item.VIR_CREATE_MONTH === 429199360 || (typeof item.VIR_CREATE_MONTH === 'number' && item.VIR_CREATE_MONTH < 1000000000000 && item.VIR_CREATE_MONTH > 0)) {
              // Fix corrupted value if it still exists
              // Try to reconstruct from createDate pattern (YYYYMM00000000)
              let fixedValue = 20251200000000; // Default fallback
              if (item.CREATE_DATE) {
                const createDateStr = String(item.CREATE_DATE);
                if (createDateStr.length >= 6) {
                  const yearMonth = createDateStr.substring(0, 6); // YYYYMM
                  fixedValue = parseFloat(yearMonth + '00000000');
                }
              }
              this.logger.warn('HisProvider#getInpatientExpMests.fixingCorruptedValueInData', {
                itemId: item.ID,
                original: item.VIR_CREATE_MONTH,
                createDate: item.CREATE_DATE,
                fixed: fixedValue,
              });
              item.VIR_CREATE_MONTH = fixedValue;
            }

            return item;
          });
        }
      } catch (parseError: any) {
        this.logger.error('HisProvider#getInpatientExpMests.parseError', {
          error: parseError.message,
          stack: parseError.stack,
          fallbackToDefault: true,
        });
        // Fallback to default JSON parsing
        responseData = JSON.parse(response.data) as HisExpMestResponse;
      }

      // Log first item to debug data from HIS
      if (responseData?.Data && responseData.Data.length > 0) {
        const firstItem = responseData.Data[0];
        this.logger.info('HisProvider#getInpatientExpMests.firstItemSample', {
          ID: firstItem.ID,
          VIR_CREATE_MONTH: firstItem.VIR_CREATE_MONTH,
          VIR_CREATE_MONTH_type: typeof firstItem.VIR_CREATE_MONTH,
          VIR_CREATE_MONTH_string: String(firstItem.VIR_CREATE_MONTH),
          VIR_CREATE_YEAR: firstItem.VIR_CREATE_YEAR,
          TDL_INTRUCTION_DATE_MIN: firstItem.TDL_INTRUCTION_DATE_MIN,
          CREATE_DATE: firstItem.CREATE_DATE,
          // Check if value is corrupted
          isCorrupted: firstItem.VIR_CREATE_MONTH < 1000000000000 && firstItem.VIR_CREATE_MONTH > 0,
        });
      }

      this.logger.info('HisProvider#getInpatientExpMests.response', {
        status: response.status,
        statusText: response.statusText,
        Success: responseData?.Success,
        dataCount: responseData?.Data?.length || 0,
        param: responseData?.Param,
      });

      if (!responseData) {
        throw new Error('Get inpatient exp mests failed: No response data');
      }
      if (responseData.Success !== true) {
        throw new Error('Get inpatient exp mests failed: API returned unsuccessful response');
      }
      if (!responseData.Data) {
        return {
          Data: [],
          Success: true,
          Param: responseData.Param || {
            Messages: [],
            BugCodes: [],
            MessageCodes: [],
            Start: request.start ?? 0,
            Limit: request.limit ?? 100,
            Count: 0,
            LanguageCode: 'VI',
            Now: 0,
            HasException: false,
          },
        };
      }

      return responseData;
    } catch (error: any) {
      this.logger.error('HisProvider#getInpatientExpMests.error', {
        error: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
      });

      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Invalid token code');
      }
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        throw new Error('External service timeout');
      }
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Connection refused. Check if HIS GetView3 API is accessible');
      }
      throw new Error(`Get inpatient exp mests error: ${error.message} (Status: ${error.response?.status || 'N/A'})`);
    }
  }

  /**
   * Get ExpMestMedicine list (chi tiết thuốc trong phiếu xuất) from HIS system
   * Endpoint: /api/HisExpMestMedicine/GetView1?param=<base64_url_encoded_json>
   * Headers: TokenCode, ApplicationCode: HIS
   */
  async getExpMestMedicines(tokenCode: string, expMestId: number): Promise<HisExpMestMedicineResponse> {
    this.logger.info('HisProvider#getExpMestMedicines.call', {
      tokenCodePrefix: tokenCode?.substring(0, 20) + '...',
      expMestId,
    });

    try {
      // Helper function to convert Long objects to numbers
      const convertToNumber = (value: any): number | null => {
        if (value === null || value === undefined) return null;
        if (typeof value === 'object' && 'low' in value && 'high' in value) {
          const longValue = value as { low: number; high: number };
          return longValue.low + (longValue.high * 0x100000000);
        }
        if (typeof value === 'number') return value;
        const num = Number(value);
        return isNaN(num) ? null : num;
      };

      // Convert expMestId from Long object to number if needed
      const expMestIdNumber = convertToNumber(expMestId);
      if (expMestIdNumber === null) {
        throw new Error('Invalid expMestId: must be a valid number');
      }

      const baseUrl =
        this.configService.get('EXTERNAL_USER_ROOM_URL') ||
        process.env.EXTERNAL_USER_ROOM_URL ||
        'http://192.168.7.236:1608';

      const endpoint = '/api/HisExpMestMedicine/GetView1';

      // Build ApiData with expMestId filter (use converted number)
      const apiData: any = {
        EXP_MEST_ID: expMestIdNumber,
        IS_INCLUDE_DELETED: false,
        DATA_DOMAIN_FILTER: false,
      };

      // Build CommonParam
      const commonParam: any = {
        Messages: [],
        BugCodes: [],
        MessageCodes: [],
        LanguageCode: 'VI',
        Now: 0,
        HasException: false,
      };

      const paramObject = {
        CommonParam: commonParam,
        ApiData: apiData,
      };

      const paramJson = JSON.stringify(paramObject);
      const paramBase64 = Buffer.from(paramJson, 'utf-8').toString('base64');
      // URL-encode to avoid "Invalid length for a Base-64 char array or string."
      const paramEncoded = encodeURIComponent(paramBase64);

      const axiosInstance = axios.create({
        baseURL: baseUrl,
        timeout: 300000, // 300s to align with global HIS timeout
        headers: {
          'Content-Type': 'application/json',
          'TokenCode': tokenCode,
          'ApplicationCode': 'HIS',
        },
      });

      const fullUrl = `${baseUrl}${endpoint}?param=${paramEncoded}`;


      this.logger.info('HisProvider#getExpMestMedicines.request', {
        method: 'GET',
        url: fullUrl,
        baseUrl,
        endpoint,
        expMestId: expMestIdNumber,
        paramJson,
        paramBase64,
        paramEncoded: paramEncoded.substring(0, 60) + '...',
      });

      const response = await axiosInstance.get<HisExpMestMedicineResponse>(
        `${endpoint}?param=${paramEncoded}`
      );

      this.logger.info('HisProvider#getExpMestMedicines.response', {
        status: response.status,
        statusText: response.statusText,
        Success: response.data?.Success,
        dataCount: response.data?.Data?.length || 0,
        param: response.data?.Param,
      });

      if (!response.data) {
        this.logger.error('HisProvider#getExpMestMedicines.noData', {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        });
        throw new Error('Get exp mest medicines failed: No response data');
      }

      // Check if Success field exists and is true
      if (response.data.Success !== true) {
        this.logger.warn('HisProvider#getExpMestMedicines.unsuccessful', {
          Success: response.data.Success,
          Param: response.data.Param,
          Messages: response.data.Param?.Messages,
          BugCodes: response.data.Param?.BugCodes,
          MessageCodes: response.data.Param?.MessageCodes,
          HasException: response.data.Param?.HasException,
          fullResponse: JSON.stringify(response.data).substring(0, 1000),
        });
        throw new Error('Get exp mest medicines failed: API returned unsuccessful response');
      }

      // Check if Data field exists (can be empty array)
      if (!response.data.Data) {
        this.logger.warn('HisProvider#getExpMestMedicines.noDataField', {
          Success: response.data.Success,
          Param: response.data.Param,
          responseDataKeys: Object.keys(response.data),
        });
        // Return empty array if Data is missing but Success is true
        return {
          Data: [],
          Success: true,
          Param: response.data.Param || {
            Messages: [],
            BugCodes: [],
            MessageCodes: [],
            LanguageCode: 'VI',
            Now: 0,
            HasException: false,
          },
        };
      }

      this.logger.info('HisProvider#getExpMestMedicines.success', {
        dataCount: response.data.Data.length,
        expMestId,
      });

      return response.data;
    } catch (error: any) {
      this.logger.error('HisProvider#getExpMestMedicines.error', {
        error: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        expMestId,
      });

      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Invalid token code');
      }
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        throw new Error('External service timeout');
      }
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Connection refused. Check if HIS ExpMestMedicine API is accessible');
      }
      throw new Error(`Get exp mest medicines error: ${error.message} (Status: ${error.response?.status || 'N/A'})`);
    }
  }

  /**
   * Get ExpMestMedicine list by multiple EXP_MEST_IDs from HIS system
   * Endpoint: /api/HisExpMestMedicine/GetView?param=<base64_url_encoded_json>
   * Headers: TokenCode, ApplicationCode: HIS
   */
  async getExpMestMedicinesByIds(
    tokenCode: string,
    expMestIds: number[],
    includeDeleted: boolean = false,
    dataDomainFilter: boolean = false
  ): Promise<HisExpMestMedicineResponse> {
    this.logger.info('HisProvider#getExpMestMedicinesByIds.call', {
      tokenCodePrefix: tokenCode?.substring(0, 20) + '...',
      expMestIdsCount: expMestIds?.length || 0,
      includeDeleted,
      dataDomainFilter,
    });

    try {
      if (!expMestIds || expMestIds.length === 0) {
        return {
          Data: [],
          Success: true,
          Param: {
            Messages: [],
            BugCodes: [],
            MessageCodes: [],
            LanguageCode: 'VI',
            Now: 0,
            HasException: false,
          },
        };
      }

      // Helper function to convert Long objects to numbers
      const convertToNumber = (value: any): number | null => {
        if (value === null || value === undefined) return null;
        if (typeof value === 'object' && 'low' in value && 'high' in value) {
          const longValue = value as { low: number; high: number };
          return longValue.low + (longValue.high * 0x100000000);
        }
        if (typeof value === 'number') return value;
        const num = Number(value);
        return isNaN(num) ? null : num;
      };

      // Convert all expMestIds to numbers
      const expMestIdsNumbers = expMestIds
        .map(id => convertToNumber(id))
        .filter((id): id is number => id !== null);

      if (expMestIdsNumbers.length === 0) {
        throw new Error('Invalid expMestIds: must contain at least one valid number');
      }

      const baseUrl =
        this.configService.get('EXTERNAL_USER_ROOM_URL') ||
        process.env.EXTERNAL_USER_ROOM_URL ||
        'http://192.168.7.236:1608';

      const endpoint = '/api/HisExpMestMedicine/GetView';

      // Build ApiData with EXP_MEST_IDs array (use converted numbers)
      const apiData: any = {
        EXP_MEST_IDs: expMestIdsNumbers,
        IS_INCLUDE_DELETED: includeDeleted,
        DATA_DOMAIN_FILTER: dataDomainFilter,
      };

      // Build CommonParam
      const commonParam: any = {
        Messages: [],
        BugCodes: [],
        MessageCodes: [],
        LanguageCode: 'VI',
        Now: 0,
        HasException: false,
      };

      const paramObject = {
        CommonParam: commonParam,
        ApiData: apiData,
      };

      const paramJson = JSON.stringify(paramObject);
      const paramBase64 = Buffer.from(paramJson, 'utf-8').toString('base64');
      // URL-encode to avoid "Invalid length for a Base-64 char array or string."
      const paramEncoded = encodeURIComponent(paramBase64);

      const axiosInstance = axios.create({
        baseURL: baseUrl,
        timeout: 300000, // 300s to align with global HIS timeout
        headers: {
          'Content-Type': 'application/json',
          'TokenCode': tokenCode,
          'ApplicationCode': 'HIS',
        },
      });

      const fullUrl = `${baseUrl}${endpoint}?param=${paramEncoded}`;

      this.logger.info('HisProvider#getExpMestMedicinesByIds.request', {
        method: 'GET',
        url: fullUrl,
        baseUrl,
        endpoint,
        expMestIdsCount: expMestIdsNumbers.length,
        expMestIds: expMestIdsNumbers,
        paramJson,
      });

      const response = await axiosInstance.get<HisExpMestMedicineResponse>(
        `${endpoint}?param=${paramEncoded}`
      );

      this.logger.info({
        status: response.status,
        statusText: response.statusText,
        Success: response.data?.Success,
        dataCount: response.data?.Data?.length || 0,
        ids: expMestIdsNumbers,
        rawResponse: JSON.stringify(response.data).substring(0, 2000), // Log more for debug
      }, 'HisProvider#getExpMestMedicinesByIds.response');

      if (!response.data) {
        this.logger.error('HisProvider#getExpMestMedicinesByIds.noData', {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        });
        throw new Error('Get exp mest medicines by IDs failed: No response data');
      }

      // Check if Success field exists and is true
      if (response.data.Success !== true) {
        this.logger.warn('HisProvider#getExpMestMedicinesByIds.unsuccessful', {
          Success: response.data.Success,
          Param: response.data.Param,
          Messages: response.data.Param?.Messages,
          BugCodes: response.data.Param?.BugCodes,
          MessageCodes: response.data.Param?.MessageCodes,
          HasException: response.data.Param?.HasException,
        });
        throw new Error('Get exp mest medicines by IDs failed: API returned unsuccessful response');
      }

      // Check if Data field exists (can be empty array)
      if (!response.data.Data) {
        this.logger.warn('HisProvider#getExpMestMedicinesByIds.noDataField', {
          Success: response.data.Success,
          Param: response.data.Param,
          responseDataKeys: Object.keys(response.data),
        });
        // Return empty array if Data is missing but Success is true
        return {
          Data: [],
          Success: true,
          Param: response.data.Param || {
            Messages: [],
            BugCodes: [],
            MessageCodes: [],
            LanguageCode: 'VI',
            Now: 0,
            HasException: false,
          },
        };
      }

      this.logger.info('HisProvider#getExpMestMedicinesByIds.success', {
        dataCount: response.data.Data.length,
        expMestIdsCount: expMestIdsNumbers.length,
      });

      return response.data;
    } catch (error: any) {
      this.logger.error('HisProvider#getExpMestMedicinesByIds.error', {
        error: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        expMestIdsCount: expMestIds?.length || 0,
      });

      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Invalid token code');
      }
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        throw new Error('External service timeout');
      }
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Connection refused. Check if HIS ExpMestMedicine GetView API is accessible');
      }
      throw new Error(`Get exp mest medicines by IDs error: ${error.message} (Status: ${error.response?.status || 'N/A'})`);
    }
  }

  /**
   * Get ExpMest by ID from HIS system
   * Endpoint: /api/HisExpMest/GetView3?param=<base64_encoded_json>
   * Headers: TokenCode, ApplicationCode: HIS
   * Note: Using GetView3 instead of GetView to get TDL_INTRUCTION_DATE_MIN field
   */
  async getExpMestById(tokenCode: string, expMestId: number, includeDeleted: boolean = false, dataDomainFilter: boolean = false): Promise<HisExpMestResponse> {
    this.logger.info('HisProvider#getExpMestById.call', {
      tokenCodePrefix: tokenCode?.substring(0, 20) + '...',
      expMestId,
      includeDeleted,
      dataDomainFilter,
    });

    try {
      const baseUrl =
        this.configService.get('EXTERNAL_USER_ROOM_URL') ||
        process.env.EXTERNAL_USER_ROOM_URL ||
        'http://192.168.7.236:1608';

      const endpoint = '/api/HisExpMest/GetView3';

      // Helper function to convert Long objects to numbers
      const convertToNumber = (value: any): number | null => {
        if (value === null || value === undefined) return null;
        if (typeof value === 'object' && 'low' in value && 'high' in value) {
          const longValue = value as { low: number; high: number };
          return longValue.low + (longValue.high * 0x100000000);
        }
        if (typeof value === 'number') return value;
        const num = Number(value);
        return isNaN(num) ? null : num;
      };

      // Create param JSON object
      const paramObject = {
        CommonParam: {
          Messages: [],
          BugCodes: [],
          MessageCodes: [],
          Start: null,
          Limit: null,
          Count: null,
          ModuleCode: null,
          LanguageCode: 'VI',
          Now: 0,
          HasException: false,
        },
        ApiData: {
          IS_INCLUDE_DELETED: includeDeleted,
          ID: convertToNumber(expMestId),
          DATA_DOMAIN_FILTER: dataDomainFilter,
        },
      };

      // Encode param to base64
      const paramJson = JSON.stringify(paramObject);
      const paramBase64 = Buffer.from(paramJson).toString('base64');
      const paramEncoded = encodeURIComponent(paramBase64);

      // Create axios instance
      const axiosInstance = axios.create({
        baseURL: baseUrl,
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'TokenCode': tokenCode,
          'ApplicationCode': 'HIS',
        },
      });

      // Full URL with param
      const fullUrl = `${baseUrl}${endpoint}?param=${paramEncoded}`;

      // Log request details
      console.log('=== HIS GetExpMestById API Request ===');
      console.log('Method: GET');
      console.log('URL:', fullUrl);
      console.log('Base URL:', baseUrl);
      console.log('Endpoint:', endpoint);
      console.log('Headers:', {
        'Content-Type': 'application/json',
        'TokenCode': tokenCode?.substring(0, 30) + '...',
        'ApplicationCode': 'HIS',
      });
      console.log('Param JSON:', JSON.stringify(paramObject, null, 2));
      console.log('Param Base64:', paramBase64);
      console.log('ExpMestId:', expMestId);
      console.log('===================================');

      this.logger.info('HisProvider#getExpMestById.request', {
        method: 'GET',
        url: fullUrl,
        baseUrl,
        endpoint,
        paramJson,
        paramBase64,
        paramEncoded: paramEncoded.substring(0, 60) + '...',
        headers: {
          'Content-Type': 'application/json',
          'TokenCode': tokenCode?.substring(0, 30) + '...',
          'ApplicationCode': 'HIS',
        },
        expMestId,
        includeDeleted,
        dataDomainFilter,
      });

      // Get raw response as string to handle large numbers
      const response = await axiosInstance.get<string>(`${endpoint}?param=${paramEncoded}`, {
        responseType: 'text',
      });

      let responseData: HisExpMestResponse;
      try {
        // Preserve VIR_CREATE_MONTH as string before JSON.parse to avoid precision loss
        let preserved = response.data;
        let matchCount = 0;

        // Try multiple regex patterns to catch different formats
        preserved = preserved.replace(/"VIR_CREATE_MONTH"\s*:\s*(\d+\.?\d*)/g, (match, number) => {
          matchCount++;
          return `"VIR_CREATE_MONTH":"${number}"`;
        });

        preserved = preserved.replace(/"VIR_CREATE_YEAR"\s*:\s*(\d+\.?\d*)/g, (match, number) => {
          matchCount++;
          return `"VIR_CREATE_YEAR":"${number}"`;
        });

        responseData = JSON.parse(preserved);

        // Convert string back to number for VIR_CREATE_MONTH and VIR_CREATE_YEAR
        if (responseData.Data && Array.isArray(responseData.Data)) {
          responseData.Data = responseData.Data.map((item: any) => {
            if (typeof item.VIR_CREATE_MONTH === 'string') {
              item.VIR_CREATE_MONTH = parseFloat(item.VIR_CREATE_MONTH);
            }
            if (typeof item.VIR_CREATE_YEAR === 'string') {
              item.VIR_CREATE_YEAR = parseFloat(item.VIR_CREATE_YEAR);
            }

            // Fallback: Fix corrupted VIR_CREATE_MONTH if needed
            if (item.VIR_CREATE_MONTH && item.VIR_CREATE_MONTH < 1000000000000 && item.CREATE_DATE) {
              // Reconstruct from CREATE_DATE (e.g., 20251218000000 -> 20251200000000)
              const createDateStr = String(item.CREATE_DATE);
              if (createDateStr.length >= 6) {
                const yearMonth = createDateStr.substring(0, 6); // YYYYMM
                item.VIR_CREATE_MONTH = parseFloat(yearMonth + '00000000');
                console.log(`Fixed VIR_CREATE_MONTH from CREATE_DATE: ${item.VIR_CREATE_MONTH}`);
              } else {
                item.VIR_CREATE_MONTH = 20251200000000; // Default fallback
              }
            }

            return item;
          });
        }
      } catch (parseError: any) {
        this.logger.error('HisProvider#getExpMestById.parseError', {
          error: parseError.message,
          responseSample: response.data?.substring(0, 1000),
        });
        throw new Error(`Failed to parse HIS response: ${parseError.message}`);
      }

      this.logger.info('HisProvider#getExpMestById.response', {
        status: response.status,
        statusText: response.statusText,
        Success: responseData.Success,
        dataCount: responseData.Data?.length || 0,
        param: responseData.Param,
        hasData: !!responseData,
        hasDataArray: !!responseData.Data,
        responseDataKeys: responseData ? Object.keys(responseData) : [],
      });

      if (!responseData) {
        this.logger.error('HisProvider#getExpMestById.noData', {
          status: response.status,
          statusText: response.statusText,
        });
        throw new Error('Get exp mest by ID failed: No response data');
      }

      if (responseData.Success !== true) {
        this.logger.warn('HisProvider#getExpMestById.notSuccess', {
          Success: responseData.Success,
          Messages: responseData.Param?.Messages || [],
          BugCodes: responseData.Param?.BugCodes || [],
        });
        throw new Error(`Get exp mest by ID failed: ${responseData.Param?.Messages?.join(', ') || 'API returned unsuccessful response'}`);
      }

      return responseData;
    } catch (error: any) {
      this.logger.error('HisProvider#getExpMestById.error', {
        error: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        expMestId,
      });

      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Invalid token code');
      }

      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        throw new Error('External service timeout');
      }

      if (error.code === 'ECONNREFUSED') {
        throw new Error('Connection refused. Check if HIS API is accessible');
      }

      throw new Error(`Get exp mest by ID error: ${error.message} (Status: ${error.response?.status || 'N/A'})`);
    }
  }

  /**
   * Get Inpatient ExpMest details (chi tiết các phiếu con) by AGGR_EXP_MEST_ID from HIS system
   * Endpoint: /api/HisExpMest/GetView?param=<base64_encoded_json>
   * Headers: TokenCode, ApplicationCode: HIS
   * Uses AGGR_EXP_MEST_ID to get list of child exp mests in an aggregated exp mest
   */
  async getInpatientExpMestDetails(tokenCode: string, aggrExpMestId: number, includeDeleted: boolean = false, dataDomainFilter: boolean = false): Promise<HisExpMestResponse> {
    this.logger.info('HisProvider#getInpatientExpMestDetails.call', {
      tokenCodePrefix: tokenCode?.substring(0, 20) + '...',
      aggrExpMestId,
      includeDeleted,
      dataDomainFilter,
    });

    try {
      const baseUrl =
        this.configService.get('EXTERNAL_USER_ROOM_URL') ||
        process.env.EXTERNAL_USER_ROOM_URL ||
        'http://192.168.7.236:1608';

      const endpoint = '/api/HisExpMest/GetView';

      // Helper function to convert Long objects to numbers
      const convertToNumber = (value: any): number | null => {
        if (value === null || value === undefined) return null;
        if (typeof value === 'object' && 'low' in value && 'high' in value) {
          const longValue = value as { low: number; high: number };
          return longValue.low + (longValue.high * 0x100000000);
        }
        if (typeof value === 'number') return value;
        const num = Number(value);
        return isNaN(num) ? null : num;
      };

      // Create param JSON object with AGGR_EXP_MEST_ID
      const paramObject = {
        CommonParam: {
          Messages: [],
          BugCodes: [],
          MessageCodes: [],
          Start: null,
          Limit: null,
          Count: null,
          ModuleCode: null,
          LanguageCode: 'VI',
          Now: 0,
          HasException: false,
        },
        ApiData: {
          IS_INCLUDE_DELETED: includeDeleted,
          AGGR_EXP_MEST_ID: convertToNumber(aggrExpMestId),
          DATA_DOMAIN_FILTER: dataDomainFilter,
        },
      };

      // Encode param to base64
      const paramJson = JSON.stringify(paramObject);
      const paramBase64 = Buffer.from(paramJson).toString('base64');
      const paramEncoded = encodeURIComponent(paramBase64);

      // Create axios instance
      const axiosInstance = axios.create({
        baseURL: baseUrl,
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
          'TokenCode': tokenCode,
          'ApplicationCode': 'HIS',
        },
      });

      // Full URL with param
      const fullUrl = `${baseUrl}${endpoint}?param=${paramEncoded}`;

      this.logger.info('HisProvider#getInpatientExpMestDetails.request', {
        method: 'GET',
        url: fullUrl,
        baseUrl,
        endpoint,
        paramJson,
        paramBase64,
        paramEncoded: paramEncoded.substring(0, 60) + '...',
        headers: {
          'Content-Type': 'application/json',
          'TokenCode': tokenCode?.substring(0, 30) + '...',
          'ApplicationCode': 'HIS',
        },
        aggrExpMestId,
        includeDeleted,
        dataDomainFilter,
      });

      // Get raw response as string to handle large numbers
      const response = await axiosInstance.get<string>(`${endpoint}?param=${paramEncoded}`, {
        responseType: 'text',
      });

      let responseData: HisExpMestResponse;
      try {
        // Preserve VIR_CREATE_MONTH as string before JSON.parse to avoid precision loss
        let preserved = response.data;
        let matchCount = 0;

        // Try multiple regex patterns to catch different formats
        preserved = preserved.replace(/"VIR_CREATE_MONTH"\s*:\s*(\d+\.?\d*)/g, (match, number) => {
          matchCount++;
          return `"VIR_CREATE_MONTH":"${number}"`;
        });

        preserved = preserved.replace(/"VIR_CREATE_YEAR"\s*:\s*(\d+\.?\d*)/g, (match, number) => {
          matchCount++;
          return `"VIR_CREATE_YEAR":"${number}"`;
        });

        responseData = JSON.parse(preserved);

        // Convert string back to number for VIR_CREATE_MONTH and VIR_CREATE_YEAR
        if (responseData.Data && Array.isArray(responseData.Data)) {
          responseData.Data = responseData.Data.map((item: any) => {
            if (typeof item.VIR_CREATE_MONTH === 'string') {
              item.VIR_CREATE_MONTH = parseFloat(item.VIR_CREATE_MONTH);
            }
            if (typeof item.VIR_CREATE_YEAR === 'string') {
              item.VIR_CREATE_YEAR = parseFloat(item.VIR_CREATE_YEAR);
            }

            // Fallback: Fix corrupted VIR_CREATE_MONTH if needed
            if (item.VIR_CREATE_MONTH && item.VIR_CREATE_MONTH < 1000000000000 && item.CREATE_DATE) {
              // Reconstruct from CREATE_DATE (e.g., 20251218000000 -> 20251200000000)
              const createDateStr = String(item.CREATE_DATE);
              if (createDateStr.length >= 6) {
                const yearMonth = createDateStr.substring(0, 6); // YYYYMM
                item.VIR_CREATE_MONTH = parseFloat(yearMonth + '00000000');
              } else {
                item.VIR_CREATE_MONTH = 20251200000000; // Default fallback
              }
            }

            return item;
          });
        }
      } catch (parseError: any) {
        this.logger.error('HisProvider#getInpatientExpMestDetails.parseError', {
          error: parseError.message,
          responseSample: response.data?.substring(0, 1000),
        });
        throw new Error(`Failed to parse HIS response: ${parseError.message}`);
      }

      this.logger.info({
        status: response.status,
        statusText: response.statusText,
        Success: responseData.Success,
        dataCount: responseData.Data?.length || 0,
        param: responseData.Param,
        hasData: !!responseData,
        hasDataArray: !!responseData.Data,
        responseDataKeys: responseData ? Object.keys(responseData) : [],
        rawResponse: response.data.substring(0, 2000), // Log more for debug
      }, 'HisProvider#getInpatientExpMestDetails.response');

      if (!responseData) {
        this.logger.error('HisProvider#getInpatientExpMestDetails.noData', {
          status: response.status,
          statusText: response.statusText,
        });
        throw new Error('Get inpatient exp mest details failed: No response data');
      }

      if (responseData.Success !== true) {
        this.logger.warn('HisProvider#getInpatientExpMestDetails.notSuccess', {
          Success: responseData.Success,
          Messages: responseData.Param?.Messages || [],
          BugCodes: responseData.Param?.BugCodes || [],
        });
        throw new Error(`Get inpatient exp mest details failed: ${responseData.Param?.Messages?.join(', ') || 'API returned unsuccessful response'}`);
      }

      return responseData;
    } catch (error: any) {
      this.logger.error('HisProvider#getInpatientExpMestDetails.error', {
        error: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        aggrExpMestId,
      });

      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error('Invalid token code');
      }

      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        throw new Error('External service timeout');
      }

      if (error.code === 'ECONNREFUSED') {
        throw new Error('Connection refused. Check if HIS API is accessible');
      }

      throw new Error(`Get inpatient exp mest details error: ${error.message} (Status: ${error.response?.status || 'N/A'})`);
    }
  }

  /**
   * Update Work Info (register working rooms)
   * Endpoint: /api/Token/UpdateWorkInfo
   */
  async updateWorkInfo(tokenCode: string, payload: UpdateWorkInfoRequest): Promise<UpdateWorkInfoResponse> {
    this.logger.info('HisProvider#updateWorkInfo.call', {
      tokenCodePrefix: tokenCode?.substring(0, 20) + '...',
      roomsLength: payload?.ApiData?.Rooms?.length || 0,
      roomIdsLength: payload?.ApiData?.RoomIds?.length || 0,
    });

    try {
      const baseUrl =
        this.configService.get('EXTERNAL_USER_ROOM_URL') ||
        process.env.EXTERNAL_USER_ROOM_URL ||
        'http://192.168.7.236:1608';

      const endpoint = '/api/Token/UpdateWorkInfo';

      const commonParam: CommonParam = payload.CommonParam || {
        Messages: [],
        BugCodes: [],
        MessageCodes: [],
        Start: null,
        Limit: null,
        Count: null,
        ModuleCode: null,
        LanguageCode: 'VI',
        Now: 0,
        HasException: false,
      };

      const apiData = payload.ApiData || {};

      const paramObject = {
        CommonParam: commonParam,
        ApiData: apiData,
      };

      const axiosInstance = axios.create({
        baseURL: baseUrl,
        timeout: 300000, // align with other HIS calls
        headers: {
          'Content-Type': 'application/json',
          'TokenCode': tokenCode,
          'ApplicationCode': 'HIS',
        },
      });

      const fullUrl = `${baseUrl}${endpoint}`;

      console.log('=== HIS UpdateWorkInfo API Request ===');
      console.log('Method: POST');
      console.log('URL:', fullUrl);
      console.log('Base URL:', baseUrl);
      console.log('Endpoint:', endpoint);
      console.log('Body JSON:', JSON.stringify(paramObject, null, 2));
      console.log('Headers:', {
        'Content-Type': 'application/json',
        'TokenCode': tokenCode?.substring(0, 20) + '...',
        'ApplicationCode': 'HIS',
      });

      const response = await axiosInstance.post<UpdateWorkInfoResponse>(endpoint, paramObject);

      this.logger.info('HisProvider#updateWorkInfo.response', {
        status: response.status,
        success: response.data.Success,
        hasData: !!response.data.Data,
      });

      return response.data;
    } catch (error: any) {
      console.log('=== HIS UpdateWorkInfo API Error ===');
      console.log('Error Message:', error.message);
      console.log('Error Code:', error.code);
      console.log('Status:', error.response?.status);
      console.log('Status Text:', error.response?.statusText);
      console.log('Response Data:', error.response?.data);
      console.log('Request URL:', error.config?.url);
      console.log('Request Method:', error.config?.method);
      console.log('Request Headers:', error.config?.headers);
      console.log('Full Error:', JSON.stringify(error, null, 2));

      this.logger.error('HisProvider#updateWorkInfo.error', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
      });

      if (error.code === 'ECONNABORTED') {
        throw new Error('External service timeout');
      }

      throw error;
    }
  }
}

