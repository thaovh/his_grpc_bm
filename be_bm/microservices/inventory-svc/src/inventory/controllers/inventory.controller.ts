import { PinoLogger } from 'nestjs-pino';
import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { isEmpty } from 'lodash';

import { Query, Count, Id } from '../../commons/interfaces/commons.interface';
import { InventoryService, ExpMestQueryResult } from '../inventory.interface';
import { ExpMest } from '../entities/exp-mest.entity';
import { CreateExpMestDto } from '../dto/create-exp-mest.dto';
import { UpdateExpMestDto } from '../dto/update-exp-mest.dto';

@Controller()
export class InventoryController {
  constructor(
    @Inject('InventoryService') private readonly inventoryService: InventoryService,
    private readonly logger: PinoLogger,
  ) {
    logger.setContext(InventoryController.name);
  }

  @GrpcMethod('InventoryService', 'findAll')
  async findAll(query: Query): Promise<ExpMestQueryResult> {
    this.logger.info('InventoryController#findAll.call', query);

    const result: Array<ExpMest> = await this.inventoryService.findAll({
      select: !isEmpty(query.attributes) ? query.attributes as any : undefined,
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
      order: !isEmpty(query.order) ? JSON.parse(query.order) : undefined,
      skip: query.offset ? query.offset : 0,
      take: query.limit ? query.limit : 25,
    });

    // Convert Long objects to numbers for Oracle compatibility
    result.forEach(expMest => this.convertLongToNumber(expMest));

    this.logger.info('InventoryController#findAll.result', { count: result.length });

    return { data: result };
  }

  @GrpcMethod('InventoryService', 'findById')
  async findById(data: Id): Promise<ExpMest> {
    this.logger.info('InventoryController#findById.call', data);

    const result: ExpMest | null = await this.inventoryService.findById(data.id);

    if (!result) {
      throw new Error('ExpMest not found');
    }

    // Convert Long objects to numbers for Oracle compatibility
    this.convertLongToNumber(result);

    this.logger.info('InventoryController#findById.result', result);

    return result;
  }

  @GrpcMethod('InventoryService', 'findByExpMestId')
  async findByExpMestId(data: Id): Promise<ExpMest> {
    this.logger.info('InventoryController#findByExpMestId.call', data);

    // Parse expMestId from string to number
    const expMestId = parseInt(data.id, 10);
    if (isNaN(expMestId)) {
      throw new Error('Invalid ExpMest ID');
    }

    const result: ExpMest | null = await this.inventoryService.findByExpMestId(expMestId);

    if (!result) {
      throw new Error('ExpMest not found');
    }

    // Convert Long objects to numbers for Oracle compatibility
    this.convertLongToNumber(result);

    this.logger.info('InventoryController#findByExpMestId.result', result);

    return result;
  }

  @GrpcMethod('InventoryService', 'count')
  async count(query: Query): Promise<Count> {
    this.logger.info('InventoryController#count.call', query);

    const count: number = await this.inventoryService.count({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
    });

    this.logger.info('InventoryController#count.result', count);

    return { count };
  }

  @GrpcMethod('InventoryService', 'create')
  async create(data: CreateExpMestDto): Promise<ExpMest> {
    this.logger.info('InventoryController#create.call', { 
      expMestId: data.expMestId, 
      createdBy: data.createdBy,
      exportStatusId: data.exportStatusId 
    });

    const result: ExpMest = await this.inventoryService.create(data);

    // Convert Long objects to numbers for Oracle compatibility
    this.convertLongToNumber(result);

    this.logger.info('InventoryController#create.result', { id: result.id, expMestId: result.expMestId });

    return result;
  }

  @GrpcMethod('InventoryService', 'update')
  async update(data: { id: string } & UpdateExpMestDto): Promise<ExpMest> {
    this.logger.info('InventoryController#update.call', { id: data.id, updatedBy: data.updatedBy });

    const { id, ...updateData } = data;
    const result: ExpMest = await this.inventoryService.update(id, updateData);

    // Convert Long objects to numbers for Oracle compatibility
    this.convertLongToNumber(result);

    this.logger.info('InventoryController#update.result', { id: result.id });

    return result;
  }

  @GrpcMethod('InventoryService', 'destroy')
  async destroy(query: Query): Promise<Count> {
    this.logger.info('InventoryController#destroy.call', query);

    const where = !isEmpty(query.where) ? JSON.parse(query.where) : {};
    const expMests = await this.inventoryService.findAll({ where, take: 1000 });
    
    let deletedCount = 0;
    for (const expMest of expMests) {
      await this.inventoryService.delete(expMest.id);
      deletedCount++;
    }

    this.logger.info('InventoryController#destroy.result', { count: deletedCount });

    return { count: deletedCount };
  }

  /**
   * Convert Long object to number (for Oracle NUMBER(19,0) fields)
   */
  private convertLongToNumber(entity: ExpMest): void {
    const numberFields: (keyof ExpMest)[] = [
      'expMestId', 'expMestTypeId', 'expMestSttId', 'mediStockId',
      'reqRoomId', 'reqDepartmentId', 'createDate', 'serviceReqId',
      'tdlTotalPrice', 'tdlIntructionTime', 'tdlIntructionDate',
      'tdlTreatmentId', 'tdlPatientId', 'tdlPatientDob',
      'tdlPatientIsHasNotDayDob', 'tdlPatientGenderId', 'tdlPatientTypeId',
      'virCreateMonth', 'virCreateYear', 'priority', 'treatmentIsActive',
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

