import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';

import { ExpMestMedicine } from '../entities/exp-mest-medicine.entity';
import { CreateExpMestMedicineDto } from '../dto/create-exp-mest-medicine.dto';
import { UpdateExpMestMedicineDto } from '../dto/update-exp-mest-medicine.dto';

@Injectable()
export class ExpMestMedicineRepository {
  constructor(
    @InjectRepository(ExpMestMedicine)
    private readonly expMestMedicineRepository: Repository<ExpMestMedicine>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ExpMestMedicineRepository.name);
  }

  async findAll(options?: FindManyOptions<ExpMestMedicine>): Promise<ExpMestMedicine[]> {
    this.logger.info('ExpMestMedicineRepository#findAll.call', options);
    const result = await this.expMestMedicineRepository.find(options);
    this.logger.info('ExpMestMedicineRepository#findAll.result', { count: result.length });
    // Convert Long objects to numbers for Oracle compatibility
    result.forEach(medicine => this.convertLongToNumber(medicine));
    return result;
  }

  async findOne(options?: FindOneOptions<ExpMestMedicine>): Promise<ExpMestMedicine | null> {
    this.logger.info('ExpMestMedicineRepository#findOne.call', options);
    const result = await this.expMestMedicineRepository.findOne(options);
    if (result) {
      this.convertLongToNumber(result);
    }
    this.logger.info('ExpMestMedicineRepository#findOne.result', { found: !!result });
    return result;
  }

  async findById(id: string): Promise<ExpMestMedicine | null> {
    this.logger.info('ExpMestMedicineRepository#findById.call', { id });
    const result = await this.expMestMedicineRepository.findOne({ where: { id } });
    if (result) {
      this.convertLongToNumber(result);
    }
    this.logger.info('ExpMestMedicineRepository#findById.result', { found: !!result });
    return result;
  }

  async findByHisId(hisId: number): Promise<ExpMestMedicine | null> {
    this.logger.info('ExpMestMedicineRepository#findByHisId.call', { hisId });
    const result = await this.expMestMedicineRepository.findOne({ where: { hisId } });
    if (result) {
      this.convertLongToNumber(result);
    }
    this.logger.info('ExpMestMedicineRepository#findByHisId.result', { found: !!result });
    return result;
  }

  async findByExpMestId(expMestId: number): Promise<ExpMestMedicine[]> {
    this.logger.info('ExpMestMedicineRepository#findByExpMestId.call', { expMestId });
    const result = await this.expMestMedicineRepository.find({ where: { expMestId } });
    this.logger.info('ExpMestMedicineRepository#findByExpMestId.result', { count: result.length });
    // Convert Long objects to numbers for Oracle compatibility
    result.forEach(medicine => this.convertLongToNumber(medicine));
    return result;
  }

  async count(options?: FindManyOptions<ExpMestMedicine>): Promise<number> {
    this.logger.info('ExpMestMedicineRepository#count.call', options);
    const result = await this.expMestMedicineRepository.count(options);
    this.logger.info('ExpMestMedicineRepository#count.result', { count: result });
    return result;
  }

  async create(medicineDto: CreateExpMestMedicineDto): Promise<ExpMestMedicine> {
    this.logger.info('ExpMestMedicineRepository#create.call', { 
      hisId: medicineDto.hisId, 
      expMestId: medicineDto.expMestId,
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
      isActive: 1,
      version: 1,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      createdBy: medicineDto.createdBy ?? null,
      updatedBy: medicineDto.createdBy ?? null, // Also set on create
    };
    
    const medicine = this.expMestMedicineRepository.create(medicineData);
    await this.expMestMedicineRepository.save(medicine);
    
    // Fetch the saved entity to ensure all fields are properly loaded
    const savedMedicine = await this.expMestMedicineRepository.findOne({ 
      where: { id }
    });
    
    if (!savedMedicine) {
      throw new Error('Failed to fetch created ExpMestMedicine');
    }
    
    this.convertLongToNumber(savedMedicine);
    this.logger.info('ExpMestMedicineRepository#create.result', { id: savedMedicine.id, hisId: savedMedicine.hisId });
    return savedMedicine;
  }

  async update(id: string, medicineDto: UpdateExpMestMedicineDto): Promise<ExpMestMedicine> {
    this.logger.info('ExpMestMedicineRepository#update.call', { id });
    
    const medicine = await this.expMestMedicineRepository.findOne({ where: { id } });
    if (!medicine) {
      throw new Error(`ExpMestMedicine with id ${id} not found`);
    }
    
    // Update fields
    if (medicineDto.expMestId !== undefined) medicine.expMestId = this.convertToNumber(medicineDto.expMestId);
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
    if (medicineDto.updatedBy !== undefined && medicineDto.updatedBy !== null) {
      medicine.updatedBy = medicineDto.updatedBy;
    }
    
    medicine.updatedAt = new Date();
    medicine.version = (medicine.version || 0) + 1;
    
    await this.expMestMedicineRepository.save(medicine);
    
    // Fetch the updated entity
    const updatedMedicine = await this.expMestMedicineRepository.findOne({ where: { id } });
    if (!updatedMedicine) {
      throw new Error('Failed to fetch updated ExpMestMedicine');
    }
    
    this.convertLongToNumber(updatedMedicine);
    this.logger.info('ExpMestMedicineRepository#update.result', { id: updatedMedicine.id });
    return updatedMedicine;
  }

  async delete(id: string): Promise<void> {
    this.logger.info('ExpMestMedicineRepository#delete.call', { id });
    await this.expMestMedicineRepository.delete(id);
    this.logger.info('ExpMestMedicineRepository#delete.result');
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
  private convertLongToNumber(entity: ExpMestMedicine): void {
    const numberFields: (keyof ExpMestMedicine)[] = [
      'hisId', 'expMestId', 'medicineId', 'tdlMediStockId', 'tdlMedicineTypeId',
      'expMestMetyReqId', 'ckImpMestMedicineId', 'isExport', 'amount', 'exportAmount',
      'exportTime', 'approvalTime', 'approvalDate', 'expTime', 'expDate',
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

