import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { ExpMestCabinetMedicine } from '../entities/exp-mest-cabinet-medicine.entity';
import { convertLongToNumberRequired } from '../utils/oracle-utils';

@Injectable()
export class ExpMestCabinetMedicineRepository {
    constructor(
        @InjectRepository(ExpMestCabinetMedicine)
        private readonly repository: Repository<ExpMestCabinetMedicine>,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(ExpMestCabinetMedicineRepository.name);
    }

    async findByExpMestId(expMestId: number): Promise<ExpMestCabinetMedicine[]> {
        this.logger.info('ExpMestCabinetMedicineRepository#findByExpMestId.call', { expMestId });
        
        // Ensure expMestId is a primitive number for Oracle binding
        const expMestIdNumber = convertLongToNumberRequired(expMestId, 'expMestId');
        
        const result = await this.repository.find({ where: { expMestId: expMestIdNumber } });
        this.logger.info('ExpMestCabinetMedicineRepository#findByExpMestId.result', { count: result.length });
        return result;
    }

    async find(options: any): Promise<ExpMestCabinetMedicine[]> {
        return this.repository.find(options);
    }

    async findByHisId(hisId: number): Promise<ExpMestCabinetMedicine | null> {
        this.logger.info('ExpMestCabinetMedicineRepository#findByHisId.call', { hisId });
        const result = await this.repository.findOne({ where: { hisId } });
        this.logger.info('ExpMestCabinetMedicineRepository#findByHisId.result', { found: !!result });
        return result;
    }

    async findByHisIds(hisIds: number[]): Promise<ExpMestCabinetMedicine[]> {
        this.logger.info('ExpMestCabinetMedicineRepository#findByHisIds.call', { count: hisIds.length });
        
        if (!hisIds || hisIds.length === 0) {
            return [];
        }

        const validIds = hisIds
            .map(id => this.convertToNumber(id))
            .filter((id): id is number => id !== null && !isNaN(id));

        if (validIds.length === 0) {
            return [];
        }

        const result = await this.repository.find({
            where: { hisId: In(validIds) },
        });

        this.logger.info('ExpMestCabinetMedicineRepository#findByHisIds.result', { 
            requested: hisIds.length,
            valid: validIds.length,
            found: result.length 
        });
        return result;
    }

    async update(id: string, updateDto: any): Promise<ExpMestCabinetMedicine> {
        this.logger.info('ExpMestCabinetMedicineRepository#update.call', { id });
        
        const medicine = await this.repository.findOne({ where: { id } });
        if (!medicine) {
            throw new Error(`ExpMestCabinetMedicine with id ${id} not found`);
        }
        
        // Update fields
        if (updateDto.isExport !== undefined) medicine.isExport = this.convertToNumber(updateDto.isExport);
        if (updateDto.exportAmount !== undefined) medicine.exportAmount = this.convertToNumber(updateDto.exportAmount);
        if (updateDto.exportByUser !== undefined) medicine.exportByUser = updateDto.exportByUser ?? null;
        // For cabinet, use expTime instead of exportTime
        if (updateDto.expTime !== undefined) medicine.expTime = this.convertToNumber(updateDto.expTime);
        if (updateDto.exportTime !== undefined) medicine.expTime = this.convertToNumber(updateDto.exportTime); // Map exportTime to expTime for compatibility
        if (updateDto.actualExportAmount !== undefined) medicine.actualExportAmount = this.convertToNumber(updateDto.actualExportAmount);
        if (updateDto.actualExportByUser !== undefined) medicine.actualExportByUser = updateDto.actualExportByUser ?? null;
        if (updateDto.actualExportTime !== undefined) medicine.actualExportTime = this.convertToNumber(updateDto.actualExportTime);
        if (updateDto.updatedBy !== undefined) medicine.updatedBy = updateDto.updatedBy;
        
        medicine.updatedAt = new Date();
        
        const result = await this.repository.save(medicine);
        this.logger.info('ExpMestCabinetMedicineRepository#update.result', { id: result.id });
        return result;
    }

    async create(data: any): Promise<ExpMestCabinetMedicine> {
        this.logger.info('ExpMestCabinetMedicineRepository#create.call', { hisId: data.hisId });

        const { randomUUID } = require('crypto');
        const now = new Date();

        const entity = {
            id: randomUUID(),
            hisId: this.convertToNumber(data.ID || data.hisId || data.id),
            expMestId: this.convertToNumber(data.EXP_MEST_ID || data.expMestId),
            expMestLocalId: data.expMestLocalId || null,
            medicineId: this.convertToNumber(data.MEDICINE_ID || data.medicineId),
            tdlMediStockId: this.convertToNumber(data.TDL_MEDI_STOCK_ID || data.tdlMediStockId),
            tdlMedicineTypeId: this.convertToNumber(data.TDL_MEDICINE_TYPE_ID || data.tdlMedicineTypeId),
            isExport: this.convertToNumber(data.IS_EXPORT || data.isExport),
            amount: this.convertToNumber(data.AMOUNT || data.amount),
            exportAmount: this.convertToNumber(data.EXPORT_AMOUNT || data.exportAmount),
            expMestCode: data.EXP_MEST_CODE || data.expMestCode || null,
            mediStockId: this.convertToNumber(data.MEDI_STOCK_ID || data.mediStockId),
            expMestSttId: this.convertToNumber(data.EXP_MEST_STT_ID || data.expMestSttId),
            impPrice: this.convertToNumber(data.IMP_PRICE || data.impPrice),
            impVatRatio: this.convertToNumber(data.IMP_VAT_RATIO || data.impVatRatio),
            price: this.convertToNumber(data.PRICE || data.price),
            vatRatio: this.convertToNumber(data.VAT_RATIO || data.vatRatio),
            medicineTypeId: this.convertToNumber(data.MEDICINE_TYPE_ID || data.medicineTypeId),
            medicineTypeCode: data.MEDICINE_TYPE_CODE || data.medicineTypeCode || null,
            medicineTypeName: data.MEDICINE_TYPE_NAME || data.medicineTypeName || null,
            packageNumber: data.PACKAGE_NUMBER || data.packageNumber || null,
            expiredDate: this.convertToNumber(data.EXPIRED_DATE || data.expiredDate),
            supplierId: this.convertToNumber(data.SUPPLIER_ID || data.supplierId),
            supplierCode: data.SUPPLIER_CODE || data.supplierCode || null,
            supplierName: data.SUPPLIER_NAME || data.supplierName || null,
            manufacturerId: this.convertToNumber(data.MANUFACTURER_ID || data.manufacturerId),
            manufacturerCode: data.MANUFACTURER_CODE || data.manufacturerCode || null,
            manufacturerName: data.MANUFACTURER_NAME || data.manufacturerName || null,
            serviceUnitId: this.convertToNumber(data.SERVICE_UNIT_ID || data.serviceUnitId),
            serviceUnitCode: data.SERVICE_UNIT_CODE || data.serviceUnitCode || null,
            serviceUnitName: data.SERVICE_UNIT_NAME || data.serviceUnitName || null,
            mediStockCode: data.MEDI_STOCK_CODE || data.mediStockCode || null,
            mediStockName: data.MEDI_STOCK_NAME || data.mediStockName || null,
            numOrder: this.convertToNumber(data.NUM_ORDER || data.numOrder),
            // New Approval/Export Fields
            exportByUser: data.EXPORT_BY_USER || data.exportByUser || null,
            expLoginname: data.EXP_LOGINNAME || data.expLoginname || null,
            expUsername: data.EXP_USERNAME || data.expUsername || null,
            expTime: this.convertToNumber(data.EXP_TIME || data.expTime),
            expDate: this.convertToNumber(data.EXP_DATE || data.expDate),
            // New Actual Export Fields
            actualExportAmount: this.convertToNumber(data.ACTUAL_EXP_AMOUNT || data.actualExportAmount),
            actualExportByUser: data.ACTUAL_EXP_BY_USER || data.actualExportByUser || null,
            actualExportTime: this.convertToNumber(data.ACTUAL_EXP_TIME || data.actualExportTime),
            approvalLoginname: data.APPROVAL_LOGINNAME || data.approvalLoginname || null,
            approvalUsername: data.APPROVAL_USERNAME || data.approvalUsername || null,
            approvalTime: this.convertToNumber(data.APPROVAL_TIME || data.approvalTime),
            approvalDate: this.convertToNumber(data.APPROVAL_DATE || data.approvalDate),
            hisCreateTime: this.convertToNumber(data.CREATE_TIME || data.hisCreateTime),
            hisModifyTime: this.convertToNumber(data.MODIFY_TIME || data.hisModifyTime),
            hisCreator: data.CREATOR || data.hisCreator || null,
            hisModifier: data.MODIFIER || data.hisModifier || null,
            createdAt: now,
            updatedAt: now,
            createdBy: data.createdBy || 'system',
            updatedBy: data.createdBy || 'system',
            version: 1,
            isActive: 1,
        };

        const result = await this.repository.save(entity);
        this.logger.info('ExpMestCabinetMedicineRepository#create.result', { id: result.id });
        return result;
    }

    async deleteByExpMestId(expMestId: number): Promise<void> {
        this.logger.info('ExpMestCabinetMedicineRepository#deleteByExpMestId.call', { expMestId });
        await this.repository.delete({ expMestId });
        this.logger.info('ExpMestCabinetMedicineRepository#deleteByExpMestId.result');
    }

    private convertToNumber(value: any): number | null {
        const { convertLongToNumber } = require('../utils/oracle-utils');
        return convertLongToNumber(value);
    }
}
