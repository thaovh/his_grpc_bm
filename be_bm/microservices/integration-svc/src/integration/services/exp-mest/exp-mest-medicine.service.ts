import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { HisProvider } from '../../providers/his.provider';
import { AuthTokenService } from '../auth/auth-token.service';
import { ExpMestMedicine } from '../../integration.interface';
import { LongConverter } from '../../utils/long-converter.util';

@Injectable()
export class ExpMestMedicineService {
  constructor(
    private readonly hisProvider: HisProvider,
    private readonly authTokenService: AuthTokenService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ExpMestMedicineService.name);
  }

  /**
   * Get ExpMestMedicine list (chi tiết thuốc trong phiếu xuất) from HIS
   */
  async getExpMestMedicines(expMestId: number, userId?: string): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMestMedicine[];
  }> {
    this.logger.info('ExpMestMedicineService#getExpMestMedicines.call', { expMestId, userId, userIdType: typeof userId });

    try {
      if (!userId) {
        this.logger.warn('ExpMestMedicineService#getExpMestMedicines.missingUserId');
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
      const expMestIdNumber = LongConverter.convertToNumber(expMestId);
      if (expMestIdNumber === null) {
        return {
          success: false,
          message: 'Invalid expMestId: must be a valid number',
        };
      }

      // Call HIS API with converted number
      const hisResponse = await this.hisProvider.getExpMestMedicines(tokenData.tokenCode, expMestIdNumber);

      this.logger.info('ExpMestMedicineService#getExpMestMedicines.hisResponse', {
        Success: hisResponse.Success,
        hasData: !!hisResponse.Data,
        dataCount: hisResponse.Data?.length || 0,
        param: hisResponse.Param,
      });

      if (!hisResponse.Success) {
        this.logger.warn('ExpMestMedicineService#getExpMestMedicines.unsuccessful', {
          Success: hisResponse.Success,
          Param: hisResponse.Param,
          Messages: hisResponse.Param?.Messages,
          BugCodes: hisResponse.Param?.BugCodes,
          HasException: hisResponse.Param?.HasException,
        });
        return {
          success: false,
          message: `Failed to get exp mest medicines from HIS: ${hisResponse.Param?.Messages?.join(', ') || 'Unknown error'}`,
        };
      }

      // Data can be empty array, that's OK
      if (!hisResponse.Data) {
        this.logger.warn('ExpMestMedicineService#getExpMestMedicines.noDataField', {
          Success: hisResponse.Success,
          Param: hisResponse.Param,
        });
        return {
          success: true,
          data: [],
        };
      }

      // Map from UPPERCASE to camelCase
      const mapped: ExpMestMedicine[] = hisResponse.Data.map((item) => ({
        id: item.ID,
        createTime: item.CREATE_TIME,
        modifyTime: item.MODIFY_TIME,
        creator: item.CREATOR || '',
        modifier: item.MODIFIER || '',
        appCreator: item.APP_CREATOR || '',
        appModifier: item.APP_MODIFIER || '',
        isActive: item.IS_ACTIVE,
        isDelete: item.IS_DELETE,
        expMestId: item.EXP_MEST_ID,
        medicineId: item.MEDICINE_ID,
        tdlMediStockId: item.TDL_MEDI_STOCK_ID,
        tdlMedicineTypeId: item.TDL_MEDICINE_TYPE_ID,
        expMestMetyReqId: item.EXP_MEST_METY_REQ_ID,
        ckImpMestMedicineId: item.CK_IMP_MEST_MEDICINE_ID,
        isExport: item.IS_EXPORT,
        amount: item.AMOUNT || 0,
        approvalLoginname: item.APPROVAL_LOGINNAME || '',
        approvalUsername: item.APPROVAL_USERNAME || '',
        approvalTime: item.APPROVAL_TIME,
        approvalDate: item.APPROVAL_DATE,
        expLoginname: item.EXP_LOGINNAME || '',
        expUsername: item.EXP_USERNAME || '',
        expTime: item.EXP_TIME,
        expDate: item.EXP_DATE,
        expMestCode: item.EXP_MEST_CODE || '',
        mediStockId: item.MEDI_STOCK_ID,
        expMestSttId: item.EXP_MEST_STT_ID,
        impPrice: item.IMP_PRICE || 0,
        impVatRatio: item.IMP_VAT_RATIO || 0,
        bidId: item.BID_ID,
        packageNumber: item.PACKAGE_NUMBER || '',
        expiredDate: item.EXPIRED_DATE,
        medicineTypeId: item.MEDICINE_TYPE_ID,
        impTime: item.IMP_TIME,
        supplierId: item.SUPPLIER_ID,
        medicineBytNumOrder: item.MEDICINE_BYT_NUM_ORDER || '',
        medicineRegisterNumber: item.MEDICINE_REGISTER_NUMBER || '',
        activeIngrBhytCode: item.ACTIVE_INGR_BHYT_CODE || '',
        activeIngrBhytName: item.ACTIVE_INGR_BHYT_NAME || '',
        concentra: item.CONCENTRA || '',
        tdlBidGroupCode: item.TDL_BID_GROUP_CODE || '',
        tdlBidPackageCode: item.TDL_BID_PACKAGE_CODE || '',
        medicineTypeCode: item.MEDICINE_TYPE_CODE || '',
        medicineTypeName: item.MEDICINE_TYPE_NAME || '',
        serviceId: item.SERVICE_ID,
        nationalName: item.NATIONAL_NAME || '',
        manufacturerId: item.MANUFACTURER_ID,
        bytNumOrder: item.BYT_NUM_ORDER || '',
        registerNumber: item.REGISTER_NUMBER || '',
        medicineGroupId: item.MEDICINE_GROUP_ID,
        serviceUnitId: item.SERVICE_UNIT_ID,
        serviceUnitCode: item.SERVICE_UNIT_CODE || '',
        serviceUnitName: item.SERVICE_UNIT_NAME || '',
        medicineNumOrder: item.MEDICINE_NUM_ORDER || 0,
        supplierCode: item.SUPPLIER_CODE || '',
        supplierName: item.SUPPLIER_NAME || '',
        bidNumber: item.BID_NUMBER || '',
        bidName: item.BID_NAME || '',
        medicineUseFormCode: item.MEDICINE_USE_FORM_CODE || '',
        medicineUseFormName: item.MEDICINE_USE_FORM_NAME || '',
        medicineUseFormNumOrder: item.MEDICINE_USE_FORM_NUM_ORDER || 0,
        sumInStock: item.SUM_IN_STOCK ?? 0,
        sumByMedicineInStock: item.SUM_BY_MEDICINE_IN_STOCK ?? 0,
        materialNumOrder: item.MATERIAL_NUM_ORDER ?? null,
        // Price & Tax Info (Additional) - Use !== undefined && !== null to preserve 0 values
        price: item.PRICE !== undefined && item.PRICE !== null ? item.PRICE : null,
        vatRatio: item.VAT_RATIO !== undefined && item.VAT_RATIO !== null ? item.VAT_RATIO : null,
        virPrice: item.VIR_PRICE !== undefined && item.VIR_PRICE !== null ? item.VIR_PRICE : null,
        taxRatio: item.TAX_RATIO !== undefined && item.TAX_RATIO !== null ? item.TAX_RATIO : null,
        // Order & Amount Info
        numOrder: item.NUM_ORDER !== undefined && item.NUM_ORDER !== null ? item.NUM_ORDER : null,
        presAmount: item.PRES_AMOUNT !== undefined && item.PRES_AMOUNT !== null ? item.PRES_AMOUNT : null,
        // Patient & Treatment Info
        patientTypeId: item.PATIENT_TYPE_ID !== undefined && item.PATIENT_TYPE_ID !== null ? item.PATIENT_TYPE_ID : null,
        patientTypeCode: item.PATIENT_TYPE_CODE || null,
        patientTypeName: item.PATIENT_TYPE_NAME || null,
        tdlPatientId: item.TDL_PATIENT_ID !== undefined && item.TDL_PATIENT_ID !== null ? item.TDL_PATIENT_ID : null,
        tdlTreatmentId: item.TDL_TREATMENT_ID !== undefined && item.TDL_TREATMENT_ID !== null ? item.TDL_TREATMENT_ID : null,
        tdlServiceReqId: item.TDL_SERVICE_REQ_ID !== undefined && item.TDL_SERVICE_REQ_ID !== null ? item.TDL_SERVICE_REQ_ID : null,
        // Instruction & Tutorial
        useTimeTo: item.USE_TIME_TO !== undefined && item.USE_TIME_TO !== null ? item.USE_TIME_TO : null,
        tutorial: item.TUTORIAL || null,
        tdlIntructionTime: item.TDL_INTRUCTION_TIME !== undefined && item.TDL_INTRUCTION_TIME !== null ? item.TDL_INTRUCTION_TIME : null,
        tdlIntructionDate: item.TDL_INTRUCTION_DATE !== undefined && item.TDL_INTRUCTION_DATE !== null ? item.TDL_INTRUCTION_DATE : null,
        htuText: item.HTU_TEXT || null,
        // Dosage Info
        morning: item.MORNING || null,
        evening: item.EVENING || null,
        // ExpMest Denormalized Info (Additional)
        expMestTypeId: item.EXP_MEST_TYPE_ID !== undefined && item.EXP_MEST_TYPE_ID !== null ? item.EXP_MEST_TYPE_ID : null,
        tdlAggrExpMestId: item.TDL_AGGR_EXP_MEST_ID !== undefined && item.TDL_AGGR_EXP_MEST_ID !== null ? item.TDL_AGGR_EXP_MEST_ID : null,
        aggrExpMestId: item.AGGR_EXP_MEST_ID !== undefined && item.AGGR_EXP_MEST_ID !== null ? item.AGGR_EXP_MEST_ID : null,
        reqRoomId: item.REQ_ROOM_ID !== undefined && item.REQ_ROOM_ID !== null ? item.REQ_ROOM_ID : null,
        reqDepartmentId: item.REQ_DEPARTMENT_ID !== undefined && item.REQ_DEPARTMENT_ID !== null ? item.REQ_DEPARTMENT_ID : null,
        reqUserTitle: item.REQ_USER_TITLE || null,
        reqLoginname: item.REQ_LOGINNAME || null,
        reqUsername: item.REQ_USERNAME || null,
        // Medicine Group & Use Form (Additional)
        medicineUseFormId: item.MEDICINE_USE_FORM_ID !== undefined && item.MEDICINE_USE_FORM_ID !== null ? item.MEDICINE_USE_FORM_ID : null,
        medicineLineId: item.MEDICINE_LINE_ID !== undefined && item.MEDICINE_LINE_ID !== null ? item.MEDICINE_LINE_ID : null,
        medicineGroupCode: item.MEDICINE_GROUP_CODE || null,
        medicineGroupName: item.MEDICINE_GROUP_NAME || null,
        medicineGroupNumOrder: item.MEDICINE_GROUP_NUM_ORDER !== undefined && item.MEDICINE_GROUP_NUM_ORDER !== null ? item.MEDICINE_GROUP_NUM_ORDER : null,
        // Manufacturer & Stock Info (Additional)
        manufacturerCode: item.MANUFACTURER_CODE || null,
        manufacturerName: item.MANUFACTURER_NAME || null,
        mediStockCode: item.MEDI_STOCK_CODE || null,
        mediStockName: item.MEDI_STOCK_NAME || null,
      }));

      this.logger.info('ExpMestMedicineService#getExpMestMedicines.success', {
        dataCount: mapped.length,
        expMestId,
      });

      return {
        success: true,
        data: mapped,
      };
    } catch (error: any) {
      this.logger.error('ExpMestMedicineService#getExpMestMedicines.error', {
        error: error.message,
        errorType: error.constructor?.name,
        stack: error.stack?.substring(0, 500),
        expMestId,
      });
      return {
        success: false,
        message: error.message || 'Failed to get exp mest medicines',
      };
    }
  }

  /**
   * Get ExpMestMedicine list by multiple EXP_MEST_IDs from HIS
   */
  async getExpMestMedicinesByIds(
    expMestIds: number[],
    includeDeleted: boolean = false,
    dataDomainFilter: boolean = false,
    userId?: string,
  ): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMestMedicine[];
  }> {
    this.logger.info('ExpMestMedicineService#getExpMestMedicinesByIds.call', {
      expMestIdsCount: expMestIds?.length || 0,
      includeDeleted,
      dataDomainFilter,
    });

    try {
      if (!expMestIds || expMestIds.length === 0) {
        return {
          success: true,
          data: [],
        };
      }

      if (!userId) {
        this.logger.warn('ExpMestMedicineService#getExpMestMedicinesByIds.missingUserId');
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

      // Convert all expMestIds to numbers
      const expMestIdsNumbers = LongConverter.convertArray(expMestIds);

      if (expMestIdsNumbers.length === 0) {
        return {
          success: false,
          message: 'Invalid expMestIds: must contain at least one valid number',
        };
      }

      // Special handling: if only one ID, try the singular GetView1 API
      // as it might be a Single ExpMest (not an aggregated/child one)
      let hisResponse: any;
      if (expMestIdsNumbers.length === 1) {
        this.logger.info('ExpMestMedicineService#getExpMestMedicinesByIds.singleIdFallback', {
          id: expMestIdsNumbers[0]
        });
        hisResponse = await this.hisProvider.getExpMestMedicines(
          tokenData.tokenCode,
          expMestIdsNumbers[0]
        );
      } else {
        // Call HIS API with array of IDs (Bulk GetView)
        hisResponse = await this.hisProvider.getExpMestMedicinesByIds(
          tokenData.tokenCode,
          expMestIdsNumbers,
          includeDeleted,
          dataDomainFilter
        );
      }

      if (!hisResponse.Success) {
        return {
          success: false,
          message: `Failed to get exp mest medicines: ${hisResponse.Param?.Messages?.join(', ') || 'Unknown error'}`,
        };
      }

      if (!hisResponse.Data || hisResponse.Data.length === 0) {
        return {
          success: true,
          data: [],
        };
      }

      // Map from UPPERCASE to camelCase (same mapping as getExpMestMedicines)
      const mapped: ExpMestMedicine[] = hisResponse.Data.map((item) => {
        return {
          id: item.ID,
          createTime: item.CREATE_TIME,
          modifyTime: item.MODIFY_TIME,
          creator: item.CREATOR || '',
          modifier: item.MODIFIER || '',
          appCreator: item.APP_CREATOR || '',
          appModifier: item.APP_MODIFIER || '',
          isActive: item.IS_ACTIVE,
          isDelete: item.IS_DELETE,
          expMestId: item.EXP_MEST_ID,
          medicineId: item.MEDICINE_ID,
          tdlMediStockId: item.TDL_MEDI_STOCK_ID,
          tdlMedicineTypeId: item.TDL_MEDICINE_TYPE_ID,
          expMestMetyReqId: item.EXP_MEST_METY_REQ_ID,
          ckImpMestMedicineId: item.CK_IMP_MEST_MEDICINE_ID,
          isExport: item.IS_EXPORT,
          amount: item.AMOUNT || 0,
          approvalLoginname: item.APPROVAL_LOGINNAME || '',
          approvalUsername: item.APPROVAL_USERNAME || '',
          approvalTime: item.APPROVAL_TIME,
          approvalDate: item.APPROVAL_DATE,
          expLoginname: item.EXP_LOGINNAME || '',
          expUsername: item.EXP_USERNAME || '',
          expTime: item.EXP_TIME,
          expDate: item.EXP_DATE,
          expMestCode: item.EXP_MEST_CODE || '',
          mediStockId: item.MEDI_STOCK_ID,
          expMestSttId: item.EXP_MEST_STT_ID,
          impPrice: item.IMP_PRICE || 0,
          impVatRatio: item.IMP_VAT_RATIO || 0,
          bidId: item.BID_ID,
          packageNumber: item.PACKAGE_NUMBER || '',
          expiredDate: item.EXPIRED_DATE,
          medicineTypeId: item.MEDICINE_TYPE_ID,
          impTime: item.IMP_TIME,
          supplierId: item.SUPPLIER_ID,
          medicineBytNumOrder: item.MEDICINE_BYT_NUM_ORDER || '',
          medicineRegisterNumber: item.MEDICINE_REGISTER_NUMBER || '',
          activeIngrBhytCode: item.ACTIVE_INGR_BHYT_CODE || '',
          activeIngrBhytName: item.ACTIVE_INGR_BHYT_NAME || '',
          concentra: item.CONCENTRA || '',
          tdlBidGroupCode: item.TDL_BID_GROUP_CODE || '',
          tdlBidPackageCode: item.TDL_BID_PACKAGE_CODE || '',
          medicineTypeCode: item.MEDICINE_TYPE_CODE || '',
          medicineTypeName: item.MEDICINE_TYPE_NAME || '',
          serviceId: item.SERVICE_ID,
          nationalName: item.NATIONAL_NAME || '',
          manufacturerId: item.MANUFACTURER_ID,
          bytNumOrder: item.BYT_NUM_ORDER || '',
          registerNumber: item.REGISTER_NUMBER || '',
          medicineGroupId: item.MEDICINE_GROUP_ID,
          serviceUnitId: item.SERVICE_UNIT_ID,
          serviceUnitCode: item.SERVICE_UNIT_CODE || '',
          serviceUnitName: item.SERVICE_UNIT_NAME || '',
          medicineNumOrder: item.MEDICINE_NUM_ORDER || 0,
          supplierCode: item.SUPPLIER_CODE || '',
          supplierName: item.SUPPLIER_NAME || '',
          bidNumber: item.BID_NUMBER || '',
          bidName: item.BID_NAME || '',
          medicineUseFormCode: item.MEDICINE_USE_FORM_CODE || '',
          medicineUseFormName: item.MEDICINE_USE_FORM_NAME || '',
          medicineUseFormNumOrder: item.MEDICINE_USE_FORM_NUM_ORDER || 0,
          sumInStock: item.SUM_IN_STOCK ?? 0,
          sumByMedicineInStock: item.SUM_BY_MEDICINE_IN_STOCK ?? 0,
          materialNumOrder: item.MATERIAL_NUM_ORDER ?? null,
          // Price & Tax Info (Additional) - Use !== undefined && !== null to preserve 0 values
          price: item.PRICE !== undefined && item.PRICE !== null ? item.PRICE : null,
          vatRatio: item.VAT_RATIO !== undefined && item.VAT_RATIO !== null ? item.VAT_RATIO : null,
          virPrice: item.VIR_PRICE !== undefined && item.VIR_PRICE !== null ? item.VIR_PRICE : null,
          taxRatio: item.TAX_RATIO !== undefined && item.TAX_RATIO !== null ? item.TAX_RATIO : null,
          // Order & Amount Info
          numOrder: item.NUM_ORDER !== undefined && item.NUM_ORDER !== null ? item.NUM_ORDER : null,
          presAmount: item.PRES_AMOUNT !== undefined && item.PRES_AMOUNT !== null ? item.PRES_AMOUNT : null,
          // Patient & Treatment Info
          patientTypeId: item.PATIENT_TYPE_ID !== undefined && item.PATIENT_TYPE_ID !== null ? item.PATIENT_TYPE_ID : null,
          patientTypeCode: item.PATIENT_TYPE_CODE || null,
          patientTypeName: item.PATIENT_TYPE_NAME || null,
          tdlPatientId: item.TDL_PATIENT_ID !== undefined && item.TDL_PATIENT_ID !== null ? item.TDL_PATIENT_ID : null,
          tdlTreatmentId: item.TDL_TREATMENT_ID !== undefined && item.TDL_TREATMENT_ID !== null ? item.TDL_TREATMENT_ID : null,
          tdlServiceReqId: item.TDL_SERVICE_REQ_ID !== undefined && item.TDL_SERVICE_REQ_ID !== null ? item.TDL_SERVICE_REQ_ID : null,
          // Instruction & Tutorial
          useTimeTo: item.USE_TIME_TO !== undefined && item.USE_TIME_TO !== null ? item.USE_TIME_TO : null,
          tutorial: item.TUTORIAL || null,
          tdlIntructionTime: item.TDL_INTRUCTION_TIME !== undefined && item.TDL_INTRUCTION_TIME !== null ? item.TDL_INTRUCTION_TIME : null,
          tdlIntructionDate: item.TDL_INTRUCTION_DATE !== undefined && item.TDL_INTRUCTION_DATE !== null ? item.TDL_INTRUCTION_DATE : null,
          htuText: item.HTU_TEXT || null,
          // Dosage Info
          morning: item.MORNING || null,
          evening: item.EVENING || null,
          // ExpMest Denormalized Info (Additional)
          expMestTypeId: item.EXP_MEST_TYPE_ID !== undefined && item.EXP_MEST_TYPE_ID !== null ? item.EXP_MEST_TYPE_ID : null,
          tdlAggrExpMestId: item.TDL_AGGR_EXP_MEST_ID !== undefined && item.TDL_AGGR_EXP_MEST_ID !== null ? item.TDL_AGGR_EXP_MEST_ID : null,
          aggrExpMestId: item.AGGR_EXP_MEST_ID !== undefined && item.AGGR_EXP_MEST_ID !== null ? item.AGGR_EXP_MEST_ID : null,
          reqRoomId: item.REQ_ROOM_ID !== undefined && item.REQ_ROOM_ID !== null ? item.REQ_ROOM_ID : null,
          reqDepartmentId: item.REQ_DEPARTMENT_ID !== undefined && item.REQ_DEPARTMENT_ID !== null ? item.REQ_DEPARTMENT_ID : null,
          reqUserTitle: item.REQ_USER_TITLE || null,
          reqLoginname: item.REQ_LOGINNAME || null,
          reqUsername: item.REQ_USERNAME || null,
          // Medicine Group & Use Form (Additional)
          medicineUseFormId: item.MEDICINE_USE_FORM_ID !== undefined && item.MEDICINE_USE_FORM_ID !== null ? item.MEDICINE_USE_FORM_ID : null,
          medicineLineId: item.MEDICINE_LINE_ID !== undefined && item.MEDICINE_LINE_ID !== null ? item.MEDICINE_LINE_ID : null,
          medicineGroupCode: item.MEDICINE_GROUP_CODE || null,
          medicineGroupName: item.MEDICINE_GROUP_NAME || null,
          medicineGroupNumOrder: item.MEDICINE_GROUP_NUM_ORDER !== undefined && item.MEDICINE_GROUP_NUM_ORDER !== null ? item.MEDICINE_GROUP_NUM_ORDER : null,
          // Manufacturer & Stock Info (Additional)
          manufacturerCode: item.MANUFACTURER_CODE || null,
          manufacturerName: item.MANUFACTURER_NAME || null,
          mediStockCode: item.MEDI_STOCK_CODE || null,
          mediStockName: item.MEDI_STOCK_NAME || null,
        };
      });

      // Convert Long objects recursively
      const converted = LongConverter.convertLongRecursive(mapped);

      this.logger.info('ExpMestMedicineService#getExpMestMedicinesByIds.success', {
        dataCount: converted.length,
        expMestIdsCount: expMestIdsNumbers.length,
      });

      return {
        success: true,
        data: converted,
      };
    } catch (error: any) {
      this.logger.error('ExpMestMedicineService#getExpMestMedicinesByIds.error', {
        error: error.message,
        errorType: error.constructor?.name,
        stack: error.stack?.substring(0, 500),
        expMestIdsCount: expMestIds?.length || 0,
      });
      return {
        success: false,
        message: error.message || 'Failed to get exp mest medicines by IDs',
      };
    }
  }
}

