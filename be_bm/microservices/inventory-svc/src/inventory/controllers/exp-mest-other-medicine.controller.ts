import { PinoLogger } from 'nestjs-pino';
import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { isEmpty } from 'lodash';

import { Query, Count, Id } from '../../commons/interfaces/commons.interface';
import { ExpMestOtherMedicineService } from '../services/exp-mest-other-medicine.service';
import { ExpMestOtherMedicine } from '../entities/exp-mest-other-medicine.entity';
import { CreateExpMestOtherMedicineDto } from '../dto/create-exp-mest-other-medicine.dto';
import { UpdateExpMestOtherMedicineDto } from '../dto/update-exp-mest-other-medicine.dto';

export interface ExpMestOtherMedicineQueryResult {
  data: Array<ExpMestOtherMedicine>;
}

@Controller()
export class ExpMestOtherMedicineController {
  constructor(
    private readonly service: ExpMestOtherMedicineService,
    private readonly logger: PinoLogger,
  ) {
    logger.setContext(ExpMestOtherMedicineController.name);
  }

  @GrpcMethod('InventoryService', 'findAllExpMestOtherMedicines')
  async findAll(query: Query): Promise<ExpMestOtherMedicineQueryResult> {
    this.logger.info('ExpMestOtherMedicineController#findAll.call', query);

    const result: Array<ExpMestOtherMedicine> = await this.service.findAll({
      select: !isEmpty(query.attributes) ? query.attributes as any : undefined,
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
      order: !isEmpty(query.order) ? JSON.parse(query.order) : undefined,
      skip: query.offset ? query.offset : 0,
      take: query.limit ? query.limit : 25,
    });

    result.forEach(medicine => this.convertLongToNumber(medicine));

    this.logger.info('ExpMestOtherMedicineController#findAll.result', { count: result.length });
    return { data: result };
  }

  @GrpcMethod('InventoryService', 'findExpMestOtherMedicineById')
  async findById(data: Id): Promise<ExpMestOtherMedicine> {
    this.logger.info('ExpMestOtherMedicineController#findById.call', data);

    const result: ExpMestOtherMedicine | null = await this.service.findById(data.id);

    if (!result) {
      throw new Error('ExpMestOtherMedicine not found');
    }

    this.convertLongToNumber(result);
    this.logger.info('ExpMestOtherMedicineController#findById.result', { id: result.id });
    return result;
  }

  @GrpcMethod('InventoryService', 'findExpMestOtherMedicineByHisId')
  async findByHisId(data: { hisId: number }): Promise<ExpMestOtherMedicine> {
    this.logger.info('ExpMestOtherMedicineController#findByHisId.call', data);

    try {
      // Convert hisId from Long object if needed
      let hisId: number;
      const hisIdValue = data.hisId;

      if (hisIdValue !== null &&
        hisIdValue !== undefined &&
        typeof hisIdValue === 'object' &&
        'low' in (hisIdValue as object) &&
        'high' in (hisIdValue as object)) {
        const longValue = hisIdValue as { low: number; high: number };
        hisId = longValue.low + (longValue.high * 0x100000000);
      } else {
        hisId = Number(hisIdValue);
      }

      if (isNaN(hisId)) {
        throw new Error('Invalid hisId: must be a valid number');
      }

      const result: ExpMestOtherMedicine | null = await this.service.findByHisId(hisId);

      if (!result) {
        throw new Error('ExpMestOtherMedicine not found');
      }

      this.convertLongToNumber(result);
      this.logger.info('ExpMestOtherMedicineController#findByHisId.result', { id: result.id });
      return result;
    } catch (error: any) {
      this.logger.error('ExpMestOtherMedicineController#findByHisId.error', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  @GrpcMethod('InventoryService', 'findExpMestOtherMedicinesByHisIds')
  async findByHisIds(data: { hisIds: number[] }): Promise<ExpMestOtherMedicineQueryResult> {
    this.logger.info('ExpMestOtherMedicineController#findByHisIds.call', {
      count: data.hisIds?.length || 0
    });

    // Convert hisIds from Long objects if needed
    const hisIds: number[] = (data.hisIds || []).map((id: any) => {
      if (id !== null && id !== undefined && typeof id === 'object' && 'low' in id && 'high' in id) {
        const longValue = id as { low: number; high: number };
        return longValue.low + (longValue.high * 0x100000000);
      }
      return Number(id);
    }).filter((id): id is number => !isNaN(id));

    if (hisIds.length === 0) {
      return { data: [] };
    }

    const result: ExpMestOtherMedicine[] = await this.service.findByHisIds(hisIds);

    result.forEach(medicine => this.convertLongToNumber(medicine));
    this.logger.info('ExpMestOtherMedicineController#findByHisIds.result', {
      requested: hisIds.length,
      found: result.length
    });
    return { data: result };
  }

  @GrpcMethod('InventoryService', 'findExpMestOtherMedicinesByExpMestId')
  async findByExpMestId(data: { expMestId: number }): Promise<ExpMestOtherMedicineQueryResult> {
    this.logger.info('ExpMestOtherMedicineController#findByExpMestId.call', data);

    // Convert expMestId from Long object if needed
    let expMestId: number;
    const expMestIdValue = data.expMestId;

    if (expMestIdValue !== null &&
      expMestIdValue !== undefined &&
      typeof expMestIdValue === 'object' &&
      'low' in (expMestIdValue as object) &&
      'high' in (expMestIdValue as object)) {
      const longValue = expMestIdValue as { low: number; high: number };
      expMestId = longValue.low + (longValue.high * 0x100000000);
    } else {
      expMestId = Number(expMestIdValue);
    }

    if (isNaN(expMestId)) {
      throw new Error('Invalid expMestId: must be a valid number');
    }

    const result: ExpMestOtherMedicine[] = await this.service.findByExpMestId(expMestId);

    result.forEach(medicine => this.convertLongToNumber(medicine));
    this.logger.info('ExpMestOtherMedicineController#findByExpMestId.result', {
      expMestId,
      count: result.length
    });
    return { data: result };
  }

  @GrpcMethod('InventoryService', 'createExpMestOtherMedicine')
  async create(data: CreateExpMestOtherMedicineDto): Promise<ExpMestOtherMedicine> {
    this.logger.info('ExpMestOtherMedicineController#create.call', { hisId: data.hisId });

    const result = await this.service.create(data);
    this.convertLongToNumber(result);
    this.logger.info('ExpMestOtherMedicineController#create.result', { id: result.id });
    return result;
  }

  @GrpcMethod('InventoryService', 'updateExpMestOtherMedicine')
  async update(data: { id: string } & UpdateExpMestOtherMedicineDto): Promise<ExpMestOtherMedicine> {
    this.logger.info('ExpMestOtherMedicineController#update.call', { id: data.id });

    const { id, ...updateDto } = data;
    const result = await this.service.update(id, updateDto);
    this.convertLongToNumber(result);
    this.logger.info('ExpMestOtherMedicineController#update.result', { id: result.id });
    return result;
  }

  @GrpcMethod('InventoryService', 'countExpMestOtherMedicines')
  async count(query: Query): Promise<Count> {
    this.logger.info('ExpMestOtherMedicineController#count.call', query);

    const count = await this.service.count({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
    });

    this.logger.info('ExpMestOtherMedicineController#count.result', { count });
    return { count };
  }

  @GrpcMethod('InventoryService', 'updateExpMestOtherMedicineExportFieldsByHisIds')
  async updateExportFieldsByHisIds(data: {
    hisIds: number[];
    exportTime: number | null;
    userId: string;
  }): Promise<{ updatedCount: number; hisIds: number[] }> {
    this.logger.info('ExpMestOtherMedicineController#updateExportFieldsByHisIds.call', {
      hisIdsCount: data.hisIds?.length || 0,
      exportTime: data.exportTime,
      userId: data.userId
    });

    // Convert hisIds from Long objects
    const hisIds: number[] = (data.hisIds || []).map((id: any) => {
      if (id !== null && id !== undefined && typeof id === 'object' && 'low' in id && 'high' in id) {
        const longValue = id as { low: number; high: number };
        return longValue.low + (longValue.high * 0x100000000);
      }
      return Number(id);
    }).filter(id => !isNaN(id));

    // Convert exportTime from Long object
    let exportTime: number | null = null;
    if (data.exportTime !== null && data.exportTime !== undefined) {
      if (typeof data.exportTime === 'object' && 'low' in (data.exportTime as any) && 'high' in (data.exportTime as any)) {
        const longValue = data.exportTime as any;
        exportTime = longValue.low + (longValue.high * 0x100000000);
      } else {
        exportTime = Number(data.exportTime);
      }
    }

    const updatedCount = await this.service.updateExportFieldsByHisIds(hisIds, exportTime, data.userId);

    return {
      updatedCount,
      hisIds
    };
  }

  @GrpcMethod('InventoryService', 'updateExpMestOtherMedicineActualExportFieldsByHisIds')
  async updateActualExportFieldsByHisIds(data: {
    hisIds: number[];
    actualExportTime: number | null;
    userId: string;
  }): Promise<{ updatedCount: number; hisIds: number[] }> {
    this.logger.info('ExpMestOtherMedicineController#updateActualExportFieldsByHisIds.call', {
      hisIdsCount: data.hisIds?.length || 0,
      actualExportTime: data.actualExportTime,
      userId: data.userId
    });

    // Convert hisIds from Long objects
    const hisIds: number[] = (data.hisIds || []).map((id: any) => {
      if (id !== null && id !== undefined && typeof id === 'object' && 'low' in id && 'high' in id) {
        const longValue = id as { low: number; high: number };
        return longValue.low + (longValue.high * 0x100000000);
      }
      return Number(id);
    }).filter(id => !isNaN(id));

    // Convert actualExportTime from Long object
    let actualExportTime: number | null = null;
    if (data.actualExportTime !== null && data.actualExportTime !== undefined) {
      if (typeof data.actualExportTime === 'object' && 'low' in (data.actualExportTime as any) && 'high' in (data.actualExportTime as any)) {
        const longValue = data.actualExportTime as any;
        actualExportTime = longValue.low + (longValue.high * 0x100000000);
      } else {
        actualExportTime = Number(data.actualExportTime);
      }
    }

    const updatedCount = await this.service.updateActualExportFieldsByHisIds(hisIds, actualExportTime, data.userId);

    return {
      updatedCount,
      hisIds
    };
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

