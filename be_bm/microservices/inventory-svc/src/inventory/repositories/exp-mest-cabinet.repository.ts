import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ExpMestCabinet } from '../entities/exp-mest-cabinet.entity';
import { convertLongToNumberRequired, convertLongToNumber } from '../utils/oracle-utils';

@Injectable()
export class ExpMestCabinetRepository extends Repository<ExpMestCabinet> {
    constructor(private dataSource: DataSource) {
        super(ExpMestCabinet, dataSource.createEntityManager());
    }

    async findByExpMestId(expMestId: number): Promise<ExpMestCabinet | null> {
        // Ensure expMestId is a primitive number for Oracle binding
        const expMestIdNumber = convertLongToNumberRequired(expMestId, 'expMestId');
        return await this.findOne({ where: { expMestId: expMestIdNumber } });
    }

    async createCabinet(data: any): Promise<ExpMestCabinet> {
        const { randomUUID } = require('crypto');
        const now = new Date();

        const entity = {
            id: randomUUID(),
            expMestId: this.convertToNumber(data.id || data.expMestId || data.ID),
            expMestCode: data.EXP_MEST_CODE || data.expMestCode || null,
            expMestTypeId: this.convertToNumber(data.EXP_MEST_TYPE_ID || data.expMestTypeId),
            expMestSttId: this.convertToNumber(data.EXP_MEST_STT_ID || data.expMestSttId),
            mediStockId: this.convertToNumber(data.MEDI_STOCK_ID || data.mediStockId),
            reqLoginname: data.REQ_LOGINNAME || data.reqLoginname || null,
            reqUsername: data.REQ_USERNAME || data.reqUsername || null,
            reqRoomId: this.convertToNumber(data.REQ_ROOM_ID || data.reqRoomId),
            reqDepartmentId: this.convertToNumber(data.REQ_DEPT_ID || data.reqDepartmentId),
            createDate: this.convertToNumber(data.CREATE_DATE || data.createDate),
            serviceReqId: this.convertToNumber(data.SERVICE_REQ_ID || data.serviceReqId),

            // TDL Fields
            tdlTotalPrice: this.convertToNumber(data.TDL_TOTAL_PRICE || data.tdlTotalPrice),
            tdlServiceReqCode: data.TDL_SVC_REQ_CODE || data.tdlServiceReqCode || null,
            tdlIntructionTime: this.convertToNumber(data.TDL_INSTR_TIME || data.tdlIntructionTime),
            tdlIntructionDate: this.convertToNumber(data.TDL_INSTR_DATE || data.tdlIntructionDate),
            tdlTreatmentId: this.convertToNumber(data.TDL_TREATMENT_ID || data.tdlTreatmentId),
            tdlTreatmentCode: data.TDL_TREATMENT_CODE || data.tdlTreatmentCode || null,
            tdlPatientId: this.convertToNumber(data.TDL_PATIENT_ID || data.tdlPatientId),
            tdlPatientCode: data.TDL_PATIENT_CODE || data.tdlPatientCode || null,
            tdlPatientName: data.TDL_PATIENT_NAME || data.tdlPatientName || null,
            tdlPatientFirstName: data.TDL_PAT_FIRST_NAME || data.tdlPatientFirstName || null,
            tdlPatientLastName: data.TDL_PAT_LAST_NAME || data.tdlPatientLastName || null,
            tdlPatientDob: this.convertToNumber(data.TDL_PATIENT_DOB || data.tdlPatientDob),
            tdlPatientIsHasNotDayDob: this.convertToNumber(data.TDL_PAT_NO_DAY_DOB || data.tdlPatientIsHasNotDayDob),
            tdlPatientAddress: data.TDL_PATIENT_ADDRESS || data.tdlPatientAddress || null,
            tdlPatientGenderId: this.convertToNumber(data.TDL_PAT_GENDER_ID || data.tdlPatientGenderId),
            tdlPatientGenderName: data.TDL_PAT_GENDER_NAME || data.tdlPatientGenderName || null,
            tdlPatientTypeId: this.convertToNumber(data.TDL_PATIENT_TYPE_ID || data.tdlPatientTypeId),
            tdlHeinCardNumber: data.TDL_HEIN_CARD_NUMBER || data.tdlHeinCardNumber || null,
            tdlPatientPhone: data.TDL_PATIENT_PHONE || data.tdlPatientPhone || null,
            tdlPatientProvinceCode: data.TDL_PAT_PROV_CODE || data.tdlPatientProvinceCode || null,
            tdlPatientCommuneCode: data.TDL_PAT_COMMUNE_CODE || data.tdlPatientCommuneCode || null,
            tdlPatientNationalName: data.TDL_PAT_NAT_NAME || data.tdlPatientNationalName || null,

            // Vir Fields
            virCreateMonth: this.convertToNumber(data.VIR_CREATE_MONTH || data.virCreateMonth),
            virCreateYear: this.convertToNumber(data.VIR_CREATE_YEAR || data.virCreateYear),
            virHeinCardPrefix: data.VIR_HEIN_CARD_PREFIX || data.virHeinCardPrefix || null,

            // ICD Info
            icdCode: data.ICD_CODE || data.icdCode || null,
            icdName: data.ICD_NAME || data.icdName || null,
            icdSubCode: data.ICD_SUB_CODE || data.icdSubCode || null,
            icdText: data.ICD_TEXT || data.icdText || null,

            // Other
            reqUserTitle: data.REQ_USER_TITLE || data.reqUserTitle || null,
            expMestSubCode2: data.EXP_MEST_SUB_CODE2 || data.expMestSubCode2 || null,
            priority: this.convertToNumber(data.PRIORITY || data.priority),
            numOrder: this.convertToNumber(data.NUM_ORDER || data.numOrder),

            // Denormalized
            expMestTypeCode: data.EXP_MEST_TYPE_CODE || data.expMestTypeCode || null,
            expMestTypeName: data.EXP_MEST_TYPE_NAME || data.expMestTypeName || null,
            expMestSttCode: data.EXP_MEST_STT_CODE || data.expMestSttCode || null,
            expMestSttName: data.EXP_MEST_STT_NAME || data.expMestSttName || null,
            mediStockCode: data.MEDI_STOCK_CODE || data.mediStockCode || null,
            mediStockName: data.MEDI_STOCK_NAME || data.mediStockName || null,
            reqDepartmentCode: data.REQ_DEPT_CODE || data.reqDepartmentCode || null,
            reqDepartmentName: data.REQ_DEPT_NAME || data.reqDepartmentName || null,
            reqRoomCode: data.REQ_ROOM_CODE || data.reqRoomCode || null,
            reqRoomName: data.REQ_ROOM_NAME || data.reqRoomName || null,
            treatmentIsActive: this.convertToNumber(data.TREATMENT_IS_ACTIVE || data.treatmentIsActive),
            tdlIntructionDateMin: this.convertToNumber(data.TDL_INTRUCTION_DATE_MIN || data.tdlIntructionDateMin),
            patientTypeName: data.PATIENT_TYPE_NAME || data.patientTypeName || null,
            patientTypeCode: data.PATIENT_TYPE_CODE || data.patientTypeCode || null,

            tdlAggrPatientCode: data.TDL_AGGR_PATIENT_CODE || data.tdlAggrPatientCode || null,
            tdlAggrTreatmentCode: data.TDL_AGGR_TREATMENT_CODE || data.tdlAggrTreatmentCode || null,

            lastExpLoginname: data.LAST_EXP_LOGINNAME || data.lastExpLoginname || null,
            lastExpUsername: data.LAST_EXP_USERNAME || data.lastExpUsername || null,
            lastExpTime: this.convertToNumber(data.LAST_EXP_TIME || data.lastExpTime),
            finishTime: this.convertToNumber(data.FINISH_TIME || data.finishTime),
            finishDate: this.convertToNumber(data.FINISH_DATE || data.finishDate),
            isExportEqualApprove: this.convertToNumber(data.IS_EXPORT_EQUAL_APPROVE || data.isExportEqualApprove),
            expMestSubCode: data.EXP_MEST_SUB_CODE || data.expMestSubCode || null,
            lastApprovalLoginname: data.LAST_APPROVAL_LOGINNAME || data.lastApprovalLoginname || null,
            lastApprovalUsername: data.LAST_APPROVAL_USERNAME || data.lastApprovalUsername || null,
            lastApprovalTime: this.convertToNumber(data.LAST_APPROVAL_TIME || data.lastApprovalTime),
            lastApprovalDate: this.convertToNumber(data.LAST_APPROVAL_DATE || data.lastApprovalDate),

            workingStateId: data.workingStateId || null,
            createdAt: now,
            updatedAt: now,
            createdBy: data.createdBy || 'system',
            updatedBy: data.createdBy || 'system',
            version: 1,
            isActive: 1,
        };

        return await this.save(entity);
    }

    async updateCabinet(id: string, data: any): Promise<ExpMestCabinet> {
        const updateData: any = {
            workingStateId: data.workingStateId,
            updatedAt: new Date(),
            updatedBy: data.updatedBy || 'system',
        };

        await super.update(id, updateData);
        const result = await this.findOne({ where: { id } });
        return result!;
    }

    private convertToNumber(value: any): number | null {
        return convertLongToNumber(value);
    }
}
