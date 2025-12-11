import { PinoLogger } from 'nestjs-pino';
import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { isEmpty } from 'lodash';

import { Query, Count, Id } from '../../commons/interfaces/commons.interface';
import { ExpMestMedicineService } from '../services/exp-mest-medicine.service';
import { ExpMestMedicine } from '../entities/exp-mest-medicine.entity';
import { CreateExpMestMedicineDto } from '../dto/create-exp-mest-medicine.dto';
import { UpdateExpMestMedicineDto } from '../dto/update-exp-mest-medicine.dto';

export interface ExpMestMedicineQueryResult {
  data: Array<ExpMestMedicine>;
}

@Controller()
export class ExpMestMedicineController {
  constructor(
    @Inject('ExpMestMedicineService') private readonly expMestMedicineService: ExpMestMedicineService,
    private readonly logger: PinoLogger,
  ) {
    logger.setContext(ExpMestMedicineController.name);
  }

  @GrpcMethod('ExpMestMedicineService', 'findAll')
  async findAll(query: Query): Promise<ExpMestMedicineQueryResult> {
    this.logger.info('ExpMestMedicineController#findAll.call', query);

    const result: Array<ExpMestMedicine> = await this.expMestMedicineService.findAll({
      select: !isEmpty(query.attributes) ? query.attributes as any : undefined,
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
      order: !isEmpty(query.order) ? JSON.parse(query.order) : undefined,
      skip: query.offset ? query.offset : 0,
      take: query.limit ? query.limit : 25,
    });

    // Convert Long objects to numbers for Oracle compatibility
    result.forEach(medicine => this.convertLongToNumber(medicine));

    this.logger.info('ExpMestMedicineController#findAll.result', { count: result.length });

    return { data: result };
  }

  @GrpcMethod('ExpMestMedicineService', 'findById')
  async findById(data: Id): Promise<ExpMestMedicine> {
    this.logger.info('ExpMestMedicineController#findById.call', data);

    const result: ExpMestMedicine | null = await this.expMestMedicineService.findById(data.id);

    if (!result) {
      throw new Error('ExpMestMedicine not found');
    }

    // Convert Long objects to numbers for Oracle compatibility
    this.convertLongToNumber(result);

    this.logger.info('ExpMestMedicineController#findById.result', result);

    return result;
  }

  @GrpcMethod('ExpMestMedicineService', 'findByHisId')
  async findByHisId(data: Id): Promise<ExpMestMedicine> {
    this.logger.info('ExpMestMedicineController#findByHisId.call', data);

    // Parse hisId from string to number
    const hisId = parseInt(data.id, 10);
    if (isNaN(hisId)) {
      throw new Error('Invalid HIS ID');
    }

    const result: ExpMestMedicine | null = await this.expMestMedicineService.findByHisId(hisId);

    if (!result) {
      throw new Error('ExpMestMedicine not found');
    }

    // Convert Long objects to numbers for Oracle compatibility
    this.convertLongToNumber(result);

    this.logger.info('ExpMestMedicineController#findByHisId.result', result);

    return result;
  }

  @GrpcMethod('ExpMestMedicineService', 'findByExpMestId')
  async findByExpMestId(data: Id): Promise<ExpMestMedicineQueryResult> {
    this.logger.info('ExpMestMedicineController#findByExpMestId.call', data);

    // Parse expMestId from string to number
    const expMestId = parseInt(data.id, 10);
    if (isNaN(expMestId)) {
      throw new Error('Invalid ExpMest ID');
    }

    const result: Array<ExpMestMedicine> = await this.expMestMedicineService.findByExpMestId(expMestId);

    // Convert Long objects to numbers for Oracle compatibility
    result.forEach(medicine => this.convertLongToNumber(medicine));

    this.logger.info('ExpMestMedicineController#findByExpMestId.result', { count: result.length });

    return { data: result };
  }

  @GrpcMethod('ExpMestMedicineService', 'count')
  async count(query: Query): Promise<Count> {
    this.logger.info('ExpMestMedicineController#count.call', query);

    const count: number = await this.expMestMedicineService.count({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
    });

    this.logger.info('ExpMestMedicineController#count.result', count);

    return { count };
  }

  @GrpcMethod('ExpMestMedicineService', 'create')
  async create(data: CreateExpMestMedicineDto): Promise<ExpMestMedicine> {
    this.logger.info('ExpMestMedicineController#create.call', { hisId: data.hisId, expMestId: data.expMestId, createdBy: data.createdBy });

    const result: ExpMestMedicine = await this.expMestMedicineService.create(data);

    // Convert Long objects to numbers for Oracle compatibility
    this.convertLongToNumber(result);

    this.logger.info('ExpMestMedicineController#create.result', { id: result.id, hisId: result.hisId });

    return result;
  }

  @GrpcMethod('ExpMestMedicineService', 'update')
  async update(data: { id: string } & UpdateExpMestMedicineDto): Promise<ExpMestMedicine> {
    this.logger.info('ExpMestMedicineController#update.call', { id: data.id, updatedBy: data.updatedBy });

    const { id, ...updateData } = data;
    const result: ExpMestMedicine = await this.expMestMedicineService.update(id, updateData);

    // Convert Long objects to numbers for Oracle compatibility
    this.convertLongToNumber(result);

    this.logger.info('ExpMestMedicineController#update.result', { id: result.id });

    return result;
  }

  @GrpcMethod('ExpMestMedicineService', 'destroy')
  async destroy(query: Query): Promise<Count> {
    this.logger.info('ExpMestMedicineController#destroy.call', query);

    const where = !isEmpty(query.where) ? JSON.parse(query.where) : {};
    const medicines = await this.expMestMedicineService.findAll({ where, take: 1000 });
    
    let deletedCount = 0;
    for (const medicine of medicines) {
      await this.expMestMedicineService.delete(medicine.id);
      deletedCount++;
    }

    this.logger.info('ExpMestMedicineController#destroy.result', { count: deletedCount });

    return { count: deletedCount };
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

