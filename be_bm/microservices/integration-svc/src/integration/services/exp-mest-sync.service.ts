import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { HisProvider } from '../providers/his.provider';
import { AuthTokenService } from './auth/auth-token.service';

interface InventoryService {
    create(data: any): any;
    update(data: any): any;
    findByExpMestId(data: { id: string }): any;
}

interface ExpMestMedicineService {
    create(data: any): any;
    update(data: any): any;
    findByHisId(data: { id: string }): any;
}

interface MasterDataGrpcService {
    findExportStatusById(data: { id: string }): any;
}

@Injectable()
export class ExpMestSyncService implements OnModuleInit {
    private inventoryService: InventoryService;
    private expMestMedicineService: ExpMestMedicineService;
    private masterDataService: MasterDataGrpcService;

    constructor(
        private readonly hisProvider: HisProvider,
        private readonly authTokenService: AuthTokenService,
        @Inject('INVENTORY_PACKAGE') private readonly inventoryClient: ClientGrpc,
        @Inject('MASTER_DATA_PACKAGE') private readonly masterDataClient: ClientGrpc,
        private readonly configService: ConfigService,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(ExpMestSyncService.name);
    }

    onModuleInit() {
        this.inventoryService = this.inventoryClient.getService<InventoryService>('InventoryService');
        this.expMestMedicineService = this.inventoryClient.getService<ExpMestMedicineService>('ExpMestMedicineService');
        this.masterDataService = this.masterDataClient.getService<MasterDataGrpcService>('MasterDataService');
    }

    async syncInpatientExpMest(expMestId: number, userId: string): Promise<any> {
        this.logger.info('ExpMestSyncService#syncInpatientExpMest.call', { expMestId, userId });

        // 1. Get HIS Token
        const { tokenCode } = await this.authTokenService.getToken(userId);
        if (!tokenCode) {
            throw new RpcException({ code: 16, message: 'User not authenticated with HIS' }); // 16 = UNAUTHENTICATED
        }

        try {
            // 2. Fetch Aggregated ExpMest from HIS (details including children)
            // Note: expMestId here is treated as AGGR_EXP_MEST_ID for inpatient
            const hisResponse = await this.hisProvider.getInpatientExpMestDetails(tokenCode, expMestId);

            if (!hisResponse.Success || !hisResponse.Data || hisResponse.Data.length === 0) {
                this.logger.warn('No data found for Aggr ID', { expMestId });
                return { success: false, message: 'No data found from HIS' };
            }

            this.logger.info('Fetched ExpMests from HIS', { count: hisResponse.Data.length });

            // 3. Process ExpMests
            const expMestIds: number[] = [];
            const createdIds: string[] = [];

            for (const hisExpMest of hisResponse.Data) {
                const id = this.convertLongToNumber(hisExpMest.ID); // Fix: EXP_MEST_ID -> ID
                if (id) {
                    expMestIds.push(id);
                }

                const input = this.mapHisExpMestToCreateInput(hisExpMest, userId);

                try {
                    // Check existence
                    let existing = null;
                    try {
                        // We use findByExpMestId (which accepts commons.Id = { id: string })
                        // Here 'id' is the HIS ID (as string)
                        existing = await firstValueFrom(this.inventoryService.findByExpMestId({ id: id.toString() }));
                    } catch (e) {
                        // Not found is fine
                    }

                    if (existing && existing.id) {
                        // Update
                        this.logger.debug('Updating existing ExpMest', { id: existing.id });
                        const updateInput = { ...input, id: existing.id };
                        await firstValueFrom(this.inventoryService.update(updateInput));
                        createdIds.push(existing.id);
                    } else {
                        // Create
                        this.logger.debug('Creating new ExpMest', { hisId: id });
                        const result = await firstValueFrom(this.inventoryService.create(input) as any);
                        createdIds.push((result as any).id);
                    }
                } catch (err) {
                    this.logger.error('Failed to sync ExpMest', { hisId: id, error: err.message });
                }
            }

            // 4. Fetch Medicines for ALL ExpMests
            if (expMestIds.length > 0) {
                this.logger.info('Fetching Medicines for ExpMests', { count: expMestIds.length });
                const medicinesResponse = await this.hisProvider.getExpMestMedicinesByIds(tokenCode, expMestIds);

                if (medicinesResponse.Success && medicinesResponse.Data) {
                    this.logger.info('Fetched Medicines count', { count: medicinesResponse.Data.length });

                    // Sync medicines
                    for (const hisMedicine of medicinesResponse.Data) {
                        const medInput = this.mapHisMedicineToCreateInput(hisMedicine, userId);
                        try {
                            // Try to Create first. If it fails due to duplicates, we might need update logic.
                            // But finding by HIS ID for medicine is heavy?
                            // Let's assume create handles it or we can try findByHisId first.
                            const medId = this.convertLongToNumber(hisMedicine.ID);
                            let existingMed = null;
                            try {
                                existingMed = await firstValueFrom(this.expMestMedicineService.findByHisId({ id: medId.toString() }));
                            } catch (e) { }

                            if (existingMed && existingMed.id) {
                                const updateMedInput = { ...medInput, id: existingMed.id };
                                await firstValueFrom(this.expMestMedicineService.update(updateMedInput));
                            } else {
                                await firstValueFrom(this.expMestMedicineService.create(medInput));
                            }
                        } catch (e) {
                            this.logger.warn('Failed to sync medicine', { hisId: medInput.hisId, error: e.message });
                        }
                    }
                }
            }

            return {
                success: true,
                message: `Synced ${createdIds.length} ExpMests`,
                hisExpMestId: expMestId,
            };

        } catch (error: any) {
            this.logger.error('ExpMestSyncService#syncInpatientExpMest.error', { error: error.message });
            throw new RpcException(error.message);
        }
    }

    async syncExpMestOther(expMestId: number, userId: string): Promise<any> {
        this.logger.info('ExpMestSyncService#syncExpMestOther.call', { expMestId, userId });

        // 1. Get HIS Token
        const { tokenCode } = await this.authTokenService.getToken(userId);
        if (!tokenCode) {
            throw new RpcException({ code: 16, message: 'User not authenticated with HIS' });
        }

        try {
            // 2. Fetch ExpMest from HIS
            const hisResponse = await this.hisProvider.getExpMestById(tokenCode, expMestId);

            if (!hisResponse.Success || !hisResponse.Data || hisResponse.Data.length === 0) {
                return { success: false, message: 'No data found from HIS' };
            }

            // Check if it's array or object (provider returns {Data: []})
            const hisExpMest = hisResponse.Data[0];
            if (!hisExpMest) {
                return { success: false, message: 'No data found from HIS' };
            }

            const input = this.mapHisExpMestToCreateInput(hisExpMest, userId);
            let localId = '';

            // Sync ExpMest
            try {
                const id = this.convertLongToNumber(hisExpMest.ID); // Fix: EXP_MEST_ID -> ID
                let existing = null;
                try {
                    existing = await firstValueFrom(this.inventoryService.findByExpMestId({ id: id.toString() }));
                } catch (e) { }

                if (existing && existing.id) {
                    const updateInput = { ...input, id: existing.id };
                    await firstValueFrom(this.inventoryService.update(updateInput));
                    localId = existing.id;
                } else {
                    const result = await firstValueFrom(this.inventoryService.create(input) as any);
                    localId = (result as any).id;
                }
            } catch (err) {
                throw new Error(`Failed to sync ExpMest: ${err.message}`);
            }

            // Sync Medicines
            const medicinesResponse = await this.hisProvider.getExpMestMedicinesByIds(tokenCode, [expMestId]);
            if (medicinesResponse.Success && medicinesResponse.Data) {
                for (const hisMedicine of medicinesResponse.Data) {
                    const medInput = this.mapHisMedicineToCreateInput(hisMedicine, userId);

                    const medId = this.convertLongToNumber(hisMedicine.ID);
                    let existingMed = null;
                    try {
                        existingMed = await firstValueFrom(this.expMestMedicineService.findByHisId({ id: medId.toString() }));
                    } catch (e) { }

                    if (existingMed && existingMed.id) {
                        const updateMedInput = { ...medInput, id: existingMed.id };
                        await firstValueFrom(this.expMestMedicineService.update(updateMedInput));
                    } else {
                        await firstValueFrom(this.expMestMedicineService.create(medInput));
                    }
                }
            }

            return {
                success: true,
                message: 'Synced ExpMestOther',
                expMestId: localId,
                hisExpMestId: expMestId,
            };
        } catch (error: any) {
            this.logger.error('ExpMestSyncService#syncExpMestOther.error', { error: error.message });
            throw new RpcException(error.message);
        }
    }

    private convertLongToNumber(value: any): number | null {
        if (value === null || value === undefined) return null;
        if (typeof value === 'object' && 'low' in value && 'high' in value) {
            return value.low + value.high * 0x100000000;
        }
        if (typeof value === 'number') return value;
        const num = Number(value);
        return isNaN(num) ? null : num;
    }

    // --- Mappers ---

    private mapHisExpMestToCreateInput(his: any, userId: string): any {
        return {
            expMestId: this.convertLongToNumber(his.ID), // Fix: EXP_MEST_ID -> ID
            expMestCode: his.EXP_MEST_CODE,
            expMestTypeId: this.convertLongToNumber(his.EXP_MEST_TYPE_ID),
            expMestSttId: this.convertLongToNumber(his.EXP_MEST_STT_ID),
            mediStockId: this.convertLongToNumber(his.MEDI_STOCK_ID),
            reqLoginname: his.REQ_LOGINNAME,
            reqUsername: his.REQ_USERNAME,
            reqRoomId: this.convertLongToNumber(his.REQ_ROOM_ID),
            reqDepartmentId: this.convertLongToNumber(his.REQ_DEPARTMENT_ID),
            createDate: this.convertLongToNumber(his.CREATE_DATE),
            serviceReqId: this.convertLongToNumber(his.SERVICE_REQ_ID),
            tdlTotalPrice: his.TDL_TOTAL_PRICE,
            tdlServiceReqCode: his.TDL_SERVICE_REQ_CODE,
            tdlIntructionTime: this.convertLongToNumber(his.TDL_INTRUCTION_TIME),
            tdlIntructionDate: this.convertLongToNumber(his.TDL_INTRUCTION_DATE),
            tdlTreatmentId: this.convertLongToNumber(his.TDL_TREATMENT_ID),
            tdlTreatmentCode: his.TDL_TREATMENT_CODE,
            tdlPatientId: this.convertLongToNumber(his.TDL_PATIENT_ID),
            tdlPatientCode: his.TDL_PATIENT_CODE,
            tdlPatientName: his.TDL_PATIENT_NAME,
            tdlPatientFirstName: his.TDL_PATIENT_FIRST_NAME,
            tdlPatientLastName: his.TDL_PATIENT_LAST_NAME,
            tdlPatientDob: this.convertLongToNumber(his.TDL_PATIENT_DOB),
            tdlPatientIsHasNotDayDob: his.TDL_PATIENT_IS_HAS_NOT_DAY_DOB,
            tdlPatientAddress: his.TDL_PATIENT_ADDRESS,
            tdlPatientGenderId: this.convertLongToNumber(his.TDL_PATIENT_GENDER_ID),
            tdlPatientGenderName: his.TDL_PATIENT_GENDER_NAME,
            tdlPatientTypeId: this.convertLongToNumber(his.TDL_PATIENT_TYPE_ID),
            tdlHeinCardNumber: his.TDL_HEIN_CARD_NUMBER,
            tdlPatientPhone: his.TDL_PATIENT_PHONE,
            tdlPatientProvinceCode: his.TDL_PATIENT_PROVINCE_CODE,
            tdlPatientCommuneCode: his.TDL_PATIENT_COMMUNE_CODE,
            tdlPatientNationalName: his.TDL_PATIENT_NATIONAL_NAME,
            virCreateMonth: his.VIR_CREATE_MONTH,
            virCreateYear: his.VIR_CREATE_YEAR,
            icdCode: his.ICD_CODE,
            icdName: his.ICD_NAME,
            icdSubCode: his.ICD_SUB_CODE,
            icdText: his.ICD_TEXT,
            reqUserTitle: his.REQ_USER_TITLE,
            expMestSubCode2: his.EXP_MEST_SUB_CODE_2,
            virHeinCardPrefix: his.VIR_HEIN_CARD_PREFIX,
            priority: his.PRIORITY,
            expMestTypeCode: his.EXP_MEST_TYPE_CODE,
            expMestTypeName: his.EXP_MEST_TYPE_NAME,
            expMestSttCode: his.EXP_MEST_STT_CODE,
            expMestSttName: his.EXP_MEST_STT_NAME,
            mediStockCode: his.MEDI_STOCK_CODE,
            mediStockName: his.MEDI_STOCK_NAME,
            reqDepartmentCode: his.REQ_DEPARTMENT_CODE,
            reqDepartmentName: his.REQ_DEPARTMENT_NAME,
            reqRoomCode: his.REQ_ROOM_CODE,
            reqRoomName: his.REQ_ROOM_NAME,
            treatmentIsActive: his.TREATMENT_IS_ACTIVE,
            patientTypeName: his.PATIENT_TYPE_NAME,
            patientTypeCode: his.PATIENT_TYPE_CODE,
            createdBy: userId,
            // Aggregates
            tdlAggrPatientCode: his.TDL_AGGR_PATIENT_CODE,
            tdlAggrTreatmentCode: his.TDL_AGGR_TREATMENT_CODE,
            // Approvals
            lastExpLoginname: his.LAST_EXP_LOGINNAME,
            lastExpUsername: his.LAST_EXP_USERNAME,
            lastExpTime: this.convertLongToNumber(his.LAST_EXP_TIME),
            finishTime: this.convertLongToNumber(his.FINISH_TIME),
            finishDate: this.convertLongToNumber(his.FINISH_DATE),
            isExportEqualApprove: his.IS_EXPORT_EQUAL_APPROVE,
            expMestSubCode: his.EXP_MEST_SUB_CODE,
            lastApprovalLoginname: his.LAST_APPROVAL_LOGINNAME,
            lastApprovalUsername: his.LAST_APPROVAL_USERNAME,
            lastApprovalTime: this.convertLongToNumber(his.LAST_APPROVAL_TIME),
            lastApprovalDate: this.convertLongToNumber(his.LAST_APPROVAL_DATE),
            numOrder: this.convertLongToNumber(his.NUM_ORDER),
            tdlIntructionDateMin: this.convertLongToNumber(his.TDL_INTRUCTION_DATE_MIN),
        };
    }

    private mapHisMedicineToCreateInput(his: any, userId: string): any {
        return {
            hisId: this.convertLongToNumber(his.ID), // ID of medicine record in HIS (EXP_MEST_MEDICINE)
            expMestId: this.convertLongToNumber(his.EXP_MEST_ID),
            medicineId: this.convertLongToNumber(his.MEDICINE_ID),
            tdlMediStockId: this.convertLongToNumber(his.TDL_MEDI_STOCK_ID),
            tdlMedicineTypeId: this.convertLongToNumber(his.TDL_MEDICINE_TYPE_ID),
            expMestMetyReqId: this.convertLongToNumber(his.EXP_MEST_METY_REQ_ID),
            ckImpMestMedicineId: this.convertLongToNumber(his.CK_IMP_MEST_MEDICINE_ID),
            isExport: his.IS_EXPORT,
            amount: his.AMOUNT,
            exportAmount: his.AMOUNT, // Fix: EXPORT_AMOUNT -> AMOUNT (or handle logic)
            exportByUser: his.EXP_LOGINNAME, // Fix: EXPORT_BY_USER -> EXP_LOGINNAME
            exportTime: this.convertLongToNumber(his.EXP_TIME), // Fix: EXPORT_TIME -> EXP_TIME
            approvalLoginname: his.APPROVAL_LOGINNAME,
            approvalUsername: his.APPROVAL_USERNAME,
            approvalTime: this.convertLongToNumber(his.APPROVAL_TIME),
            approvalDate: this.convertLongToNumber(his.APPROVAL_DATE),
            expLoginname: his.EXP_LOGINNAME,
            expUsername: his.EXP_USERNAME,
            expTime: this.convertLongToNumber(his.EXP_TIME),
            expDate: this.convertLongToNumber(his.EXP_DATE),
            expMestCode: his.EXP_MEST_CODE,
            mediStockId: this.convertLongToNumber(his.MEDI_STOCK_ID),
            expMestSttId: this.convertLongToNumber(his.EXP_MEST_STT_ID),
            impPrice: his.IMP_PRICE,
            impVatRatio: his.IMP_VAT_RATIO,
            bidId: this.convertLongToNumber(his.BID_ID),
            packageNumber: his.PACKAGE_NUMBER,
            expiredDate: this.convertLongToNumber(his.EXPIRED_DATE),
            medicineTypeId: this.convertLongToNumber(his.MEDICINE_TYPE_ID),
            medicineTypeCode: his.MEDICINE_TYPE_CODE,
            medicineTypeName: his.MEDICINE_TYPE_NAME,
            impTime: this.convertLongToNumber(his.IMP_TIME),
            supplierId: this.convertLongToNumber(his.SUPPLIER_ID),
            medicineBytNumOrder: his.MEDICINE_BYT_NUM_ORDER,
            medicineRegisterNumber: his.MEDICINE_REGISTER_NUMBER,
            activeIngrBhytCode: his.ACTIVE_INGR_BHYT_CODE,
            activeIngrBhytName: his.ACTIVE_INGR_BHYT_NAME,
            concentra: his.CONCENTRA,
            tdlBidGroupCode: his.TDL_BID_GROUP_CODE,
            tdlBidPackageCode: his.TDL_BID_PACKAGE_CODE,
            serviceId: this.convertLongToNumber(his.SERVICE_ID),
            nationalName: his.NATIONAL_NAME,
            manufacturerId: this.convertLongToNumber(his.MANUFACTURER_ID),
            bytNumOrder: his.BYT_NUM_ORDER,
            registerNumber: his.REGISTER_NUMBER,
            medicineGroupId: this.convertLongToNumber(his.MEDICINE_GROUP_ID),
            serviceUnitId: this.convertLongToNumber(his.SERVICE_UNIT_ID),
            serviceUnitCode: his.SERVICE_UNIT_CODE,
            serviceUnitName: his.SERVICE_UNIT_NAME,
            medicineNumOrder: his.MEDICINE_NUM_ORDER,
            supplierCode: his.SUPPLIER_CODE,
            supplierName: his.SUPPLIER_NAME,
            bidNumber: his.BID_NUMBER,
            bidName: his.BID_NAME,
            medicineUseFormCode: his.MEDICINE_USE_FORM_CODE,
            medicineUseFormName: his.MEDICINE_USE_FORM_NAME,
            medicineUseFormNumOrder: his.MEDICINE_USE_FORM_NUM_ORDER,
            sumInStock: his.SUM_IN_STOCK,
            sumByMedicineInStock: his.SUM_BY_MEDICINE_IN_STOCK,
            price: his.PRICE,
            vatRatio: his.VAT_RATIO,
            virPrice: his.VIR_PRICE,
            taxRatio: his.TAX_RATIO,
            numOrder: his.NUM_ORDER,
            presAmount: his.PRES_AMOUNT,
            patientTypeId: this.convertLongToNumber(his.PATIENT_TYPE_ID),
            patientTypeCode: his.PATIENT_TYPE_CODE,
            patientTypeName: his.PATIENT_TYPE_NAME,
            tdlPatientId: this.convertLongToNumber(his.TDL_PATIENT_ID),
            tdlTreatmentId: this.convertLongToNumber(his.TDL_TREATMENT_ID),
            tdlServiceReqId: this.convertLongToNumber(his.TDL_SERVICE_REQ_ID),
            useTimeTo: this.convertLongToNumber(his.USE_TIME_TO),
            tutorial: his.TUTORIAL,
            tdlIntructionTime: this.convertLongToNumber(his.TDL_INTRUCTION_TIME),
            tdlIntructionDate: this.convertLongToNumber(his.TDL_INTRUCTION_DATE),
            htuText: his.HTU_TEXT,
            morning: his.MORNING,
            evening: his.EVENING,
            expMestTypeId: this.convertLongToNumber(his.EXP_MEST_TYPE_ID),
            tdlAggrExpMestId: this.convertLongToNumber(his.TDL_AGGR_EXP_MEST_ID),
            aggrExpMestId: this.convertLongToNumber(his.AGGR_EXP_MEST_ID),
            reqRoomId: this.convertLongToNumber(his.REQ_ROOM_ID),
            reqDepartmentId: this.convertLongToNumber(his.REQ_DEPARTMENT_ID),
            reqUserTitle: his.REQ_USER_TITLE,
            reqLoginname: his.REQ_LOGINNAME,
            reqUsername: his.REQ_USERNAME,
            medicineUseFormId: this.convertLongToNumber(his.MEDICINE_USE_FORM_ID),
            medicineLineId: this.convertLongToNumber(his.MEDICINE_LINE_ID),
            medicineGroupCode: his.MEDICINE_GROUP_CODE,
            medicineGroupName: his.MEDICINE_GROUP_NAME,
            medicineGroupNumOrder: his.MEDICINE_GROUP_NUM_ORDER,
            manufacturerCode: his.MANUFACTURER_CODE,
            manufacturerName: his.MANUFACTURER_NAME,
            mediStockCode: his.MEDI_STOCK_CODE,
            mediStockName: his.MEDI_STOCK_NAME,
            createdBy: userId,
        };
    }
}
