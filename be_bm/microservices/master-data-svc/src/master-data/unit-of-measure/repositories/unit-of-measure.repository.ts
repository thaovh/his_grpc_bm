import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { UnitOfMeasure } from '../entities/unit-of-measure.entity';
import { CreateUnitOfMeasureDto } from '../dto/create-unit-of-measure.dto';
import { UpdateUnitOfMeasureDto } from '../dto/update-unit-of-measure.dto';

@Injectable()
export class UnitOfMeasureRepository {
  constructor(
    @InjectRepository(UnitOfMeasure)
    private readonly unitOfMeasureRepository: Repository<UnitOfMeasure>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UnitOfMeasureRepository.name);
  }

  async create(unitOfMeasureDto: CreateUnitOfMeasureDto): Promise<UnitOfMeasure> {
    this.logger.info('UnitOfMeasureRepository#create.call', { code: unitOfMeasureDto.code, createdBy: unitOfMeasureDto.createdBy });
    
    // Generate UUID manually for Oracle compatibility
    const { randomUUID } = require('crypto');
    const id = randomUUID();
    const now = new Date();
    
    // Create entity - explicitly set ALL fields (including nullable) to avoid DEFAULT values
    const unitOfMeasureData: any = {
      id,
      code: unitOfMeasureDto.code,
      name: unitOfMeasureDto.name,
      sortOrder: unitOfMeasureDto.sortOrder ?? 0,
      isActive: 1,
      version: 1,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      createdBy: unitOfMeasureDto.createdBy ?? null,
      updatedBy: unitOfMeasureDto.createdBy ?? null, // Also set on create
    };
    
    const unitOfMeasure = this.unitOfMeasureRepository.create(unitOfMeasureData);
    await this.unitOfMeasureRepository.save(unitOfMeasure);
    
    // Fetch the saved entity
    const savedUnitOfMeasure = await this.unitOfMeasureRepository.findOne({ 
      where: { id }
    });
    
    if (!savedUnitOfMeasure) {
      throw new Error('Failed to fetch created UnitOfMeasure');
    }
    
    this.logger.info('UnitOfMeasureRepository#create.result', { id: savedUnitOfMeasure.id, code: savedUnitOfMeasure.code });
    return savedUnitOfMeasure;
  }

  async update(id: string, unitOfMeasureDto: UpdateUnitOfMeasureDto): Promise<UnitOfMeasure> {
    this.logger.info('UnitOfMeasureRepository#update.call', { id, updatedBy: unitOfMeasureDto.updatedBy });
    
    const unitOfMeasure = await this.unitOfMeasureRepository.findOne({ where: { id } });
    if (!unitOfMeasure) {
      throw new Error(`UnitOfMeasure with id ${id} not found`);
    }
    
    // Update fields
    if (unitOfMeasureDto.code !== undefined) unitOfMeasure.code = unitOfMeasureDto.code;
    if (unitOfMeasureDto.name !== undefined) unitOfMeasure.name = unitOfMeasureDto.name;
    if (unitOfMeasureDto.sortOrder !== undefined) unitOfMeasure.sortOrder = unitOfMeasureDto.sortOrder ?? 0;
    if (unitOfMeasureDto.updatedBy !== undefined && unitOfMeasureDto.updatedBy !== null) {
      unitOfMeasure.updatedBy = unitOfMeasureDto.updatedBy;
    }
    
    unitOfMeasure.updatedAt = new Date();
    unitOfMeasure.version += 1;
    
    await this.unitOfMeasureRepository.save(unitOfMeasure);
    
    // Fetch the updated entity
    const updatedUnitOfMeasure = await this.unitOfMeasureRepository.findOne({ 
      where: { id }
    });
    
    if (!updatedUnitOfMeasure) {
      throw new Error('Failed to fetch updated UnitOfMeasure');
    }
    
    this.logger.info('UnitOfMeasureRepository#update.result', { id: updatedUnitOfMeasure.id });
    return updatedUnitOfMeasure;
  }

  async findAll(options?: FindManyOptions<UnitOfMeasure>): Promise<UnitOfMeasure[]> {
    this.logger.info('UnitOfMeasureRepository#findAll.call', options);
    const result = await this.unitOfMeasureRepository.find({
      ...options,
      order: options?.order || { sortOrder: 'ASC', name: 'ASC' },
    });
    this.logger.info('UnitOfMeasureRepository#findAll.result', { count: result.length });
    return result;
  }

  async findOne(id: string): Promise<UnitOfMeasure | null> {
    this.logger.info('UnitOfMeasureRepository#findOne.call', { id });
    const result = await this.unitOfMeasureRepository.findOne({ where: { id } });
    this.logger.info('UnitOfMeasureRepository#findOne.result', { found: !!result });
    return result;
  }

  async findByCode(code: string): Promise<UnitOfMeasure | null> {
    this.logger.info('UnitOfMeasureRepository#findByCode.call', { code });
    const result = await this.unitOfMeasureRepository.findOne({ where: { code } });
    this.logger.info('UnitOfMeasureRepository#findByCode.result', { found: !!result });
    return result;
  }

  async count(options?: FindManyOptions<UnitOfMeasure>): Promise<number> {
    this.logger.info('UnitOfMeasureRepository#count.call', options);
    const result = await this.unitOfMeasureRepository.count(options);
    this.logger.info('UnitOfMeasureRepository#count.result', { count: result });
    return result;
  }

  async delete(id: string): Promise<void> {
    this.logger.info('UnitOfMeasureRepository#delete.call', { id });
    await this.unitOfMeasureRepository.delete(id);
    this.logger.info('UnitOfMeasureRepository#delete.result');
  }
}

