import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions, In, EntityManager } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

import { InpatientExpMest } from '../entities/inpatient-exp-mest.entity';
import { CreateInpatientExpMestDto } from '../dto/create-inpatient-exp-mest.dto';
import { UpdateInpatientExpMestDto } from '../dto/update-inpatient-exp-mest.dto';

@Injectable()
export class InpatientExpMestRepository {
  constructor(
    @InjectRepository(InpatientExpMest)
    private readonly inpatientExpMestRepository: Repository<InpatientExpMest>,
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
  ) {
    this.logger.setContext(InpatientExpMestRepository.name);
  }

  async findAll(options?: FindManyOptions<InpatientExpMest>): Promise<InpatientExpMest[]> {
    this.logger.info('InpatientExpMestRepository#findAll.call', options);
    const result = await this.inpatientExpMestRepository.find(options);
    result.forEach(item => this.convertLongToNumber(item));
    this.logger.info('InpatientExpMestRepository#findAll.result', { count: result.length });
    return result;
  }

  async findOne(options?: FindOneOptions<InpatientExpMest>): Promise<InpatientExpMest | null> {
    this.logger.info('InpatientExpMestRepository#findOne.call', options);
    const result = await this.inpatientExpMestRepository.findOne(options);
    if (result) {
      this.convertLongToNumber(result);
    }
    this.logger.info('InpatientExpMestRepository#findOne.result', { found: !!result });
    return result;
  }

  async findById(id: string, entityManager?: EntityManager): Promise<InpatientExpMest | null> {
    this.logger.info('InpatientExpMestRepository#findById.call', { id });
    const repo = entityManager ? entityManager.getRepository(InpatientExpMest) : this.inpatientExpMestRepository;
    const result = await repo.findOne({ where: { id } });
    if (result) {
      this.convertLongToNumber(result);
    }
    this.logger.info('InpatientExpMestRepository#findById.result', { found: !!result });
    return result;
  }

  async findByHisExpMestId(hisExpMestId: number, entityManager?: EntityManager): Promise<InpatientExpMest | null> {
    this.logger.info('InpatientExpMestRepository#findByHisExpMestId.call', { hisExpMestId });
    const repo = entityManager ? entityManager.getRepository(InpatientExpMest) : this.inpatientExpMestRepository;
    const result = await repo.findOne({ where: { hisExpMestId } });
    if (result) {
      this.convertLongToNumber(result);
    }
    this.logger.info('InpatientExpMestRepository#findByHisExpMestId.result', { found: !!result });
    return result;
  }

  /**
   * Find multiple InpatientExpMest by array of hisExpMestIds
   */
  async findByHisExpMestIds(hisExpMestIds: number[]): Promise<InpatientExpMest[]> {
    this.logger.info('InpatientExpMestRepository#findByHisExpMestIds.call', { count: hisExpMestIds.length });

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
    const result = await this.inpatientExpMestRepository.find({
      where: { hisExpMestId: In(validIds) },
    });

    result.forEach(item => this.convertLongToNumber(item));
    this.logger.info('InpatientExpMestRepository#findByHisExpMestIds.result', {
      requested: hisExpMestIds.length,
      valid: validIds.length,
      found: result.length
    });
    return result;
  }

  async count(options?: FindManyOptions<InpatientExpMest>): Promise<number> {
    this.logger.info('InpatientExpMestRepository#count.call', options);
    const result = await this.inpatientExpMestRepository.count(options);
    this.logger.info('InpatientExpMestRepository#count.result', { count: result });
    return result;
  }

  async create(dto: CreateInpatientExpMestDto, entityManager?: EntityManager): Promise<InpatientExpMest> {
    this.logger.info('InpatientExpMestRepository#create.call', {
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

    const repo = entityManager ? entityManager.getRepository(InpatientExpMest) : this.inpatientExpMestRepository;
    const result = await repo.save(data);
    this.convertLongToNumber(result);
    this.logger.info('InpatientExpMestRepository#create.result', { id: result.id });
    return result;
  }

  async update(id: string, dto: UpdateInpatientExpMestDto, entityManager?: EntityManager): Promise<InpatientExpMest> {
    this.logger.info('InpatientExpMestRepository#update.call', { id });

    const existing = await this.findById(id, entityManager);
    if (!existing) {
      throw new Error(`InpatientExpMest with id ${id} not found`);
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
    if (dto.workingStateId !== undefined) updateData.workingStateId = dto.workingStateId ?? null;
    if (dto.hisCreateTime !== undefined) updateData.hisCreateTime = this.convertToNumber(dto.hisCreateTime);
    if (dto.hisModifyTime !== undefined) updateData.hisModifyTime = this.convertToNumber(dto.hisModifyTime);
    if (dto.hisCreator !== undefined) updateData.hisCreator = dto.hisCreator ?? null;
    if (dto.hisModifier !== undefined) updateData.hisModifier = dto.hisModifier ?? null;

    updateData.updatedAt = new Date();
    updateData.updatedBy = dto.updatedBy;
    updateData.version = existing.version + 1;

    const repo = entityManager ? entityManager.getRepository(InpatientExpMest) : this.inpatientExpMestRepository;
    await repo.update(id, updateData);
    const result = await this.findById(id, entityManager);
    this.logger.info('InpatientExpMestRepository#update.result', { id: result?.id });
    return result!;
  }

  /**
   * Update InpatientExpMest by hisExpMestId (HIS ID)
   * @param hisExpMestId HIS ExpMest ID
   * @param dto Update data
   * @param userId User ID for updatedBy
   * @returns Updated InpatientExpMest or null if not found
   */
  async updateByHisExpMestId(
    hisExpMestId: number,
    dto: Partial<UpdateInpatientExpMestDto>,
    userId: string,
  ): Promise<InpatientExpMest | null> {
    this.logger.info('InpatientExpMestRepository#updateByHisExpMestId.call', { hisExpMestId, userId });

    const existing = await this.findByHisExpMestId(hisExpMestId);
    if (!existing) {
      this.logger.warn('InpatientExpMestRepository#updateByHisExpMestId.notFound', { hisExpMestId });
      return null;
    }

    const updateDto: UpdateInpatientExpMestDto = {
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

