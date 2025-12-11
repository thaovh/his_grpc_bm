import { PinoLogger } from 'nestjs-pino';
import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { isEmpty } from 'lodash';

import { Query, Count, Id } from '../../commons/interfaces/commons.interface';
import { InpatientExpMestService } from '../services/inpatient-exp-mest.service';
import { InpatientExpMest } from '../entities/inpatient-exp-mest.entity';
import { CreateInpatientExpMestDto } from '../dto/create-inpatient-exp-mest.dto';
import { UpdateInpatientExpMestDto } from '../dto/update-inpatient-exp-mest.dto';

@Controller()
export class InpatientExpMestController {
  constructor(
    private readonly inpatientExpMestService: InpatientExpMestService,
    private readonly logger: PinoLogger,
  ) {
    logger.setContext(InpatientExpMestController.name);
  }

  @GrpcMethod('InventoryService', 'findAllInpatientExpMests')
  async findAllInpatientExpMests(query: Query): Promise<{ data: InpatientExpMest[] }> {
    this.logger.info('InpatientExpMestController#findAllInpatientExpMests.call', query);

    const result: InpatientExpMest[] = await this.inpatientExpMestService.findAll({
      select: !isEmpty(query.attributes) ? query.attributes as any : undefined,
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
      order: !isEmpty(query.order) ? JSON.parse(query.order) : undefined,
      skip: query.offset ? query.offset : 0,
      take: query.limit ? query.limit : 25,
    });

    result.forEach(item => this.convertLongToNumber(item));

    this.logger.info('InpatientExpMestController#findAllInpatientExpMests.result', { count: result.length });
    return { data: result };
  }

  @GrpcMethod('InventoryService', 'findInpatientExpMestById')
  async findInpatientExpMestById(data: Id): Promise<InpatientExpMest> {
    this.logger.info('InpatientExpMestController#findInpatientExpMestById.call', data);

    const result: InpatientExpMest | null = await this.inpatientExpMestService.findById(data.id);

    if (!result) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'InpatientExpMest not found',
      });
    }

    this.convertLongToNumber(result);
    this.logger.info('InpatientExpMestController#findInpatientExpMestById.result', { id: result.id });
    return result;
  }

  @GrpcMethod('InventoryService', 'findInpatientExpMestsByHisIds')
  async findInpatientExpMestsByHisIds(data: { hisExpMestIds: number[] }): Promise<{ data: InpatientExpMest[] }> {
    this.logger.info('InpatientExpMestController#findInpatientExpMestsByHisIds.call', {
      count: data.hisExpMestIds?.length || 0
    });

    // Convert hisExpMestIds from Long objects if needed
    const hisExpMestIds: number[] = (data.hisExpMestIds || []).map((id: any) => {
      if (id !== null && id !== undefined && typeof id === 'object' && 'low' in id && 'high' in id) {
        const longValue = id as { low: number; high: number };
        return longValue.low + (longValue.high * 0x100000000);
      }
      return Number(id);
    }).filter((id): id is number => !isNaN(id));

    if (hisExpMestIds.length === 0) {
      return { data: [] };
    }

    const result: InpatientExpMest[] = await this.inpatientExpMestService.findByHisExpMestIds(hisExpMestIds);

    result.forEach(item => this.convertLongToNumber(item));
    this.logger.info('InpatientExpMestController#findInpatientExpMestsByHisIds.result', {
      requested: hisExpMestIds.length,
      found: result.length
    });
    return { data: result };
  }

  @GrpcMethod('InventoryService', 'findInpatientExpMestByHisId')
  async findInpatientExpMestByHisId(data: Id): Promise<InpatientExpMest> {
    this.logger.info('InpatientExpMestController#findInpatientExpMestByHisId.call', data);

    const hisExpMestId = Number(data.id);
    if (isNaN(hisExpMestId)) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Invalid hisExpMestId: must be a valid number',
      });
    }

    const result: InpatientExpMest | null = await this.inpatientExpMestService.findByHisExpMestId(hisExpMestId);

    if (!result) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'InpatientExpMest not found',
      });
    }

    this.convertLongToNumber(result);
    this.logger.info('InpatientExpMestController#findInpatientExpMestByHisId.result', { id: result.id });
    return result;
  }

  @GrpcMethod('InventoryService', 'createInpatientExpMest')
  async createInpatientExpMest(data: CreateInpatientExpMestDto): Promise<InpatientExpMest> {
    this.logger.info('InpatientExpMestController#createInpatientExpMest.call', { hisExpMestId: data.hisExpMestId });

    const result = await this.inpatientExpMestService.create(data);
    this.convertLongToNumber(result);
    this.logger.info('InpatientExpMestController#createInpatientExpMest.result', { id: result.id });
    return result;
  }

  @GrpcMethod('InventoryService', 'updateInpatientExpMest')
  async updateInpatientExpMest(data: { id: string } & UpdateInpatientExpMestDto): Promise<InpatientExpMest> {
    this.logger.info('InpatientExpMestController#updateInpatientExpMest.call', { id: data.id });

    const { id, ...updateDto } = data;
    const result = await this.inpatientExpMestService.update(id, updateDto);
    this.convertLongToNumber(result);
    this.logger.info('InpatientExpMestController#updateInpatientExpMest.result', { id: result.id });
    return result;
  }

  @GrpcMethod('InventoryService', 'countInpatientExpMests')
  async countInpatientExpMests(query: Query): Promise<Count> {
    this.logger.info('InpatientExpMestController#countInpatientExpMests.call', query);

    const count = await this.inpatientExpMestService.count({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
    });

    this.logger.info('InpatientExpMestController#countInpatientExpMests.result', { count });
    return { count };
  }

  @GrpcMethod('InventoryService', 'syncInpatientExpMest')
  async syncInpatientExpMest(data: {
    hisData: { [key: string]: string } | any;
    userId: string;
    workingStateId?: string | null;
  }): Promise<InpatientExpMest> {
    this.logger.info('InpatientExpMestController#syncInpatientExpMest.call', {
      userId: data.userId,
      workingStateId: data.workingStateId,
    });

    try {
      // Convert map<string, string> back to object
      let hisDataObj: any = data.hisData;
      if (data.hisData && typeof data.hisData === 'object' && !Array.isArray(data.hisData)) {
        // If it's a map with 'data' key containing JSON string, parse it
        if (data.hisData.data && typeof data.hisData.data === 'string') {
          try {
            hisDataObj = JSON.parse(data.hisData.data);
          } catch (error: any) {
            this.logger.error('Failed to parse hisData JSON', { error });
            throw new Error('Invalid hisData format');
          }
        } else if (Object.keys(data.hisData).length > 0 && typeof Object.values(data.hisData)[0] === 'string') {
          // Try to parse individual JSON strings
          hisDataObj = {};
          Object.keys(data.hisData).forEach(key => {
            try {
              hisDataObj[key] = JSON.parse(data.hisData[key]);
            } catch {
              hisDataObj[key] = data.hisData[key];
            }
          });
        }
      }

      const result = await this.inpatientExpMestService.syncFromIntegrationApi(
        hisDataObj,
        data.userId,
        data.workingStateId,
      );

      this.convertLongToNumber(result);

      this.logger.info('InpatientExpMestController#syncInpatientExpMest.result', { id: result.id });
      return result;
    } catch (error: any) {
      this.logger.error('InpatientExpMestController#syncInpatientExpMest.error', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  @GrpcMethod('InventoryService', 'syncAllInpatientExpMest')
  async syncAllInpatientExpMest(data: {
    parentData: { [key: string]: string } | any;
    childrenData?: { [key: string]: string }[] | any[];
    medicinesData?: { [key: string]: string }[] | any[];
    userId: string;
    workingStateId?: string | null;
  }): Promise<{
    parent: InpatientExpMest;
    children: any[];
    medicines: any[];
  }> {
    this.logger.info('InpatientExpMestController#syncAllInpatientExpMest.call', {
      userId: data.userId,
      workingStateId: data.workingStateId,
      childrenCount: data.childrenData?.length || 0,
      medicinesCount: data.medicinesData?.length || 0,
    });

    try {
      // Convert map<string, string> back to object for parentData
      let parentDataObj: any = data.parentData;
      if (data.parentData && typeof data.parentData === 'object' && !Array.isArray(data.parentData)) {
        if (data.parentData.data && typeof data.parentData.data === 'string') {
          try {
            parentDataObj = JSON.parse(data.parentData.data);
          } catch (error: any) {
            this.logger.error('Failed to parse parentData JSON', { error });
            throw new Error('Invalid parentData format');
          }
        } else if (Object.keys(data.parentData).length > 0 && typeof Object.values(data.parentData)[0] === 'string') {
          parentDataObj = {};
          Object.keys(data.parentData).forEach(key => {
            try {
              parentDataObj[key] = JSON.parse(data.parentData[key]);
            } catch {
              parentDataObj[key] = data.parentData[key];
            }
          });
        }
      }

      // Convert childrenData array (now it's repeated string, each element is a JSON string)
      let childrenDataArray: any[] = [];
      if (data.childrenData && Array.isArray(data.childrenData) && data.childrenData.length > 0) {
        childrenDataArray = data.childrenData.map((item: any) => {
          if (typeof item === 'string') {
            try {
              return JSON.parse(item);
            } catch {
              return null;
            }
          }
          return item;
        }).filter((item: any) => item !== null);
      }

      // Convert medicinesData array (now it's repeated string, each element is a JSON string)
      let medicinesDataArray: any[] = [];
      if (data.medicinesData && Array.isArray(data.medicinesData) && data.medicinesData.length > 0) {
        medicinesDataArray = data.medicinesData.map((item: any) => {
          if (typeof item === 'string') {
            try {
              return JSON.parse(item);
            } catch {
              return null;
            }
          }
          return item;
        }).filter((item: any) => item !== null);
      }

      const result = await this.inpatientExpMestService.syncAllInTransaction({
        parentData: parentDataObj,
        childrenData: childrenDataArray.length > 0 ? childrenDataArray : undefined,
        medicinesData: medicinesDataArray.length > 0 ? medicinesDataArray : undefined,
        userId: data.userId,
        workingStateId: data.workingStateId,
      });

      this.convertLongToNumber(result.parent);
      result.children.forEach((child: any) => {
        // Convert Long to Number for child if needed
        if (child && typeof child === 'object') {
          // Add conversion logic for child if needed
        }
      });
      result.medicines.forEach((medicine: any) => {
        // Convert Long to Number for medicine if needed
        if (medicine && typeof medicine === 'object') {
          // Add conversion logic for medicine if needed
        }
      });

      this.logger.info('InpatientExpMestController#syncAllInpatientExpMest.result', {
        parentId: result.parent.id,
        childrenCount: result.children.length,
        medicinesCount: result.medicines.length,
      });
      return result;
    } catch (error: any) {
      this.logger.error('InpatientExpMestController#syncAllInpatientExpMest.error', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  /**
   * Convert Long object to number (for Oracle NUMBER(19,0) fields)
   */
  private convertLongToNumber(entity: InpatientExpMest): void {
    const numberFields: (keyof InpatientExpMest)[] = [
      'hisExpMestId', 'expMestTypeId', 'expMestSttId', 'mediStockId',
      'reqRoomId', 'reqDepartmentId', 'createDate', 'tdlPatientTypeId',
      'virCreateMonth', 'virCreateYear', 'numOrder', 'tdlIntructionDateMin',
      'lastExpTime', 'finishTime', 'finishDate', 'isExportEqualApprove',
      'lastApprovalTime', 'lastApprovalDate', 'hisCreateTime', 'hisModifyTime',
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

