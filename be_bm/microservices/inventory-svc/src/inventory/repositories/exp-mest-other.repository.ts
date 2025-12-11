import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions, In } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

import { ExpMestOther } from '../entities/exp-mest-other.entity';
import { CreateExpMestOtherDto } from '../dto/create-exp-mest-other.dto';
import { UpdateExpMestOtherDto } from '../dto/update-exp-mest-other.dto';

@Injectable()
export class ExpMestOtherRepository {
  constructor(
    @InjectRepository(ExpMestOther)
    private readonly expMestOtherRepository: Repository<ExpMestOther>,
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
  ) {
    this.logger.setContext(ExpMestOtherRepository.name);
  }

  async findAll(options?: FindManyOptions<ExpMestOther>): Promise<ExpMestOther[]> {
    this.logger.info('ExpMestOtherRepository#findAll.call', options);
    const result = await this.expMestOtherRepository.find(options);
    result.forEach(item => this.convertLongToNumber(item));
    this.logger.info('ExpMestOtherRepository#findAll.result', { count: result.length });
    return result;
  }

  async findOne(options?: FindOneOptions<ExpMestOther>): Promise<ExpMestOther | null> {
    this.logger.info('ExpMestOtherRepository#findOne.call', options);
    const result = await this.expMestOtherRepository.findOne(options);
    if (result) {
      this.convertLongToNumber(result);
    }
    this.logger.info('ExpMestOtherRepository#findOne.result', { found: !!result });
    return result;
  }

  async findById(id: string): Promise<ExpMestOther | null> {
    this.logger.info('ExpMestOtherRepository#findById.call', { id });
    const result = await this.expMestOtherRepository.findOne({ where: { id } });
    if (result) {
      this.convertLongToNumber(result);
    }
    this.logger.info('ExpMestOtherRepository#findById.result', { found: !!result });
    return result;
  }

  async findByHisExpMestId(hisExpMestId: number): Promise<ExpMestOther | null> {
    this.logger.info('ExpMestOtherRepository#findByHisExpMestId.call', { hisExpMestId });
    const result = await this.expMestOtherRepository.findOne({ where: { hisExpMestId } });
    if (result) {
      this.convertLongToNumber(result);
    }
    this.logger.info('ExpMestOtherRepository#findByHisExpMestId.result', { found: !!result });
    return result;
  }

  /**
   * Find multiple ExpMestOther by array of hisExpMestIds
   */
  async findByHisExpMestIds(hisExpMestIds: number[]): Promise<ExpMestOther[]> {
    this.logger.info('ExpMestOtherRepository#findByHisExpMestIds.call', { count: hisExpMestIds.length });
    
    if (!hisExpMestIds || hisExpMestIds.length === 0) {
      return [];
    }

    // Convert to numbers and filter invalid values
    const validIds = hisExpMestIds
      .map(id => this.convertToNumber(id))
      .filter((id): id is number => id !== null && !isNaN(id));

    if (validIds.length === 0) {
      return [];
    }

    // Use TypeORM In() operator
    const result = await this.expMestOtherRepository.find({
      where: { hisExpMestId: In(validIds) },
    });

    result.forEach(item => this.convertLongToNumber(item));
    this.logger.info('ExpMestOtherRepository#findByHisExpMestIds.result', { 
      requested: hisExpMestIds.length,
      valid: validIds.length,
      found: result.length 
    });
    return result;
  }

  async count(options?: FindManyOptions<ExpMestOther>): Promise<number> {
    this.logger.info('ExpMestOtherRepository#count.call', options);
    const result = await this.expMestOtherRepository.count(options);
    this.logger.info('ExpMestOtherRepository#count.result', { count: result });
    return result;
  }

  async create(dto: CreateExpMestOtherDto): Promise<ExpMestOther> {
    this.logger.info('ExpMestOtherRepository#create.call', { 
      hisExpMestId: dto.hisExpMestId,
      workingStateId: dto.workingStateId 
    });
    
    const { randomUUID } = require('crypto');
    const id = randomUUID();
    const now = new Date();
    
    const data: any = {
      id,
      hisExpMestId: this.convertToNumber(dto.hisExpMestId),
      expMestCode: dto.expMestCode ?? null,
      expMestTypeId: this.convertToNumber(dto.expMestTypeId),
      expMestSttId: this.convertToNumber(dto.expMestSttId),
      mediStockId: this.convertToNumber(dto.mediStockId),
      reqLoginname: dto.reqLoginname ?? null,
      reqUsername: dto.reqUsername ?? null,
      reqRoomId: this.convertToNumber(dto.reqRoomId),
      reqDepartmentId: this.convertToNumber(dto.reqDepartmentId),
      createDate: this.convertToNumber(dto.createDate),
      reqUserTitle: dto.reqUserTitle ?? null,
      serviceReqId: this.convertToNumber(dto.serviceReqId),
      tdlTotalPrice: this.convertToNumber(dto.tdlTotalPrice),
      tdlServiceReqCode: dto.tdlServiceReqCode ?? null,
      tdlIntructionTime: this.convertToNumber(dto.tdlIntructionTime),
      tdlIntructionDate: this.convertToNumber(dto.tdlIntructionDate),
      tdlIntructionDateMin: this.convertToNumber(dto.tdlIntructionDateMin),
      tdlTreatmentId: this.convertToNumber(dto.tdlTreatmentId),
      tdlTreatmentCode: dto.tdlTreatmentCode ?? null,
      tdlPatientId: this.convertToNumber(dto.tdlPatientId),
      tdlPatientCode: dto.tdlPatientCode ?? null,
      tdlPatientName: dto.tdlPatientName ?? null,
      tdlPatientFirstName: dto.tdlPatientFirstName ?? null,
      tdlPatientLastName: dto.tdlPatientLastName ?? null,
      tdlPatientDob: this.convertToNumber(dto.tdlPatientDob),
      tdlPatientIsHasNotDayDob: this.convertToNumber(dto.tdlPatientIsHasNotDayDob),
      tdlPatientAddress: dto.tdlPatientAddress ?? null,
      tdlPatientGenderId: this.convertToNumber(dto.tdlPatientGenderId),
      tdlPatientGenderName: dto.tdlPatientGenderName ?? null,
      tdlPatientTypeId: this.convertToNumber(dto.tdlPatientTypeId),
      tdlHeinCardNumber: dto.tdlHeinCardNumber ?? null,
      tdlPatientPhone: dto.tdlPatientPhone ?? null,
      tdlPatientProvinceCode: dto.tdlPatientProvinceCode ?? null,
      tdlPatientDistrictCode: dto.tdlPatientDistrictCode ?? null,
      tdlPatientCommuneCode: dto.tdlPatientCommuneCode ?? null,
      tdlPatientNationalName: dto.tdlPatientNationalName ?? null,
      virCreateMonth: this.convertToNumber(dto.virCreateMonth),
      virCreateYear: this.convertToNumber(dto.virCreateYear),
      virHeinCardPrefix: dto.virHeinCardPrefix ?? null,
      icdCode: dto.icdCode ?? null,
      icdName: dto.icdName ?? null,
      icdSubCode: dto.icdSubCode ?? null,
      icdText: dto.icdText ?? null,
      expMestTypeCode: dto.expMestTypeCode ?? null,
      expMestTypeName: dto.expMestTypeName ?? null,
      expMestSttCode: dto.expMestSttCode ?? null,
      expMestSttName: dto.expMestSttName ?? null,
      mediStockCode: dto.mediStockCode ?? null,
      mediStockName: dto.mediStockName ?? null,
      reqDepartmentCode: dto.reqDepartmentCode ?? null,
      reqDepartmentName: dto.reqDepartmentName ?? null,
      reqRoomCode: dto.reqRoomCode ?? null,
      reqRoomName: dto.reqRoomName ?? null,
      tdlAggrPatientCode: dto.tdlAggrPatientCode ?? null,
      tdlAggrTreatmentCode: dto.tdlAggrTreatmentCode ?? null,
      expMestSubCode: dto.expMestSubCode ?? null,
      expMestSubCode2: dto.expMestSubCode2 ?? null,
      numOrder: this.convertToNumber(dto.numOrder),
      priority: this.convertToNumber(dto.priority),
      groupCode: dto.groupCode ?? null,
      patientTypeCode: dto.patientTypeCode ?? null,
      patientTypeName: dto.patientTypeName ?? null,
      treatmentIsActive: this.convertToNumber(dto.treatmentIsActive),
      lastExpLoginname: dto.lastExpLoginname ?? null,
      lastExpUsername: dto.lastExpUsername ?? null,
      lastExpTime: this.convertToNumber(dto.lastExpTime),
      finishTime: this.convertToNumber(dto.finishTime),
      finishDate: this.convertToNumber(dto.finishDate),
      isExportEqualApprove: this.convertToNumber(dto.isExportEqualApprove),
      lastApprovalLoginname: dto.lastApprovalLoginname ?? null,
      lastApprovalUsername: dto.lastApprovalUsername ?? null,
      lastApprovalTime: this.convertToNumber(dto.lastApprovalTime),
      lastApprovalDate: this.convertToNumber(dto.lastApprovalDate),
      workingStateId: dto.workingStateId ?? null,
      hisCreateTime: this.convertToNumber(dto.hisCreateTime),
      hisModifyTime: this.convertToNumber(dto.hisModifyTime),
      hisCreator: dto.hisCreator ?? null,
      hisModifier: dto.hisModifier ?? null,
      createdAt: now,
      updatedAt: now,
      createdBy: dto.createdBy,
      updatedBy: dto.createdBy,
      version: 1,
      isActive: 1,
    };

    const result = await this.expMestOtherRepository.save(data);
    this.convertLongToNumber(result);
    this.logger.info('ExpMestOtherRepository#create.result', { id: result.id });
    return result;
  }

  async update(id: string, dto: UpdateExpMestOtherDto): Promise<ExpMestOther> {
    this.logger.info('ExpMestOtherRepository#update.call', { id });
    
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error(`ExpMestOther with id ${id} not found`);
    }

    const updateData: any = {};
    if (dto.expMestCode !== undefined) updateData.expMestCode = dto.expMestCode ?? null;
    if (dto.expMestTypeId !== undefined) updateData.expMestTypeId = this.convertToNumber(dto.expMestTypeId);
    if (dto.expMestSttId !== undefined) updateData.expMestSttId = this.convertToNumber(dto.expMestSttId);
    if (dto.mediStockId !== undefined) updateData.mediStockId = this.convertToNumber(dto.mediStockId);
    if (dto.reqLoginname !== undefined) updateData.reqLoginname = dto.reqLoginname ?? null;
    if (dto.reqUsername !== undefined) updateData.reqUsername = dto.reqUsername ?? null;
    if (dto.reqRoomId !== undefined) updateData.reqRoomId = this.convertToNumber(dto.reqRoomId);
    if (dto.reqDepartmentId !== undefined) updateData.reqDepartmentId = this.convertToNumber(dto.reqDepartmentId);
    if (dto.createDate !== undefined) updateData.createDate = this.convertToNumber(dto.createDate);
    if (dto.reqUserTitle !== undefined) updateData.reqUserTitle = dto.reqUserTitle ?? null;
    if (dto.serviceReqId !== undefined) updateData.serviceReqId = this.convertToNumber(dto.serviceReqId);
    if (dto.tdlTotalPrice !== undefined) updateData.tdlTotalPrice = this.convertToNumber(dto.tdlTotalPrice);
    if (dto.tdlServiceReqCode !== undefined) updateData.tdlServiceReqCode = dto.tdlServiceReqCode ?? null;
    if (dto.tdlIntructionTime !== undefined) updateData.tdlIntructionTime = this.convertToNumber(dto.tdlIntructionTime);
    if (dto.tdlIntructionDate !== undefined) updateData.tdlIntructionDate = this.convertToNumber(dto.tdlIntructionDate);
    if (dto.tdlIntructionDateMin !== undefined) updateData.tdlIntructionDateMin = this.convertToNumber(dto.tdlIntructionDateMin);
    if (dto.tdlTreatmentId !== undefined) updateData.tdlTreatmentId = this.convertToNumber(dto.tdlTreatmentId);
    if (dto.tdlTreatmentCode !== undefined) updateData.tdlTreatmentCode = dto.tdlTreatmentCode ?? null;
    if (dto.tdlPatientId !== undefined) updateData.tdlPatientId = this.convertToNumber(dto.tdlPatientId);
    if (dto.tdlPatientCode !== undefined) updateData.tdlPatientCode = dto.tdlPatientCode ?? null;
    if (dto.tdlPatientName !== undefined) updateData.tdlPatientName = dto.tdlPatientName ?? null;
    if (dto.tdlPatientFirstName !== undefined) updateData.tdlPatientFirstName = dto.tdlPatientFirstName ?? null;
    if (dto.tdlPatientLastName !== undefined) updateData.tdlPatientLastName = dto.tdlPatientLastName ?? null;
    if (dto.tdlPatientDob !== undefined) updateData.tdlPatientDob = this.convertToNumber(dto.tdlPatientDob);
    if (dto.tdlPatientIsHasNotDayDob !== undefined) updateData.tdlPatientIsHasNotDayDob = this.convertToNumber(dto.tdlPatientIsHasNotDayDob);
    if (dto.tdlPatientAddress !== undefined) updateData.tdlPatientAddress = dto.tdlPatientAddress ?? null;
    if (dto.tdlPatientGenderId !== undefined) updateData.tdlPatientGenderId = this.convertToNumber(dto.tdlPatientGenderId);
    if (dto.tdlPatientGenderName !== undefined) updateData.tdlPatientGenderName = dto.tdlPatientGenderName ?? null;
    if (dto.tdlPatientTypeId !== undefined) updateData.tdlPatientTypeId = this.convertToNumber(dto.tdlPatientTypeId);
    if (dto.tdlHeinCardNumber !== undefined) updateData.tdlHeinCardNumber = dto.tdlHeinCardNumber ?? null;
    if (dto.tdlPatientPhone !== undefined) updateData.tdlPatientPhone = dto.tdlPatientPhone ?? null;
    if (dto.tdlPatientProvinceCode !== undefined) updateData.tdlPatientProvinceCode = dto.tdlPatientProvinceCode ?? null;
    if (dto.tdlPatientDistrictCode !== undefined) updateData.tdlPatientDistrictCode = dto.tdlPatientDistrictCode ?? null;
    if (dto.tdlPatientCommuneCode !== undefined) updateData.tdlPatientCommuneCode = dto.tdlPatientCommuneCode ?? null;
    if (dto.tdlPatientNationalName !== undefined) updateData.tdlPatientNationalName = dto.tdlPatientNationalName ?? null;
    if (dto.virCreateMonth !== undefined) updateData.virCreateMonth = this.convertToNumber(dto.virCreateMonth);
    if (dto.virCreateYear !== undefined) updateData.virCreateYear = this.convertToNumber(dto.virCreateYear);
    if (dto.virHeinCardPrefix !== undefined) updateData.virHeinCardPrefix = dto.virHeinCardPrefix ?? null;
    if (dto.icdCode !== undefined) updateData.icdCode = dto.icdCode ?? null;
    if (dto.icdName !== undefined) updateData.icdName = dto.icdName ?? null;
    if (dto.icdSubCode !== undefined) updateData.icdSubCode = dto.icdSubCode ?? null;
    if (dto.icdText !== undefined) updateData.icdText = dto.icdText ?? null;
    if (dto.expMestTypeCode !== undefined) updateData.expMestTypeCode = dto.expMestTypeCode ?? null;
    if (dto.expMestTypeName !== undefined) updateData.expMestTypeName = dto.expMestTypeName ?? null;
    if (dto.expMestSttCode !== undefined) updateData.expMestSttCode = dto.expMestSttCode ?? null;
    if (dto.expMestSttName !== undefined) updateData.expMestSttName = dto.expMestSttName ?? null;
    if (dto.mediStockCode !== undefined) updateData.mediStockCode = dto.mediStockCode ?? null;
    if (dto.mediStockName !== undefined) updateData.mediStockName = dto.mediStockName ?? null;
    if (dto.reqDepartmentCode !== undefined) updateData.reqDepartmentCode = dto.reqDepartmentCode ?? null;
    if (dto.reqDepartmentName !== undefined) updateData.reqDepartmentName = dto.reqDepartmentName ?? null;
    if (dto.reqRoomCode !== undefined) updateData.reqRoomCode = dto.reqRoomCode ?? null;
    if (dto.reqRoomName !== undefined) updateData.reqRoomName = dto.reqRoomName ?? null;
    if (dto.tdlAggrPatientCode !== undefined) updateData.tdlAggrPatientCode = dto.tdlAggrPatientCode ?? null;
    if (dto.tdlAggrTreatmentCode !== undefined) updateData.tdlAggrTreatmentCode = dto.tdlAggrTreatmentCode ?? null;
    if (dto.expMestSubCode !== undefined) updateData.expMestSubCode = dto.expMestSubCode ?? null;
    if (dto.expMestSubCode2 !== undefined) updateData.expMestSubCode2 = dto.expMestSubCode2 ?? null;
    if (dto.numOrder !== undefined) updateData.numOrder = this.convertToNumber(dto.numOrder);
    if (dto.priority !== undefined) updateData.priority = this.convertToNumber(dto.priority);
    if (dto.groupCode !== undefined) updateData.groupCode = dto.groupCode ?? null;
    if (dto.patientTypeCode !== undefined) updateData.patientTypeCode = dto.patientTypeCode ?? null;
    if (dto.patientTypeName !== undefined) updateData.patientTypeName = dto.patientTypeName ?? null;
    if (dto.treatmentIsActive !== undefined) updateData.treatmentIsActive = this.convertToNumber(dto.treatmentIsActive);
    if (dto.lastExpLoginname !== undefined) updateData.lastExpLoginname = dto.lastExpLoginname ?? null;
    if (dto.lastExpUsername !== undefined) updateData.lastExpUsername = dto.lastExpUsername ?? null;
    if (dto.lastExpTime !== undefined) updateData.lastExpTime = this.convertToNumber(dto.lastExpTime);
    if (dto.finishTime !== undefined) updateData.finishTime = this.convertToNumber(dto.finishTime);
    if (dto.finishDate !== undefined) updateData.finishDate = this.convertToNumber(dto.finishDate);
    if (dto.isExportEqualApprove !== undefined) updateData.isExportEqualApprove = this.convertToNumber(dto.isExportEqualApprove);
    if (dto.lastApprovalLoginname !== undefined) updateData.lastApprovalLoginname = dto.lastApprovalLoginname ?? null;
    if (dto.lastApprovalUsername !== undefined) updateData.lastApprovalUsername = dto.lastApprovalUsername ?? null;
    if (dto.lastApprovalTime !== undefined) updateData.lastApprovalTime = this.convertToNumber(dto.lastApprovalTime);
    if (dto.lastApprovalDate !== undefined) updateData.lastApprovalDate = this.convertToNumber(dto.lastApprovalDate);
    if (dto.workingStateId !== undefined) updateData.workingStateId = dto.workingStateId ?? null;
    if (dto.hisCreateTime !== undefined) updateData.hisCreateTime = this.convertToNumber(dto.hisCreateTime);
    if (dto.hisModifyTime !== undefined) updateData.hisModifyTime = this.convertToNumber(dto.hisModifyTime);
    if (dto.hisCreator !== undefined) updateData.hisCreator = dto.hisCreator ?? null;
    if (dto.hisModifier !== undefined) updateData.hisModifier = dto.hisModifier ?? null;
    
    updateData.updatedAt = new Date();
    updateData.updatedBy = dto.updatedBy;
    updateData.version = existing.version + 1;

    await this.expMestOtherRepository.update(id, updateData);
    const result = await this.findById(id);
    this.logger.info('ExpMestOtherRepository#update.result', { id: result?.id });
    return result!;
  }

  /**
   * Update ExpMestOther by hisExpMestId (HIS ID)
   */
  async updateByHisExpMestId(
    hisExpMestId: number,
    dto: Partial<UpdateExpMestOtherDto>,
    userId: string,
  ): Promise<ExpMestOther | null> {
    this.logger.info('ExpMestOtherRepository#updateByHisExpMestId.call', { hisExpMestId, userId });

    const existing = await this.findByHisExpMestId(hisExpMestId);
    if (!existing) {
      this.logger.warn('ExpMestOtherRepository#updateByHisExpMestId.notFound', { hisExpMestId });
      return null;
    }

    const updateDto: UpdateExpMestOtherDto = {
      ...dto,
      updatedBy: userId,
    };

    return await this.update(existing.id, updateDto);
  }

  private convertToNumber(value: any): number | null {
    if (value === null || value === undefined) return null;
    if (typeof value === 'number') return value;
    const num = Number(value);
    return isNaN(num) ? null : num;
  }

  private convertLongToNumber(obj: any): void {
    // Convert Long objects to numbers for Oracle compatibility
    const fields = [
      'hisExpMestId', 'expMestTypeId', 'expMestSttId', 'mediStockId',
      'reqRoomId', 'reqDepartmentId', 'createDate', 'serviceReqId',
      'tdlTotalPrice', 'tdlIntructionTime', 'tdlIntructionDate', 'tdlIntructionDateMin',
      'tdlTreatmentId', 'tdlPatientId', 'tdlPatientDob', 'tdlPatientIsHasNotDayDob',
      'tdlPatientGenderId', 'tdlPatientTypeId', 'virCreateMonth', 'virCreateYear',
      'numOrder', 'priority', 'treatmentIsActive', 'lastExpTime',
      'finishTime', 'finishDate', 'isExportEqualApprove',
      'lastApprovalTime', 'lastApprovalDate', 'hisCreateTime', 'hisModifyTime',
    ];
    fields.forEach(field => {
      if (obj[field] !== null && obj[field] !== undefined) {
        if (typeof obj[field] === 'object' && 'low' in obj[field] && 'high' in obj[field]) {
          const longValue = obj[field] as { low: number; high: number };
          obj[field] = longValue.low + (longValue.high * 0x100000000);
        }
      }
    });
  }
}

