import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { ExportStatus } from '../entities/export-status.entity';
import { CreateExportStatusDto } from '../dto/create-export-status.dto';
import { UpdateExportStatusDto } from '../dto/update-export-status.dto';

@Injectable()
export class ExportStatusRepository {
  constructor(
    @InjectRepository(ExportStatus)
    private readonly exportStatusRepository: Repository<ExportStatus>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ExportStatusRepository.name);
  }

  async create(ExportStatusDto: CreateExportStatusDto): Promise<ExportStatus> {
    this.logger.info('ExportStatusRepository#create.call', { code: ExportStatusDto.code, createdBy: ExportStatusDto.createdBy });
    
    // Generate UUID manually for Oracle compatibility
    const { randomUUID } = require('crypto');
    const id = randomUUID();
    const now = new Date();
    
    // Create entity - explicitly set ALL fields (including nullable) to avoid DEFAULT values
    const ExportStatusData: any = {
      id,
      code: ExportStatusDto.code,
      name: ExportStatusDto.name,
      sortOrder: ExportStatusDto.sortOrder ?? 0,
      isActive: 1,
      version: 1,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      createdBy: ExportStatusDto.createdBy ?? null,
      updatedBy: ExportStatusDto.createdBy ?? null, // Also set on create
    };
    
    const ExportStatus = this.exportStatusRepository.create(ExportStatusData);
    await this.exportStatusRepository.save(ExportStatus);
    
    // Fetch the saved entity
    const savedExportStatus = await this.exportStatusRepository.findOne({ 
      where: { id }
    });
    
    if (!savedExportStatus) {
      throw new Error('Failed to fetch created ExportStatus');
    }
    
    this.logger.info('ExportStatusRepository#create.result', { id: savedExportStatus.id, code: savedExportStatus.code });
    return savedExportStatus;
  }

  async update(id: string, ExportStatusDto: UpdateExportStatusDto): Promise<ExportStatus> {
    this.logger.info('ExportStatusRepository#update.call', { id, updatedBy: ExportStatusDto.updatedBy });
    
    const ExportStatus = await this.exportStatusRepository.findOne({ where: { id } });
    if (!ExportStatus) {
      throw new Error(`ExportStatus with id ${id} not found`);
    }
    
    // Update fields
    if (ExportStatusDto.code !== undefined) ExportStatus.code = ExportStatusDto.code;
    if (ExportStatusDto.name !== undefined) ExportStatus.name = ExportStatusDto.name;
    if (ExportStatusDto.sortOrder !== undefined) ExportStatus.sortOrder = ExportStatusDto.sortOrder ?? 0;
    if (ExportStatusDto.updatedBy !== undefined && ExportStatusDto.updatedBy !== null) {
      ExportStatus.updatedBy = ExportStatusDto.updatedBy;
    }
    
    ExportStatus.updatedAt = new Date();
    ExportStatus.version += 1;
    
    await this.exportStatusRepository.save(ExportStatus);
    
    // Fetch the updated entity
    const updatedExportStatus = await this.exportStatusRepository.findOne({ 
      where: { id }
    });
    
    if (!updatedExportStatus) {
      throw new Error('Failed to fetch updated ExportStatus');
    }
    
    this.logger.info('ExportStatusRepository#update.result', { id: updatedExportStatus.id });
    return updatedExportStatus;
  }

  async findAll(options?: FindManyOptions<ExportStatus>): Promise<ExportStatus[]> {
    this.logger.info('ExportStatusRepository#findAll.call', options);
    const result = await this.exportStatusRepository.find({
      ...options,
      order: options?.order || { sortOrder: 'ASC', name: 'ASC' },
    });
    this.logger.info('ExportStatusRepository#findAll.result', { count: result.length });
    return result;
  }

  async findOne(id: string): Promise<ExportStatus | null> {
    this.logger.info('ExportStatusRepository#findOne.call', { id });
    const result = await this.exportStatusRepository.findOne({ where: { id } });
    this.logger.info('ExportStatusRepository#findOne.result', { found: !!result });
    return result;
  }

  async findByCode(code: string): Promise<ExportStatus | null> {
    this.logger.info('ExportStatusRepository#findByCode.call', { code });
    const result = await this.exportStatusRepository.findOne({ where: { code } });
    this.logger.info('ExportStatusRepository#findByCode.result', { found: !!result });
    return result;
  }

  async count(options?: FindManyOptions<ExportStatus>): Promise<number> {
    this.logger.info('ExportStatusRepository#count.call', options);
    const result = await this.exportStatusRepository.count(options);
    this.logger.info('ExportStatusRepository#count.result', { count: result });
    return result;
  }

  async delete(id: string): Promise<void> {
    this.logger.info('ExportStatusRepository#delete.call', { id });
    await this.exportStatusRepository.delete(id);
    this.logger.info('ExportStatusRepository#delete.result');
  }
}

