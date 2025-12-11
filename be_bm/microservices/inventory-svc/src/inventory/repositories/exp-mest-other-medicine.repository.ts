import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions, In } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

import { ExpMestOtherMedicine } from '../entities/exp-mest-other-medicine.entity';
import { CreateExpMestOtherMedicineDto } from '../dto/create-exp-mest-other-medicine.dto';
import { UpdateExpMestOtherMedicineDto } from '../dto/update-exp-mest-other-medicine.dto';
import { ExpMestOtherRepository } from './exp-mest-other.repository';

@Injectable()
export class ExpMestOtherMedicineRepository {
  constructor(
    @InjectRepository(ExpMestOtherMedicine)
    private readonly repository: Repository<ExpMestOtherMedicine>,
    @Inject(forwardRef(() => ExpMestOtherRepository))
    private readonly parentRepository: ExpMestOtherRepository,
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ExpMestOtherMedicineRepository.name);
  }

  async findAll(options?: FindManyOptions<ExpMestOtherMedicine>): Promise<ExpMestOtherMedicine[]> {
    this.logger.info('ExpMestOtherMedicineRepository#findAll.call', options);
    const result = await this.repository.find(options);
    this.logger.info('ExpMestOtherMedicineRepository#findAll.result', { count: result.length });
    result.forEach(medicine => this.convertLongToNumber(medicine));
    return result;
  }

  async findOne(options?: FindOneOptions<ExpMestOtherMedicine>): Promise<ExpMestOtherMedicine | null> {
    this.logger.info('ExpMestOtherMedicineRepository#findOne.call', options);
    const result = await this.repository.findOne(options);
    if (result) {
      this.convertLongToNumber(result);
    }
    this.logger.info('ExpMestOtherMedicineRepository#findOne.result', { found: !!result });
    return result;
  }

  async findById(id: string): Promise<ExpMestOtherMedicine | null> {
    this.logger.info('ExpMestOtherMedicineRepository#findById.call', { id });
    const result = await this.repository.findOne({ where: { id } });
    if (result) {
      this.convertLongToNumber(result);
    }
    this.logger.info('ExpMestOtherMedicineRepository#findById.result', { found: !!result });
    return result;
  }

  async findByHisId(hisId: number): Promise<ExpMestOtherMedicine | null> {
    this.logger.info('ExpMestOtherMedicineRepository#findByHisId.call', { hisId });
    const result = await this.repository.findOne({ where: { hisId } });
    if (result) {
      this.convertLongToNumber(result);
    }
    this.logger.info('ExpMestOtherMedicineRepository#findByHisId.result', { found: !!result });
    return result;
  }

  async findByExpMestId(expMestId: number): Promise<ExpMestOtherMedicine[]> {
    this.logger.info('ExpMestOtherMedicineRepository#findByExpMestId.call', { expMestId });
    const result = await this.repository.find({ where: { expMestId } });
    this.logger.info('ExpMestOtherMedicineRepository#findByExpMestId.result', { count: result.length });
    result.forEach(medicine => this.convertLongToNumber(medicine));
    return result;
  }

  async findByHisIds(hisIds: number[]): Promise<ExpMestOtherMedicine[]> {
    this.logger.info('ExpMestOtherMedicineRepository#findByHisIds.call', { count: hisIds.length });
    
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

    result.forEach(medicine => this.convertLongToNumber(medicine));
    this.logger.info('ExpMestOtherMedicineRepository#findByHisIds.result', { 
      requested: hisIds.length,
      valid: validIds.length,
      found: result.length 
    });
    return result;
  }

  async count(options?: FindManyOptions<ExpMestOtherMedicine>): Promise<number> {
    this.logger.info('ExpMestOtherMedicineRepository#count.call', options);
    const result = await this.repository.count(options);
    this.logger.info('ExpMestOtherMedicineRepository#count.result', { count: result });
    return result;
  }

  async create(medicineDto: CreateExpMestOtherMedicineDto): Promise<ExpMestOtherMedicine> {
    this.logger.info('ExpMestOtherMedicineRepository#create.call', { 
      hisId: medicineDto.hisId, 
      expMestId: medicineDto.expMestId,
      createdBy: medicineDto.createdBy 
    });
    
    const { randomUUID } = require('crypto');
    const id = randomUUID();
    const now = new Date();
    
    const medicineData: any = {
      id,
      hisId: this.convertToNumber(medicineDto.hisId),
      expMestId: this.convertToNumber(medicineDto.expMestId),
      expMestLocalId: medicineDto.expMestLocalId ?? null,
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
      actualExportAmount: this.convertToNumber(medicineDto.actualExportAmount),
      actualExportByUser: medicineDto.actualExportByUser ?? null,
      actualExportTime: this.convertToNumber(medicineDto.actualExportTime),
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
      price: this.convertToNumber(medicineDto.price),
      vatRatio: this.convertToNumber(medicineDto.vatRatio),
      virPrice: this.convertToNumber(medicineDto.virPrice),
      taxRatio: this.convertToNumber(medicineDto.taxRatio),
      bidId: this.convertToNumber(medicineDto.bidId),
      packageNumber: medicineDto.packageNumber ?? null,
      expiredDate: this.convertToNumber(medicineDto.expiredDate),
      tdlBidGroupCode: medicineDto.tdlBidGroupCode ?? null,
      tdlBidPackageCode: medicineDto.tdlBidPackageCode ?? null,
      bidNumber: medicineDto.bidNumber ?? null,
      bidName: medicineDto.bidName ?? null,
      medicineTypeId: this.convertToNumber(medicineDto.medicineTypeId),
      medicineTypeCode: medicineDto.medicineTypeCode ?? null,
      medicineTypeName: medicineDto.medicineTypeName ?? null,
      impTime: this.convertToNumber(medicineDto.impTime),
      supplierId: this.convertToNumber(medicineDto.supplierId),
      supplierCode: medicineDto.supplierCode ?? null,
      supplierName: medicineDto.supplierName ?? null,
      medicineBytNumOrder: medicineDto.medicineBytNumOrder ?? null,
      medicineRegisterNumber: medicineDto.medicineRegisterNumber ?? null,
      activeIngrBhytCode: medicineDto.activeIngrBhytCode ?? null,
      activeIngrBhytName: medicineDto.activeIngrBhytName ?? null,
      concentra: medicineDto.concentra ?? null,
      materialNumOrder: this.convertToNumber(medicineDto.materialNumOrder),
      serviceId: this.convertToNumber(medicineDto.serviceId),
      nationalName: medicineDto.nationalName ?? null,
      manufacturerId: this.convertToNumber(medicineDto.manufacturerId),
      manufacturerCode: medicineDto.manufacturerCode ?? null,
      manufacturerName: medicineDto.manufacturerName ?? null,
      bytNumOrder: medicineDto.bytNumOrder ?? null,
      registerNumber: medicineDto.registerNumber ?? null,
      medicineGroupId: this.convertToNumber(medicineDto.medicineGroupId),
      medicineGroupCode: medicineDto.medicineGroupCode ?? null,
      medicineGroupName: medicineDto.medicineGroupName ?? null,
      medicineGroupNumOrder: this.convertToNumber(medicineDto.medicineGroupNumOrder),
      serviceUnitId: this.convertToNumber(medicineDto.serviceUnitId),
      serviceUnitCode: medicineDto.serviceUnitCode ?? null,
      serviceUnitName: medicineDto.serviceUnitName ?? null,
      medicineNumOrder: this.convertToNumber(medicineDto.medicineNumOrder),
      medicineUseFormId: this.convertToNumber(medicineDto.medicineUseFormId),
      medicineUseFormCode: medicineDto.medicineUseFormCode ?? null,
      medicineUseFormName: medicineDto.medicineUseFormName ?? null,
      medicineUseFormNumOrder: this.convertToNumber(medicineDto.medicineUseFormNumOrder),
      sumInStock: this.convertToNumber(medicineDto.sumInStock),
      sumByMedicineInStock: this.convertToNumber(medicineDto.sumByMedicineInStock),
      mediStockCode: medicineDto.mediStockCode ?? null,
      mediStockName: medicineDto.mediStockName ?? null,
      numOrder: this.convertToNumber(medicineDto.numOrder),
      presAmount: this.convertToNumber(medicineDto.presAmount),
      patientTypeId: this.convertToNumber(medicineDto.patientTypeId),
      patientTypeCode: medicineDto.patientTypeCode ?? null,
      patientTypeName: medicineDto.patientTypeName ?? null,
      tdlPatientId: this.convertToNumber(medicineDto.tdlPatientId),
      tdlTreatmentId: this.convertToNumber(medicineDto.tdlTreatmentId),
      tdlServiceReqId: this.convertToNumber(medicineDto.tdlServiceReqId),
      useTimeTo: this.convertToNumber(medicineDto.useTimeTo),
      tutorial: medicineDto.tutorial ?? null,
      tdlIntructionTime: this.convertToNumber(medicineDto.tdlIntructionTime),
      tdlIntructionDate: this.convertToNumber(medicineDto.tdlIntructionDate),
      htuText: medicineDto.htuText ?? null,
      morning: medicineDto.morning ?? null,
      evening: medicineDto.evening ?? null,
      expMestTypeId: this.convertToNumber(medicineDto.expMestTypeId),
      tdlAggrExpMestId: this.convertToNumber(medicineDto.tdlAggrExpMestId),
      aggrExpMestId: this.convertToNumber(medicineDto.aggrExpMestId),
      reqRoomId: this.convertToNumber(medicineDto.reqRoomId),
      reqDepartmentId: this.convertToNumber(medicineDto.reqDepartmentId),
      reqUserTitle: medicineDto.reqUserTitle ?? null,
      reqLoginname: medicineDto.reqLoginname ?? null,
      reqUsername: medicineDto.reqUsername ?? null,
      medicineLineId: this.convertToNumber(medicineDto.medicineLineId),
      isActive: 1,
      version: 1,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      createdBy: medicineDto.createdBy ?? null,
      updatedBy: medicineDto.createdBy ?? null,
    };
    
    const medicine = this.repository.create(medicineData);
    await this.repository.save(medicine);
    
    const savedMedicine = await this.repository.findOne({ 
      where: { id }
    });
    
    if (!savedMedicine) {
      throw new Error('Failed to fetch created ExpMestOtherMedicine');
    }
    
    this.convertLongToNumber(savedMedicine);
    this.logger.info('ExpMestOtherMedicineRepository#create.result', { id: savedMedicine.id, hisId: savedMedicine.hisId });
    return savedMedicine;
  }

  async update(id: string, medicineDto: UpdateExpMestOtherMedicineDto): Promise<ExpMestOtherMedicine> {
    this.logger.info('ExpMestOtherMedicineRepository#update.call', { id });
    
    const medicine = await this.repository.findOne({ where: { id } });
    if (!medicine) {
      throw new Error(`ExpMestOtherMedicine with id ${id} not found`);
    }
    
    // Update fields (similar to InpatientExpMestMedicineRepository)
    if (medicineDto.expMestId !== undefined) medicine.expMestId = this.convertToNumber(medicineDto.expMestId);
    if (medicineDto.expMestLocalId !== undefined) medicine.expMestLocalId = medicineDto.expMestLocalId ?? null;
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
    if (medicineDto.actualExportAmount !== undefined) medicine.actualExportAmount = this.convertToNumber(medicineDto.actualExportAmount);
    if (medicineDto.actualExportByUser !== undefined) medicine.actualExportByUser = medicineDto.actualExportByUser ?? null;
    if (medicineDto.actualExportTime !== undefined) medicine.actualExportTime = this.convertToNumber(medicineDto.actualExportTime);
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
    if (medicineDto.price !== undefined) medicine.price = this.convertToNumber(medicineDto.price);
    if (medicineDto.vatRatio !== undefined) medicine.vatRatio = this.convertToNumber(medicineDto.vatRatio);
    if (medicineDto.virPrice !== undefined) medicine.virPrice = this.convertToNumber(medicineDto.virPrice);
    if (medicineDto.taxRatio !== undefined) medicine.taxRatio = this.convertToNumber(medicineDto.taxRatio);
    if (medicineDto.bidId !== undefined) medicine.bidId = this.convertToNumber(medicineDto.bidId);
    if (medicineDto.packageNumber !== undefined) medicine.packageNumber = medicineDto.packageNumber;
    if (medicineDto.expiredDate !== undefined) medicine.expiredDate = this.convertToNumber(medicineDto.expiredDate);
    if (medicineDto.tdlBidGroupCode !== undefined) medicine.tdlBidGroupCode = medicineDto.tdlBidGroupCode;
    if (medicineDto.tdlBidPackageCode !== undefined) medicine.tdlBidPackageCode = medicineDto.tdlBidPackageCode;
    if (medicineDto.bidNumber !== undefined) medicine.bidNumber = medicineDto.bidNumber;
    if (medicineDto.bidName !== undefined) medicine.bidName = medicineDto.bidName;
    if (medicineDto.medicineTypeId !== undefined) medicine.medicineTypeId = this.convertToNumber(medicineDto.medicineTypeId);
    if (medicineDto.medicineTypeCode !== undefined) medicine.medicineTypeCode = medicineDto.medicineTypeCode;
    if (medicineDto.medicineTypeName !== undefined) medicine.medicineTypeName = medicineDto.medicineTypeName;
    if (medicineDto.impTime !== undefined) medicine.impTime = this.convertToNumber(medicineDto.impTime);
    if (medicineDto.supplierId !== undefined) medicine.supplierId = this.convertToNumber(medicineDto.supplierId);
    if (medicineDto.supplierCode !== undefined) medicine.supplierCode = medicineDto.supplierCode;
    if (medicineDto.supplierName !== undefined) medicine.supplierName = medicineDto.supplierName;
    if (medicineDto.medicineBytNumOrder !== undefined) medicine.medicineBytNumOrder = medicineDto.medicineBytNumOrder;
    if (medicineDto.medicineRegisterNumber !== undefined) medicine.medicineRegisterNumber = medicineDto.medicineRegisterNumber;
    if (medicineDto.activeIngrBhytCode !== undefined) medicine.activeIngrBhytCode = medicineDto.activeIngrBhytCode;
    if (medicineDto.activeIngrBhytName !== undefined) medicine.activeIngrBhytName = medicineDto.activeIngrBhytName;
    if (medicineDto.concentra !== undefined) medicine.concentra = medicineDto.concentra;
    if (medicineDto.materialNumOrder !== undefined) medicine.materialNumOrder = this.convertToNumber(medicineDto.materialNumOrder);
    if (medicineDto.serviceId !== undefined) medicine.serviceId = this.convertToNumber(medicineDto.serviceId);
    if (medicineDto.nationalName !== undefined) medicine.nationalName = medicineDto.nationalName;
    if (medicineDto.manufacturerId !== undefined) medicine.manufacturerId = this.convertToNumber(medicineDto.manufacturerId);
    if (medicineDto.manufacturerCode !== undefined) medicine.manufacturerCode = medicineDto.manufacturerCode;
    if (medicineDto.manufacturerName !== undefined) medicine.manufacturerName = medicineDto.manufacturerName;
    if (medicineDto.bytNumOrder !== undefined) medicine.bytNumOrder = medicineDto.bytNumOrder;
    if (medicineDto.registerNumber !== undefined) medicine.registerNumber = medicineDto.registerNumber;
    if (medicineDto.medicineGroupId !== undefined) medicine.medicineGroupId = this.convertToNumber(medicineDto.medicineGroupId);
    if (medicineDto.medicineGroupCode !== undefined) medicine.medicineGroupCode = medicineDto.medicineGroupCode;
    if (medicineDto.medicineGroupName !== undefined) medicine.medicineGroupName = medicineDto.medicineGroupName;
    if (medicineDto.medicineGroupNumOrder !== undefined) medicine.medicineGroupNumOrder = this.convertToNumber(medicineDto.medicineGroupNumOrder);
    if (medicineDto.serviceUnitId !== undefined) medicine.serviceUnitId = this.convertToNumber(medicineDto.serviceUnitId);
    if (medicineDto.serviceUnitCode !== undefined) medicine.serviceUnitCode = medicineDto.serviceUnitCode;
    if (medicineDto.serviceUnitName !== undefined) medicine.serviceUnitName = medicineDto.serviceUnitName;
    if (medicineDto.medicineNumOrder !== undefined) medicine.medicineNumOrder = this.convertToNumber(medicineDto.medicineNumOrder);
    if (medicineDto.medicineUseFormId !== undefined) medicine.medicineUseFormId = this.convertToNumber(medicineDto.medicineUseFormId);
    if (medicineDto.medicineUseFormCode !== undefined) medicine.medicineUseFormCode = medicineDto.medicineUseFormCode;
    if (medicineDto.medicineUseFormName !== undefined) medicine.medicineUseFormName = medicineDto.medicineUseFormName;
    if (medicineDto.medicineUseFormNumOrder !== undefined) medicine.medicineUseFormNumOrder = this.convertToNumber(medicineDto.medicineUseFormNumOrder);
    if (medicineDto.sumInStock !== undefined) medicine.sumInStock = this.convertToNumber(medicineDto.sumInStock);
    if (medicineDto.sumByMedicineInStock !== undefined) medicine.sumByMedicineInStock = this.convertToNumber(medicineDto.sumByMedicineInStock);
    if (medicineDto.mediStockCode !== undefined) medicine.mediStockCode = medicineDto.mediStockCode;
    if (medicineDto.mediStockName !== undefined) medicine.mediStockName = medicineDto.mediStockName;
    if (medicineDto.numOrder !== undefined) medicine.numOrder = this.convertToNumber(medicineDto.numOrder);
    if (medicineDto.presAmount !== undefined) medicine.presAmount = this.convertToNumber(medicineDto.presAmount);
    if (medicineDto.patientTypeId !== undefined) medicine.patientTypeId = this.convertToNumber(medicineDto.patientTypeId);
    if (medicineDto.patientTypeCode !== undefined) medicine.patientTypeCode = medicineDto.patientTypeCode;
    if (medicineDto.patientTypeName !== undefined) medicine.patientTypeName = medicineDto.patientTypeName;
    if (medicineDto.tdlPatientId !== undefined) medicine.tdlPatientId = this.convertToNumber(medicineDto.tdlPatientId);
    if (medicineDto.tdlTreatmentId !== undefined) medicine.tdlTreatmentId = this.convertToNumber(medicineDto.tdlTreatmentId);
    if (medicineDto.tdlServiceReqId !== undefined) medicine.tdlServiceReqId = this.convertToNumber(medicineDto.tdlServiceReqId);
    if (medicineDto.useTimeTo !== undefined) medicine.useTimeTo = this.convertToNumber(medicineDto.useTimeTo);
    if (medicineDto.tutorial !== undefined) medicine.tutorial = medicineDto.tutorial;
    if (medicineDto.tdlIntructionTime !== undefined) medicine.tdlIntructionTime = this.convertToNumber(medicineDto.tdlIntructionTime);
    if (medicineDto.tdlIntructionDate !== undefined) medicine.tdlIntructionDate = this.convertToNumber(medicineDto.tdlIntructionDate);
    if (medicineDto.htuText !== undefined) medicine.htuText = medicineDto.htuText;
    if (medicineDto.morning !== undefined) medicine.morning = medicineDto.morning;
    if (medicineDto.evening !== undefined) medicine.evening = medicineDto.evening;
    if (medicineDto.expMestTypeId !== undefined) medicine.expMestTypeId = this.convertToNumber(medicineDto.expMestTypeId);
    if (medicineDto.tdlAggrExpMestId !== undefined) medicine.tdlAggrExpMestId = this.convertToNumber(medicineDto.tdlAggrExpMestId);
    if (medicineDto.aggrExpMestId !== undefined) medicine.aggrExpMestId = this.convertToNumber(medicineDto.aggrExpMestId);
    if (medicineDto.reqRoomId !== undefined) medicine.reqRoomId = this.convertToNumber(medicineDto.reqRoomId);
    if (medicineDto.reqDepartmentId !== undefined) medicine.reqDepartmentId = this.convertToNumber(medicineDto.reqDepartmentId);
    if (medicineDto.reqUserTitle !== undefined) medicine.reqUserTitle = medicineDto.reqUserTitle;
    if (medicineDto.reqLoginname !== undefined) medicine.reqLoginname = medicineDto.reqLoginname;
    if (medicineDto.reqUsername !== undefined) medicine.reqUsername = medicineDto.reqUsername;
    if (medicineDto.medicineLineId !== undefined) medicine.medicineLineId = this.convertToNumber(medicineDto.medicineLineId);
    if (medicineDto.updatedBy !== undefined && medicineDto.updatedBy !== null) {
      medicine.updatedBy = medicineDto.updatedBy;
    }
    
    medicine.updatedAt = new Date();
    medicine.version = (medicine.version || 0) + 1;
    
    await this.repository.save(medicine);
    
    const updatedMedicine = await this.repository.findOne({ where: { id } });
    if (!updatedMedicine) {
      throw new Error('Failed to fetch updated ExpMestOtherMedicine');
    }
    
    this.convertLongToNumber(updatedMedicine);
    this.logger.info('ExpMestOtherMedicineRepository#update.result', { id: updatedMedicine.id });
    return updatedMedicine;
  }

  async delete(id: string): Promise<void> {
    this.logger.info('ExpMestOtherMedicineRepository#delete.call', { id });
    await this.repository.delete(id);
    this.logger.info('ExpMestOtherMedicineRepository#delete.result');
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
  private convertLongToNumber(entity: ExpMestOtherMedicine): void {
    const numberFields: (keyof ExpMestOtherMedicine)[] = [
      'hisId', 'expMestId', 'medicineId', 'tdlMediStockId', 'tdlMedicineTypeId',
      'expMestMetyReqId', 'ckImpMestMedicineId', 'isExport', 'amount', 'exportAmount',
      'exportTime', 'actualExportAmount', 'actualExportTime', 'approvalTime', 'approvalDate', 'expTime', 'expDate',
      'mediStockId', 'expMestSttId', 'impPrice', 'impVatRatio', 'price', 'vatRatio', 'virPrice', 'taxRatio',
      'bidId', 'expiredDate', 'medicineTypeId', 'impTime', 'supplierId', 'materialNumOrder',
      'serviceId', 'manufacturerId', 'medicineGroupId', 'serviceUnitId', 'medicineNumOrder',
      'medicineUseFormId', 'medicineUseFormNumOrder', 'medicineGroupNumOrder',
      'sumInStock', 'sumByMedicineInStock', 'numOrder', 'presAmount',
      'patientTypeId', 'tdlPatientId', 'tdlTreatmentId', 'tdlServiceReqId',
      'useTimeTo', 'tdlIntructionTime', 'tdlIntructionDate',
      'expMestTypeId', 'tdlAggrExpMestId', 'aggrExpMestId', 'reqRoomId', 'reqDepartmentId',
      'medicineLineId',
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

