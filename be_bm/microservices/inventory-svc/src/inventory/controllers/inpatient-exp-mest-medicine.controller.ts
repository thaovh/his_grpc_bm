import { PinoLogger } from 'nestjs-pino';
import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { isEmpty } from 'lodash';

import { Query, Count, Id } from '../../commons/interfaces/commons.interface';
import { InpatientExpMestMedicineService } from '../services/inpatient-exp-mest-medicine.service';
import { InpatientExpMestMedicine } from '../entities/inpatient-exp-mest-medicine.entity';
import { CreateInpatientExpMestMedicineDto } from '../dto/create-inpatient-exp-mest-medicine.dto';
import { UpdateInpatientExpMestMedicineDto } from '../dto/update-inpatient-exp-mest-medicine.dto';
import { BatchUpdateExportFieldsDto } from '../dto/batch-update-export-fields.dto';
import { BatchUpdateActualExportFieldsDto } from '../dto/batch-update-actual-export-fields.dto';

export interface InpatientExpMestMedicineQueryResult {
  data: Array<InpatientExpMestMedicine>;
}

@Controller()
export class InpatientExpMestMedicineController {
  constructor(
    private readonly service: InpatientExpMestMedicineService,
    private readonly logger: PinoLogger,
  ) {
    logger.setContext(InpatientExpMestMedicineController.name);
  }

  @GrpcMethod('InventoryService', 'findAllInpatientExpMestMedicines')
  async findAll(query: Query): Promise<InpatientExpMestMedicineQueryResult> {
    this.logger.info('InpatientExpMestMedicineController#findAll.call', query);

    const result: Array<InpatientExpMestMedicine> = await this.service.findAll({
      select: !isEmpty(query.attributes) ? query.attributes as any : undefined,
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
      order: !isEmpty(query.order) ? JSON.parse(query.order) : undefined,
      skip: query.offset ? query.offset : 0,
      take: query.limit ? query.limit : 25,
    });

    // Convert Long objects to numbers for Oracle compatibility
    result.forEach(medicine => this.convertLongToNumber(medicine));

    this.logger.info('InpatientExpMestMedicineController#findAll.result', { count: result.length });

    return { data: result };
  }

  @GrpcMethod('InventoryService', 'findInpatientExpMestMedicineById')
  async findById(data: Id): Promise<InpatientExpMestMedicine> {
    this.logger.info('InpatientExpMestMedicineController#findById.call', data);

    const result: InpatientExpMestMedicine | null = await this.service.findById(data.id);

    if (!result) {
      throw new Error('InpatientExpMestMedicine not found');
    }

    // Convert Long objects to numbers for Oracle compatibility
    this.convertLongToNumber(result);

    this.logger.info('InpatientExpMestMedicineController#findById.result', result);

    return result;
  }

  @GrpcMethod('InventoryService', 'findInpatientExpMestMedicineByHisId')
  async findByHisId(data: { hisId: number }): Promise<InpatientExpMestMedicine> {
    console.log('=== [GRPC DEBUG] InpatientExpMestMedicineController#findByHisId.call ===');
    console.log('data:', JSON.stringify(data, null, 2));
    console.log('data.hisId type:', typeof data.hisId);
    console.log('data.hisId value:', data.hisId);
    this.logger.info('InpatientExpMestMedicineController#findByHisId.call', data);

    try {
      // Convert hisId from Long object if needed
      let hisId: number;
      const hisIdValue = data.hisId;
      console.log('=== [GRPC DEBUG] Converting hisId ===');
      console.log('hisIdValue:', hisIdValue);
      console.log('hisIdValue type:', typeof hisIdValue);
      console.log('hisIdValue is object:', typeof hisIdValue === 'object');
      
      if (hisIdValue !== null && 
          hisIdValue !== undefined && 
          typeof hisIdValue === 'object') {
        const objValue = hisIdValue as any;
        console.log('hisIdValue is Long object:', 'low' in objValue && 'high' in objValue);
        if ('low' in objValue && 'high' in objValue) {
          const longValue = objValue as { low: number; high: number };
          hisId = longValue.low + (longValue.high * 0x100000000);
          console.log('Converted from Long:', { low: longValue.low, high: longValue.high, result: hisId });
        } else {
          hisId = Number(hisIdValue);
          console.log('Converted to Number:', hisId);
        }
      } else {
        hisId = Number(hisIdValue);
        console.log('Converted to Number (not object):', hisId);
      }

      console.log('=== [GRPC DEBUG] Final hisId ===');
      console.log('hisId:', hisId);
      console.log('isNaN:', isNaN(hisId));

      if (isNaN(hisId)) {
        console.error('=== [GRPC DEBUG] Invalid hisId ===');
        throw new RpcException({
          code: 3, // INVALID_ARGUMENT
          message: 'Invalid hisId: must be a valid number',
        });
      }

      console.log('=== [GRPC DEBUG] Calling service.findByHisId ===');
      const result: InpatientExpMestMedicine | null = await this.service.findByHisId(hisId);

      console.log('=== [GRPC DEBUG] Service result ===');
      console.log('result:', result ? 'found' : 'not found');
      console.log('result hisId:', result?.hisId);
      console.log('result inpatientExpMestId:', result?.inpatientExpMestId);

      if (!result) {
        console.error('=== [GRPC DEBUG] Medicine not found ===');
        throw new RpcException({
          code: 5, // NOT_FOUND
          message: `InpatientExpMestMedicine with hisId ${hisId} not found`,
        });
      }

      // Convert Long objects to numbers for Oracle compatibility
      this.convertLongToNumber(result);

      // Map inpatientExpMestId to proto message (proto uses inpatientExpMestChildId but entity uses inpatientExpMestId)
      // Create a new object with proto field names
      const protoResult: any = {
        ...result,
        inpatientExpMestChildId: result.inpatientExpMestId, // Map to proto field name
        inpatientExpMestId: result.inpatientExpMestId, // Also include for compatibility
      };

      console.log('=== [GRPC DEBUG] Returning result ===');
      console.log('result hisId:', result.hisId);
      console.log('result inpatientExpMestId:', result.inpatientExpMestId);
      console.log('protoResult.inpatientExpMestChildId:', protoResult.inpatientExpMestChildId);
      console.log('protoResult.inpatientExpMestId:', protoResult.inpatientExpMestId);
      this.logger.info('InpatientExpMestMedicineController#findByHisId.result', result);

      return protoResult;
    } catch (error: any) {
      console.error('=== [GRPC DEBUG] Error occurred ===');
      console.error('error type:', error?.constructor?.name);
      console.error('error message:', error?.message);
      console.error('error code:', error?.code);
      console.error('error stack:', error?.stack);
      
      this.logger.error('InpatientExpMestMedicineController#findByHisId.error', {
        error: error.message,
        stack: error.stack,
        code: error.code,
      });

      if (error instanceof RpcException) {
        console.log('=== [GRPC DEBUG] Re-throwing RpcException ===');
        throw error;
      }

      console.error('=== [GRPC DEBUG] Wrapping error in RpcException ===');
      throw new RpcException({
        code: 2, // INTERNAL
        message: error.message || 'Internal server error',
      });
    }
  }

  @GrpcMethod('InventoryService', 'findInpatientExpMestMedicinesByInpatientExpMestId')
  async findByInpatientExpMestId(data: { inpatientExpMestId: number }): Promise<InpatientExpMestMedicineQueryResult> {
    this.logger.info('InpatientExpMestMedicineController#findByInpatientExpMestId.call', data);

    // Convert inpatientExpMestId from Long object if needed
    let inpatientExpMestId: number;
    const inpatientExpMestIdValue = data.inpatientExpMestId;
    if (inpatientExpMestIdValue !== null && 
        inpatientExpMestIdValue !== undefined && 
        typeof inpatientExpMestIdValue === 'object') {
      const objValue = inpatientExpMestIdValue as any;
      if ('low' in objValue && 'high' in objValue) {
        const longValue = objValue as { low: number; high: number };
        inpatientExpMestId = longValue.low + (longValue.high * 0x100000000);
      } else {
        inpatientExpMestId = Number(inpatientExpMestIdValue);
      }
    } else {
      inpatientExpMestId = Number(inpatientExpMestIdValue);
    }

    if (isNaN(inpatientExpMestId)) {
      throw new Error('Invalid inpatientExpMestId: must be a valid number');
    }

    const result: Array<InpatientExpMestMedicine> = await this.service.findByInpatientExpMestId(inpatientExpMestId);

    // Convert Long objects to numbers for Oracle compatibility
    result.forEach(medicine => this.convertLongToNumber(medicine));

    this.logger.info('InpatientExpMestMedicineController#findByInpatientExpMestId.result', { count: result.length });

    return { data: result };
  }

  @GrpcMethod('InventoryService', 'createInpatientExpMestMedicine')
  async create(data: CreateInpatientExpMestMedicineDto): Promise<InpatientExpMestMedicine> {
    this.logger.info('InpatientExpMestMedicineController#create.call', { hisId: data.hisId });

    const result = await this.service.create(data);
    this.convertLongToNumber(result);
    this.logger.info('InpatientExpMestMedicineController#create.result', { id: result.id });
    return result;
  }

  @GrpcMethod('InventoryService', 'updateInpatientExpMestMedicine')
  async update(data: { id: string } & UpdateInpatientExpMestMedicineDto): Promise<InpatientExpMestMedicine> {
    this.logger.info('InpatientExpMestMedicineController#update.call', { id: data.id });

    const { id, ...updateDto } = data;
    const result = await this.service.update(id, updateDto);
    this.convertLongToNumber(result);
    this.logger.info('InpatientExpMestMedicineController#update.result', { id: result.id });
    return result;
  }

  @GrpcMethod('InventoryService', 'countInpatientExpMestMedicines')
  async count(query: Query): Promise<Count> {
    this.logger.info('InpatientExpMestMedicineController#count.call', query);

    const count = await this.service.count({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
    });

    this.logger.info('InpatientExpMestMedicineController#count.result', { count });
    return { count };
  }

  @GrpcMethod('InventoryService', 'syncInpatientExpMestMedicine')
  async syncInpatientExpMestMedicine(data: {
    hisData: { [key: string]: string } | any;
    inpatientExpMestId: number;
    inpatientExpMestLocalId?: string | null;
    userId: string;
  }): Promise<InpatientExpMestMedicine> {
    console.log('=== InpatientExpMestMedicineController#syncInpatientExpMestMedicine START ===');
    console.log('data.userId:', data.userId);
    console.log('data.inpatientExpMestId:', data.inpatientExpMestId);
    console.log('data.inpatientExpMestLocalId:', data.inpatientExpMestLocalId);
    console.log('data.hisData type:', typeof data.hisData);
    console.log('data.hisData:', JSON.stringify(data.hisData, null, 2));
    this.logger.info('InpatientExpMestMedicineController#syncInpatientExpMestMedicine.call', {
      userId: data.userId,
      inpatientExpMestId: data.inpatientExpMestId,
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
        data.inpatientExpMestId,
        data.inpatientExpMestLocalId || null,
        data.userId,
      );
      console.log('Service result:', JSON.stringify(result, null, 2));

      console.log('Step 3: Converting Long to Number...');
      this.convertLongToNumber(result);
      console.log('After convertLongToNumber:', JSON.stringify(result, null, 2));

      this.logger.info('InpatientExpMestMedicineController#syncInpatientExpMestMedicine.result', { id: result.id });
      console.log('=== InpatientExpMestMedicineController#syncInpatientExpMestMedicine SUCCESS ===');
      return result;
    } catch (error: any) {
      console.error('=== InpatientExpMestMedicineController#syncInpatientExpMestMedicine ERROR ===');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      this.logger.error('InpatientExpMestMedicineController#syncInpatientExpMestMedicine.error', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  @GrpcMethod('InventoryService', 'updateExportFieldsByHisIds')
  async updateExportFieldsByHisIds(data: {
    hisIds: number[];
    exportTime?: number | null;
    userId: string;
  }): Promise<{ updatedCount: number; hisIds: number[] }> {
    this.logger.info('InpatientExpMestMedicineController#updateExportFieldsByHisIds.call', {
      hisIdsCount: data.hisIds?.length || 0,
      exportTime: data.exportTime,
      userId: data.userId,
    });

    try {
      // Convert hisIds from Long objects if needed
      const hisIdsNumbers: number[] = (data.hisIds || []).map((id: any) => {
        if (id !== null && id !== undefined && typeof id === 'object' && 'low' in id && 'high' in id) {
          const longValue = id as { low: number; high: number };
          return longValue.low + (longValue.high * 0x100000000);
        }
        return Number(id);
      }).filter((id): id is number => !isNaN(id));

      if (hisIdsNumbers.length === 0) {
        throw new Error('Invalid hisIds: must provide at least one valid hisId');
      }

      // Convert exportTime from Long if needed
      let exportTime: number | null | undefined = data.exportTime;
      if (exportTime !== null && exportTime !== undefined) {
        // Check if it's a Long object - use type guard
        const exportTimeObj: any = exportTime;
        if (
          typeof exportTimeObj === 'object' &&
          exportTimeObj !== null &&
          typeof exportTimeObj.low === 'number' &&
          typeof exportTimeObj.high === 'number'
        ) {
          // It's a Long object
          exportTime = exportTimeObj.low + (exportTimeObj.high * 0x100000000);
        } else {
          // It's a regular number
          exportTime = Number(exportTimeObj);
        }
      }

      const dto: BatchUpdateExportFieldsDto = {
        hisIds: hisIdsNumbers,
        exportTime: exportTime !== undefined ? exportTime : null,
      };

      const result = await this.service.updateExportFieldsByHisIds(dto, data.userId);

      this.logger.info('InpatientExpMestMedicineController#updateExportFieldsByHisIds.result', {
        updatedCount: result.updatedCount,
        hisIdsCount: result.hisIds.length,
      });

      return result;
    } catch (error: any) {
      this.logger.error('InpatientExpMestMedicineController#updateExportFieldsByHisIds.error', {
        error: error.message,
        stack: error.stack,
      });
      
      // Check if error is about validation (already exported or not found)
      const errorMessage = error?.message || 'Internal server error';
      if (errorMessage.includes('already been exported') || errorMessage.includes('Cannot update') || errorMessage.includes('not found')) {
        // Use INVALID_ARGUMENT (3) for validation errors
        throw new RpcException({
          code: 3, // INVALID_ARGUMENT
          message: errorMessage,
        });
      }
      
      // For other errors, use INTERNAL (2)
      throw new RpcException({
        code: 2, // INTERNAL
        message: errorMessage,
      });
    }
  }

  @GrpcMethod('InventoryService', 'updateActualExportFieldsByHisIds')
  async updateActualExportFieldsByHisIds(data: {
    hisIds: number[];
    actualExportTime?: number | null;
    userId: string;
  }): Promise<{ updatedCount: number; hisIds: number[] }> {
    this.logger.info('InpatientExpMestMedicineController#updateActualExportFieldsByHisIds.call', {
      hisIdsCount: data.hisIds?.length || 0,
      actualExportTime: data.actualExportTime,
      userId: data.userId,
    });

    try {
      // Convert hisIds from Long objects if needed
      const hisIdsNumbers: number[] = (data.hisIds || []).map((id: any) => {
        if (id !== null && id !== undefined && typeof id === 'object' && 'low' in id && 'high' in id) {
          const longValue = id as { low: number; high: number };
          return longValue.low + (longValue.high * 0x100000000);
        }
        return Number(id);
      }).filter((id): id is number => !isNaN(id));

      if (hisIdsNumbers.length === 0) {
        throw new Error('Invalid hisIds: must provide at least one valid hisId');
      }

      // Convert actualExportTime from Long if needed
      let actualExportTime: number | null | undefined = data.actualExportTime;
      if (actualExportTime !== null && actualExportTime !== undefined) {
        const actualExportTimeObj: any = actualExportTime;
        if (
          typeof actualExportTimeObj === 'object' &&
          actualExportTimeObj !== null &&
          typeof actualExportTimeObj.low === 'number' &&
          typeof actualExportTimeObj.high === 'number'
        ) {
          actualExportTime = actualExportTimeObj.low + (actualExportTimeObj.high * 0x100000000);
        } else {
          actualExportTime = Number(actualExportTimeObj);
        }
      }

      const dto: BatchUpdateActualExportFieldsDto = {
        hisIds: hisIdsNumbers,
        actualExportTime: actualExportTime !== undefined ? actualExportTime : null,
      };

      const result = await this.service.updateActualExportFieldsByHisIds(dto, data.userId);

      this.logger.info('InpatientExpMestMedicineController#updateActualExportFieldsByHisIds.result', {
        updatedCount: result.updatedCount,
        hisIdsCount: result.hisIds.length,
      });

      return result;
    } catch (error: any) {
      this.logger.error('InpatientExpMestMedicineController#updateActualExportFieldsByHisIds.error', {
        error: error.message,
        stack: error.stack,
      });

      const errorMessage = error?.message || 'Internal server error';
      if (errorMessage.includes('already been actually exported') || errorMessage.includes('Cannot update') || errorMessage.includes('not found')) {
        throw new RpcException({
          code: 3, // INVALID_ARGUMENT
          message: errorMessage,
        });
      }

      throw new RpcException({
        code: 2, // INTERNAL
        message: errorMessage,
      });
    }
  }

  /**
   * Convert Long object to number (for Oracle NUMBER(19,0) fields)
   */
  private convertLongToNumber(entity: InpatientExpMestMedicine): void {
    const numberFields: (keyof InpatientExpMestMedicine)[] = [
      'hisId', 'inpatientExpMestId', 'medicineId', 'tdlMediStockId', 'tdlMedicineTypeId',
      'expMestMetyReqId', 'ckImpMestMedicineId', 'isExport', 'amount', 'exportAmount',
      'exportTime', 'approvalTime', 'approvalDate', 'expTime', 'expDate',
      'mediStockId', 'expMestSttId', 'impPrice', 'impVatRatio', 'bidId',
      'expiredDate', 'medicineTypeId', 'impTime', 'supplierId', 'medicineGroupId',
      'serviceUnitId', 'medicineNumOrder', 'serviceId', 'manufacturerId',
      'medicineUseFormNumOrder', 'sumInStock', 'sumByMedicineInStock',
      'price', 'vatRatio', 'virPrice', 'taxRatio', 'numOrder', 'presAmount',
      'patientTypeId', 'tdlPatientId', 'tdlTreatmentId', 'tdlServiceReqId',
      'useTimeTo', 'tdlIntructionTime', 'tdlIntructionDate',
      'expMestTypeId', 'tdlAggrExpMestId', 'aggrExpMestId', 'reqRoomId', 'reqDepartmentId',
      'medicineUseFormId', 'medicineLineId', 'medicineGroupNumOrder',
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

