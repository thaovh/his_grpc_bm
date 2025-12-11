import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions, EntityManager } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

import { InpatientExpMestChild } from '../entities/inpatient-exp-mest-child.entity';
import { CreateInpatientExpMestChildDto } from '../dto/create-inpatient-exp-mest-child.dto';
import { UpdateInpatientExpMestChildDto } from '../dto/update-inpatient-exp-mest-child.dto';

@Injectable()
export class InpatientExpMestChildRepository {
  constructor(
    @InjectRepository(InpatientExpMestChild)
    private readonly repository: Repository<InpatientExpMestChild>,
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
  ) {
    this.logger.setContext(InpatientExpMestChildRepository.name);
  }

  async findAll(options?: FindManyOptions<InpatientExpMestChild>): Promise<InpatientExpMestChild[]> {
    this.logger.info('InpatientExpMestChildRepository#findAll.call', options);
    const result = await this.repository.find(options);
    result.forEach(item => this.convertLongToNumber(item));
    this.logger.info('InpatientExpMestChildRepository#findAll.result', { count: result.length });
    return result;
  }

  async findOne(options?: FindOneOptions<InpatientExpMestChild>): Promise<InpatientExpMestChild | null> {
    this.logger.info('InpatientExpMestChildRepository#findOne.call', options);
    const result = await this.repository.findOne(options);
    if (result) {
      this.convertLongToNumber(result);
    }
    this.logger.info('InpatientExpMestChildRepository#findOne.result', { found: !!result });
    return result;
  }

  async findById(id: string, entityManager?: EntityManager): Promise<InpatientExpMestChild | null> {
    this.logger.info('InpatientExpMestChildRepository#findById.call', { id });
    const repo = entityManager ? entityManager.getRepository(InpatientExpMestChild) : this.repository;
    const result = await repo.findOne({ where: { id } });
    if (result) {
      this.convertLongToNumber(result);
    }
    this.logger.info('InpatientExpMestChildRepository#findById.result', { found: !!result });
    return result;
  }

  async findByHisExpMestId(hisExpMestId: number, entityManager?: EntityManager): Promise<InpatientExpMestChild | null> {
    this.logger.info('InpatientExpMestChildRepository#findByHisExpMestId.call', { hisExpMestId });
    const repo = entityManager ? entityManager.getRepository(InpatientExpMestChild) : this.repository;
    const result = await repo.findOne({ where: { hisExpMestId } });
    if (result) {
      this.convertLongToNumber(result);
    }
    this.logger.info('InpatientExpMestChildRepository#findByHisExpMestId.result', { found: !!result });
    return result;
  }

  async findByAggrExpMestId(aggrExpMestId: number): Promise<InpatientExpMestChild[]> {
    this.logger.info('InpatientExpMestChildRepository#findByAggrExpMestId.call', { aggrExpMestId });
    const result = await this.repository.find({ where: { aggrExpMestId } });
    result.forEach(item => this.convertLongToNumber(item));
    this.logger.info('InpatientExpMestChildRepository#findByAggrExpMestId.result', { count: result.length });
    return result;
  }

  async count(options?: FindManyOptions<InpatientExpMestChild>): Promise<number> {
    this.logger.info('InpatientExpMestChildRepository#count.call', options);
    const result = await this.repository.count(options);
    this.logger.info('InpatientExpMestChildRepository#count.result', { count: result });
    return result;
  }

  async create(dto: CreateInpatientExpMestChildDto, entityManager?: EntityManager): Promise<InpatientExpMestChild> {
    this.logger.info('InpatientExpMestChildRepository#create.call', {
      hisExpMestId: dto.hisExpMestId,
      aggrExpMestId: dto.aggrExpMestId
    });

    const { randomUUID } = require('crypto');
    const id = randomUUID();
    const now = new Date();

    const data: any = {
      id,
      hisExpMestId: this.convertToNumber(dto.hisExpMestId),
      aggrExpMestId: this.convertToNumber(dto.aggrExpMestId),
      aggrExpMestLocalId: dto.aggrExpMestLocalId ?? null,
      expMestCode: dto.expMestCode ?? null,
      expMestTypeId: this.convertToNumber(dto.expMestTypeId),
      expMestSttId: this.convertToNumber(dto.expMestSttId),
      mediStockId: this.convertToNumber(dto.mediStockId),
      reqLoginname: dto.reqLoginname ?? null,
      reqUsername: dto.reqUsername ?? null,
      reqRoomId: this.convertToNumber(dto.reqRoomId),
      reqDepartmentId: this.convertToNumber(dto.reqDepartmentId),
      createDate: this.convertToNumber(dto.createDate),
      tdlPatientTypeId: this.convertToNumber(dto.tdlPatientTypeId),
      virCreateMonth: this.convertToNumber(dto.virCreateMonth),
      virCreateYear: this.convertToNumber(dto.virCreateYear),
      reqUserTitle: dto.reqUserTitle ?? null,
      expMestSubCode: dto.expMestSubCode ?? null,
      expMestSubCode2: dto.expMestSubCode2 ?? null,
      numOrder: this.convertToNumber(dto.numOrder),
      tdlAggrPatientCode: dto.tdlAggrPatientCode ?? null,
      tdlAggrTreatmentCode: dto.tdlAggrTreatmentCode ?? null,
      expMestTypeCode: dto.expMestTypeCode ?? null,
      expMestTypeName: dto.expMestTypeName ?? null,
      expMestSttCode: dto.expMestSttCode ?? null,
      expMestSttName: dto.expMestSttName ?? null,
      mediStockCode: dto.mediStockCode ?? null,
      mediStockName: dto.mediStockName ?? null,
      reqDepartmentCode: dto.reqDepartmentCode ?? null,
      reqDepartmentName: dto.reqDepartmentName ?? null,
      tdlIntructionDateMin: this.convertToNumber(dto.tdlIntructionDateMin),
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
      reqRoomCode: dto.reqRoomCode ?? null,
      reqRoomName: dto.reqRoomName ?? null,
      groupCode: dto.groupCode ?? null,
      hisCreateTime: this.convertToNumber(dto.hisCreateTime),
      hisModifyTime: this.convertToNumber(dto.hisModifyTime),
      hisCreator: dto.hisCreator ?? null,
      hisModifier: dto.hisModifier ?? null,
      // Service Request fields
      serviceReqId: this.convertToNumber(dto.serviceReqId),
      tdlTotalPrice: this.convertToNumber(dto.tdlTotalPrice),
      tdlServiceReqCode: dto.tdlServiceReqCode ?? null,
      // Instruction fields
      tdlIntructionTime: this.convertToNumber(dto.tdlIntructionTime),
      tdlIntructionDate: this.convertToNumber(dto.tdlIntructionDate),
      // Treatment fields
      tdlTreatmentId: this.convertToNumber(dto.tdlTreatmentId),
      tdlTreatmentCode: dto.tdlTreatmentCode ?? null,
      tdlAggrExpMestCode: dto.tdlAggrExpMestCode ?? null,
      // Patient fields
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
      tdlHeinCardNumber: dto.tdlHeinCardNumber ?? null,
      tdlPatientPhone: dto.tdlPatientPhone ?? null,
      tdlPatientProvinceCode: dto.tdlPatientProvinceCode ?? null,
      tdlPatientCommuneCode: dto.tdlPatientCommuneCode ?? null,
      tdlPatientNationalName: dto.tdlPatientNationalName ?? null,
      // ICD fields
      icdCode: dto.icdCode ?? null,
      icdName: dto.icdName ?? null,
      icdSubCode: dto.icdSubCode ?? null,
      icdText: dto.icdText ?? null,
      // Other fields
      virHeinCardPrefix: dto.virHeinCardPrefix ?? null,
      priority: this.convertToNumber(dto.priority),
      reqHeadUsername: dto.reqHeadUsername ?? null,
      patientTypeName: dto.patientTypeName ?? null,
      currentBedIds: dto.currentBedIds ?? null,
      createdAt: now,
      updatedAt: now,
      createdBy: dto.createdBy,
      updatedBy: dto.createdBy,
      version: 1,
      isActive: 1,
    };

    const repo = entityManager ? entityManager.getRepository(InpatientExpMestChild) : this.repository;
    const result = await repo.save(data);
    this.convertLongToNumber(result);
    this.logger.info('InpatientExpMestChildRepository#create.result', { id: result.id });
    return result;
  }

  async update(id: string, dto: UpdateInpatientExpMestChildDto, entityManager?: EntityManager): Promise<InpatientExpMestChild> {
    this.logger.info('InpatientExpMestChildRepository#update.call', { id });

    const existing = await this.findById(id, entityManager);
    if (!existing) {
      throw new Error(`InpatientExpMestChild with id ${id} not found`);
    }

    const updateData: any = {};
    if (dto.aggrExpMestId !== undefined) updateData.aggrExpMestId = this.convertToNumber(dto.aggrExpMestId);
    if (dto.aggrExpMestLocalId !== undefined) updateData.aggrExpMestLocalId = dto.aggrExpMestLocalId ?? null;
    if (dto.expMestCode !== undefined) updateData.expMestCode = dto.expMestCode ?? null;
    if (dto.expMestTypeId !== undefined) updateData.expMestTypeId = this.convertToNumber(dto.expMestTypeId);
    if (dto.expMestSttId !== undefined) updateData.expMestSttId = this.convertToNumber(dto.expMestSttId);
    if (dto.mediStockId !== undefined) updateData.mediStockId = this.convertToNumber(dto.mediStockId);
    if (dto.reqLoginname !== undefined) updateData.reqLoginname = dto.reqLoginname ?? null;
    if (dto.reqUsername !== undefined) updateData.reqUsername = dto.reqUsername ?? null;
    if (dto.reqRoomId !== undefined) updateData.reqRoomId = this.convertToNumber(dto.reqRoomId);
    if (dto.reqDepartmentId !== undefined) updateData.reqDepartmentId = this.convertToNumber(dto.reqDepartmentId);
    if (dto.createDate !== undefined) updateData.createDate = this.convertToNumber(dto.createDate);
    if (dto.tdlPatientTypeId !== undefined) updateData.tdlPatientTypeId = this.convertToNumber(dto.tdlPatientTypeId);
    if (dto.virCreateMonth !== undefined) updateData.virCreateMonth = this.convertToNumber(dto.virCreateMonth);
    if (dto.virCreateYear !== undefined) updateData.virCreateYear = this.convertToNumber(dto.virCreateYear);
    if (dto.reqUserTitle !== undefined) updateData.reqUserTitle = dto.reqUserTitle ?? null;
    if (dto.expMestSubCode !== undefined) updateData.expMestSubCode = dto.expMestSubCode ?? null;
    if (dto.expMestSubCode2 !== undefined) updateData.expMestSubCode2 = dto.expMestSubCode2 ?? null;
    if (dto.numOrder !== undefined) updateData.numOrder = this.convertToNumber(dto.numOrder);
    if (dto.tdlAggrPatientCode !== undefined) updateData.tdlAggrPatientCode = dto.tdlAggrPatientCode ?? null;
    if (dto.tdlAggrTreatmentCode !== undefined) updateData.tdlAggrTreatmentCode = dto.tdlAggrTreatmentCode ?? null;
    if (dto.expMestTypeCode !== undefined) updateData.expMestTypeCode = dto.expMestTypeCode ?? null;
    if (dto.expMestTypeName !== undefined) updateData.expMestTypeName = dto.expMestTypeName ?? null;
    if (dto.expMestSttCode !== undefined) updateData.expMestSttCode = dto.expMestSttCode ?? null;
    if (dto.expMestSttName !== undefined) updateData.expMestSttName = dto.expMestSttName ?? null;
    if (dto.mediStockCode !== undefined) updateData.mediStockCode = dto.mediStockCode ?? null;
    if (dto.mediStockName !== undefined) updateData.mediStockName = dto.mediStockName ?? null;
    if (dto.reqDepartmentCode !== undefined) updateData.reqDepartmentCode = dto.reqDepartmentCode ?? null;
    if (dto.reqDepartmentName !== undefined) updateData.reqDepartmentName = dto.reqDepartmentName ?? null;
    if (dto.tdlIntructionDateMin !== undefined) updateData.tdlIntructionDateMin = this.convertToNumber(dto.tdlIntructionDateMin);
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
    if (dto.reqRoomCode !== undefined) updateData.reqRoomCode = dto.reqRoomCode ?? null;
    if (dto.reqRoomName !== undefined) updateData.reqRoomName = dto.reqRoomName ?? null;
    if (dto.groupCode !== undefined) updateData.groupCode = dto.groupCode ?? null;
    if (dto.hisCreateTime !== undefined) updateData.hisCreateTime = this.convertToNumber(dto.hisCreateTime);
    if (dto.hisModifyTime !== undefined) updateData.hisModifyTime = this.convertToNumber(dto.hisModifyTime);
    if (dto.hisCreator !== undefined) updateData.hisCreator = dto.hisCreator ?? null;
    if (dto.hisModifier !== undefined) updateData.hisModifier = dto.hisModifier ?? null;
    // Service Request fields
    if (dto.serviceReqId !== undefined) updateData.serviceReqId = this.convertToNumber(dto.serviceReqId);
    if (dto.tdlTotalPrice !== undefined) updateData.tdlTotalPrice = this.convertToNumber(dto.tdlTotalPrice);
    if (dto.tdlServiceReqCode !== undefined) updateData.tdlServiceReqCode = dto.tdlServiceReqCode ?? null;
    // Instruction fields
    if (dto.tdlIntructionTime !== undefined) updateData.tdlIntructionTime = this.convertToNumber(dto.tdlIntructionTime);
    if (dto.tdlIntructionDate !== undefined) updateData.tdlIntructionDate = this.convertToNumber(dto.tdlIntructionDate);
    // Treatment fields
    if (dto.tdlTreatmentId !== undefined) updateData.tdlTreatmentId = this.convertToNumber(dto.tdlTreatmentId);
    if (dto.tdlTreatmentCode !== undefined) updateData.tdlTreatmentCode = dto.tdlTreatmentCode ?? null;
    if (dto.tdlAggrExpMestCode !== undefined) updateData.tdlAggrExpMestCode = dto.tdlAggrExpMestCode ?? null;
    // Patient fields
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
    if (dto.tdlHeinCardNumber !== undefined) updateData.tdlHeinCardNumber = dto.tdlHeinCardNumber ?? null;
    if (dto.tdlPatientPhone !== undefined) updateData.tdlPatientPhone = dto.tdlPatientPhone ?? null;
    if (dto.tdlPatientProvinceCode !== undefined) updateData.tdlPatientProvinceCode = dto.tdlPatientProvinceCode ?? null;
    if (dto.tdlPatientCommuneCode !== undefined) updateData.tdlPatientCommuneCode = dto.tdlPatientCommuneCode ?? null;
    if (dto.tdlPatientNationalName !== undefined) updateData.tdlPatientNationalName = dto.tdlPatientNationalName ?? null;
    // ICD fields
    if (dto.icdCode !== undefined) updateData.icdCode = dto.icdCode ?? null;
    if (dto.icdName !== undefined) updateData.icdName = dto.icdName ?? null;
    if (dto.icdSubCode !== undefined) updateData.icdSubCode = dto.icdSubCode ?? null;
    if (dto.icdText !== undefined) updateData.icdText = dto.icdText ?? null;
    // Other fields
    if (dto.virHeinCardPrefix !== undefined) updateData.virHeinCardPrefix = dto.virHeinCardPrefix ?? null;
    if (dto.priority !== undefined) updateData.priority = this.convertToNumber(dto.priority);
    if (dto.reqHeadUsername !== undefined) updateData.reqHeadUsername = dto.reqHeadUsername ?? null;
    if (dto.patientTypeName !== undefined) updateData.patientTypeName = dto.patientTypeName ?? null;
    if (dto.currentBedIds !== undefined) updateData.currentBedIds = dto.currentBedIds ?? null;

    updateData.updatedAt = new Date();
    updateData.updatedBy = dto.updatedBy;
    updateData.version = existing.version + 1;

    const repo = entityManager ? entityManager.getRepository(InpatientExpMestChild) : this.repository;
    await repo.update(id, updateData);
    const result = await this.findById(id, entityManager);
    this.logger.info('InpatientExpMestChildRepository#update.result', { id: result?.id });
    return result!;
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
      'hisExpMestId', 'aggrExpMestId', 'expMestTypeId', 'expMestSttId', 'mediStockId',
      'reqRoomId', 'reqDepartmentId', 'createDate', 'tdlPatientTypeId',
      'virCreateMonth', 'virCreateYear', 'numOrder', 'tdlIntructionDateMin',
      'lastExpTime', 'finishTime', 'finishDate', 'isExportEqualApprove',
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

