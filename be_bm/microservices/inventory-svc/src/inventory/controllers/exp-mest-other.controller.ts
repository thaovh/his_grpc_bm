import { PinoLogger } from 'nestjs-pino';
import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { isEmpty } from 'lodash';

import { Query, Count, Id } from '../../commons/interfaces/commons.interface';
import { ExpMestOtherService } from '../services/exp-mest-other.service';
import { ExpMestOther } from '../entities/exp-mest-other.entity';
import { CreateExpMestOtherDto } from '../dto/create-exp-mest-other.dto';
import { UpdateExpMestOtherDto } from '../dto/update-exp-mest-other.dto';

@Controller()
export class ExpMestOtherController {
  constructor(
    private readonly expMestOtherService: ExpMestOtherService,
    private readonly logger: PinoLogger,
  ) {
    logger.setContext(ExpMestOtherController.name);
  }

  @GrpcMethod('InventoryService', 'findAllExpMestOthers')
  async findAllExpMestOthers(query: Query): Promise<{ data: ExpMestOther[] }> {
    this.logger.info('ExpMestOtherController#findAllExpMestOthers.call', query);

    const result: ExpMestOther[] = await this.expMestOtherService.findAll({
      select: !isEmpty(query.attributes) ? query.attributes as any : undefined,
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
      order: !isEmpty(query.order) ? JSON.parse(query.order) : undefined,
      skip: query.offset ? query.offset : 0,
      take: query.limit ? query.limit : 25,
    });

    result.forEach(item => this.convertLongToNumber(item));

    this.logger.info('ExpMestOtherController#findAllExpMestOthers.result', { count: result.length });
    return { data: result };
  }

  @GrpcMethod('InventoryService', 'findExpMestOtherById')
  async findExpMestOtherById(data: Id): Promise<ExpMestOther> {
    this.logger.info('ExpMestOtherController#findExpMestOtherById.call', data);

    const result: ExpMestOther | null = await this.expMestOtherService.findById(data.id);

    if (!result) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'ExpMestOther not found',
      });
    }

    this.convertLongToNumber(result);
    this.logger.info('ExpMestOtherController#findExpMestOtherById.result', { id: result.id });
    return result;
  }

  @GrpcMethod('InventoryService', 'findExpMestOthersByHisIds')
  async findExpMestOthersByHisIds(data: { hisExpMestIds: number[] }): Promise<{ data: ExpMestOther[] }> {
    this.logger.info('ExpMestOtherController#findExpMestOthersByHisIds.call', {
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

    const result: ExpMestOther[] = await this.expMestOtherService.findByHisExpMestIds(hisExpMestIds);

    result.forEach(item => this.convertLongToNumber(result));
    this.logger.info('ExpMestOtherController#findExpMestOthersByHisIds.result', {
      requested: hisExpMestIds.length,
      found: result.length
    });
    return { data: result };
  }

  @GrpcMethod('InventoryService', 'findExpMestOtherByHisId')
  async findExpMestOtherByHisId(data: Id): Promise<ExpMestOther> {
    this.logger.info('ExpMestOtherController#findExpMestOtherByHisId.call', data);

    const hisExpMestId = Number(data.id);
    if (isNaN(hisExpMestId)) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: 'Invalid hisExpMestId: must be a valid number',
      });
    }

    const result: ExpMestOther | null = await this.expMestOtherService.findByHisExpMestId(hisExpMestId);

    if (!result) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'ExpMestOther not found',
      });
    }

    this.convertLongToNumber(result);
    this.logger.info('ExpMestOtherController#findExpMestOtherByHisId.result', { id: result.id });
    return result;
  }

  @GrpcMethod('InventoryService', 'createExpMestOther')
  async createExpMestOther(data: CreateExpMestOtherDto): Promise<ExpMestOther> {
    this.logger.info('ExpMestOtherController#createExpMestOther.call', { hisExpMestId: data.hisExpMestId });

    const result = await this.expMestOtherService.create(data);
    this.convertLongToNumber(result);
    this.logger.info('ExpMestOtherController#createExpMestOther.result', { id: result.id });
    return result;
  }

  @GrpcMethod('InventoryService', 'updateExpMestOther')
  async updateExpMestOther(data: { id: string } & UpdateExpMestOtherDto): Promise<ExpMestOther> {
    this.logger.info('ExpMestOtherController#updateExpMestOther.call', { id: data.id });

    const { id, ...updateDto } = data;
    const result = await this.expMestOtherService.update(id, updateDto);
    this.convertLongToNumber(result);
    this.logger.info('ExpMestOtherController#updateExpMestOther.result', { id: result.id });
    return result;
  }

  @GrpcMethod('InventoryService', 'countExpMestOthers')
  async countExpMestOthers(query: Query): Promise<Count> {
    this.logger.info('ExpMestOtherController#countExpMestOthers.call', query);

    const count = await this.expMestOtherService.count({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
    });

    this.logger.info('ExpMestOtherController#countExpMestOthers.result', { count });
    return { count };
  }

  @GrpcMethod('InventoryService', 'syncExpMestOther')
  async syncExpMestOther(data: {
    hisData: { [key: string]: string } | any;
    userId: string;
    workingStateId?: string | null;
  }): Promise<ExpMestOther> {
    this.logger.info('ExpMestOtherController#syncExpMestOther.call', {
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

      const result = await this.expMestOtherService.syncFromIntegrationApi(
        hisDataObj,
        data.userId,
        data.workingStateId,
      );

      this.convertLongToNumber(result);
      this.logger.info('ExpMestOtherController#syncExpMestOther.result', { id: result.id });
      return result;
    } catch (error: any) {
      this.logger.error('ExpMestOtherController#syncExpMestOther.error', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  @GrpcMethod('InventoryService', 'syncAllExpMestOther')
  async syncAllExpMestOther(data: {
    parentData: { [key: string]: string } | any;
    medicinesData?: { [key: string]: string }[] | any[];
    userId: string;
    workingStateId?: string | null;
  }): Promise<{
    parent: ExpMestOther;
    medicines: any[];
  }> {
    console.log('=== [DEBUG] ExpMestOtherController#syncAllExpMestOther.start ===');
    console.log('userId:', data.userId);
    console.log('workingStateId:', data.workingStateId);
    console.log('medicinesData type:', Array.isArray(data.medicinesData) ? 'array' : typeof data.medicinesData);
    console.log('medicinesData length:', data.medicinesData?.length || 0);
    this.logger.info('ExpMestOtherController#syncAllExpMestOther.call', {
      userId: data.userId,
      workingStateId: data.workingStateId,
      medicinesCount: data.medicinesData?.length || 0,
    });

    try {
      // Convert parentData
      console.log('=== [DEBUG] ExpMestOtherController#syncAllExpMestOther.step1: Parse parentData ===');
      console.log('parentData type:', typeof data.parentData);
      console.log('parentData keys:', data.parentData ? Object.keys(data.parentData) : 'null');
      let parentDataObj: any = data.parentData;
      if (data.parentData && typeof data.parentData === 'object' && !Array.isArray(data.parentData)) {
        if (data.parentData.data && typeof data.parentData.data === 'string') {
          try {
            console.log('Parsing parentData.data (string)');
            parentDataObj = JSON.parse(data.parentData.data);
            console.log('parentDataObj.id:', parentDataObj?.id);
          } catch (error: any) {
            console.error('=== [DEBUG] ExpMestOtherController#syncAllExpMestOther.step1.error ===');
            console.error('Failed to parse parentData JSON:', error?.message);
            this.logger.error('Failed to parse parentData JSON', { error });
            throw new Error('Invalid parentData format');
          }
        } else {
          console.log('parentData is already an object, using directly');
        }
      }

      // Convert medicinesData - medicinesData is array of JSON strings from api-gateway
      console.log('=== [DEBUG] ExpMestOtherController#syncAllExpMestOther.step2: Parse medicinesData ===');
      let medicinesDataArray: any[] = [];
      if (data.medicinesData && Array.isArray(data.medicinesData)) {
        console.log('medicinesData is array, length:', data.medicinesData.length);
        medicinesDataArray = data.medicinesData.map((item: any, index: number) => {
          // medicinesData from api-gateway is array of JSON strings
          if (typeof item === 'string') {
            try {
              const parsed = JSON.parse(item);
              if (index === 0) {
                console.log('First medicine parsed sample:', JSON.stringify(parsed, null, 2).substring(0, 200));
              }
              return parsed;
            } catch (error: any) {
              console.warn(`Failed to parse medicine at index ${index}:`, error?.message);
              return item;
            }
          } else if (typeof item === 'object' && item !== null) {
            // If it's already an object, use it directly
            return item;
          }
          return item;
        });
        console.log('medicinesDataArray.length:', medicinesDataArray.length);
      }

      console.log('=== [DEBUG] ExpMestOtherController#syncAllExpMestOther.step3: Call syncAllInTransaction ===');
      console.log('parentDataObj.id:', parentDataObj?.id);
      console.log('medicinesDataArray.length:', medicinesDataArray.length);
      const result = await this.expMestOtherService.syncAllInTransaction({
        parentData: parentDataObj,
        medicinesData: medicinesDataArray.length > 0 ? medicinesDataArray : undefined,
        userId: data.userId,
        workingStateId: data.workingStateId || null,
      });
      console.log('=== [DEBUG] ExpMestOtherController#syncAllExpMestOther.step3.result ===');
      console.log('result.parent.id:', result?.parent?.id);
      console.log('result.medicines.length:', result?.medicines?.length);

      this.convertLongToNumber(result.parent);
      result.medicines.forEach(med => this.convertLongToNumber(med));

      console.log('=== [DEBUG] ExpMestOtherController#syncAllExpMestOther.success ===');
      this.logger.info('ExpMestOtherController#syncAllExpMestOther.result', {
        parentId: result.parent.id,
        medicinesCount: result.medicines.length,
      });
      return result;
    } catch (error: any) {
      console.error('=== [DEBUG] ExpMestOtherController#syncAllExpMestOther.error ===');
      console.error('Error type:', error?.constructor?.name);
      console.error('Error message:', error?.message);
      console.error('Error stack:', error?.stack);
      this.logger.error('ExpMestOtherController#syncAllExpMestOther.error', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
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

