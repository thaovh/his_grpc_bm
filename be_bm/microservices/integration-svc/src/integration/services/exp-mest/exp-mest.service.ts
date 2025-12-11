import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { RpcException } from '@nestjs/microservices';
import { HisProvider, GetExpMestRequest } from '../../providers/his.provider';
import { AuthTokenService } from '../auth/auth-token.service';
import { ExpMest } from '../../integration.interface';
import { LongConverter } from '../../utils/long-converter.util';

@Injectable()
export class ExpMestService {
  constructor(
    private readonly hisProvider: HisProvider,
    private readonly authTokenService: AuthTokenService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ExpMestService.name);
  }

  /**
   * Get ExpMest list with filters (pagination)
   */
  async getExpMests(request: {
    expMestSttIds?: number[];
    expMestTypeIds?: number[];
    impOrExpMediStockId?: number;
    createTimeFrom?: number;
    createTimeTo?: number;
    start?: number;
    limit?: number;
    expMestCodeExact?: string;
    workingRoomId?: number;
    dataDomainFilter?: boolean;
    keyword?: string;
    userId?: string;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMest[];
    start?: number;
    limit?: number;
    count?: number;
    total?: number;
  }> {
    this.logger.info('ExpMestService#getExpMests.call', { request });

    try {
      const userId = request.userId;
      if (!userId) {
        this.logger.warn('ExpMestService#getExpMests.missingUserId');
        return {
          success: false,
          message: 'User ID is required',
        };
      }

      // Get external token for specific user
      const tokenData = await this.authTokenService.getToken(userId);
      if (!tokenData?.tokenCode) {
        return {
          success: false,
          message: 'No external token available. Please login first.',
        };
      }

      // Convert arrays of Long objects to arrays of numbers
      const convertArray = (arr: any[] | undefined): number[] | undefined => {
        if (!arr || arr.length === 0) return undefined;
        return LongConverter.convertArray(arr);
      };

      // Call HIS API - Convert Long objects to numbers before sending
      const hisRequest: GetExpMestRequest = {
        expMestSttIds: convertArray(request.expMestSttIds),
        expMestTypeIds: convertArray(request.expMestTypeIds),
        impOrExpMediStockId: LongConverter.convertToNumber(request.impOrExpMediStockId) ?? undefined,
        createTimeFrom: LongConverter.convertToNumber(request.createTimeFrom) ?? undefined,
        createTimeTo: LongConverter.convertToNumber(request.createTimeTo) ?? undefined,
        start: LongConverter.convertToNumber(request.start) ?? undefined,
        limit: LongConverter.convertToNumber(request.limit) ?? undefined,
        expMestCodeExact: request.expMestCodeExact ?? undefined,
        workingRoomId: LongConverter.convertToNumber(request.workingRoomId) ?? undefined,
        dataDomainFilter: request.dataDomainFilter ?? undefined,
        keyword: request.keyword ?? undefined, // Fix: was keyWord
      };

      const hisResponse = await this.hisProvider.getExpMests(tokenData.tokenCode, hisRequest);

      this.logger.info('ExpMestService#getExpMests.hisResponse', {
        Success: hisResponse.Success,
        hasData: !!hisResponse.Data,
        dataCount: hisResponse.Data?.length || 0,
        param: hisResponse.Param,
      });

      if (!hisResponse.Success) {
        this.logger.warn('ExpMestService#getExpMests.unsuccessful', {
          Success: hisResponse.Success,
          Param: hisResponse.Param,
          Messages: hisResponse.Param?.Messages,
          BugCodes: hisResponse.Param?.BugCodes,
          HasException: hisResponse.Param?.HasException,
        });
        return {
          success: false,
          message: `Failed to get exp mests from HIS: ${hisResponse.Param?.Messages?.join(', ') || 'Unknown error'}`,
        };
      }

      // Data can be empty array, that's OK
      if (!hisResponse.Data) {
        this.logger.warn('ExpMestService#getExpMests.noDataField', {
          Success: hisResponse.Success,
          Param: hisResponse.Param,
        });
        // Return empty result if Data is missing but Success is true
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

      // Map from UPPERCASE to camelCase
      const mapped: ExpMest[] = hisResponse.Data.map((item) => ({
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
        serviceReqId: item.SERVICE_REQ_ID,
        tdlTotalPrice: item.TDL_TOTAL_PRICE || 0,
        tdlServiceReqCode: item.TDL_SERVICE_REQ_CODE || '',
        tdlIntructionTime: item.TDL_INTRUCTION_TIME,
        tdlIntructionDate: item.TDL_INTRUCTION_DATE,
        tdlTreatmentId: item.TDL_TREATMENT_ID,
        tdlTreatmentCode: item.TDL_TREATMENT_CODE || '',
        tdlPatientId: item.TDL_PATIENT_ID,
        tdlPatientCode: item.TDL_PATIENT_CODE || '',
        tdlPatientName: item.TDL_PATIENT_NAME || '',
        tdlPatientFirstName: item.TDL_PATIENT_FIRST_NAME || '',
        tdlPatientLastName: item.TDL_PATIENT_LAST_NAME || '',
        tdlPatientDob: item.TDL_PATIENT_DOB,
        tdlPatientIsHasNotDayDob: item.TDL_PATIENT_IS_HAS_NOT_DAY_DOB || 0,
        tdlPatientAddress: item.TDL_PATIENT_ADDRESS || '',
        tdlPatientGenderId: item.TDL_PATIENT_GENDER_ID,
        tdlPatientGenderName: item.TDL_PATIENT_GENDER_NAME || '',
        tdlPatientTypeId: item.TDL_PATIENT_TYPE_ID,
        tdlHeinCardNumber: item.TDL_HEIN_CARD_NUMBER || '',
        tdlPatientPhone: item.TDL_PATIENT_PHONE || '',
        tdlPatientProvinceCode: item.TDL_PATIENT_PROVINCE_CODE || '',
        tdlPatientCommuneCode: item.TDL_PATIENT_COMMUNE_CODE || '',
        tdlPatientNationalName: item.TDL_PATIENT_NATIONAL_NAME || '',
        virCreateMonth: item.VIR_CREATE_MONTH || 0,
        icdCode: item.ICD_CODE || '',
        icdName: item.ICD_NAME || '',
        reqUserTitle: item.REQ_USER_TITLE || '',
        expMestSubCode2: item.EXP_MEST_SUB_CODE_2 || '',
        virCreateYear: item.VIR_CREATE_YEAR || 0,
        virHeinCardPrefix: item.VIR_HEIN_CARD_PREFIX || '',
        priority: item.PRIORITY || 0,
        expMestTypeCode: item.EXP_MEST_TYPE_CODE || '',
        expMestTypeName: item.EXP_MEST_TYPE_NAME || '',
        expMestSttCode: item.EXP_MEST_STT_CODE || '',
        expMestSttName: item.EXP_MEST_STT_NAME || '',
        mediStockCode: item.MEDI_STOCK_CODE || '',
        mediStockName: item.MEDI_STOCK_NAME || '',
        reqDepartmentCode: item.REQ_DEPARTMENT_CODE || '',
        reqDepartmentName: item.REQ_DEPARTMENT_NAME || '',
        reqRoomCode: item.REQ_ROOM_CODE || '',
        reqRoomName: item.REQ_ROOM_NAME || '',
        treatmentIsActive: item.TREATMENT_IS_ACTIVE || 0,
        patientTypeName: item.PATIENT_TYPE_NAME || '',
        patientTypeCode: item.PATIENT_TYPE_CODE || '',
        icdSubCode: item.ICD_SUB_CODE || null,
        icdText: item.ICD_TEXT || null,
        tdlPatientDistrictCode: item.TDL_PATIENT_DISTRICT_CODE || null,
        tdlAggrPatientCode: item.TDL_AGGR_PATIENT_CODE || '',
        tdlAggrTreatmentCode: item.TDL_AGGR_TREATMENT_CODE || '',
        lastExpLoginname: item.LAST_EXP_LOGINNAME || '',
        lastExpUsername: item.LAST_EXP_USERNAME || '',
        lastExpTime: item.LAST_EXP_TIME,
        finishTime: item.FINISH_TIME,
        finishDate: item.FINISH_DATE,
        isExportEqualApprove: item.IS_EXPORT_EQUAL_APPROVE,
        expMestSubCode: item.EXP_MEST_SUB_CODE || '',
        lastApprovalLoginname: item.LAST_APPROVAL_LOGINNAME || '',
        lastApprovalUsername: item.LAST_APPROVAL_USERNAME || '',
        lastApprovalTime: item.LAST_APPROVAL_TIME,
        lastApprovalDate: item.LAST_APPROVAL_DATE,
        numOrder: item.NUM_ORDER,
        tdlIntructionDateMin: item.TDL_INTRUCTION_DATE_MIN,
        groupCode: item.GROUP_CODE || '',
      }));

      const start = hisResponse.Param?.Start ?? request.start ?? 0;
      const limit = hisResponse.Param?.Limit ?? request.limit ?? 100;
      const count = hisResponse.Param?.Count ?? mapped.length;
      const total = count; // Total available records

      this.logger.info('ExpMestService#getExpMests.success', {
        dataCount: mapped.length,
        start,
        limit,
        count,
        total,
      });

      return {
        success: true,
        data: mapped,
        start,
        limit,
        count,
        total,
      };
    } catch (error: any) {
      this.logger.error('ExpMestService#getExpMests.error', {
        error: error.message,
        errorType: error.constructor?.name,
        stack: error.stack?.substring(0, 500),
      });
      return {
        success: false,
        message: error.message || 'Failed to get exp mests',
      };
    }
  }

  async getExpMestCabinets(request: any): Promise<any> {
    const { userId } = request;
    this.logger.info(`getExpMestCabinets called for user ${userId || 'unknown'}`);

    try {
      const token = await this.authTokenService.getToken(userId);
      if (!token) {
        throw new RpcException({
          code: 16, // UNAUTHENTICATED
          message: 'Could not get token for HIS',
        });
      }

      this.logger.debug(`Found token for user ${userId}, calling HIS provider for cabinets...`);
      const response = await this.hisProvider.getExpMestCabinets(token.tokenCode, request);

      this.logger.info(`HIS provider returned success: ${response?.Success}`);

      if (!response.Success) {
        return {
          success: false,
          message: response.Param?.Messages?.join(', ') || 'Failed',
          data: [],
        };
      }

      const hisData = response.Data || [];
      const mapped: ExpMest[] = hisData.map((item: any) => ({
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
        serviceReqId: item.SERVICE_REQ_ID,
        tdlTotalPrice: item.TDL_TOTAL_PRICE || 0,
        tdlServiceReqCode: item.TDL_SERVICE_REQ_CODE || '',
        tdlIntructionTime: item.TDL_INTRUCTION_TIME,
        tdlIntructionDate: item.TDL_INTRUCTION_DATE,
        tdlTreatmentId: item.TDL_TREATMENT_ID,
        tdlTreatmentCode: item.TDL_TREATMENT_CODE || '',
        tdlPatientId: item.TDL_PATIENT_ID,
        tdlPatientCode: item.TDL_PATIENT_CODE || '',
        tdlPatientName: item.TDL_PATIENT_NAME || '',
        tdlPatientFirstName: item.TDL_PATIENT_FIRST_NAME || '',
        tdlPatientLastName: item.TDL_PATIENT_LAST_NAME || '',
        tdlPatientDob: item.TDL_PATIENT_DOB,
        tdlPatientIsHasNotDayDob: item.TDL_PATIENT_IS_HAS_NOT_DAY_DOB || 0,
        tdlPatientAddress: item.TDL_PATIENT_ADDRESS || '',
        tdlPatientGenderId: item.TDL_PATIENT_GENDER_ID,
        tdlPatientGenderName: item.TDL_PATIENT_GENDER_NAME || '',
        tdlPatientTypeId: item.TDL_PATIENT_TYPE_ID,
        tdlHeinCardNumber: item.TDL_HEIN_CARD_NUMBER || '',
        tdlPatientPhone: item.TDL_PATIENT_PHONE || '',
        tdlPatientProvinceCode: item.TDL_PATIENT_PROVINCE_CODE || '',
        tdlPatientCommuneCode: item.TDL_PATIENT_COMMUNE_CODE || '',
        tdlPatientNationalName: item.TDL_PATIENT_NATIONAL_NAME || '',
        virCreateMonth: item.VIR_CREATE_MONTH || 0,
        icdCode: item.ICD_CODE || '',
        icdName: item.ICD_NAME || '',
        reqUserTitle: item.REQ_USER_TITLE || '',
        expMestSubCode2: item.EXP_MEST_SUB_CODE_2 || '',
        virCreateYear: item.VIR_CREATE_YEAR || 0,
        virHeinCardPrefix: item.VIR_HEIN_CARD_PREFIX || '',
        priority: item.PRIORITY || 0,
        expMestTypeCode: item.EXP_MEST_TYPE_CODE || '',
        expMestTypeName: item.EXP_MEST_TYPE_NAME || '',
        expMestSttCode: item.EXP_MEST_STT_CODE || '',
        expMestSttName: item.EXP_MEST_STT_NAME || '',
        mediStockCode: item.MEDI_STOCK_CODE || '',
        mediStockName: item.MEDI_STOCK_NAME || '',
        reqDepartmentCode: item.REQ_DEPARTMENT_CODE || '',
        reqDepartmentName: item.REQ_DEPARTMENT_NAME || '',
        reqRoomCode: item.REQ_ROOM_CODE || '',
        reqRoomName: item.REQ_ROOM_NAME || '',
        treatmentIsActive: item.TREATMENT_IS_ACTIVE || 0,
        patientTypeName: item.PATIENT_TYPE_NAME || '',
        patientTypeCode: item.PATIENT_TYPE_CODE || '',
        icdSubCode: item.ICD_SUB_CODE || null,
        icdText: item.ICD_TEXT || null,
        tdlPatientDistrictCode: item.TDL_PATIENT_DISTRICT_CODE || null,
        tdlAggrPatientCode: item.TDL_AGGR_PATIENT_CODE || '',
        tdlAggrTreatmentCode: item.TDL_AGGR_TREATMENT_CODE || '',
        lastExpLoginname: item.LAST_EXP_LOGINNAME || '',
        lastExpUsername: item.LAST_EXP_USERNAME || '',
        lastExpTime: item.LAST_EXP_TIME,
        finishTime: item.FINISH_TIME,
        finishDate: item.FINISH_DATE,
        isExportEqualApprove: item.IS_EXPORT_EQUAL_APPROVE,
        expMestSubCode: item.EXP_MEST_SUB_CODE || '',
        lastApprovalLoginname: item.LAST_APPROVAL_LOGINNAME || '',
        lastApprovalUsername: item.LAST_APPROVAL_USERNAME || '',
        lastApprovalTime: item.LAST_APPROVAL_TIME,
        lastApprovalDate: item.LAST_APPROVAL_DATE,
        numOrder: item.NUM_ORDER,
        tdlIntructionDateMin: item.TDL_INTRUCTION_DATE_MIN,
        groupCode: item.GROUP_CODE || '',
      }));

      return {
        success: true,
        message: 'Success',
        data: mapped,
        start: response.Param?.Start ?? request.start ?? 0,
        limit: response.Param?.Limit ?? request.limit ?? 100,
        count: response.Param?.Count ?? mapped.length,
        total: response.Param?.Count ?? mapped.length,
      };

    } catch (error: any) {
      this.logger.error(`getExpMestCabinets error: ${error.message}`, error.stack);
      return {
        success: false,
        message: error.message || 'Internal Server Error',
        data: [],
      };
    }
  }

  /**
   * Get ExpMest by ID from HIS
   */
  async getExpMestById(request: {
    expMestId: number;
    includeDeleted?: boolean;
    dataDomainFilter?: boolean;
    userId?: string;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMest | null;
  }> {
    this.logger.info('ExpMestService#getExpMestById.call', request);

    try {
      const userId = request.userId;
      if (!userId) {
        this.logger.warn('ExpMestService#getExpMestById.missingUserId');
        return {
          success: false,
          message: 'User ID is required',
        };
      }

      // Get external token for specific user
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
          message: `Failed to get exp mest by ID: ${hisResponse.Param?.Messages?.join(', ') || 'Unknown error'}`,
        };
      }

      if (!hisResponse.Data || hisResponse.Data.length === 0) {
        return {
          success: true,
          data: null,
        };
      }

      // Map from UPPERCASE to camelCase
      const item = hisResponse.Data[0];

      const mapped: ExpMest = {
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
        serviceReqId: item.SERVICE_REQ_ID,
        tdlTotalPrice: item.TDL_TOTAL_PRICE || 0,
        tdlServiceReqCode: item.TDL_SERVICE_REQ_CODE || '',
        tdlIntructionTime: item.TDL_INTRUCTION_TIME,
        tdlIntructionDate: item.TDL_INTRUCTION_DATE,
        tdlTreatmentId: item.TDL_TREATMENT_ID,
        tdlTreatmentCode: item.TDL_TREATMENT_CODE || '',
        tdlPatientId: item.TDL_PATIENT_ID,
        tdlPatientCode: item.TDL_PATIENT_CODE || '',
        tdlPatientName: item.TDL_PATIENT_NAME || '',
        tdlPatientFirstName: item.TDL_PATIENT_FIRST_NAME || '',
        tdlPatientLastName: item.TDL_PATIENT_LAST_NAME || '',
        tdlPatientDob: item.TDL_PATIENT_DOB,
        tdlPatientIsHasNotDayDob: item.TDL_PATIENT_IS_HAS_NOT_DAY_DOB || 0,
        tdlPatientAddress: item.TDL_PATIENT_ADDRESS || '',
        tdlPatientGenderId: item.TDL_PATIENT_GENDER_ID,
        tdlPatientGenderName: item.TDL_PATIENT_GENDER_NAME || '',
        tdlPatientTypeId: item.TDL_PATIENT_TYPE_ID,
        tdlHeinCardNumber: item.TDL_HEIN_CARD_NUMBER || '',
        tdlPatientPhone: item.TDL_PATIENT_PHONE || '',
        tdlPatientProvinceCode: item.TDL_PATIENT_PROVINCE_CODE || '',
        tdlPatientCommuneCode: item.TDL_PATIENT_COMMUNE_CODE || '',
        tdlPatientNationalName: item.TDL_PATIENT_NATIONAL_NAME || '',
        virCreateMonth: item.VIR_CREATE_MONTH || 0,
        icdCode: item.ICD_CODE || '',
        icdName: item.ICD_NAME || '',
        reqUserTitle: item.REQ_USER_TITLE || '',
        expMestSubCode2: item.EXP_MEST_SUB_CODE_2 || '',
        virCreateYear: item.VIR_CREATE_YEAR || 0,
        virHeinCardPrefix: item.VIR_HEIN_CARD_PREFIX || '',
        priority: item.PRIORITY || 0,
        expMestTypeCode: item.EXP_MEST_TYPE_CODE || '',
        expMestTypeName: item.EXP_MEST_TYPE_NAME || '',
        expMestSttCode: item.EXP_MEST_STT_CODE || '',
        expMestSttName: item.EXP_MEST_STT_NAME || '',
        mediStockCode: item.MEDI_STOCK_CODE || '',
        mediStockName: item.MEDI_STOCK_NAME || '',
        reqDepartmentCode: item.REQ_DEPARTMENT_CODE || '',
        reqDepartmentName: item.REQ_DEPARTMENT_NAME || '',
        reqRoomCode: item.REQ_ROOM_CODE || '',
        reqRoomName: item.REQ_ROOM_NAME || '',
        treatmentIsActive: item.TREATMENT_IS_ACTIVE || 0,
        patientTypeName: item.PATIENT_TYPE_NAME || '',
        patientTypeCode: item.PATIENT_TYPE_CODE || '',
        icdSubCode: item.ICD_SUB_CODE || null,
        icdText: item.ICD_TEXT || null,
        tdlPatientDistrictCode: item.TDL_PATIENT_DISTRICT_CODE || null,
        tdlAggrPatientCode: item.TDL_AGGR_PATIENT_CODE || '',
        tdlAggrTreatmentCode: item.TDL_AGGR_TREATMENT_CODE || '',
        lastExpLoginname: item.LAST_EXP_LOGINNAME || '',
        lastExpUsername: item.LAST_EXP_USERNAME || '',
        lastExpTime: item.LAST_EXP_TIME,
        finishTime: item.FINISH_TIME,
        finishDate: item.FINISH_DATE,
        isExportEqualApprove: item.IS_EXPORT_EQUAL_APPROVE,
        expMestSubCode: item.EXP_MEST_SUB_CODE || '',
        lastApprovalLoginname: item.LAST_APPROVAL_LOGINNAME || '',
        lastApprovalUsername: item.LAST_APPROVAL_USERNAME || '',
        lastApprovalTime: item.LAST_APPROVAL_TIME,
        lastApprovalDate: item.LAST_APPROVAL_DATE,
        numOrder: item.NUM_ORDER,
        tdlIntructionDateMin: item.TDL_INTRUCTION_DATE_MIN,
        groupCode: item.GROUP_CODE || '',
      };

      return {
        success: true,
        data: mapped,
      };
    } catch (error: any) {
      this.logger.error('ExpMestService#getExpMestById.error', {
        error: error.message,
        errorType: error.constructor?.name,
        stack: error.stack?.substring(0, 500),
      });
      return {
        success: false,
        message: error.message || 'Failed to get exp mest by ID',
      };
    }
  }
}
