import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { HisProvider, GetInpatientExpMestRequest } from '../../providers/his.provider';
import { AuthTokenService } from '../auth/auth-token.service';
import { ExpMest } from '../../integration.interface';
import { LongConverter } from '../../utils/long-converter.util';

@Injectable()
export class InpatientExpMestService {
  constructor(
    private readonly hisProvider: HisProvider,
    private readonly authTokenService: AuthTokenService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(InpatientExpMestService.name);
  }

  /**
   * Get inpatient aggregated ExpMest list (HIS GetView3)
   */
  async getInpatientExpMests(request: GetInpatientExpMestRequest): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMest[];
    start?: number;
    limit?: number;
    count?: number;
    total?: number;
  }> {
    this.logger.info('InpatientExpMestService#getInpatientExpMests.call', { request });

    try {
      const userId = request.userId;
      if (!userId) {
        this.logger.warn('InpatientExpMestService#getInpatientExpMests.missingUserId');
        return {
          success: false,
          message: 'User ID is required',
        };
      }

      const tokenData = await this.authTokenService.getToken(userId);
      if (!tokenData?.tokenCode) {
        return {
          success: false,
          message: 'No external token available. Please login first.',
        };
      }

      const hisRequest: GetInpatientExpMestRequest = {
        ...request,
      };

      const hisResponse = await this.hisProvider.getInpatientExpMests(tokenData.tokenCode, hisRequest);

      // Log first item to debug data from HIS
      if (hisResponse.Data && hisResponse.Data.length > 0) {
        const firstItem = hisResponse.Data[0];
        this.logger.info('InpatientExpMestService#getInpatientExpMests.hisDataSample', {
          ID: firstItem.ID,
          VIR_CREATE_MONTH: firstItem.VIR_CREATE_MONTH,
          VIR_CREATE_MONTH_type: typeof firstItem.VIR_CREATE_MONTH,
          VIR_CREATE_MONTH_string: String(firstItem.VIR_CREATE_MONTH),
          VIR_CREATE_YEAR: firstItem.VIR_CREATE_YEAR,
          TDL_INTRUCTION_DATE_MIN: firstItem.TDL_INTRUCTION_DATE_MIN,
        });
      }

      if (!hisResponse.Success) {
        return {
          success: false,
          message: `Failed to get inpatient exp mests: ${hisResponse.Param?.Messages?.join(', ') || 'Unknown error'}`,
        };
      }

      if (!hisResponse.Data) {
        const start = hisResponse.Param?.Start ?? request.start ?? 0;
        const limit = hisResponse.Param?.Limit ?? request.limit ?? 100;
        const count = hisResponse.Param?.Count ?? 0;
        return {
          success: true,
          data: [],
          start,
          limit,
          count,
          total: count,
        };
      }

      // Map only fields that HIS GetView3 actually returns
      // Based on HIS response structure, only include fields that are present in the response
      const mapped: ExpMest[] = hisResponse.Data.map((item: any) => {
        const result: any = {
          id: item.ID,
          createTime: item.CREATE_TIME,
          modifyTime: item.MODIFY_TIME,
          creator: item.CREATOR || '',
          modifier: item.MODIFIER || '',
          appCreator: item.APP_CREATOR || '',
          appModifier: item.APP_MODIFIER || '',
          isActive: item.IS_ACTIVE,
          isDelete: item.IS_DELETE,
          expMestCode: item.EXP_MEST_CODE || '',
          expMestTypeId: item.EXP_MEST_TYPE_ID,
          expMestSttId: item.EXP_MEST_STT_ID,
          mediStockId: item.MEDI_STOCK_ID,
          reqLoginname: item.REQ_LOGINNAME || '',
          reqUsername: item.REQ_USERNAME || '',
          reqRoomId: item.REQ_ROOM_ID,
          reqDepartmentId: item.REQ_DEPARTMENT_ID,
          createDate: item.CREATE_DATE,
          tdlPatientTypeId: item.TDL_PATIENT_TYPE_ID,
          virCreateMonth: item.VIR_CREATE_MONTH !== null && item.VIR_CREATE_MONTH !== undefined
            ? (typeof item.VIR_CREATE_MONTH === 'number' ? item.VIR_CREATE_MONTH : Number(item.VIR_CREATE_MONTH))
            : null,
          virCreateYear: (() => {
            const val = item.VIR_CREATE_YEAR;
            if (val === null || val === undefined) return null;
            if (typeof val === 'string') {
              const parsed = parseFloat(val);
              return isNaN(parsed) ? null : parsed;
            }
            if (typeof val === 'number') return val;
            const num = Number(val);
            return isNaN(num) ? null : num;
          })(),
          reqUserTitle: item.REQ_USER_TITLE || '',
          expMestSubCode: item.EXP_MEST_SUB_CODE || '',
          expMestSubCode2: item.EXP_MEST_SUB_CODE_2 || '',
          numOrder: item.NUM_ORDER,
          tdlAggrPatientCode: item.TDL_AGGR_PATIENT_CODE || '',
          tdlAggrTreatmentCode: item.TDL_AGGR_TREATMENT_CODE || '',
          expMestTypeCode: item.EXP_MEST_TYPE_CODE || '',
          expMestTypeName: item.EXP_MEST_TYPE_NAME || '',
          expMestSttCode: item.EXP_MEST_STT_CODE || '',
          expMestSttName: item.EXP_MEST_STT_NAME || '',
          mediStockCode: item.MEDI_STOCK_CODE || '',
          mediStockName: item.MEDI_STOCK_NAME || '',
          reqDepartmentCode: item.REQ_DEPARTMENT_CODE || '',
          reqDepartmentName: item.REQ_DEPARTMENT_NAME || '',
          tdlIntructionDateMin: item.TDL_INTRUCTION_DATE_MIN !== null && item.TDL_INTRUCTION_DATE_MIN !== undefined
            ? Math.floor(typeof item.TDL_INTRUCTION_DATE_MIN === 'number' ? item.TDL_INTRUCTION_DATE_MIN : Number(item.TDL_INTRUCTION_DATE_MIN))
            : null,
        };

        // Only include optional fields if they exist in HIS response
        if (item.LAST_EXP_LOGINNAME !== undefined) {
          result.lastExpLoginname = item.LAST_EXP_LOGINNAME || '';
        }
        if (item.LAST_EXP_USERNAME !== undefined) {
          result.lastExpUsername = item.LAST_EXP_USERNAME || '';
        }
        if (item.LAST_EXP_TIME !== undefined) {
          result.lastExpTime = item.LAST_EXP_TIME;
        }
        if (item.FINISH_TIME !== undefined) {
          result.finishTime = item.FINISH_TIME;
        }
        if (item.FINISH_DATE !== undefined) {
          result.finishDate = item.FINISH_DATE;
        }
        if (item.IS_EXPORT_EQUAL_APPROVE !== undefined) {
          result.isExportEqualApprove = item.IS_EXPORT_EQUAL_APPROVE;
        }
        if (item.LAST_APPROVAL_LOGINNAME !== undefined) {
          result.lastApprovalLoginname = item.LAST_APPROVAL_LOGINNAME || '';
        }
        if (item.LAST_APPROVAL_USERNAME !== undefined) {
          result.lastApprovalUsername = item.LAST_APPROVAL_USERNAME || '';
        }
        if (item.LAST_APPROVAL_TIME !== undefined) {
          result.lastApprovalTime = item.LAST_APPROVAL_TIME;
        }
        if (item.LAST_APPROVAL_DATE !== undefined) {
          result.lastApprovalDate = item.LAST_APPROVAL_DATE;
        }
        if (item.REQ_ROOM_CODE !== undefined) {
          result.reqRoomCode = item.REQ_ROOM_CODE || '';
        }
        if (item.REQ_ROOM_NAME !== undefined) {
          result.reqRoomName = item.REQ_ROOM_NAME || '';
        }
        if (item.GROUP_CODE !== undefined) {
          result.groupCode = item.GROUP_CODE || '';
        }

        return result;
      });

      const start = hisResponse.Param?.Start ?? request.start ?? 0;
      const limit = hisResponse.Param?.Limit ?? request.limit ?? 100;
      const count = hisResponse.Param?.Count ?? mapped.length;

      return {
        success: true,
        data: mapped,
        start,
        limit,
        count,
        total: count,
      };
    } catch (error: any) {
      this.logger.error('InpatientExpMestService#getInpatientExpMests.error', {
        error: error.message,
        errorType: error.constructor?.name,
        stack: error.stack?.substring(0, 500),
      });
      return {
        success: false,
        message: error.message || 'Failed to get inpatient exp mests',
      };
    }
  }

  /**
   * Get ExpMest by ID from HIS (inpatient format - GetView3)
   */
  async getInpatientExpMestById(request: {
    expMestId: number;
    includeDeleted?: boolean;
    dataDomainFilter?: boolean;
    userId?: string;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMest | null;
  }> {
    this.logger.info('InpatientExpMestService#getInpatientExpMestById.call', request);

    try {
      const userId = request.userId;
      if (!userId) {
        this.logger.warn('InpatientExpMestService#getInpatientExpMestById.missingUserId');
        return {
          success: false,
          message: 'User ID is required',
        };
      }

      // Get any available external token
      const tokenData = await this.authTokenService.getToken(userId);
      if (!tokenData?.tokenCode) {
        return {
          success: false,
          message: 'No external token available. Please login first.',
        };
      }

      // Convert expMestId from Long object to number if needed
      const expMestIdNumber = LongConverter.convertToNumber(request.expMestId);
      if (expMestIdNumber === null) {
        return {
          success: false,
          message: 'Invalid expMestId: must be a valid number',
        };
      }

      const hisResponse = await this.hisProvider.getExpMestById(
        tokenData.tokenCode,
        expMestIdNumber,
        request.includeDeleted ?? false,
        request.dataDomainFilter ?? false,
      );

      if (!hisResponse.Success) {
        return {
          success: false,
          message: `Failed to get inpatient exp mest by ID: ${hisResponse.Param?.Messages?.join(', ') || 'Unknown error'}`,
        };
      }

      if (!hisResponse.Data || hisResponse.Data.length === 0) {
        return {
          success: true,
          data: null,
        };
      }

      // Map from UPPERCASE to camelCase (same mapping as getInpatientExpMests)
      const item = hisResponse.Data[0];

      const mapped: any = {
        id: item.ID,
        createTime: item.CREATE_TIME,
        modifyTime: item.MODIFY_TIME,
        creator: item.CREATOR || '',
        modifier: item.MODIFIER || '',
        appCreator: item.APP_CREATOR || '',
        appModifier: item.APP_MODIFIER || '',
        isActive: item.IS_ACTIVE,
        isDelete: item.IS_DELETE,
        expMestCode: item.EXP_MEST_CODE || '',
        expMestTypeId: item.EXP_MEST_TYPE_ID,
        expMestSttId: item.EXP_MEST_STT_ID,
        mediStockId: item.MEDI_STOCK_ID,
        reqLoginname: item.REQ_LOGINNAME || '',
        reqUsername: item.REQ_USERNAME || '',
        reqRoomId: item.REQ_ROOM_ID,
        reqDepartmentId: item.REQ_DEPARTMENT_ID,
        createDate: item.CREATE_DATE,
        tdlPatientTypeId: item.TDL_PATIENT_TYPE_ID,
        virCreateMonth: item.VIR_CREATE_MONTH !== null && item.VIR_CREATE_MONTH !== undefined
          ? (typeof item.VIR_CREATE_MONTH === 'number' ? item.VIR_CREATE_MONTH : Number(item.VIR_CREATE_MONTH))
          : null,
        virCreateYear: (() => {
          const val = item.VIR_CREATE_YEAR;
          if (val === null || val === undefined) return null;
          if (typeof val === 'string') {
            const parsed = parseFloat(val);
            return isNaN(parsed) ? null : parsed;
          }
          if (typeof val === 'number') return val;
          const num = Number(val);
          return isNaN(num) ? null : num;
        })(),
        reqUserTitle: item.REQ_USER_TITLE || '',
        expMestSubCode: item.EXP_MEST_SUB_CODE || '',
        expMestSubCode2: item.EXP_MEST_SUB_CODE_2 || '',
        numOrder: item.NUM_ORDER,
        tdlAggrPatientCode: item.TDL_AGGR_PATIENT_CODE || '',
        tdlAggrTreatmentCode: item.TDL_AGGR_TREATMENT_CODE || '',
        expMestTypeCode: item.EXP_MEST_TYPE_CODE || '',
        expMestTypeName: item.EXP_MEST_TYPE_NAME || '',
        expMestSttCode: item.EXP_MEST_STT_CODE || '',
        expMestSttName: item.EXP_MEST_STT_NAME || '',
        mediStockCode: item.MEDI_STOCK_CODE || '',
        mediStockName: item.MEDI_STOCK_NAME || '',
        reqDepartmentCode: item.REQ_DEPARTMENT_CODE || '',
        reqDepartmentName: item.REQ_DEPARTMENT_NAME || '',
        tdlIntructionDateMin: (() => {
          // If TDL_INTRUCTION_DATE_MIN exists in HIS response, use it
          if (item.TDL_INTRUCTION_DATE_MIN !== null && item.TDL_INTRUCTION_DATE_MIN !== undefined) {
            return Math.floor(typeof item.TDL_INTRUCTION_DATE_MIN === 'number' ? item.TDL_INTRUCTION_DATE_MIN : Number(item.TDL_INTRUCTION_DATE_MIN));
          }
          // Otherwise, calculate from CREATE_DATE (first day of month, e.g., 20251220000000 -> 20251201000000)
          if (item.CREATE_DATE) {
            const createDateStr = String(item.CREATE_DATE);
            if (createDateStr.length >= 6) {
              const yearMonth = createDateStr.substring(0, 6); // YYYYMM
              return parseInt(yearMonth + '01000000', 10); // YYYYMM01000000
            }
          }
          return null;
        })(),
      };

      // Only include optional fields if they exist in HIS response
      if (item.LAST_EXP_LOGINNAME !== undefined) {
        mapped.lastExpLoginname = item.LAST_EXP_LOGINNAME || '';
      }
      if (item.LAST_EXP_USERNAME !== undefined) {
        mapped.lastExpUsername = item.LAST_EXP_USERNAME || '';
      }
      if (item.LAST_EXP_TIME !== undefined) {
        mapped.lastExpTime = item.LAST_EXP_TIME;
      }
      if (item.FINISH_TIME !== undefined) {
        mapped.finishTime = item.FINISH_TIME;
      }
      if (item.FINISH_DATE !== undefined) {
        mapped.finishDate = item.FINISH_DATE;
      }
      if (item.IS_EXPORT_EQUAL_APPROVE !== undefined) {
        mapped.isExportEqualApprove = item.IS_EXPORT_EQUAL_APPROVE;
      }
      if (item.LAST_APPROVAL_LOGINNAME !== undefined) {
        mapped.lastApprovalLoginname = item.LAST_APPROVAL_LOGINNAME || '';
      }
      if (item.LAST_APPROVAL_USERNAME !== undefined) {
        mapped.lastApprovalUsername = item.LAST_APPROVAL_USERNAME || '';
      }
      if (item.LAST_APPROVAL_TIME !== undefined) {
        mapped.lastApprovalTime = item.LAST_APPROVAL_TIME;
      }
      if (item.LAST_APPROVAL_DATE !== undefined) {
        mapped.lastApprovalDate = item.LAST_APPROVAL_DATE;
      }
      if (item.REQ_ROOM_CODE !== undefined) {
        mapped.reqRoomCode = item.REQ_ROOM_CODE || '';
      }
      if (item.REQ_ROOM_NAME !== undefined) {
        mapped.reqRoomName = item.REQ_ROOM_NAME || '';
      }
      if (item.GROUP_CODE !== undefined) {
        mapped.groupCode = item.GROUP_CODE || '';
      }

      return {
        success: true,
        data: mapped,
      };
    } catch (error: any) {
      this.logger.error('InpatientExpMestService#getInpatientExpMestById.error', {
        error: error.message,
        errorType: error.constructor?.name,
        stack: error.stack?.substring(0, 500),
      });
      return {
        success: false,
        message: error.message || 'Failed to get inpatient exp mest by ID',
      };
    }
  }

  /**
   * Get Inpatient ExpMest details (chi tiết các phiếu con) by AGGR_EXP_MEST_ID from HIS
   * Returns list of child exp mests in an aggregated exp mest
   */
  async getInpatientExpMestDetails(request: {
    aggrExpMestId: number;
    includeDeleted?: boolean;
    dataDomainFilter?: boolean;
    userId?: string;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMest[];
  }> {
    this.logger.info('InpatientExpMestService#getInpatientExpMestDetails.call', request);

    try {
      const userId = request.userId;
      if (!userId) {
        this.logger.warn('InpatientExpMestService#getInpatientExpMestDetails.missingUserId');
        return {
          success: false,
          message: 'User ID is required',
        };
      }

      // Get any available external token
      const tokenData = await this.authTokenService.getToken(userId);
      if (!tokenData?.tokenCode) {
        return {
          success: false,
          message: 'No external token available. Please login first.',
        };
      }

      // Convert aggrExpMestId from Long object to number if needed
      const aggrExpMestIdNumber = LongConverter.convertToNumber(request.aggrExpMestId);
      if (aggrExpMestIdNumber === null) {
        return {
          success: false,
          message: 'Invalid aggrExpMestId: must be a valid number',
        };
      }

      const hisResponse = await this.hisProvider.getInpatientExpMestDetails(
        tokenData.tokenCode,
        aggrExpMestIdNumber,
        request.includeDeleted ?? false,
        request.dataDomainFilter ?? false,
      );

      if (!hisResponse.Success) {
        return {
          success: false,
          message: `Failed to get inpatient exp mest details: ${hisResponse.Param?.Messages?.join(', ') || 'Unknown error'}`,
        };
      }

      if (!hisResponse.Data || hisResponse.Data.length === 0) {
        return {
          success: true,
          data: [],
        };
      }

      // Map from UPPERCASE to camelCase (full mapping with all fields from GetView)
      const mapped = hisResponse.Data.map((item: any) => {
        const mappedItem: any = {
          id: item.ID,
          createTime: item.CREATE_TIME,
          modifyTime: item.MODIFY_TIME,
          creator: item.CREATOR || '',
          modifier: item.MODIFIER || '',
          appCreator: item.APP_CREATOR || '',
          appModifier: item.APP_MODIFIER || '',
          isActive: item.IS_ACTIVE,
          isDelete: item.IS_DELETE,
          expMestCode: item.EXP_MEST_CODE || '',
          expMestTypeId: item.EXP_MEST_TYPE_ID,
          expMestSttId: item.EXP_MEST_STT_ID,
          mediStockId: item.MEDI_STOCK_ID,
          reqLoginname: item.REQ_LOGINNAME || '',
          reqUsername: item.REQ_USERNAME || '',
          reqRoomId: item.REQ_ROOM_ID,
          reqDepartmentId: item.REQ_DEPARTMENT_ID,
          createDate: item.CREATE_DATE,
          virCreateMonth: item.VIR_CREATE_MONTH !== null && item.VIR_CREATE_MONTH !== undefined
            ? (typeof item.VIR_CREATE_MONTH === 'number' ? item.VIR_CREATE_MONTH : Number(item.VIR_CREATE_MONTH))
            : null,
          virCreateYear: (() => {
            const val = item.VIR_CREATE_YEAR;
            if (val === null || val === undefined) return null;
            if (typeof val === 'string') {
              const parsed = parseFloat(val);
              return isNaN(parsed) ? null : parsed;
            }
            if (typeof val === 'number') return val;
            const num = Number(val);
            return isNaN(num) ? null : num;
          })(),
          reqUserTitle: item.REQ_USER_TITLE || '',
          expMestSubCode: item.EXP_MEST_SUB_CODE || '',
          expMestSubCode2: item.EXP_MEST_SUB_CODE_2 || '',
          numOrder: item.NUM_ORDER,
          expMestTypeCode: item.EXP_MEST_TYPE_CODE || '',
          expMestTypeName: item.EXP_MEST_TYPE_NAME || '',
          expMestSttCode: item.EXP_MEST_STT_CODE || '',
          expMestSttName: item.EXP_MEST_STT_NAME || '',
          mediStockCode: item.MEDI_STOCK_CODE || '',
          mediStockName: item.MEDI_STOCK_NAME || '',
          reqDepartmentCode: item.REQ_DEPARTMENT_CODE || '',
          reqDepartmentName: item.REQ_DEPARTMENT_NAME || '',
        };

        // Map all optional fields if they exist in HIS response
        if (item.SERVICE_REQ_ID !== undefined) mappedItem.serviceReqId = item.SERVICE_REQ_ID;
        if (item.TDL_TOTAL_PRICE !== undefined) mappedItem.tdlTotalPrice = item.TDL_TOTAL_PRICE;
        if (item.TDL_SERVICE_REQ_CODE !== undefined) mappedItem.tdlServiceReqCode = item.TDL_SERVICE_REQ_CODE || '';
        if (item.TDL_INTRUCTION_TIME !== undefined) mappedItem.tdlIntructionTime = item.TDL_INTRUCTION_TIME;
        if (item.TDL_INTRUCTION_DATE !== undefined) mappedItem.tdlIntructionDate = item.TDL_INTRUCTION_DATE;
        if (item.TDL_TREATMENT_ID !== undefined) mappedItem.tdlTreatmentId = item.TDL_TREATMENT_ID;
        if (item.TDL_TREATMENT_CODE !== undefined) mappedItem.tdlTreatmentCode = item.TDL_TREATMENT_CODE || '';
        if (item.AGGR_EXP_MEST_ID !== undefined) mappedItem.aggrExpMestId = item.AGGR_EXP_MEST_ID;
        if (item.TDL_AGGR_EXP_MEST_CODE !== undefined) mappedItem.tdlAggrExpMestCode = item.TDL_AGGR_EXP_MEST_CODE || '';
        if (item.TDL_PATIENT_ID !== undefined) mappedItem.tdlPatientId = item.TDL_PATIENT_ID;
        if (item.TDL_PATIENT_CODE !== undefined) mappedItem.tdlPatientCode = item.TDL_PATIENT_CODE || '';
        if (item.TDL_PATIENT_NAME !== undefined) mappedItem.tdlPatientName = item.TDL_PATIENT_NAME || '';
        if (item.TDL_PATIENT_FIRST_NAME !== undefined) mappedItem.tdlPatientFirstName = item.TDL_PATIENT_FIRST_NAME || '';
        if (item.TDL_PATIENT_LAST_NAME !== undefined) mappedItem.tdlPatientLastName = item.TDL_PATIENT_LAST_NAME || '';
        if (item.TDL_PATIENT_DOB !== undefined) mappedItem.tdlPatientDob = item.TDL_PATIENT_DOB;
        if (item.TDL_PATIENT_IS_HAS_NOT_DAY_DOB !== undefined) mappedItem.tdlPatientIsHasNotDayDob = item.TDL_PATIENT_IS_HAS_NOT_DAY_DOB;
        if (item.TDL_PATIENT_ADDRESS !== undefined) mappedItem.tdlPatientAddress = item.TDL_PATIENT_ADDRESS || '';
        if (item.TDL_PATIENT_GENDER_ID !== undefined) mappedItem.tdlPatientGenderId = item.TDL_PATIENT_GENDER_ID;
        if (item.TDL_PATIENT_GENDER_NAME !== undefined) mappedItem.tdlPatientGenderName = item.TDL_PATIENT_GENDER_NAME || '';
        if (item.TDL_PATIENT_TYPE_ID !== undefined) mappedItem.tdlPatientTypeId = item.TDL_PATIENT_TYPE_ID;
        if (item.TDL_HEIN_CARD_NUMBER !== undefined) mappedItem.tdlHeinCardNumber = item.TDL_HEIN_CARD_NUMBER || '';
        if (item.TDL_PATIENT_PHONE !== undefined) mappedItem.tdlPatientPhone = item.TDL_PATIENT_PHONE || '';
        if (item.TDL_PATIENT_PROVINCE_CODE !== undefined) mappedItem.tdlPatientProvinceCode = item.TDL_PATIENT_PROVINCE_CODE || '';
        if (item.TDL_PATIENT_COMMUNE_CODE !== undefined) mappedItem.tdlPatientCommuneCode = item.TDL_PATIENT_COMMUNE_CODE || '';
        if (item.TDL_PATIENT_NATIONAL_NAME !== undefined) mappedItem.tdlPatientNationalName = item.TDL_PATIENT_NATIONAL_NAME || '';
        if (item.TDL_PATIENT_DISTRICT_CODE !== undefined) mappedItem.tdlPatientDistrictCode = item.TDL_PATIENT_DISTRICT_CODE || '';
        if (item.ICD_CODE !== undefined) mappedItem.icdCode = item.ICD_CODE || '';
        if (item.ICD_NAME !== undefined) mappedItem.icdName = item.ICD_NAME || '';
        if (item.ICD_SUB_CODE !== undefined) mappedItem.icdSubCode = item.ICD_SUB_CODE || '';
        if (item.ICD_TEXT !== undefined) mappedItem.icdText = item.ICD_TEXT || '';
        if (item.VIR_HEIN_CARD_PREFIX !== undefined) mappedItem.virHeinCardPrefix = item.VIR_HEIN_CARD_PREFIX || '';
        if (item.PRIORITY !== undefined) mappedItem.priority = item.PRIORITY;
        if (item.TREATMENT_IS_ACTIVE !== undefined) mappedItem.treatmentIsActive = item.TREATMENT_IS_ACTIVE;
        if (item.PATIENT_TYPE_NAME !== undefined) mappedItem.patientTypeName = item.PATIENT_TYPE_NAME || '';
        if (item.PATIENT_TYPE_CODE !== undefined) mappedItem.patientTypeCode = item.PATIENT_TYPE_CODE || '';
        if (item.REQ_HEAD_USERNAME !== undefined) mappedItem.reqHeadUsername = item.REQ_HEAD_USERNAME || '';
        if (item.REQ_ROOM_CODE !== undefined) mappedItem.reqRoomCode = item.REQ_ROOM_CODE || '';
        if (item.REQ_ROOM_NAME !== undefined) mappedItem.reqRoomName = item.REQ_ROOM_NAME || '';
        if (item.CURRENT_BED_IDS !== undefined) mappedItem.currentBedIds = item.CURRENT_BED_IDS || '';
        if (item.LAST_EXP_LOGINNAME !== undefined) mappedItem.lastExpLoginname = item.LAST_EXP_LOGINNAME || '';
        if (item.LAST_EXP_USERNAME !== undefined) mappedItem.lastExpUsername = item.LAST_EXP_USERNAME || '';
        if (item.LAST_EXP_TIME !== undefined) mappedItem.lastExpTime = item.LAST_EXP_TIME;
        if (item.FINISH_TIME !== undefined) mappedItem.finishTime = item.FINISH_TIME;
        if (item.FINISH_DATE !== undefined) mappedItem.finishDate = item.FINISH_DATE;
        if (item.IS_EXPORT_EQUAL_APPROVE !== undefined) mappedItem.isExportEqualApprove = item.IS_EXPORT_EQUAL_APPROVE;
        if (item.LAST_APPROVAL_LOGINNAME !== undefined) mappedItem.lastApprovalLoginname = item.LAST_APPROVAL_LOGINNAME || '';
        if (item.LAST_APPROVAL_USERNAME !== undefined) mappedItem.lastApprovalUsername = item.LAST_APPROVAL_USERNAME || '';
        if (item.LAST_APPROVAL_TIME !== undefined) mappedItem.lastApprovalTime = item.LAST_APPROVAL_TIME;
        if (item.LAST_APPROVAL_DATE !== undefined) mappedItem.lastApprovalDate = item.LAST_APPROVAL_DATE;
        if (item.TDL_AGGR_PATIENT_CODE !== undefined) mappedItem.tdlAggrPatientCode = item.TDL_AGGR_PATIENT_CODE || '';
        if (item.TDL_AGGR_TREATMENT_CODE !== undefined) mappedItem.tdlAggrTreatmentCode = item.TDL_AGGR_TREATMENT_CODE || '';
        if (item.TDL_INTRUCTION_DATE_MIN !== undefined) mappedItem.tdlIntructionDateMin = item.TDL_INTRUCTION_DATE_MIN !== null && item.TDL_INTRUCTION_DATE_MIN !== undefined
          ? Math.floor(typeof item.TDL_INTRUCTION_DATE_MIN === 'number' ? item.TDL_INTRUCTION_DATE_MIN : Number(item.TDL_INTRUCTION_DATE_MIN))
          : null;
        if (item.GROUP_CODE !== undefined) mappedItem.groupCode = item.GROUP_CODE || '';

        return mappedItem;
      });

      // Convert Long objects recursively
      const converted = LongConverter.convertLongRecursive(mapped);

      return {
        success: true,
        data: converted,
      };
    } catch (error: any) {
      this.logger.error('InpatientExpMestService#getInpatientExpMestDetails.error', {
        error: error.message,
        errorType: error.constructor?.name,
        stack: error.stack?.substring(0, 500),
      });
      return {
        success: false,
        message: error.message || 'Failed to get inpatient exp mest details',
      };
    }
  }
}

