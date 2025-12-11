import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { FindManyOptions, EntityManager } from 'typeorm';
import { InpatientExpMestMedicineRepository } from '../repositories/inpatient-exp-mest-medicine.repository';
import { InpatientExpMestMedicine } from '../entities/inpatient-exp-mest-medicine.entity';
import { CreateInpatientExpMestMedicineDto } from '../dto/create-inpatient-exp-mest-medicine.dto';
import { UpdateInpatientExpMestMedicineDto } from '../dto/update-inpatient-exp-mest-medicine.dto';
import { BatchUpdateExportFieldsDto } from '../dto/batch-update-export-fields.dto';
import { BatchUpdateActualExportFieldsDto } from '../dto/batch-update-actual-export-fields.dto';

@Injectable()
export class InpatientExpMestMedicineService {
  constructor(
    private readonly repository: InpatientExpMestMedicineRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(InpatientExpMestMedicineService.name);
  }

  async findAll(options?: FindManyOptions<InpatientExpMestMedicine>): Promise<InpatientExpMestMedicine[]> {
    this.logger.info('InpatientExpMestMedicineService#findAll.call', options);
    return this.repository.findAll(options);
  }

  async findById(id: string): Promise<InpatientExpMestMedicine | null> {
    this.logger.info('InpatientExpMestMedicineService#findById.call', { id });
    return this.repository.findById(id);
  }

  async findByHisId(hisId: number): Promise<InpatientExpMestMedicine | null> {
    this.logger.info('InpatientExpMestMedicineService#findByHisId.call', { hisId });
    return this.repository.findByHisId(hisId);
  }

  async findByInpatientExpMestId(inpatientExpMestId: number): Promise<InpatientExpMestMedicine[]> {
    this.logger.info('InpatientExpMestMedicineService#findByInpatientExpMestId.call', { inpatientExpMestId });
    return this.repository.findByInpatientExpMestId(inpatientExpMestId);
  }

  async create(dto: CreateInpatientExpMestMedicineDto): Promise<InpatientExpMestMedicine> {
    this.logger.info('InpatientExpMestMedicineService#create.call', { hisId: dto.hisId });
    return this.repository.create(dto);
  }

  async update(id: string, dto: UpdateInpatientExpMestMedicineDto): Promise<InpatientExpMestMedicine> {
    this.logger.info('InpatientExpMestMedicineService#update.call', { id });
    return this.repository.update(id, dto);
  }

  async count(options?: FindManyOptions<InpatientExpMestMedicine>): Promise<number> {
    this.logger.info('InpatientExpMestMedicineService#count.call', options);
    return this.repository.count(options);
  }

  /**
   * Sync từ Integration API vào local inventory
   */
  async syncFromIntegrationApi(
    hisData: any,
    inpatientExpMestId: number,
    inpatientExpMestLocalId: string | null,

    userId: string,
    entityManager?: EntityManager,
  ): Promise<InpatientExpMestMedicine> {
    this.logger.info('InpatientExpMestMedicineService#syncFromIntegrationApi.call', {
      hisId: hisData.id,
      inpatientExpMestId,
      userId,
    });

    try {
      // Check if exists
      const existing = await this.repository.findByHisId(hisData.id, entityManager);
      const syncDto: CreateInpatientExpMestMedicineDto = {
        hisId: hisData.id,
        inpatientExpMestId,
        inpatientExpMestLocalId,
        medicineId: hisData.medicineId !== undefined && hisData.medicineId !== null ? hisData.medicineId : null,
        tdlMediStockId: hisData.tdlMediStockId !== undefined && hisData.tdlMediStockId !== null ? hisData.tdlMediStockId : null,
        tdlMedicineTypeId: hisData.tdlMedicineTypeId !== undefined && hisData.tdlMedicineTypeId !== null ? hisData.tdlMedicineTypeId : null,
        expMestMetyReqId: hisData.expMestMetyReqId !== undefined && hisData.expMestMetyReqId !== null ? hisData.expMestMetyReqId : null,
        ckImpMestMedicineId: hisData.ckImpMestMedicineId !== undefined && hisData.ckImpMestMedicineId !== null ? hisData.ckImpMestMedicineId : null,
        isExport: hisData.isExport !== undefined && hisData.isExport !== null ? hisData.isExport : null,
        amount: hisData.amount !== undefined && hisData.amount !== null ? hisData.amount : null,
        exportAmount: hisData.exportAmount !== undefined && hisData.exportAmount !== null ? hisData.exportAmount : null,
        exportByUser: hisData.exportByUser || null,
        exportTime: hisData.exportTime !== undefined && hisData.exportTime !== null ? hisData.exportTime : null,
        approvalLoginname: hisData.approvalLoginname || null,
        approvalUsername: hisData.approvalUsername || null,
        approvalTime: hisData.approvalTime !== undefined && hisData.approvalTime !== null ? hisData.approvalTime : null,
        approvalDate: hisData.approvalDate !== undefined && hisData.approvalDate !== null ? hisData.approvalDate : null,
        expLoginname: hisData.expLoginname || null,
        expUsername: hisData.expUsername || null,
        expTime: hisData.expTime !== undefined && hisData.expTime !== null ? hisData.expTime : null,
        expDate: hisData.expDate !== undefined && hisData.expDate !== null ? hisData.expDate : null,
        expMestCode: hisData.expMestCode || null,
        mediStockId: hisData.mediStockId !== undefined && hisData.mediStockId !== null ? hisData.mediStockId : null,
        expMestSttId: hisData.expMestSttId !== undefined && hisData.expMestSttId !== null ? hisData.expMestSttId : null,
        impPrice: hisData.impPrice !== undefined && hisData.impPrice !== null ? hisData.impPrice : null,
        impVatRatio: hisData.impVatRatio !== undefined && hisData.impVatRatio !== null ? hisData.impVatRatio : null,
        bidId: hisData.bidId !== undefined && hisData.bidId !== null ? hisData.bidId : null,
        packageNumber: hisData.packageNumber || null,
        expiredDate: hisData.expiredDate !== undefined && hisData.expiredDate !== null ? hisData.expiredDate : null,
        medicineTypeId: hisData.medicineTypeId !== undefined && hisData.medicineTypeId !== null ? hisData.medicineTypeId : null,
        medicineTypeCode: hisData.medicineTypeCode || null,
        medicineTypeName: hisData.medicineTypeName || null,
        impTime: hisData.impTime !== undefined && hisData.impTime !== null ? hisData.impTime : null,
        supplierId: hisData.supplierId !== undefined && hisData.supplierId !== null ? hisData.supplierId : null,
        medicineBytNumOrder: hisData.medicineBytNumOrder || null,
        medicineRegisterNumber: hisData.medicineRegisterNumber || null,
        activeIngrBhytCode: hisData.activeIngrBhytCode || null,
        activeIngrBhytName: hisData.activeIngrBhytName || null,
        concentra: hisData.concentra || null,
        tdlBidGroupCode: hisData.tdlBidGroupCode || null,
        tdlBidPackageCode: hisData.tdlBidPackageCode || null,
        serviceId: hisData.serviceId !== undefined && hisData.serviceId !== null ? hisData.serviceId : null,
        nationalName: hisData.nationalName || null,
        manufacturerId: hisData.manufacturerId !== undefined && hisData.manufacturerId !== null ? hisData.manufacturerId : null,
        bytNumOrder: hisData.bytNumOrder || null,
        registerNumber: hisData.registerNumber || null,
        medicineGroupId: hisData.medicineGroupId !== undefined && hisData.medicineGroupId !== null ? hisData.medicineGroupId : null,
        serviceUnitId: hisData.serviceUnitId !== undefined && hisData.serviceUnitId !== null ? hisData.serviceUnitId : null,
        serviceUnitCode: hisData.serviceUnitCode || null,
        serviceUnitName: hisData.serviceUnitName || null,
        medicineNumOrder: hisData.medicineNumOrder !== undefined && hisData.medicineNumOrder !== null ? hisData.medicineNumOrder : null,
        supplierCode: hisData.supplierCode || null,
        supplierName: hisData.supplierName || null,
        bidNumber: hisData.bidNumber || null,
        bidName: hisData.bidName || null,
        medicineUseFormCode: hisData.medicineUseFormCode || null,
        medicineUseFormName: hisData.medicineUseFormName || null,
        medicineUseFormNumOrder: hisData.medicineUseFormNumOrder !== undefined && hisData.medicineUseFormNumOrder !== null ? hisData.medicineUseFormNumOrder : null,
        sumInStock: hisData.sumInStock !== undefined && hisData.sumInStock !== null ? hisData.sumInStock : null,
        sumByMedicineInStock: hisData.sumByMedicineInStock !== undefined && hisData.sumByMedicineInStock !== null ? hisData.sumByMedicineInStock : null,
        // Price & Tax Info (Additional)
        price: hisData.price !== undefined && hisData.price !== null ? hisData.price : null,
        vatRatio: hisData.vatRatio !== undefined && hisData.vatRatio !== null ? hisData.vatRatio : null,
        virPrice: hisData.virPrice !== undefined && hisData.virPrice !== null ? hisData.virPrice : null,
        taxRatio: hisData.taxRatio !== undefined && hisData.taxRatio !== null ? hisData.taxRatio : null,
        // Order & Amount Info
        numOrder: hisData.numOrder !== undefined && hisData.numOrder !== null ? hisData.numOrder : null,
        presAmount: hisData.presAmount !== undefined && hisData.presAmount !== null ? hisData.presAmount : null,
        // Patient & Treatment Info
        patientTypeId: hisData.patientTypeId !== undefined && hisData.patientTypeId !== null ? hisData.patientTypeId : null,
        patientTypeCode: hisData.patientTypeCode || null,
        patientTypeName: hisData.patientTypeName || null,
        tdlPatientId: hisData.tdlPatientId !== undefined && hisData.tdlPatientId !== null ? hisData.tdlPatientId : null,
        tdlTreatmentId: hisData.tdlTreatmentId !== undefined && hisData.tdlTreatmentId !== null ? hisData.tdlTreatmentId : null,
        tdlServiceReqId: hisData.tdlServiceReqId !== undefined && hisData.tdlServiceReqId !== null ? hisData.tdlServiceReqId : null,
        // Instruction & Tutorial
        useTimeTo: hisData.useTimeTo !== undefined && hisData.useTimeTo !== null ? hisData.useTimeTo : null,
        tutorial: hisData.tutorial || null,
        tdlIntructionTime: hisData.tdlIntructionTime !== undefined && hisData.tdlIntructionTime !== null ? hisData.tdlIntructionTime : null,
        tdlIntructionDate: hisData.tdlIntructionDate !== undefined && hisData.tdlIntructionDate !== null ? hisData.tdlIntructionDate : null,
        htuText: hisData.htuText || null,
        // Dosage Info
        morning: hisData.morning || null,
        evening: hisData.evening || null,
        // ExpMest Denormalized Info (Additional)
        expMestTypeId: hisData.expMestTypeId !== undefined && hisData.expMestTypeId !== null ? hisData.expMestTypeId : null,
        tdlAggrExpMestId: hisData.tdlAggrExpMestId !== undefined && hisData.tdlAggrExpMestId !== null ? hisData.tdlAggrExpMestId : null,
        aggrExpMestId: hisData.aggrExpMestId !== undefined && hisData.aggrExpMestId !== null ? hisData.aggrExpMestId : null,
        reqRoomId: hisData.reqRoomId !== undefined && hisData.reqRoomId !== null ? hisData.reqRoomId : null,
        reqDepartmentId: hisData.reqDepartmentId !== undefined && hisData.reqDepartmentId !== null ? hisData.reqDepartmentId : null,
        reqUserTitle: hisData.reqUserTitle || null,
        reqLoginname: hisData.reqLoginname || null,
        reqUsername: hisData.reqUsername || null,
        // Medicine Group & Use Form (Additional)
        medicineUseFormId: hisData.medicineUseFormId !== undefined && hisData.medicineUseFormId !== null ? hisData.medicineUseFormId : null,
        medicineLineId: hisData.medicineLineId !== undefined && hisData.medicineLineId !== null ? hisData.medicineLineId : null,
        medicineGroupCode: hisData.medicineGroupCode || null,
        medicineGroupName: hisData.medicineGroupName || null,
        medicineGroupNumOrder: hisData.medicineGroupNumOrder !== undefined && hisData.medicineGroupNumOrder !== null ? hisData.medicineGroupNumOrder : null,
        // Manufacturer & Stock Info (Additional)
        manufacturerCode: hisData.manufacturerCode || null,
        manufacturerName: hisData.manufacturerName || null,
        mediStockCode: hisData.mediStockCode || null,
        mediStockName: hisData.mediStockName || null,
        createdBy: userId,
      };

      if (existing) {
        console.log(`[Medicine] Updating: ID=${existing.id}, HIS_ID=${hisData.id}`);
        const updateDto: UpdateInpatientExpMestMedicineDto = {
          ...syncDto,
          updatedBy: userId,
        };
        const result = await this.repository.update(existing.id, updateDto, entityManager);
        return result;
      } else {
        console.log(`[Medicine] Creating: HIS_ID=${hisData.id}`);
        const result = await this.repository.create(syncDto, entityManager);
        return result;
      }
    } catch (error: any) {
      this.logger.error('InpatientExpMestMedicineService#syncFromIntegrationApi.error', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  /**
   * Batch update export fields by HIS IDs
   * Sets exportAmount = amount (from database), exportByUser (from token), and exportTime
   */
  async updateExportFieldsByHisIds(
    dto: BatchUpdateExportFieldsDto,
    userId: string,
  ): Promise<{ updatedCount: number; hisIds: number[] }> {
    this.logger.info('InpatientExpMestMedicineService#updateExportFieldsByHisIds.call', {
      hisIdsCount: dto.hisIds.length,
      exportTime: dto.exportTime,
      userId,
    });

    try {
      const updatedCount = await this.repository.updateExportFieldsByHisIds(
        dto.hisIds,
        dto,
        userId,
      );

      return { updatedCount, hisIds: dto.hisIds };
    } catch (error: any) {
      this.logger.error('InpatientExpMestMedicineService#updateExportFieldsByHisIds.error', {
        error: error?.message,
        stack: error?.stack,
      });
      // Re-throw error with clear message for gRPC
      throw new Error(error?.message || 'Failed to update export fields');
    }
  }

  /**
   * Batch update actual export fields by HIS IDs
   * Sets actualExportAmount = amount (from database), actualExportByUser (from token), and actualExportTime
   */
  async updateActualExportFieldsByHisIds(
    dto: BatchUpdateActualExportFieldsDto,
    userId: string,
  ): Promise<{ updatedCount: number; hisIds: number[] }> {
    this.logger.info('InpatientExpMestMedicineService#updateActualExportFieldsByHisIds.call', {
      hisIdsCount: dto.hisIds.length,
      actualExportTime: dto.actualExportTime,
      userId,
    });

    try {
      const updatedCount = await this.repository.updateActualExportFieldsByHisIds(
        dto.hisIds,
        dto,
        userId,
      );

      return { updatedCount, hisIds: dto.hisIds };
    } catch (error: any) {
      this.logger.error('InpatientExpMestMedicineService#updateActualExportFieldsByHisIds.error', {
        error: error?.message,
        stack: error?.stack,
      });
      throw error;
    }
  }
}

