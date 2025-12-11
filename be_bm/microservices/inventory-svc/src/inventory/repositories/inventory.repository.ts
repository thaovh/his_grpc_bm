import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

import { ExpMest } from '../entities/exp-mest.entity';
import { CreateExpMestDto } from '../dto/create-exp-mest.dto';
import { UpdateExpMestDto } from '../dto/update-exp-mest.dto';

@Injectable()
export class InventoryRepository {
  constructor(
    @InjectRepository(ExpMest)
    private readonly expMestRepository: Repository<ExpMest>,
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
  ) {
    this.logger.setContext(InventoryRepository.name);
  }

  async findAll(options?: FindManyOptions<ExpMest>): Promise<ExpMest[]> {
    this.logger.info('InventoryRepository#findAll.call', options);
    const result = await this.expMestRepository.find(options);
    // Convert Long objects to numbers for Oracle compatibility
    result.forEach(expMest => this.convertLongToNumber(expMest));
    this.logger.info('InventoryRepository#findAll.result', { count: result.length });
    return result;
  }

  async findOne(options?: FindOneOptions<ExpMest>): Promise<ExpMest | null> {
    this.logger.info('InventoryRepository#findOne.call', options);
    const result = await this.expMestRepository.findOne(options);
    if (result) {
      this.convertLongToNumber(result);
    }
    this.logger.info('InventoryRepository#findOne.result', { found: !!result });
    return result;
  }

  async findById(id: string): Promise<ExpMest | null> {
    this.logger.info('InventoryRepository#findById.call', { id });
    const result = await this.expMestRepository.findOne({ where: { id } });
    if (result) {
      this.convertLongToNumber(result);
    }
    this.logger.info('InventoryRepository#findById.result', { found: !!result });
    return result;
  }

  async findByExpMestId(expMestId: number): Promise<ExpMest | null> {
    this.logger.info('InventoryRepository#findByExpMestId.call', { expMestId });
    const result = await this.expMestRepository.findOne({ where: { expMestId } });
    if (result) {
      this.convertLongToNumber(result);
    }
    this.logger.info('InventoryRepository#findByExpMestId.result', { found: !!result });
    return result;
  }

  async count(options?: FindManyOptions<ExpMest>): Promise<number> {
    this.logger.info('InventoryRepository#count.call', options);
    const result = await this.expMestRepository.count(options);
    this.logger.info('InventoryRepository#count.result', { count: result });
    return result;
  }

  async create(expMestDto: CreateExpMestDto): Promise<ExpMest> {
    this.logger.info('InventoryRepository#create.call', { 
      expMestId: expMestDto.expMestId, 
      createdBy: expMestDto.createdBy,
      exportStatusId: expMestDto.exportStatusId 
    });
    console.log('=== InventoryRepository#create ===');
    console.log('expMestDto.exportStatusId:', expMestDto.exportStatusId);
    console.log('typeof expMestDto.exportStatusId:', typeof expMestDto.exportStatusId);
    console.log('expMestDto.exportStatusId truthy?', !!expMestDto.exportStatusId);
    
    // Generate UUID manually for Oracle compatibility
    const { randomUUID } = require('crypto');
    const id = randomUUID();
    const now = new Date();
    
    // Create entity - explicitly set ALL fields (including nullable) to avoid DEFAULT values
    const expMestData: any = {
      id,
      expMestId: this.convertToNumber(expMestDto.expMestId),
      expMestCode: expMestDto.expMestCode ?? null,
      expMestTypeId: this.convertToNumber(expMestDto.expMestTypeId),
      expMestSttId: this.convertToNumber(expMestDto.expMestSttId),
      mediStockId: this.convertToNumber(expMestDto.mediStockId),
      reqLoginname: expMestDto.reqLoginname ?? null,
      reqUsername: expMestDto.reqUsername ?? null,
      reqRoomId: this.convertToNumber(expMestDto.reqRoomId),
      reqDepartmentId: this.convertToNumber(expMestDto.reqDepartmentId),
      createDate: this.convertToNumber(expMestDto.createDate),
      serviceReqId: this.convertToNumber(expMestDto.serviceReqId),
      tdlTotalPrice: this.convertToNumber(expMestDto.tdlTotalPrice),
      tdlServiceReqCode: expMestDto.tdlServiceReqCode ?? null,
      tdlIntructionTime: this.convertToNumber(expMestDto.tdlIntructionTime),
      tdlIntructionDate: this.convertToNumber(expMestDto.tdlIntructionDate),
      tdlTreatmentId: this.convertToNumber(expMestDto.tdlTreatmentId),
      tdlTreatmentCode: expMestDto.tdlTreatmentCode ?? null,
      tdlPatientId: this.convertToNumber(expMestDto.tdlPatientId),
      tdlPatientCode: expMestDto.tdlPatientCode ?? null,
      tdlPatientName: expMestDto.tdlPatientName ?? null,
      tdlPatientFirstName: expMestDto.tdlPatientFirstName ?? null,
      tdlPatientLastName: expMestDto.tdlPatientLastName ?? null,
      tdlPatientDob: this.convertToNumber(expMestDto.tdlPatientDob),
      tdlPatientIsHasNotDayDob: this.convertToNumber(expMestDto.tdlPatientIsHasNotDayDob),
      tdlPatientAddress: expMestDto.tdlPatientAddress ?? null,
      tdlPatientGenderId: this.convertToNumber(expMestDto.tdlPatientGenderId),
      tdlPatientGenderName: expMestDto.tdlPatientGenderName ?? null,
      tdlPatientTypeId: this.convertToNumber(expMestDto.tdlPatientTypeId),
      tdlHeinCardNumber: expMestDto.tdlHeinCardNumber ?? null,
      tdlPatientPhone: expMestDto.tdlPatientPhone ?? null,
      tdlPatientProvinceCode: expMestDto.tdlPatientProvinceCode ?? null,
      tdlPatientCommuneCode: expMestDto.tdlPatientCommuneCode ?? null,
      tdlPatientNationalName: expMestDto.tdlPatientNationalName ?? null,
      tdlAggrPatientCode: expMestDto.tdlAggrPatientCode ?? null,
      tdlAggrTreatmentCode: expMestDto.tdlAggrTreatmentCode ?? null,
      virCreateMonth: this.convertToNumber(expMestDto.virCreateMonth),
      virCreateYear: this.convertToNumber(expMestDto.virCreateYear),
      icdCode: expMestDto.icdCode ?? null,
      icdName: expMestDto.icdName ?? null,
      icdSubCode: expMestDto.icdSubCode ?? null,
      icdText: expMestDto.icdText ?? null,
      reqUserTitle: expMestDto.reqUserTitle ?? null,
      expMestSubCode: expMestDto.expMestSubCode ?? null,
      expMestSubCode2: expMestDto.expMestSubCode2 ?? null,
      virHeinCardPrefix: expMestDto.virHeinCardPrefix ?? null,
      priority: this.convertToNumber(expMestDto.priority),
      numOrder: this.convertToNumber(expMestDto.numOrder),
      expMestTypeCode: expMestDto.expMestTypeCode ?? null,
      expMestTypeName: expMestDto.expMestTypeName ?? null,
      expMestSttCode: expMestDto.expMestSttCode ?? null,
      expMestSttName: expMestDto.expMestSttName ?? null,
      mediStockCode: expMestDto.mediStockCode ?? null,
      mediStockName: expMestDto.mediStockName ?? null,
      reqDepartmentCode: expMestDto.reqDepartmentCode ?? null,
      reqDepartmentName: expMestDto.reqDepartmentName ?? null,
      reqRoomCode: expMestDto.reqRoomCode ?? null,
      reqRoomName: expMestDto.reqRoomName ?? null,
      lastExpLoginname: expMestDto.lastExpLoginname ?? null,
      lastExpUsername: expMestDto.lastExpUsername ?? null,
      lastExpTime: this.convertToNumber(expMestDto.lastExpTime),
      finishTime: this.convertToNumber(expMestDto.finishTime),
      finishDate: this.convertToNumber(expMestDto.finishDate),
      isExportEqualApprove: this.convertToNumber(expMestDto.isExportEqualApprove),
      lastApprovalLoginname: expMestDto.lastApprovalLoginname ?? null,
      lastApprovalUsername: expMestDto.lastApprovalUsername ?? null,
      lastApprovalTime: this.convertToNumber(expMestDto.lastApprovalTime),
      lastApprovalDate: this.convertToNumber(expMestDto.lastApprovalDate),
      treatmentIsActive: this.convertToNumber(expMestDto.treatmentIsActive),
      patientTypeName: expMestDto.patientTypeName ?? null,
      patientTypeCode: expMestDto.patientTypeCode ?? null,
      tdlIntructionDateMin: this.convertToNumber(expMestDto.tdlIntructionDateMin),
      // Use exportStatusId from DTO if provided, otherwise use default from env, otherwise don't set (let database use default)
      ...(expMestDto.exportStatusId || this.configService.get<string>('DEFAULT_EXPORT_STATUS_ID')
        ? { exportStatusId: expMestDto.exportStatusId ?? this.configService.get<string>('DEFAULT_EXPORT_STATUS_ID') }
        : {}),
      isActive: 1,
      version: 1,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      createdBy: expMestDto.createdBy ?? null,
      updatedBy: expMestDto.createdBy ?? null, // Also set on create
    };
    
    console.log('expMestData has exportStatusId?', 'exportStatusId' in expMestData);
    console.log('expMestData.exportStatusId:', expMestData.exportStatusId);
    console.log('expMestData keys:', Object.keys(expMestData).filter(k => k.includes('export')));
    
    const expMest = this.expMestRepository.create(expMestData);
    console.log('Created entity exportStatusId:', (expMest as any).exportStatusId);
    const saved = await this.expMestRepository.save(expMest);
    console.log('Saved entity exportStatusId:', (saved as any).exportStatusId);
    
    // Fetch the saved entity
    const savedExpMest = await this.expMestRepository.findOne({ 
      where: { id }
    });
    
    if (!savedExpMest) {
      throw new Error('Failed to fetch created ExpMest');
    }
    
    // Convert Long objects to numbers for Oracle compatibility
    this.convertLongToNumber(savedExpMest);
    this.logger.info('InventoryRepository#create.result', { id: savedExpMest.id, expMestId: savedExpMest.expMestId });
    return savedExpMest;
  }

  async update(id: string, expMestDto: UpdateExpMestDto): Promise<ExpMest> {
    this.logger.info('InventoryRepository#update.call', { id });
    
    const expMest = await this.expMestRepository.findOne({ where: { id } });
    if (!expMest) {
      throw new Error(`ExpMest with id ${id} not found`);
    }
    
    // Update fields
    if (expMestDto.expMestCode !== undefined) expMest.expMestCode = expMestDto.expMestCode;
    if (expMestDto.expMestTypeId !== undefined) expMest.expMestTypeId = this.convertToNumber(expMestDto.expMestTypeId);
    if (expMestDto.expMestSttId !== undefined) expMest.expMestSttId = this.convertToNumber(expMestDto.expMestSttId);
    if (expMestDto.mediStockId !== undefined) expMest.mediStockId = this.convertToNumber(expMestDto.mediStockId);
    if (expMestDto.reqLoginname !== undefined) expMest.reqLoginname = expMestDto.reqLoginname;
    if (expMestDto.reqUsername !== undefined) expMest.reqUsername = expMestDto.reqUsername;
    if (expMestDto.reqRoomId !== undefined) expMest.reqRoomId = this.convertToNumber(expMestDto.reqRoomId);
    if (expMestDto.reqDepartmentId !== undefined) expMest.reqDepartmentId = this.convertToNumber(expMestDto.reqDepartmentId);
    if (expMestDto.createDate !== undefined) expMest.createDate = this.convertToNumber(expMestDto.createDate);
    if (expMestDto.serviceReqId !== undefined) expMest.serviceReqId = this.convertToNumber(expMestDto.serviceReqId);
    if (expMestDto.tdlTotalPrice !== undefined) expMest.tdlTotalPrice = this.convertToNumber(expMestDto.tdlTotalPrice);
    if (expMestDto.tdlServiceReqCode !== undefined) expMest.tdlServiceReqCode = expMestDto.tdlServiceReqCode;
    if (expMestDto.tdlIntructionTime !== undefined) expMest.tdlIntructionTime = this.convertToNumber(expMestDto.tdlIntructionTime);
    if (expMestDto.tdlIntructionDate !== undefined) expMest.tdlIntructionDate = this.convertToNumber(expMestDto.tdlIntructionDate);
    if (expMestDto.tdlTreatmentId !== undefined) expMest.tdlTreatmentId = this.convertToNumber(expMestDto.tdlTreatmentId);
    if (expMestDto.tdlTreatmentCode !== undefined) expMest.tdlTreatmentCode = expMestDto.tdlTreatmentCode;
    if (expMestDto.tdlPatientId !== undefined) expMest.tdlPatientId = this.convertToNumber(expMestDto.tdlPatientId);
    if (expMestDto.tdlPatientCode !== undefined) expMest.tdlPatientCode = expMestDto.tdlPatientCode;
    if (expMestDto.tdlPatientName !== undefined) expMest.tdlPatientName = expMestDto.tdlPatientName;
    if (expMestDto.tdlPatientFirstName !== undefined) expMest.tdlPatientFirstName = expMestDto.tdlPatientFirstName;
    if (expMestDto.tdlPatientLastName !== undefined) expMest.tdlPatientLastName = expMestDto.tdlPatientLastName;
    if (expMestDto.tdlPatientDob !== undefined) expMest.tdlPatientDob = this.convertToNumber(expMestDto.tdlPatientDob);
    if (expMestDto.tdlPatientIsHasNotDayDob !== undefined) expMest.tdlPatientIsHasNotDayDob = this.convertToNumber(expMestDto.tdlPatientIsHasNotDayDob);
    if (expMestDto.tdlPatientAddress !== undefined) expMest.tdlPatientAddress = expMestDto.tdlPatientAddress;
    if (expMestDto.tdlPatientGenderId !== undefined) expMest.tdlPatientGenderId = this.convertToNumber(expMestDto.tdlPatientGenderId);
    if (expMestDto.tdlPatientGenderName !== undefined) expMest.tdlPatientGenderName = expMestDto.tdlPatientGenderName;
    if (expMestDto.tdlPatientTypeId !== undefined) expMest.tdlPatientTypeId = this.convertToNumber(expMestDto.tdlPatientTypeId);
    if (expMestDto.tdlHeinCardNumber !== undefined) expMest.tdlHeinCardNumber = expMestDto.tdlHeinCardNumber;
    if (expMestDto.tdlPatientPhone !== undefined) expMest.tdlPatientPhone = expMestDto.tdlPatientPhone;
    if (expMestDto.tdlPatientProvinceCode !== undefined) expMest.tdlPatientProvinceCode = expMestDto.tdlPatientProvinceCode;
    if (expMestDto.tdlPatientCommuneCode !== undefined) expMest.tdlPatientCommuneCode = expMestDto.tdlPatientCommuneCode;
    if (expMestDto.tdlPatientNationalName !== undefined) expMest.tdlPatientNationalName = expMestDto.tdlPatientNationalName;
    if (expMestDto.tdlAggrPatientCode !== undefined) expMest.tdlAggrPatientCode = expMestDto.tdlAggrPatientCode;
    if (expMestDto.tdlAggrTreatmentCode !== undefined) expMest.tdlAggrTreatmentCode = expMestDto.tdlAggrTreatmentCode;
    if (expMestDto.virCreateMonth !== undefined) expMest.virCreateMonth = this.convertToNumber(expMestDto.virCreateMonth);
    if (expMestDto.virCreateYear !== undefined) expMest.virCreateYear = this.convertToNumber(expMestDto.virCreateYear);
    if (expMestDto.icdCode !== undefined) expMest.icdCode = expMestDto.icdCode;
    if (expMestDto.icdName !== undefined) expMest.icdName = expMestDto.icdName;
    if (expMestDto.icdSubCode !== undefined) expMest.icdSubCode = expMestDto.icdSubCode;
    if (expMestDto.icdText !== undefined) expMest.icdText = expMestDto.icdText;
    if (expMestDto.reqUserTitle !== undefined) expMest.reqUserTitle = expMestDto.reqUserTitle;
    if (expMestDto.expMestSubCode !== undefined) expMest.expMestSubCode = expMestDto.expMestSubCode;
    if (expMestDto.expMestSubCode2 !== undefined) expMest.expMestSubCode2 = expMestDto.expMestSubCode2;
    if (expMestDto.virHeinCardPrefix !== undefined) expMest.virHeinCardPrefix = expMestDto.virHeinCardPrefix;
    if (expMestDto.priority !== undefined) expMest.priority = this.convertToNumber(expMestDto.priority);
    if (expMestDto.numOrder !== undefined) expMest.numOrder = this.convertToNumber(expMestDto.numOrder);
    if (expMestDto.expMestTypeCode !== undefined) expMest.expMestTypeCode = expMestDto.expMestTypeCode;
    if (expMestDto.expMestTypeName !== undefined) expMest.expMestTypeName = expMestDto.expMestTypeName;
    if (expMestDto.expMestSttCode !== undefined) expMest.expMestSttCode = expMestDto.expMestSttCode;
    if (expMestDto.expMestSttName !== undefined) expMest.expMestSttName = expMestDto.expMestSttName;
    if (expMestDto.mediStockCode !== undefined) expMest.mediStockCode = expMestDto.mediStockCode;
    if (expMestDto.mediStockName !== undefined) expMest.mediStockName = expMestDto.mediStockName;
    if (expMestDto.reqDepartmentCode !== undefined) expMest.reqDepartmentCode = expMestDto.reqDepartmentCode;
    if (expMestDto.reqDepartmentName !== undefined) expMest.reqDepartmentName = expMestDto.reqDepartmentName;
    if (expMestDto.reqRoomCode !== undefined) expMest.reqRoomCode = expMestDto.reqRoomCode;
    if (expMestDto.reqRoomName !== undefined) expMest.reqRoomName = expMestDto.reqRoomName;
    if (expMestDto.lastExpLoginname !== undefined) expMest.lastExpLoginname = expMestDto.lastExpLoginname;
    if (expMestDto.lastExpUsername !== undefined) expMest.lastExpUsername = expMestDto.lastExpUsername;
    if (expMestDto.lastExpTime !== undefined) expMest.lastExpTime = this.convertToNumber(expMestDto.lastExpTime);
    if (expMestDto.finishTime !== undefined) expMest.finishTime = this.convertToNumber(expMestDto.finishTime);
    if (expMestDto.finishDate !== undefined) expMest.finishDate = this.convertToNumber(expMestDto.finishDate);
    if (expMestDto.isExportEqualApprove !== undefined) expMest.isExportEqualApprove = this.convertToNumber(expMestDto.isExportEqualApprove);
    if (expMestDto.lastApprovalLoginname !== undefined) expMest.lastApprovalLoginname = expMestDto.lastApprovalLoginname;
    if (expMestDto.lastApprovalUsername !== undefined) expMest.lastApprovalUsername = expMestDto.lastApprovalUsername;
    if (expMestDto.lastApprovalTime !== undefined) expMest.lastApprovalTime = this.convertToNumber(expMestDto.lastApprovalTime);
    if (expMestDto.lastApprovalDate !== undefined) expMest.lastApprovalDate = this.convertToNumber(expMestDto.lastApprovalDate);
    if (expMestDto.treatmentIsActive !== undefined) expMest.treatmentIsActive = this.convertToNumber(expMestDto.treatmentIsActive);
    if (expMestDto.patientTypeName !== undefined) expMest.patientTypeName = expMestDto.patientTypeName;
    if (expMestDto.patientTypeCode !== undefined) expMest.patientTypeCode = expMestDto.patientTypeCode;
    if (expMestDto.tdlIntructionDateMin !== undefined) expMest.tdlIntructionDateMin = this.convertToNumber(expMestDto.tdlIntructionDateMin);
    // Update exportStatusId: use from DTO if provided, otherwise use default from env, otherwise preserve existing value
    if (expMestDto.exportStatusId !== undefined) {
      // If explicitly provided (even if null), use it
      expMest.exportStatusId = expMestDto.exportStatusId ?? this.configService.get<string>('DEFAULT_EXPORT_STATUS_ID') ?? null;
    } else if (expMest.exportStatusId === null || expMest.exportStatusId === undefined) {
      // If not provided in DTO and current value is null/undefined, use default from env
      const defaultExportStatusId = this.configService.get<string>('DEFAULT_EXPORT_STATUS_ID');
      if (defaultExportStatusId) {
        expMest.exportStatusId = defaultExportStatusId;
      }
    }
    if (expMestDto.updatedBy !== undefined && expMestDto.updatedBy !== null) {
      expMest.updatedBy = expMestDto.updatedBy;
    }
    
    expMest.updatedAt = new Date();
    expMest.version = (expMest.version || 0) + 1;
    
    await this.expMestRepository.save(expMest);
    
    this.convertLongToNumber(expMest);
    this.logger.info('InventoryRepository#update.result', { id: expMest.id });
    return expMest;
  }

  async delete(id: string): Promise<void> {
    this.logger.info('InventoryRepository#delete.call', { id });
    await this.expMestRepository.softDelete(id);
    this.logger.info('InventoryRepository#delete.result', { id });
  }

  /**
   * Convert Long object to number (for Oracle NUMBER(19,0) fields)
   */
  private convertLongToNumber(entity: ExpMest): void {
    // Convert all number fields that might be Long objects
    const numberFields: (keyof ExpMest)[] = [
      'expMestId', 'expMestTypeId', 'expMestSttId', 'mediStockId',
      'reqRoomId', 'reqDepartmentId', 'createDate', 'serviceReqId',
      'tdlTotalPrice', 'tdlIntructionTime', 'tdlIntructionDate',
      'tdlTreatmentId', 'tdlPatientId', 'tdlPatientDob',
      'tdlPatientIsHasNotDayDob', 'tdlPatientGenderId', 'tdlPatientTypeId',
      'virCreateMonth', 'virCreateYear', 'priority', 'treatmentIsActive',
      // Newly added numeric fields from HIS
      'lastExpTime', 'finishTime', 'finishDate', 'isExportEqualApprove',
      'lastApprovalTime', 'lastApprovalDate', 'numOrder', 'tdlIntructionDateMin',
    ];
    
    numberFields.forEach(field => {
      const value = entity[field];
      if (value !== null && value !== undefined && typeof value === 'object' && 'low' in value && 'high' in value) {
        const longValue = value as unknown as { low: number; high: number };
        (entity as any)[field] = longValue.low + (longValue.high * 0x100000000);
      }
    });
  }

  /**
   * Convert value to number, handling Long objects from gRPC
   */
  private convertToNumber(value: any): number | null {
    if (value === null || value === undefined) {
      return null;
    }
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'object' && 'low' in value && 'high' in value) {
      const longValue = value as { low: number; high: number };
      return longValue.low + (longValue.high * 0x100000000);
    }
    return Number(value);
  }
}

