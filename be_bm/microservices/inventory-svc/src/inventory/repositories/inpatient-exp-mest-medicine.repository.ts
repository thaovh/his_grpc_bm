import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions, In, EntityManager } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

import { InpatientExpMestMedicine } from '../entities/inpatient-exp-mest-medicine.entity';
import { CreateInpatientExpMestMedicineDto } from '../dto/create-inpatient-exp-mest-medicine.dto';
import { UpdateInpatientExpMestMedicineDto } from '../dto/update-inpatient-exp-mest-medicine.dto';
import { BatchUpdateExportFieldsDto } from '../dto/batch-update-export-fields.dto';
import { BatchUpdateActualExportFieldsDto } from '../dto/batch-update-actual-export-fields.dto';
import { InpatientExpMestChildRepository } from './inpatient-exp-mest-child.repository';
import { InpatientExpMestRepository } from './inpatient-exp-mest.repository';

@Injectable()
export class InpatientExpMestMedicineRepository {
  constructor(
    @InjectRepository(InpatientExpMestMedicine)
    private readonly repository: Repository<InpatientExpMestMedicine>,
    @Inject(forwardRef(() => InpatientExpMestChildRepository))
    private readonly childRepository: InpatientExpMestChildRepository,
    @Inject(forwardRef(() => InpatientExpMestRepository))
    private readonly parentRepository: InpatientExpMestRepository,
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(InpatientExpMestMedicineRepository.name);
  }

  async findAll(options?: FindManyOptions<InpatientExpMestMedicine>): Promise<InpatientExpMestMedicine[]> {
    this.logger.info('InpatientExpMestMedicineRepository#findAll.call', options);
    const result = await this.repository.find(options);
    this.logger.info('InpatientExpMestMedicineRepository#findAll.result', { count: result.length });
    // Convert Long objects to numbers for Oracle compatibility
    result.forEach(medicine => this.convertLongToNumber(medicine));
    return result;
  }

  async findOne(options?: FindOneOptions<InpatientExpMestMedicine>): Promise<InpatientExpMestMedicine | null> {
    this.logger.info('InpatientExpMestMedicineRepository#findOne.call', options);
    const result = await this.repository.findOne(options);
    if (result) {
      this.convertLongToNumber(result);
    }
    this.logger.info('InpatientExpMestMedicineRepository#findOne.result', { found: !!result });
    return result;
  }

  async findById(id: string, entityManager?: EntityManager): Promise<InpatientExpMestMedicine | null> {
    this.logger.info('InpatientExpMestMedicineRepository#findById.call', { id });
    const repo = entityManager ? entityManager.getRepository(InpatientExpMestMedicine) : this.repository;
    const result = await repo.findOne({ where: { id } });
    if (result) {
      this.convertLongToNumber(result);
    }
    this.logger.info('InpatientExpMestMedicineRepository#findById.result', { found: !!result });
    return result;
  }

  async findByHisId(hisId: number, entityManager?: EntityManager): Promise<InpatientExpMestMedicine | null> {
    this.logger.info('InpatientExpMestMedicineRepository#findByHisId.call', { hisId });
    const repo = entityManager ? entityManager.getRepository(InpatientExpMestMedicine) : this.repository;
    const result = await repo.findOne({ where: { hisId } });
    if (result) {
      this.convertLongToNumber(result);
    }
    this.logger.info('InpatientExpMestMedicineRepository#findByHisId.result', { found: !!result });
    return result;
  }

  async findByInpatientExpMestId(inpatientExpMestId: number): Promise<InpatientExpMestMedicine[]> {
    this.logger.info('InpatientExpMestMedicineRepository#findByInpatientExpMestId.call', { inpatientExpMestId });
    const result = await this.repository.find({ where: { inpatientExpMestId } });
    this.logger.info('InpatientExpMestMedicineRepository#findByInpatientExpMestId.result', { count: result.length });
    // Convert Long objects to numbers for Oracle compatibility
    result.forEach(medicine => this.convertLongToNumber(medicine));
    return result;
  }

  async count(options?: FindManyOptions<InpatientExpMestMedicine>): Promise<number> {
    this.logger.info('InpatientExpMestMedicineRepository#count.call', options);
    const result = await this.repository.count(options);
    this.logger.info('InpatientExpMestMedicineRepository#count.result', { count: result });
    return result;
  }

  async create(medicineDto: CreateInpatientExpMestMedicineDto, entityManager?: EntityManager): Promise<InpatientExpMestMedicine> {
    this.logger.info('InpatientExpMestMedicineRepository#create.call', {
      hisId: medicineDto.hisId,
      inpatientExpMestId: medicineDto.inpatientExpMestId,
      createdBy: medicineDto.createdBy
    });

    // Generate UUID manually for Oracle compatibility
    const { randomUUID } = require('crypto');
    const id = randomUUID();
    const now = new Date();

    // Create entity - explicitly set ALL fields (including nullable) to avoid DEFAULT values
    const medicineData: any = {
      id,
      hisId: this.convertToNumber(medicineDto.hisId),
      inpatientExpMestId: this.convertToNumber(medicineDto.inpatientExpMestId),
      inpatientExpMestLocalId: medicineDto.inpatientExpMestLocalId ?? null,
      medicineId: this.convertToNumber(medicineDto.medicineId),
      tdlMediStockId: this.convertToNumber(medicineDto.tdlMediStockId),
      tdlMedicineTypeId: this.convertToNumber(medicineDto.tdlMedicineTypeId),
      expMestMetyReqId: this.convertToNumber(medicineDto.expMestMetyReqId),
      ckImpMestMedicineId: this.convertToNumber(medicineDto.ckImpMestMedicineId),
      isExport: this.convertToNumber(medicineDto.isExport),
      amount: this.convertToNumber(medicineDto.amount),
      exportAmount: this.convertToNumber(medicineDto.exportAmount),
      exportByUser: medicineDto.exportByUser ?? null,
      exportTime: this.convertToNumber(medicineDto.exportTime),
      approvalLoginname: medicineDto.approvalLoginname ?? null,
      approvalUsername: medicineDto.approvalUsername ?? null,
      approvalTime: this.convertToNumber(medicineDto.approvalTime),
      approvalDate: this.convertToNumber(medicineDto.approvalDate),
      expLoginname: medicineDto.expLoginname ?? null,
      expUsername: medicineDto.expUsername ?? null,
      expTime: this.convertToNumber(medicineDto.expTime),
      expDate: this.convertToNumber(medicineDto.expDate),
      expMestCode: medicineDto.expMestCode ?? null,
      mediStockId: this.convertToNumber(medicineDto.mediStockId),
      expMestSttId: this.convertToNumber(medicineDto.expMestSttId),
      impPrice: this.convertToNumber(medicineDto.impPrice),
      impVatRatio: this.convertToNumber(medicineDto.impVatRatio),
      bidId: this.convertToNumber(medicineDto.bidId),
      packageNumber: medicineDto.packageNumber ?? null,
      expiredDate: this.convertToNumber(medicineDto.expiredDate),
      medicineTypeId: this.convertToNumber(medicineDto.medicineTypeId),
      medicineTypeCode: medicineDto.medicineTypeCode ?? null,
      medicineTypeName: medicineDto.medicineTypeName ?? null,
      impTime: this.convertToNumber(medicineDto.impTime),
      supplierId: this.convertToNumber(medicineDto.supplierId),
      medicineBytNumOrder: medicineDto.medicineBytNumOrder ?? null,
      medicineRegisterNumber: medicineDto.medicineRegisterNumber ?? null,
      activeIngrBhytCode: medicineDto.activeIngrBhytCode ?? null,
      activeIngrBhytName: medicineDto.activeIngrBhytName ?? null,
      concentra: medicineDto.concentra ?? null,
      tdlBidGroupCode: medicineDto.tdlBidGroupCode ?? null,
      tdlBidPackageCode: medicineDto.tdlBidPackageCode ?? null,
      serviceId: this.convertToNumber(medicineDto.serviceId),
      nationalName: medicineDto.nationalName ?? null,
      manufacturerId: this.convertToNumber(medicineDto.manufacturerId),
      bytNumOrder: medicineDto.bytNumOrder ?? null,
      registerNumber: medicineDto.registerNumber ?? null,
      medicineGroupId: this.convertToNumber(medicineDto.medicineGroupId),
      serviceUnitId: this.convertToNumber(medicineDto.serviceUnitId),
      serviceUnitCode: medicineDto.serviceUnitCode ?? null,
      serviceUnitName: medicineDto.serviceUnitName ?? null,
      medicineNumOrder: this.convertToNumber(medicineDto.medicineNumOrder),
      supplierCode: medicineDto.supplierCode ?? null,
      supplierName: medicineDto.supplierName ?? null,
      bidNumber: medicineDto.bidNumber ?? null,
      bidName: medicineDto.bidName ?? null,
      medicineUseFormCode: medicineDto.medicineUseFormCode ?? null,
      medicineUseFormName: medicineDto.medicineUseFormName ?? null,
      medicineUseFormNumOrder: this.convertToNumber(medicineDto.medicineUseFormNumOrder),
      sumInStock: this.convertToNumber(medicineDto.sumInStock),
      sumByMedicineInStock: this.convertToNumber(medicineDto.sumByMedicineInStock),
      // Price & Tax Info (Additional)
      price: this.convertToNumber(medicineDto.price),
      vatRatio: this.convertToNumber(medicineDto.vatRatio),
      virPrice: this.convertToNumber(medicineDto.virPrice),
      taxRatio: this.convertToNumber(medicineDto.taxRatio),
      // Order & Amount Info
      numOrder: this.convertToNumber(medicineDto.numOrder),
      presAmount: this.convertToNumber(medicineDto.presAmount),
      // Patient & Treatment Info
      patientTypeId: this.convertToNumber(medicineDto.patientTypeId),
      patientTypeCode: medicineDto.patientTypeCode ?? null,
      patientTypeName: medicineDto.patientTypeName ?? null,
      tdlPatientId: this.convertToNumber(medicineDto.tdlPatientId),
      tdlTreatmentId: this.convertToNumber(medicineDto.tdlTreatmentId),
      tdlServiceReqId: this.convertToNumber(medicineDto.tdlServiceReqId),
      // Instruction & Tutorial
      useTimeTo: this.convertToNumber(medicineDto.useTimeTo),
      tutorial: medicineDto.tutorial ?? null,
      tdlIntructionTime: this.convertToNumber(medicineDto.tdlIntructionTime),
      tdlIntructionDate: this.convertToNumber(medicineDto.tdlIntructionDate),
      htuText: medicineDto.htuText ?? null,
      // Dosage Info
      morning: medicineDto.morning ?? null,
      evening: medicineDto.evening ?? null,
      // ExpMest Denormalized Info (Additional)
      expMestTypeId: this.convertToNumber(medicineDto.expMestTypeId),
      tdlAggrExpMestId: this.convertToNumber(medicineDto.tdlAggrExpMestId),
      aggrExpMestId: this.convertToNumber(medicineDto.aggrExpMestId),
      reqRoomId: this.convertToNumber(medicineDto.reqRoomId),
      reqDepartmentId: this.convertToNumber(medicineDto.reqDepartmentId),
      reqUserTitle: medicineDto.reqUserTitle ?? null,
      reqLoginname: medicineDto.reqLoginname ?? null,
      reqUsername: medicineDto.reqUsername ?? null,
      // Medicine Group & Use Form (Additional)
      medicineUseFormId: this.convertToNumber(medicineDto.medicineUseFormId),
      medicineLineId: this.convertToNumber(medicineDto.medicineLineId),
      medicineGroupCode: medicineDto.medicineGroupCode ?? null,
      medicineGroupName: medicineDto.medicineGroupName ?? null,
      medicineGroupNumOrder: this.convertToNumber(medicineDto.medicineGroupNumOrder),
      // Manufacturer & Stock Info (Additional)
      manufacturerCode: medicineDto.manufacturerCode ?? null,
      manufacturerName: medicineDto.manufacturerName ?? null,
      mediStockCode: medicineDto.mediStockCode ?? null,
      mediStockName: medicineDto.mediStockName ?? null,
      isActive: 1,
      version: 1,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      createdBy: medicineDto.createdBy ?? null,
      updatedBy: medicineDto.createdBy ?? null, // Also set on create
    };

    const repo = entityManager ? entityManager.getRepository(InpatientExpMestMedicine) : this.repository;
    const medicine = repo.create(medicineData);
    await repo.save(medicine);

    // Fetch the saved entity to ensure all fields are properly loaded
    const savedMedicine = await repo.findOne({
      where: { id }
    });

    if (!savedMedicine) {
      throw new Error('Failed to fetch created InpatientExpMestMedicine');
    }

    this.convertLongToNumber(savedMedicine);
    this.logger.info('InpatientExpMestMedicineRepository#create.result', { id: savedMedicine.id, hisId: savedMedicine.hisId });
    return savedMedicine;
  }

  async update(id: string, medicineDto: UpdateInpatientExpMestMedicineDto, entityManager?: EntityManager): Promise<InpatientExpMestMedicine> {
    this.logger.info('InpatientExpMestMedicineRepository#update.call', { id });

    const repo = entityManager ? entityManager.getRepository(InpatientExpMestMedicine) : this.repository;
    const medicine = await repo.findOne({ where: { id } });
    if (!medicine) {
      throw new Error(`InpatientExpMestMedicine with id ${id} not found`);
    }

    // Update fields
    if (medicineDto.inpatientExpMestId !== undefined) medicine.inpatientExpMestId = this.convertToNumber(medicineDto.inpatientExpMestId);
    if (medicineDto.inpatientExpMestLocalId !== undefined) medicine.inpatientExpMestLocalId = medicineDto.inpatientExpMestLocalId ?? null;
    if (medicineDto.medicineId !== undefined) medicine.medicineId = this.convertToNumber(medicineDto.medicineId);
    if (medicineDto.tdlMediStockId !== undefined) medicine.tdlMediStockId = this.convertToNumber(medicineDto.tdlMediStockId);
    if (medicineDto.tdlMedicineTypeId !== undefined) medicine.tdlMedicineTypeId = this.convertToNumber(medicineDto.tdlMedicineTypeId);
    if (medicineDto.expMestMetyReqId !== undefined) medicine.expMestMetyReqId = this.convertToNumber(medicineDto.expMestMetyReqId);
    if (medicineDto.ckImpMestMedicineId !== undefined) medicine.ckImpMestMedicineId = this.convertToNumber(medicineDto.ckImpMestMedicineId);
    if (medicineDto.isExport !== undefined) medicine.isExport = this.convertToNumber(medicineDto.isExport);
    if (medicineDto.amount !== undefined) medicine.amount = this.convertToNumber(medicineDto.amount);
    if (medicineDto.exportAmount !== undefined) medicine.exportAmount = this.convertToNumber(medicineDto.exportAmount);
    if (medicineDto.exportByUser !== undefined) medicine.exportByUser = medicineDto.exportByUser ?? null;
    if (medicineDto.exportTime !== undefined) medicine.exportTime = this.convertToNumber(medicineDto.exportTime);
    if (medicineDto.approvalLoginname !== undefined) medicine.approvalLoginname = medicineDto.approvalLoginname;
    if (medicineDto.approvalUsername !== undefined) medicine.approvalUsername = medicineDto.approvalUsername;
    if (medicineDto.approvalTime !== undefined) medicine.approvalTime = this.convertToNumber(medicineDto.approvalTime);
    if (medicineDto.approvalDate !== undefined) medicine.approvalDate = this.convertToNumber(medicineDto.approvalDate);
    if (medicineDto.expLoginname !== undefined) medicine.expLoginname = medicineDto.expLoginname;
    if (medicineDto.expUsername !== undefined) medicine.expUsername = medicineDto.expUsername;
    if (medicineDto.expTime !== undefined) medicine.expTime = this.convertToNumber(medicineDto.expTime);
    if (medicineDto.expDate !== undefined) medicine.expDate = this.convertToNumber(medicineDto.expDate);
    if (medicineDto.expMestCode !== undefined) medicine.expMestCode = medicineDto.expMestCode;
    if (medicineDto.mediStockId !== undefined) medicine.mediStockId = this.convertToNumber(medicineDto.mediStockId);
    if (medicineDto.expMestSttId !== undefined) medicine.expMestSttId = this.convertToNumber(medicineDto.expMestSttId);
    if (medicineDto.impPrice !== undefined) medicine.impPrice = this.convertToNumber(medicineDto.impPrice);
    if (medicineDto.impVatRatio !== undefined) medicine.impVatRatio = this.convertToNumber(medicineDto.impVatRatio);
    if (medicineDto.bidId !== undefined) medicine.bidId = this.convertToNumber(medicineDto.bidId);
    if (medicineDto.packageNumber !== undefined) medicine.packageNumber = medicineDto.packageNumber;
    if (medicineDto.expiredDate !== undefined) medicine.expiredDate = this.convertToNumber(medicineDto.expiredDate);
    if (medicineDto.medicineTypeId !== undefined) medicine.medicineTypeId = this.convertToNumber(medicineDto.medicineTypeId);
    if (medicineDto.medicineTypeCode !== undefined) medicine.medicineTypeCode = medicineDto.medicineTypeCode;
    if (medicineDto.medicineTypeName !== undefined) medicine.medicineTypeName = medicineDto.medicineTypeName;
    if (medicineDto.impTime !== undefined) medicine.impTime = this.convertToNumber(medicineDto.impTime);
    if (medicineDto.supplierId !== undefined) medicine.supplierId = this.convertToNumber(medicineDto.supplierId);
    if (medicineDto.medicineBytNumOrder !== undefined) medicine.medicineBytNumOrder = medicineDto.medicineBytNumOrder;
    if (medicineDto.medicineRegisterNumber !== undefined) medicine.medicineRegisterNumber = medicineDto.medicineRegisterNumber;
    if (medicineDto.activeIngrBhytCode !== undefined) medicine.activeIngrBhytCode = medicineDto.activeIngrBhytCode;
    if (medicineDto.activeIngrBhytName !== undefined) medicine.activeIngrBhytName = medicineDto.activeIngrBhytName;
    if (medicineDto.concentra !== undefined) medicine.concentra = medicineDto.concentra;
    if (medicineDto.tdlBidGroupCode !== undefined) medicine.tdlBidGroupCode = medicineDto.tdlBidGroupCode;
    if (medicineDto.tdlBidPackageCode !== undefined) medicine.tdlBidPackageCode = medicineDto.tdlBidPackageCode;
    if (medicineDto.serviceId !== undefined) medicine.serviceId = this.convertToNumber(medicineDto.serviceId);
    if (medicineDto.nationalName !== undefined) medicine.nationalName = medicineDto.nationalName;
    if (medicineDto.manufacturerId !== undefined) medicine.manufacturerId = this.convertToNumber(medicineDto.manufacturerId);
    if (medicineDto.bytNumOrder !== undefined) medicine.bytNumOrder = medicineDto.bytNumOrder;
    if (medicineDto.registerNumber !== undefined) medicine.registerNumber = medicineDto.registerNumber;
    if (medicineDto.medicineGroupId !== undefined) medicine.medicineGroupId = this.convertToNumber(medicineDto.medicineGroupId);
    if (medicineDto.serviceUnitId !== undefined) medicine.serviceUnitId = this.convertToNumber(medicineDto.serviceUnitId);
    if (medicineDto.serviceUnitCode !== undefined) medicine.serviceUnitCode = medicineDto.serviceUnitCode;
    if (medicineDto.serviceUnitName !== undefined) medicine.serviceUnitName = medicineDto.serviceUnitName;
    if (medicineDto.medicineNumOrder !== undefined) medicine.medicineNumOrder = this.convertToNumber(medicineDto.medicineNumOrder);
    if (medicineDto.supplierCode !== undefined) medicine.supplierCode = medicineDto.supplierCode;
    if (medicineDto.supplierName !== undefined) medicine.supplierName = medicineDto.supplierName;
    if (medicineDto.bidNumber !== undefined) medicine.bidNumber = medicineDto.bidNumber;
    if (medicineDto.bidName !== undefined) medicine.bidName = medicineDto.bidName;
    if (medicineDto.medicineUseFormCode !== undefined) medicine.medicineUseFormCode = medicineDto.medicineUseFormCode;
    if (medicineDto.medicineUseFormName !== undefined) medicine.medicineUseFormName = medicineDto.medicineUseFormName;
    if (medicineDto.medicineUseFormNumOrder !== undefined) medicine.medicineUseFormNumOrder = this.convertToNumber(medicineDto.medicineUseFormNumOrder);
    if (medicineDto.sumInStock !== undefined) medicine.sumInStock = this.convertToNumber(medicineDto.sumInStock);
    if (medicineDto.sumByMedicineInStock !== undefined) medicine.sumByMedicineInStock = this.convertToNumber(medicineDto.sumByMedicineInStock);
    // Price & Tax Info (Additional)
    if (medicineDto.price !== undefined) medicine.price = this.convertToNumber(medicineDto.price);
    if (medicineDto.vatRatio !== undefined) medicine.vatRatio = this.convertToNumber(medicineDto.vatRatio);
    if (medicineDto.virPrice !== undefined) medicine.virPrice = this.convertToNumber(medicineDto.virPrice);
    if (medicineDto.taxRatio !== undefined) medicine.taxRatio = this.convertToNumber(medicineDto.taxRatio);
    // Order & Amount Info
    if (medicineDto.numOrder !== undefined) medicine.numOrder = this.convertToNumber(medicineDto.numOrder);
    if (medicineDto.presAmount !== undefined) medicine.presAmount = this.convertToNumber(medicineDto.presAmount);
    // Patient & Treatment Info
    if (medicineDto.patientTypeId !== undefined) medicine.patientTypeId = this.convertToNumber(medicineDto.patientTypeId);
    if (medicineDto.patientTypeCode !== undefined) medicine.patientTypeCode = medicineDto.patientTypeCode;
    if (medicineDto.patientTypeName !== undefined) medicine.patientTypeName = medicineDto.patientTypeName;
    if (medicineDto.tdlPatientId !== undefined) medicine.tdlPatientId = this.convertToNumber(medicineDto.tdlPatientId);
    if (medicineDto.tdlTreatmentId !== undefined) medicine.tdlTreatmentId = this.convertToNumber(medicineDto.tdlTreatmentId);
    if (medicineDto.tdlServiceReqId !== undefined) medicine.tdlServiceReqId = this.convertToNumber(medicineDto.tdlServiceReqId);
    // Instruction & Tutorial
    if (medicineDto.useTimeTo !== undefined) medicine.useTimeTo = this.convertToNumber(medicineDto.useTimeTo);
    if (medicineDto.tutorial !== undefined) medicine.tutorial = medicineDto.tutorial;
    if (medicineDto.tdlIntructionTime !== undefined) medicine.tdlIntructionTime = this.convertToNumber(medicineDto.tdlIntructionTime);
    if (medicineDto.tdlIntructionDate !== undefined) medicine.tdlIntructionDate = this.convertToNumber(medicineDto.tdlIntructionDate);
    if (medicineDto.htuText !== undefined) medicine.htuText = medicineDto.htuText;
    // Dosage Info
    if (medicineDto.morning !== undefined) medicine.morning = medicineDto.morning;
    if (medicineDto.evening !== undefined) medicine.evening = medicineDto.evening;
    // ExpMest Denormalized Info (Additional)
    if (medicineDto.expMestTypeId !== undefined) medicine.expMestTypeId = this.convertToNumber(medicineDto.expMestTypeId);
    if (medicineDto.tdlAggrExpMestId !== undefined) medicine.tdlAggrExpMestId = this.convertToNumber(medicineDto.tdlAggrExpMestId);
    if (medicineDto.aggrExpMestId !== undefined) medicine.aggrExpMestId = this.convertToNumber(medicineDto.aggrExpMestId);
    if (medicineDto.reqRoomId !== undefined) medicine.reqRoomId = this.convertToNumber(medicineDto.reqRoomId);
    if (medicineDto.reqDepartmentId !== undefined) medicine.reqDepartmentId = this.convertToNumber(medicineDto.reqDepartmentId);
    if (medicineDto.reqUserTitle !== undefined) medicine.reqUserTitle = medicineDto.reqUserTitle;
    if (medicineDto.reqLoginname !== undefined) medicine.reqLoginname = medicineDto.reqLoginname;
    if (medicineDto.reqUsername !== undefined) medicine.reqUsername = medicineDto.reqUsername;
    // Medicine Group & Use Form (Additional)
    if (medicineDto.medicineUseFormId !== undefined) medicine.medicineUseFormId = this.convertToNumber(medicineDto.medicineUseFormId);
    if (medicineDto.medicineLineId !== undefined) medicine.medicineLineId = this.convertToNumber(medicineDto.medicineLineId);
    if (medicineDto.medicineGroupCode !== undefined) medicine.medicineGroupCode = medicineDto.medicineGroupCode;
    if (medicineDto.medicineGroupName !== undefined) medicine.medicineGroupName = medicineDto.medicineGroupName;
    if (medicineDto.medicineGroupNumOrder !== undefined) medicine.medicineGroupNumOrder = this.convertToNumber(medicineDto.medicineGroupNumOrder);
    // Manufacturer & Stock Info (Additional)
    if (medicineDto.manufacturerCode !== undefined) medicine.manufacturerCode = medicineDto.manufacturerCode;
    if (medicineDto.manufacturerName !== undefined) medicine.manufacturerName = medicineDto.manufacturerName;
    if (medicineDto.mediStockCode !== undefined) medicine.mediStockCode = medicineDto.mediStockCode;
    if (medicineDto.mediStockName !== undefined) medicine.mediStockName = medicineDto.mediStockName;
    if (medicineDto.updatedBy !== undefined && medicineDto.updatedBy !== null) {
      medicine.updatedBy = medicineDto.updatedBy;
    }

    medicine.updatedAt = new Date();
    medicine.version = (medicine.version || 0) + 1;

    await repo.save(medicine);

    // Fetch the updated entity
    const updatedMedicine = await repo.findOne({ where: { id } });
    if (!updatedMedicine) {
      throw new Error('Failed to fetch updated InpatientExpMestMedicine');
    }

    this.convertLongToNumber(updatedMedicine);
    this.logger.info('InpatientExpMestMedicineRepository#update.result', { id: updatedMedicine.id });
    return updatedMedicine;
  }

  async delete(id: string): Promise<void> {
    this.logger.info('InpatientExpMestMedicineRepository#delete.call', { id });
    await this.repository.delete(id);
    this.logger.info('InpatientExpMestMedicineRepository#delete.result');
  }

  /**
   * Batch update export fields by HIS IDs
   * Sets exportAmount = amount (from database), exportByUser, and exportTime
   * Only allows update if records are not already exported (exportByUser = null and exportTime = null)
   */
  async updateExportFieldsByHisIds(
    hisIds: number[],
    dto: BatchUpdateExportFieldsDto,
    userId: string,
  ): Promise<number> {
    this.logger.info('InpatientExpMestMedicineRepository#updateExportFieldsByHisIds.call', {
      hisIdsCount: hisIds.length,
      exportTime: dto.exportTime,
      userId,
    });

    if (hisIds.length === 0) {
      return 0;
    }

    // Convert hisIds to numbers (handle Long objects)
    const hisIdsNumbers = hisIds.map(id => this.convertToNumber(id)).filter((id): id is number => id !== null);

    if (hisIdsNumbers.length === 0) {
      return 0;
    }

    // Validation: Check if any records are already exported
    const existingRecords = await this.repository.find({
      where: { hisId: In(hisIdsNumbers) },
      select: ['hisId', 'exportByUser', 'exportTime'],
    });

    // Find records that are already exported
    const alreadyExported = existingRecords.filter(
      record => record.exportByUser !== null || record.exportTime !== null
    );

    if (alreadyExported.length > 0) {
      const exportedHisIds = alreadyExported.map(r => r.hisId);
      const exportedDetails = alreadyExported.map(r => ({
        hisId: r.hisId,
        exportByUser: r.exportByUser,
        exportTime: r.exportTime,
      }));

      this.logger.warn('InpatientExpMestMedicineRepository#updateExportFieldsByHisIds.validationFailed', {
        exportedHisIds,
        exportedCount: alreadyExported.length,
        totalRequested: hisIdsNumbers.length,
        exportedDetails,
      });

      // Throw error with detailed information as JSON string
      const errorDetails = {
        message: `Cannot update: ${alreadyExported.length} record(s) have already been exported.`,
        exportedCount: alreadyExported.length,
        exportedHisIds: exportedHisIds,
        exportedDetails: exportedDetails,
      };

      throw new Error(JSON.stringify(errorDetails));
    }

    // Check if all requested records exist
    if (existingRecords.length !== hisIdsNumbers.length) {
      const foundHisIds = existingRecords.map(r => r.hisId);
      const notFoundHisIds = hisIdsNumbers.filter(id => !foundHisIds.includes(id));
      this.logger.warn('InpatientExpMestMedicineRepository#updateExportFieldsByHisIds.notFound', {
        notFoundHisIds,
        notFoundCount: notFoundHisIds.length,
        totalRequested: hisIdsNumbers.length,
      });
      throw new Error(
        `Cannot update: ${notFoundHisIds.length} record(s) not found. ` +
        `Not found HIS IDs: ${notFoundHisIds.join(', ')}`
      );
    }

    // Build update query with raw SQL for EXPORT_AMOUNT = AMOUNT
    const setData: any = {
      // Set EXPORT_AMOUNT = AMOUNT (lấy từ chính dòng đó) using raw SQL
      exportAmount: () => 'AMOUNT',
      exportByUser: userId, // Lấy từ token
      updatedAt: new Date(),
      updatedBy: userId,
      version: () => 'VERSION + 1',
    };

    // Add exportTime if provided
    if (dto.exportTime !== undefined && dto.exportTime !== null) {
      const exportTimeNumber = this.convertToNumber(dto.exportTime);
      if (exportTimeNumber !== null) {
        setData.exportTime = exportTimeNumber;
      }
    }

    // Update batch using query builder - only update records that are not exported
    const result = await this.repository
      .createQueryBuilder()
      .update(InpatientExpMestMedicine)
      .set(setData)
      .where('hisId IN (:...hisIds)', { hisIds: hisIdsNumbers })
      .andWhere('(exportByUser IS NULL AND exportTime IS NULL)') // Additional safety check
      .execute();

    const affectedCount = result.affected || 0;
    this.logger.info('InpatientExpMestMedicineRepository#updateExportFieldsByHisIds.result', {
      affectedCount,
      hisIdsCount: hisIdsNumbers.length,
    });

    // After successful update, check if all medicines of parent exp mests are exported
    if (affectedCount > 0) {
      try {
        await this.checkAndUpdateParentWorkingState(hisIdsNumbers, userId);
      } catch (error: any) {
        // Log error but don't fail the update operation
        this.logger.error('InpatientExpMestMedicineRepository#updateExportFieldsByHisIds.checkParentWorkingState.error', {
          error: error?.message,
          stack: error?.stack,
        });
      }
    }

    return affectedCount;
  }

  /**
   * Check if all medicines of parent exp mests are exported and update WORKING_STATE_ID
   * @param updatedHisIds Array of medicine HIS IDs that were just updated
   * @param userId User ID for updatedBy
   */
  private async checkAndUpdateParentWorkingState(
    updatedHisIds: number[],
    userId: string,
  ): Promise<void> {
    this.logger.info('InpatientExpMestMedicineRepository#checkAndUpdateParentWorkingState.call', {
      updatedHisIdsCount: updatedHisIds.length,
    });

    // Get unique inpatientExpMestIds from updated medicines
    const updatedMedicines = await this.repository.find({
      where: { hisId: In(updatedHisIds) },
      select: ['inpatientExpMestId'],
    });

    if (updatedMedicines.length === 0) {
      return;
    }

    const uniqueInpatientExpMestIds = Array.from(
      new Set(updatedMedicines.map(m => m.inpatientExpMestId))
    );

    // Query child exp mests to get aggrExpMestIds (parents)
    const childExpMests = await this.childRepository.findAll({
      where: { hisExpMestId: In(uniqueInpatientExpMestIds) },
      select: ['aggrExpMestId'],
    });

    if (childExpMests.length === 0) {
      return;
    }

    const uniqueAggrExpMestIds = Array.from(
      new Set(childExpMests.map(c => c.aggrExpMestId))
    );

    // Get default WORKING_STATE_ID for all exported status
    const defaultAllExportedWorkingStateId =
      this.configService.get<string>('DEFAULT_ALL_EXPORTED_WORKING_STATE_ID') ||
      null;

    if (!defaultAllExportedWorkingStateId) {
      this.logger.warn('InpatientExpMestMedicineRepository#checkAndUpdateParentWorkingState.noConfig', {
        message: 'DEFAULT_ALL_EXPORTED_WORKING_STATE_ID not configured, skipping update',
      });
      return;
    }

    // For each parent, check if all medicines are exported
    for (const aggrExpMestId of uniqueAggrExpMestIds) {
      try {
        // Query all children of this parent
        const allChildren = await this.childRepository.findByAggrExpMestId(aggrExpMestId);
        const childHisIds = allChildren.map(c => c.hisExpMestId);

        if (childHisIds.length === 0) {
          continue;
        }

        // Query all medicines of all children
        const allMedicines = await this.repository.find({
          where: { inpatientExpMestId: In(childHisIds) },
          select: ['hisId', 'exportByUser', 'exportTime'],
        });

        if (allMedicines.length === 0) {
          continue;
        }

        // Check if all medicines are exported
        const allExported = allMedicines.every(
          med => med.exportByUser !== null || med.exportTime !== null
        );

        if (allExported) {
          // Update WORKING_STATE_ID of parent
          await this.parentRepository.updateByHisExpMestId(
            aggrExpMestId,
            { workingStateId: defaultAllExportedWorkingStateId },
            userId,
          );

          this.logger.info('InpatientExpMestMedicineRepository#checkAndUpdateParentWorkingState.updated', {
            aggrExpMestId,
            workingStateId: defaultAllExportedWorkingStateId,
            totalMedicines: allMedicines.length,
          });
        }
      } catch (error: any) {
        this.logger.error('InpatientExpMestMedicineRepository#checkAndUpdateParentWorkingState.parentError', {
          aggrExpMestId,
          error: error?.message,
          stack: error?.stack,
        });
        // Continue with next parent
      }
    }
  }

  /**
   * Update actual export fields for multiple medicines by HIS IDs
   * @param hisIds Array of medicine HIS IDs to update
   * @param dto DTO containing actualExportTime
   * @param userId User ID for actualExportByUser
   * @returns Number of affected records
   */
  async updateActualExportFieldsByHisIds(
    hisIds: number[],
    dto: BatchUpdateActualExportFieldsDto,
    userId: string,
  ): Promise<number> {
    this.logger.info('InpatientExpMestMedicineRepository#updateActualExportFieldsByHisIds.call', {
      hisIdsCount: hisIds.length,
      actualExportTime: dto.actualExportTime,
      userId,
    });

    if (hisIds.length === 0) {
      return 0;
    }

    // Convert hisIds to numbers (handle Long objects)
    const hisIdsNumbers = hisIds.map(id => this.convertToNumber(id)).filter((id): id is number => id !== null);

    if (hisIdsNumbers.length === 0) {
      return 0;
    }

    // Validation: Check if any records are already actually exported
    const existingRecords = await this.repository.find({
      where: { hisId: In(hisIdsNumbers) },
      select: ['hisId', 'exportByUser', 'exportTime', 'actualExportByUser', 'actualExportTime'],
    });

    // Find records that are already actually exported
    const alreadyActuallyExported = existingRecords.filter(
      record => record.actualExportByUser !== null || record.actualExportTime !== null
    );

    if (alreadyActuallyExported.length > 0) {
      const exportedHisIds = alreadyActuallyExported.map(r => r.hisId);
      const exportedDetails = alreadyActuallyExported.map(r => ({
        hisId: r.hisId,
        actualExportByUser: r.actualExportByUser,
        actualExportTime: r.actualExportTime,
      }));

      this.logger.warn('InpatientExpMestMedicineRepository#updateActualExportFieldsByHisIds.validationFailed', {
        exportedHisIds,
        exportedCount: alreadyActuallyExported.length,
        totalRequested: hisIdsNumbers.length,
        exportedDetails,
      });

      const errorDetails = {
        message: `Cannot update: ${alreadyActuallyExported.length} record(s) have already been actually exported.`,
        exportedCount: alreadyActuallyExported.length,
        exportedHisIds: exportedHisIds,
        exportedDetails: exportedDetails,
      };

      throw new Error(JSON.stringify(errorDetails));
    }

    // Validation: Check if records have been exported (EXPORT fields) before allowing actual export
    // Thực xuất chỉ có thể xảy ra sau khi đã có dự kiến xuất
    const notExported = existingRecords.filter(
      record => record.exportByUser === null && record.exportTime === null
    );

    if (notExported.length > 0) {
      const notExportedHisIds = notExported.map(r => r.hisId);
      this.logger.warn('InpatientExpMestMedicineRepository#updateActualExportFieldsByHisIds.notExported', {
        notExportedHisIds,
        notExportedCount: notExported.length,
        totalRequested: hisIdsNumbers.length,
      });
      throw new Error(
        `Cannot update: ${notExported.length} record(s) have not been exported yet. ` +
        `Actual export can only be performed after export. ` +
        `Not exported HIS IDs: ${notExportedHisIds.join(', ')}`
      );
    }

    // Check if all requested records exist
    if (existingRecords.length !== hisIdsNumbers.length) {
      const foundHisIds = existingRecords.map(r => r.hisId);
      const notFoundHisIds = hisIdsNumbers.filter(id => !foundHisIds.includes(id));
      this.logger.warn('InpatientExpMestMedicineRepository#updateActualExportFieldsByHisIds.notFound', {
        notFoundHisIds,
        notFoundCount: notFoundHisIds.length,
        totalRequested: hisIdsNumbers.length,
      });
      throw new Error(
        `Cannot update: ${notFoundHisIds.length} record(s) not found. ` +
        `Not found HIS IDs: ${notFoundHisIds.join(', ')}`
      );
    }

    const setData: any = {
      actualExportAmount: () => 'AMOUNT', // Tự động = AMOUNT
      actualExportByUser: userId, // Lấy từ token
      updatedAt: new Date(),
      updatedBy: userId,
      version: () => 'VERSION + 1',
    };

    // Add actualExportTime if provided
    if (dto.actualExportTime !== undefined && dto.actualExportTime !== null) {
      const actualExportTimeNumber = this.convertToNumber(dto.actualExportTime);
      if (actualExportTimeNumber !== null) {
        setData.actualExportTime = actualExportTimeNumber;
      }
    }

    // Update batch using query builder - only update records that are not actually exported
    const result = await this.repository
      .createQueryBuilder()
      .update(InpatientExpMestMedicine)
      .set(setData)
      .where('hisId IN (:...hisIds)', { hisIds: hisIdsNumbers })
      .andWhere('(actualExportByUser IS NULL AND actualExportTime IS NULL)') // Additional safety check
      .execute();

    const affectedCount = result.affected || 0;
    this.logger.info('InpatientExpMestMedicineRepository#updateActualExportFieldsByHisIds.result', {
      affectedCount,
      hisIdsCount: hisIdsNumbers.length,
    });

    // After successful update, check if all medicines of parent exp mests are actually exported
    if (affectedCount > 0) {
      try {
        await this.checkAndUpdateParentWorkingStateForActualExport(hisIdsNumbers, userId);
      } catch (error: any) {
        // Log error but don't fail the update operation
        this.logger.error('InpatientExpMestMedicineRepository#updateActualExportFieldsByHisIds.checkParentWorkingState.error', {
          error: error?.message,
          stack: error?.stack,
        });
      }
    }

    return affectedCount;
  }

  /**
   * Check if all medicines of parent exp mests are actually exported and update WORKING_STATE_ID
   * @param updatedHisIds Array of medicine HIS IDs that were just updated
   * @param userId User ID for updatedBy
   */
  private async checkAndUpdateParentWorkingStateForActualExport(
    updatedHisIds: number[],
    userId: string,
  ): Promise<void> {
    this.logger.info('InpatientExpMestMedicineRepository#checkAndUpdateParentWorkingStateForActualExport.call', {
      updatedHisIdsCount: updatedHisIds.length,
    });

    // Get unique inpatientExpMestIds from updated medicines
    const updatedMedicines = await this.repository.find({
      where: { hisId: In(updatedHisIds) },
      select: ['inpatientExpMestId'],
    });

    if (updatedMedicines.length === 0) {
      return;
    }

    const uniqueInpatientExpMestIds = Array.from(
      new Set(updatedMedicines.map(m => m.inpatientExpMestId))
    );

    // Query child exp mests to get aggrExpMestIds (parents)
    const childExpMests = await this.childRepository.findAll({
      where: { hisExpMestId: In(uniqueInpatientExpMestIds) },
      select: ['aggrExpMestId'],
    });

    if (childExpMests.length === 0) {
      return;
    }

    const uniqueAggrExpMestIds = Array.from(
      new Set(childExpMests.map(c => c.aggrExpMestId))
    );

    // Get default WORKING_STATE_ID for all actually exported status
    const defaultActualStatusId =
      this.configService.get<string>('DEFAULT_ALL_ACTUAL_STATUS_ID') ||
      null;

    if (!defaultActualStatusId) {
      this.logger.warn('InpatientExpMestMedicineRepository#checkAndUpdateParentWorkingStateForActualExport.noConfig', {
        message: 'DEFAULT_ALL_ACTUAL_STATUS_ID not configured, skipping update',
      });
      return;
    }

    // For each parent, check if all medicines are actually exported
    for (const aggrExpMestId of uniqueAggrExpMestIds) {
      try {
        // Query all children of this parent
        const allChildren = await this.childRepository.findByAggrExpMestId(aggrExpMestId);
        const childHisIds = allChildren.map(c => c.hisExpMestId);

        if (childHisIds.length === 0) {
          continue;
        }

        // Query all medicines of all children
        const allMedicines = await this.repository.find({
          where: { inpatientExpMestId: In(childHisIds) },
          select: ['hisId', 'actualExportByUser', 'actualExportTime'],
        });

        if (allMedicines.length === 0) {
          continue;
        }

        // Check if all medicines are actually exported
        const allActuallyExported = allMedicines.every(
          med => med.actualExportByUser !== null || med.actualExportTime !== null
        );

        if (allActuallyExported) {
          // Update WORKING_STATE_ID of parent
          await this.parentRepository.updateByHisExpMestId(
            aggrExpMestId,
            { workingStateId: defaultActualStatusId },
            userId,
          );

          this.logger.info('InpatientExpMestMedicineRepository#checkAndUpdateParentWorkingStateForActualExport.updated', {
            aggrExpMestId,
            workingStateId: defaultActualStatusId,
            totalMedicines: allMedicines.length,
          });
        }
      } catch (error: any) {
        this.logger.error('InpatientExpMestMedicineRepository#checkAndUpdateParentWorkingStateForActualExport.parentError', {
          aggrExpMestId,
          error: error?.message,
          stack: error?.stack,
        });
        // Continue with next parent
      }
    }
  }

  /**
   * Convert value to number (handle Long objects from gRPC)
   */
  private convertToNumber(value: any): number | null {
    if (value === null || value === undefined) return null;
    if (typeof value === 'number') return value;
    if (typeof value === 'object' && 'low' in value && 'high' in value) {
      const longValue = value as { low: number; high: number };
      return longValue.low + (longValue.high * 0x100000000);
    }
    return Number(value);
  }

  /**
   * Convert Long object to number (for Oracle NUMBER(19,0) fields)
   */
  private convertLongToNumber(entity: InpatientExpMestMedicine): void {
    const numberFields: (keyof InpatientExpMestMedicine)[] = [
      'hisId', 'inpatientExpMestId', 'medicineId', 'tdlMediStockId', 'tdlMedicineTypeId',
      'expMestMetyReqId', 'ckImpMestMedicineId', 'isExport', 'amount', 'exportAmount',
      'exportTime', 'actualExportAmount', 'actualExportTime', 'approvalTime', 'approvalDate', 'expTime', 'expDate',
      'mediStockId', 'expMestSttId', 'impPrice', 'impVatRatio', 'bidId',
      'expiredDate', 'medicineTypeId', 'impTime', 'supplierId', 'medicineGroupId',
      'serviceUnitId', 'medicineNumOrder', 'serviceId', 'manufacturerId',
      'medicineUseFormNumOrder', 'sumInStock', 'sumByMedicineInStock',
    ];

    numberFields.forEach(field => {
      const value = entity[field];
      if (value !== null && value !== undefined && typeof value === 'object' && 'low' in value && 'high' in value) {
        const longValue = value as unknown as { low: number; high: number };
        (entity as any)[field] = longValue.low + (longValue.high * 0x100000000);
      }
    });
  }
}

