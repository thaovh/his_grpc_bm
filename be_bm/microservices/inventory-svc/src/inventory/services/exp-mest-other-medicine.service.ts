import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { FindManyOptions } from 'typeorm';
import { ExpMestOtherMedicineRepository } from '../repositories/exp-mest-other-medicine.repository';
import { ExpMestOtherMedicine } from '../entities/exp-mest-other-medicine.entity';
import { CreateExpMestOtherMedicineDto } from '../dto/create-exp-mest-other-medicine.dto';
import { UpdateExpMestOtherMedicineDto } from '../dto/update-exp-mest-other-medicine.dto';

@Injectable()
export class ExpMestOtherMedicineService {
  constructor(
    private readonly repository: ExpMestOtherMedicineRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ExpMestOtherMedicineService.name);
  }

  async findAll(options?: FindManyOptions<ExpMestOtherMedicine>): Promise<ExpMestOtherMedicine[]> {
    this.logger.info('ExpMestOtherMedicineService#findAll.call', options);
    return this.repository.findAll(options);
  }

  async findById(id: string): Promise<ExpMestOtherMedicine | null> {
    this.logger.info('ExpMestOtherMedicineService#findById.call', { id });
    return this.repository.findById(id);
  }

  async findByHisId(hisId: number): Promise<ExpMestOtherMedicine | null> {
    this.logger.info('ExpMestOtherMedicineService#findByHisId.call', { hisId });
    return this.repository.findByHisId(hisId);
  }

  async findByExpMestId(expMestId: number): Promise<ExpMestOtherMedicine[]> {
    this.logger.info('ExpMestOtherMedicineService#findByExpMestId.call', { expMestId });
    return this.repository.findByExpMestId(expMestId);
  }

  async findByHisIds(hisIds: number[]): Promise<ExpMestOtherMedicine[]> {
    this.logger.info('ExpMestOtherMedicineService#findByHisIds.call', { count: hisIds.length });
    return this.repository.findByHisIds(hisIds);
  }

  async create(dto: CreateExpMestOtherMedicineDto): Promise<ExpMestOtherMedicine> {
    this.logger.info('ExpMestOtherMedicineService#create.call', { hisId: dto.hisId });
    return this.repository.create(dto);
  }

  async update(id: string, dto: UpdateExpMestOtherMedicineDto): Promise<ExpMestOtherMedicine> {
    this.logger.info('ExpMestOtherMedicineService#update.call', { id });
    return this.repository.update(id, dto);
  }

  async count(options?: FindManyOptions<ExpMestOtherMedicine>): Promise<number> {
    this.logger.info('ExpMestOtherMedicineService#count.call', options);
    return this.repository.count(options);
  }

  /**
   * Sync từ Integration API vào local inventory
   */
  async syncFromIntegrationApi(
    hisData: any,
    expMestId: number,
    expMestLocalId: string | null,
    userId: string,
    parentHisData?: any, // Added parentHisData for enrichment
  ): Promise<ExpMestOtherMedicine> {
    console.log('=== [DEBUG] ExpMestOtherMedicineService#syncFromIntegrationApi.start ===');
    console.log('hisData.id:', hisData?.id);
    console.log('expMestId:', expMestId);
    console.log('expMestLocalId:', expMestLocalId);
    console.log('userId:', userId);
    this.logger.info('ExpMestOtherMedicineService#syncFromIntegrationApi.call', {
      hisId: hisData.id,
      expMestId,
      userId,
    });

    try {
      // Check if exists
      console.log('=== [DEBUG] ExpMestOtherMedicineService#syncFromIntegrationApi.step1: Check existing ===');
      const existing = await this.repository.findByHisId(hisData.id);
      console.log('existing:', !!existing);
      // Helper function to enrich field: use hisData value if exists and not null, otherwise use parentHisData value
      const enrichField = (fieldName: string, isNumeric: boolean = false) => {
        const value = hisData[fieldName];
        const parentValue = parentHisData ? parentHisData[fieldName] : null;

        if (value !== undefined && value !== null) {
          return value;
        }

        if (parentValue !== undefined && parentValue !== null) {
          return parentValue;
        }

        return null;
      };

      const syncDto: CreateExpMestOtherMedicineDto = {
        hisId: hisData.id,
        expMestId,
        expMestLocalId,
        medicineId: enrichField('medicineId'),
        tdlMediStockId: enrichField('tdlMediStockId'),
        tdlMedicineTypeId: enrichField('tdlMedicineTypeId'),
        expMestMetyReqId: enrichField('expMestMetyReqId'),
        ckImpMestMedicineId: enrichField('ckImpMestMedicineId'),
        isExport: hisData.isExport !== undefined && hisData.isExport !== null ? hisData.isExport : null,
        amount: hisData.amount !== undefined && hisData.amount !== null ? hisData.amount : null,
        exportAmount: hisData.exportAmount !== undefined && hisData.exportAmount !== null ? hisData.exportAmount : null,
        exportByUser: hisData.exportByUser || null,
        exportTime: hisData.exportTime !== undefined && hisData.exportTime !== null ? hisData.exportTime : null,
        actualExportAmount: hisData.actualExportAmount !== undefined && hisData.actualExportAmount !== null ? hisData.actualExportAmount : null,
        actualExportByUser: hisData.actualExportByUser || null,
        actualExportTime: hisData.actualExportTime !== undefined && hisData.actualExportTime !== null ? hisData.actualExportTime : null,
        approvalLoginname: hisData.approvalLoginname || null,
        approvalUsername: hisData.approvalUsername || null,
        approvalTime: hisData.approvalTime !== undefined && hisData.approvalTime !== null ? hisData.approvalTime : null,
        approvalDate: hisData.approvalDate !== undefined && hisData.approvalDate !== null ? hisData.approvalDate : null,
        expLoginname: hisData.expLoginname || null,
        expUsername: hisData.expUsername || null,
        expTime: hisData.expTime !== undefined && hisData.expTime !== null ? hisData.expTime : null,
        expDate: hisData.expDate !== undefined && hisData.expDate !== null ? hisData.expDate : null,
        expMestCode: hisData.expMestCode || null,
        mediStockId: enrichField('mediStockId'),
        expMestSttId: enrichField('expMestSttId'),
        impPrice: hisData.impPrice !== undefined && hisData.impPrice !== null ? hisData.impPrice : null,
        impVatRatio: hisData.impVatRatio !== undefined && hisData.impVatRatio !== null ? hisData.impVatRatio : null,
        price: hisData.price !== undefined && hisData.price !== null ? hisData.price : null,
        vatRatio: hisData.vatRatio !== undefined && hisData.vatRatio !== null ? hisData.vatRatio : null,
        virPrice: hisData.virPrice !== undefined && hisData.virPrice !== null ? hisData.virPrice : null,
        taxRatio: hisData.taxRatio !== undefined && hisData.taxRatio !== null ? hisData.taxRatio : null,
        bidId: hisData.bidId !== undefined && hisData.bidId !== null ? hisData.bidId : null,
        packageNumber: hisData.packageNumber || null,
        expiredDate: hisData.expiredDate !== undefined && hisData.expiredDate !== null ? hisData.expiredDate : null,
        tdlBidGroupCode: hisData.tdlBidGroupCode || null,
        tdlBidPackageCode: hisData.tdlBidPackageCode || null,
        bidNumber: hisData.bidNumber || null,
        bidName: hisData.bidName || null,
        medicineTypeId: hisData.medicineTypeId !== undefined && hisData.medicineTypeId !== null ? hisData.medicineTypeId : null,
        medicineTypeCode: hisData.medicineTypeCode || null,
        medicineTypeName: hisData.medicineTypeName || null,
        impTime: hisData.impTime !== undefined && hisData.impTime !== null ? hisData.impTime : null,
        supplierId: hisData.supplierId !== undefined && hisData.supplierId !== null ? hisData.supplierId : null,
        supplierCode: hisData.supplierCode || null,
        supplierName: hisData.supplierName || null,
        medicineBytNumOrder: hisData.medicineBytNumOrder || null,
        medicineRegisterNumber: hisData.medicineRegisterNumber || null,
        activeIngrBhytCode: hisData.activeIngrBhytCode || null,
        activeIngrBhytName: hisData.activeIngrBhytName || null,
        concentra: hisData.concentra || null,
        materialNumOrder: hisData.materialNumOrder !== undefined && hisData.materialNumOrder !== null ? hisData.materialNumOrder : null,
        serviceId: hisData.serviceId !== undefined && hisData.serviceId !== null ? hisData.serviceId : null,
        nationalName: hisData.nationalName || null,
        manufacturerId: hisData.manufacturerId !== undefined && hisData.manufacturerId !== null ? hisData.manufacturerId : null,
        manufacturerCode: hisData.manufacturerCode || null,
        manufacturerName: hisData.manufacturerName || null,
        bytNumOrder: hisData.bytNumOrder || null,
        registerNumber: hisData.registerNumber || null,
        medicineGroupId: hisData.medicineGroupId !== undefined && hisData.medicineGroupId !== null ? hisData.medicineGroupId : null,
        medicineGroupCode: hisData.medicineGroupCode || null,
        medicineGroupName: hisData.medicineGroupName || null,
        medicineGroupNumOrder: hisData.medicineGroupNumOrder !== undefined && hisData.medicineGroupNumOrder !== null ? hisData.medicineGroupNumOrder : null,
        serviceUnitId: hisData.serviceUnitId !== undefined && hisData.serviceUnitId !== null ? hisData.serviceUnitId : null,
        serviceUnitCode: hisData.serviceUnitCode || null,
        serviceUnitName: hisData.serviceUnitName || null,
        medicineNumOrder: hisData.medicineNumOrder !== undefined && hisData.medicineNumOrder !== null ? hisData.medicineNumOrder : null,
        medicineUseFormId: hisData.medicineUseFormId !== undefined && hisData.medicineUseFormId !== null ? hisData.medicineUseFormId : null,
        medicineUseFormCode: hisData.medicineUseFormCode || null,
        medicineUseFormName: hisData.medicineUseFormName || null,
        medicineUseFormNumOrder: hisData.medicineUseFormNumOrder !== undefined && hisData.medicineUseFormNumOrder !== null ? hisData.medicineUseFormNumOrder : null,
        sumInStock: hisData.sumInStock !== undefined && hisData.sumInStock !== null ? hisData.sumInStock : null,
        sumByMedicineInStock: hisData.sumByMedicineInStock !== undefined && hisData.sumByMedicineInStock !== null ? hisData.sumByMedicineInStock : null,
        mediStockCode: hisData.mediStockCode || null,
        mediStockName: hisData.mediStockName || null,
        numOrder: hisData.numOrder !== undefined && hisData.numOrder !== null ? hisData.numOrder : null,
        presAmount: hisData.presAmount !== undefined && hisData.presAmount !== null ? hisData.presAmount : null,
        patientTypeId: hisData.patientTypeId !== undefined && hisData.patientTypeId !== null ? hisData.patientTypeId : null,
        patientTypeCode: hisData.patientTypeCode || null,
        patientTypeName: hisData.patientTypeName || null,
        tdlPatientId: hisData.tdlPatientId !== undefined && hisData.tdlPatientId !== null ? hisData.tdlPatientId : null,
        tdlTreatmentId: hisData.tdlTreatmentId !== undefined && hisData.tdlTreatmentId !== null ? hisData.tdlTreatmentId : null,
        tdlServiceReqId: hisData.tdlServiceReqId !== undefined && hisData.tdlServiceReqId !== null ? hisData.tdlServiceReqId : null,
        useTimeTo: hisData.useTimeTo !== undefined && hisData.useTimeTo !== null ? hisData.useTimeTo : null,
        tutorial: hisData.tutorial || null,
        tdlIntructionTime: hisData.tdlIntructionTime !== undefined && hisData.tdlIntructionTime !== null ? hisData.tdlIntructionTime : null,
        tdlIntructionDate: hisData.tdlIntructionDate !== undefined && hisData.tdlIntructionDate !== null ? hisData.tdlIntructionDate : null,
        htuText: hisData.htuText || null,
        morning: hisData.morning || null,
        evening: hisData.evening || null,
        expMestTypeId: hisData.expMestTypeId !== undefined && hisData.expMestTypeId !== null ? hisData.expMestTypeId : null,
        tdlAggrExpMestId: hisData.tdlAggrExpMestId !== undefined && hisData.tdlAggrExpMestId !== null ? hisData.tdlAggrExpMestId : null,
        aggrExpMestId: hisData.aggrExpMestId !== undefined && hisData.aggrExpMestId !== null ? hisData.aggrExpMestId : null,
        reqRoomId: hisData.reqRoomId !== undefined && hisData.reqRoomId !== null ? hisData.reqRoomId : null,
        reqDepartmentId: hisData.reqDepartmentId !== undefined && hisData.reqDepartmentId !== null ? hisData.reqDepartmentId : null,
        reqUserTitle: hisData.reqUserTitle || null,
        reqLoginname: hisData.reqLoginname || null,
        reqUsername: hisData.reqUsername || null,
        medicineLineId: hisData.medicineLineId !== undefined && hisData.medicineLineId !== null ? hisData.medicineLineId : null,
        createdBy: userId,
      };

      console.log('=== [DEBUG] ExpMestOtherMedicineService#syncFromIntegrationApi.step2: Save to DB ===');
      console.log('syncDto.hisId:', syncDto.hisId);
      console.log('syncDto.expMestId:', syncDto.expMestId);
      if (existing) {
        console.log('Updating existing record, id:', existing.id);
        const updateDto: UpdateExpMestOtherMedicineDto = {
          ...syncDto,
          updatedBy: userId,
        };
        const result = await this.repository.update(existing.id, updateDto);
        console.log('=== [DEBUG] ExpMestOtherMedicineService#syncFromIntegrationApi.step2.result (update) ===');
        console.log('result.id:', result?.id);
        return result;
      } else {
        console.log('Creating new record');
        const result = await this.repository.create(syncDto);
        console.log('=== [DEBUG] ExpMestOtherMedicineService#syncFromIntegrationApi.step2.result (create) ===');
        console.log('result.id:', result?.id);
        return result;
      }
    } catch (error: any) {
      console.error('=== [DEBUG] ExpMestOtherMedicineService#syncFromIntegrationApi.error ===');
      console.error('Error type:', error?.constructor?.name);
      console.error('Error message:', error?.message);
      console.error('Error stack:', error?.stack);
      this.logger.error('ExpMestOtherMedicineService#syncFromIntegrationApi.error', {
        error: error.message,
        stack: error.stack,
        code: error.code,
      });
      throw error;
    }
  }

  async updateExportFieldsByHisIds(
    hisIds: number[],
    exportTime: number | null,
    userId: string,
  ): Promise<number> {
    this.logger.info('ExpMestOtherMedicineService#updateExportFieldsByHisIds.call', {
      count: hisIds.length,
      exportTime,
      userId,
    });

    let updatedCount = 0;

    // Find medicines by HIS IDs
    const medicines = await this.repository.findByHisIds(hisIds);
    if (!medicines || medicines.length === 0) {
      return 0;
    }

    // Update each medicine
    for (const medicine of medicines) {
      try {
        const updateDto: UpdateExpMestOtherMedicineDto = {
          isExport: 1,
          exportAmount: medicine.amount, // Default to amount
          exportTime: exportTime || undefined,
          exportByUser: userId,
          updatedBy: userId,
        };

        await this.repository.update(medicine.id, updateDto);
        updatedCount++;
      } catch (error: any) {
        this.logger.error('ExpMestOtherMedicineService#updateExportFieldsByHisIds.error', {
          id: medicine.id,
          hisId: medicine.hisId,
          error: error.message,
        });
      }
    }

    return updatedCount;
  }

  async updateActualExportFieldsByHisIds(
    hisIds: number[],
    actualExportTime: number | null,
    userId: string,
  ): Promise<number> {
    this.logger.info('ExpMestOtherMedicineService#updateActualExportFieldsByHisIds.call', {
      count: hisIds.length,
      actualExportTime,
      userId,
    });

    let updatedCount = 0;

    // Find medicines by HIS IDs
    const medicines = await this.repository.findByHisIds(hisIds);
    if (!medicines || medicines.length === 0) {
      return 0;
    }

    // Update each medicine
    for (const medicine of medicines) {
      try {
        const updateDto: UpdateExpMestOtherMedicineDto = {
          actualExportAmount: medicine.amount, // Default to amount
          actualExportTime: actualExportTime || undefined,
          actualExportByUser: userId,
          updatedBy: userId,
        };

        await this.repository.update(medicine.id, updateDto);
        updatedCount++;
      } catch (error: any) {
        this.logger.error('ExpMestOtherMedicineService#updateActualExportFieldsByHisIds.error', {
          id: medicine.id,
          hisId: medicine.hisId,
          error: error.message,
        });
      }
    }

    return updatedCount;
  }

}
