import { PinoLogger } from 'nestjs-pino';
import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { isEmpty } from 'lodash';

import { Query, Count, Id } from '../../commons/interfaces/commons.interface';
import { InpatientExpMestChildService } from '../services/inpatient-exp-mest-child.service';
import { InpatientExpMestChild } from '../entities/inpatient-exp-mest-child.entity';
import { CreateInpatientExpMestChildDto } from '../dto/create-inpatient-exp-mest-child.dto';
import { UpdateInpatientExpMestChildDto } from '../dto/update-inpatient-exp-mest-child.dto';

@Controller()
export class InpatientExpMestChildController {
  constructor(
    private readonly service: InpatientExpMestChildService,
    private readonly logger: PinoLogger,
  ) {
    logger.setContext(InpatientExpMestChildController.name);
  }

  @GrpcMethod('InventoryService', 'findAllInpatientExpMestChildren')
  async findAllInpatientExpMestChildren(query: Query): Promise<{ data: InpatientExpMestChild[] }> {
    this.logger.info('InpatientExpMestChildController#findAllInpatientExpMestChildren.call', query);

    const result: InpatientExpMestChild[] = await this.service.findAll({
      select: !isEmpty(query.attributes) ? query.attributes as any : undefined,
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
      order: !isEmpty(query.order) ? JSON.parse(query.order) : undefined,
      skip: query.offset ? query.offset : 0,
      take: query.limit ? query.limit : 25,
    });

    result.forEach(item => this.convertLongToNumber(item));

    this.logger.info('InpatientExpMestChildController#findAllInpatientExpMestChildren.result', { count: result.length });
    return { data: result };
  }

  @GrpcMethod('InventoryService', 'findInpatientExpMestChildById')
  async findInpatientExpMestChildById(data: Id): Promise<InpatientExpMestChild> {
    this.logger.info('InpatientExpMestChildController#findInpatientExpMestChildById.call', data);

    const result: InpatientExpMestChild | null = await this.service.findById(data.id);

    if (!result) {
      throw new Error('InpatientExpMestChild not found');
    }

    this.convertLongToNumber(result);
    this.logger.info('InpatientExpMestChildController#findInpatientExpMestChildById.result', { id: result.id });
    return result;
  }

  @GrpcMethod('InventoryService', 'findInpatientExpMestChildByHisId')
  async findInpatientExpMestChildByHisId(data: { hisExpMestId: number }): Promise<InpatientExpMestChild> {
    console.log('=== [GRPC DEBUG] InpatientExpMestChildController#findInpatientExpMestChildByHisId.call ===');
    console.log('data:', JSON.stringify(data, null, 2));
    console.log('data.hisExpMestId type:', typeof data.hisExpMestId);
    console.log('data.hisExpMestId value:', data.hisExpMestId);
    this.logger.info('InpatientExpMestChildController#findInpatientExpMestChildByHisId.call', data);

    try {
      // Convert hisExpMestId from Long object if needed
      let hisExpMestId: number;
      const hisExpMestIdValue = data.hisExpMestId;
      console.log('=== [GRPC DEBUG] Converting hisExpMestId ===');
      console.log('hisExpMestIdValue:', hisExpMestIdValue);
      console.log('hisExpMestIdValue type:', typeof hisExpMestIdValue);
      
      if (hisExpMestIdValue !== null && 
          hisExpMestIdValue !== undefined && 
          typeof hisExpMestIdValue === 'object') {
        const objValue = hisExpMestIdValue as any;
        if ('low' in objValue && 'high' in objValue) {
          const longValue = objValue as { low: number; high: number };
          hisExpMestId = longValue.low + (longValue.high * 0x100000000);
          console.log('Converted from Long:', { low: longValue.low, high: longValue.high, result: hisExpMestId });
        } else {
          hisExpMestId = Number(hisExpMestIdValue);
          console.log('Converted to Number:', hisExpMestId);
        }
      } else {
        hisExpMestId = Number(hisExpMestIdValue);
        console.log('Converted to Number (not object):', hisExpMestId);
      }

      console.log('=== [GRPC DEBUG] Final hisExpMestId ===');
      console.log('hisExpMestId:', hisExpMestId);
      console.log('isNaN:', isNaN(hisExpMestId));

      if (isNaN(hisExpMestId)) {
        throw new RpcException({
          code: 3, // INVALID_ARGUMENT
          message: 'Invalid hisExpMestId: must be a valid number',
        });
      }

      console.log('=== [GRPC DEBUG] Calling service.findByHisExpMestId ===');
      const result: InpatientExpMestChild | null = await this.service.findByHisExpMestId(hisExpMestId);

      console.log('=== [GRPC DEBUG] Service result ===');
      console.log('result:', result ? 'found' : 'not found');
      console.log('result hisExpMestId:', result?.hisExpMestId);
      console.log('result aggrExpMestId:', result?.aggrExpMestId);

      if (!result) {
        throw new RpcException({
          code: 5, // NOT_FOUND
          message: `InpatientExpMestChild with hisExpMestId ${hisExpMestId} not found`,
        });
      }

      this.convertLongToNumber(result);
      console.log('=== [GRPC DEBUG] Returning result ===');
      console.log('result hisExpMestId:', result.hisExpMestId);
      console.log('result aggrExpMestId:', result.aggrExpMestId);
      this.logger.info('InpatientExpMestChildController#findInpatientExpMestChildByHisId.result', { id: result.id });
      return result;
    } catch (error: any) {
      console.error('=== [GRPC DEBUG] Error occurred ===');
      console.error('error type:', error?.constructor?.name);
      console.error('error message:', error?.message);
      console.error('error code:', error?.code);
      
      if (error instanceof RpcException) {
        throw error;
      }

      throw new RpcException({
        code: 2, // INTERNAL
        message: error.message || 'Internal server error',
      });
    }
  }

  @GrpcMethod('InventoryService', 'createInpatientExpMestChild')
  async createInpatientExpMestChild(data: CreateInpatientExpMestChildDto): Promise<InpatientExpMestChild> {
    this.logger.info('InpatientExpMestChildController#createInpatientExpMestChild.call', { hisExpMestId: data.hisExpMestId });

    const result = await this.service.create(data);
    this.convertLongToNumber(result);
    this.logger.info('InpatientExpMestChildController#createInpatientExpMestChild.result', { id: result.id });
    return result;
  }

  @GrpcMethod('InventoryService', 'updateInpatientExpMestChild')
  async updateInpatientExpMestChild(data: { id: string } & UpdateInpatientExpMestChildDto): Promise<InpatientExpMestChild> {
    this.logger.info('InpatientExpMestChildController#updateInpatientExpMestChild.call', { id: data.id });

    const { id, ...updateDto } = data;
    const result = await this.service.update(id, updateDto);
    this.convertLongToNumber(result);
    this.logger.info('InpatientExpMestChildController#updateInpatientExpMestChild.result', { id: result.id });
    return result;
  }

  @GrpcMethod('InventoryService', 'countInpatientExpMestChildren')
  async countInpatientExpMestChildren(query: Query): Promise<Count> {
    this.logger.info('InpatientExpMestChildController#countInpatientExpMestChildren.call', query);

    const count = await this.service.count({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
    });

    this.logger.info('InpatientExpMestChildController#countInpatientExpMestChildren.result', { count });
    return { count };
  }

  @GrpcMethod('InventoryService', 'findInpatientExpMestChildrenByAggrExpMestId')
  async findInpatientExpMestChildrenByAggrExpMestId(data: { aggrExpMestId: number }): Promise<{ data: InpatientExpMestChild[] }> {
    this.logger.info('InpatientExpMestChildController#findInpatientExpMestChildrenByAggrExpMestId.call', data);

    // Convert aggrExpMestId from Long object if needed
    let aggrExpMestId: number;
    const aggrExpMestIdValue = data.aggrExpMestId;
    if (aggrExpMestIdValue !== null && 
        aggrExpMestIdValue !== undefined && 
        typeof aggrExpMestIdValue === 'object') {
      const objValue = aggrExpMestIdValue as any;
      if ('low' in objValue && 'high' in objValue) {
        const longValue = objValue as { low: number; high: number };
        aggrExpMestId = longValue.low + (longValue.high * 0x100000000);
      } else {
        aggrExpMestId = Number(aggrExpMestIdValue);
      }
    } else {
      aggrExpMestId = Number(aggrExpMestIdValue);
    }

    if (isNaN(aggrExpMestId)) {
      throw new Error('Invalid aggrExpMestId: must be a valid number');
    }

    const result: InpatientExpMestChild[] = await this.service.findByAggrExpMestId(aggrExpMestId);

    result.forEach(item => this.convertLongToNumber(item));

    this.logger.info('InpatientExpMestChildController#findInpatientExpMestChildrenByAggrExpMestId.result', { count: result.length });
    return { data: result };
  }

  @GrpcMethod('InventoryService', 'syncInpatientExpMestChild')
  async syncInpatientExpMestChild(data: {
    hisData: { [key: string]: string } | any;
    aggrExpMestId: number;
    aggrExpMestLocalId?: string | null;
    userId: string;
  }): Promise<InpatientExpMestChild> {
    console.log('=== InpatientExpMestChildController#syncInpatientExpMestChild START ===');
    console.log('data.userId:', data.userId);
    console.log('data.aggrExpMestId:', data.aggrExpMestId);
    console.log('data.aggrExpMestLocalId:', data.aggrExpMestLocalId);
    console.log('data.hisData type:', typeof data.hisData);
    console.log('data.hisData:', JSON.stringify(data.hisData, null, 2));
    this.logger.info('InpatientExpMestChildController#syncInpatientExpMestChild.call', {
      userId: data.userId,
      aggrExpMestId: data.aggrExpMestId,
    });

    try {
      // Convert map<string, string> back to object
      let hisDataObj: any = data.hisData;
      console.log('Step 1: Parsing hisData...');
      if (data.hisData && typeof data.hisData === 'object' && !Array.isArray(data.hisData)) {
        // If it's a map with 'data' key containing JSON string, parse it
        if (data.hisData.data && typeof data.hisData.data === 'string') {
          console.log('Found data.hisData.data as string, parsing JSON...');
          try {
            hisDataObj = JSON.parse(data.hisData.data);
            console.log('Parsed hisDataObj:', JSON.stringify(hisDataObj, null, 2));
          } catch (error: any) {
            console.error('Failed to parse hisData JSON:', error.message);
            this.logger.error('Failed to parse hisData JSON', { error });
            throw new Error('Invalid hisData format');
          }
        } else if (Object.keys(data.hisData).length > 0 && typeof Object.values(data.hisData)[0] === 'string') {
          console.log('Parsing individual JSON strings...');
          // Try to parse individual JSON strings
          hisDataObj = {};
          Object.keys(data.hisData).forEach(key => {
            try {
              hisDataObj[key] = JSON.parse(data.hisData[key]);
            } catch {
              hisDataObj[key] = data.hisData[key];
            }
          });
          console.log('Parsed hisDataObj:', JSON.stringify(hisDataObj, null, 2));
        } else {
          console.log('hisData is already an object, using as-is');
        }
      }

      console.log('Step 2: Calling service.syncFromIntegrationApi...');
      const result = await this.service.syncFromIntegrationApi(
        hisDataObj,
        data.aggrExpMestId,
        data.aggrExpMestLocalId || null,
        data.userId,
      );
      console.log('Service result:', JSON.stringify(result, null, 2));

      console.log('Step 3: Converting Long to Number...');
      this.convertLongToNumber(result);
      console.log('After convertLongToNumber:', JSON.stringify(result, null, 2));

      this.logger.info('InpatientExpMestChildController#syncInpatientExpMestChild.result', { id: result.id });
      console.log('=== InpatientExpMestChildController#syncInpatientExpMestChild SUCCESS ===');
      return result;
    } catch (error: any) {
      console.error('=== InpatientExpMestChildController#syncInpatientExpMestChild ERROR ===');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      this.logger.error('InpatientExpMestChildController#syncInpatientExpMestChild.error', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  /**
   * Convert Long object to number (for Oracle NUMBER(19,0) fields)
   */
  private convertLongToNumber(entity: InpatientExpMestChild): void {
    const numberFields: (keyof InpatientExpMestChild)[] = [
      'hisExpMestId', 'aggrExpMestId', 'expMestTypeId', 'expMestSttId', 'mediStockId',
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

