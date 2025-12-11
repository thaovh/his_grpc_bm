import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { PinoLogger } from 'nestjs-pino';
import { ExpMestSummaryService } from '../services/exp-mest-summary.service';
import { convertLongToNumber } from '../utils/oracle-utils';

@Controller()
export class ExpMestSummaryGrpcController {
  constructor(
    private readonly expMestSummaryService: ExpMestSummaryService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ExpMestSummaryGrpcController.name);
  }

  @GrpcMethod('InventoryService', 'GetExpMestCabinetSummary')
  async getExpMestCabinetSummary(data: { expMestId: number; orderBy?: string }): Promise<any> {
    this.logger.info('ExpMestSummaryGrpcController#getExpMestCabinetSummary.call', data);
    
    try {
      const result = await this.expMestSummaryService.getExpMestCabinetSummary(
        data.expMestId,
        data.orderBy
      );
      
      console.log('=== [DEBUG] Controller: Before serializeLongObjects ===');
      console.log('result.working_state:', result.working_state);
      console.log('hasWorkingState:', !!result.working_state);
      console.log('result keys:', Object.keys(result || {}));
      
      // Serialize Long objects before returning
      this.serializeLongObjects(result);
      
      // Convert Date objects in working_state to ISO strings for gRPC serialization
      if (result.working_state) {
        if (result.working_state.createdAt instanceof Date) {
          result.working_state.createdAt = result.working_state.createdAt.toISOString();
        } else if (typeof result.working_state.createdAt === 'string' && result.working_state.createdAt.includes('GMT')) {
          const date = new Date(result.working_state.createdAt);
          if (!isNaN(date.getTime())) {
            result.working_state.createdAt = date.toISOString();
          }
        }
        if (result.working_state.updatedAt instanceof Date) {
          result.working_state.updatedAt = result.working_state.updatedAt.toISOString();
        } else if (typeof result.working_state.updatedAt === 'string' && result.working_state.updatedAt.includes('GMT')) {
          const date = new Date(result.working_state.updatedAt);
          if (!isNaN(date.getTime())) {
            result.working_state.updatedAt = date.toISOString();
          }
        }
      }
      
      console.log('=== [DEBUG] Controller: After serializeLongObjects and Date conversion ===');
      console.log('result.working_state:', result.working_state);
      console.log('hasWorkingState:', !!result.working_state);
      console.log('result keys:', Object.keys(result || {}));
      console.log('result (first 1000 chars):', JSON.stringify(result).substring(0, 1000));
      
      this.logger.info('ExpMestSummaryGrpcController#getExpMestCabinetSummary.result', {
        expMestId: data.expMestId,
        medicinesCount: result.medicines?.length || 0,
        workingStateId: result.workingStateId,
        hasWorkingState: !!result.working_state,
        workingStateCode: result.working_state?.code,
      });
      
      console.log('=== [DEBUG] Controller: Returning result ===');
      console.log('result.working_state:', result.working_state);
      console.log('result.working_state type:', typeof result.working_state);
      console.log('result.working_state is null:', result.working_state === null);
      console.log('result.working_state is undefined:', result.working_state === undefined);
      if (result.working_state) {
        console.log('result.working_state keys:', Object.keys(result.working_state));
        console.log('result.working_state JSON:', JSON.stringify(result.working_state));
      }
      console.log('Full result JSON (first 2000 chars):', JSON.stringify(result).substring(0, 2000));
      
      // CRITICAL: Ensure working_state is properly structured for gRPC serialization
      // NestJS gRPC may not serialize nested objects if they don't match proto definition exactly
      if (result.working_state && typeof result.working_state === 'object') {
        // Create a new object with only proto-defined fields
        const protoWorkingState = {
          id: String(result.working_state.id || ''),
          code: String(result.working_state.code || ''),
          name: String(result.working_state.name || ''),
          sortOrder: Number(result.working_state.sortOrder || 0),
          createdAt: String(result.working_state.createdAt || ''),
          updatedAt: String(result.working_state.updatedAt || ''),
          createdBy: String(result.working_state.createdBy || ''),
          updatedBy: String(result.working_state.updatedBy || ''),
          version: Number(result.working_state.version || 0),
          isActive: Number(result.working_state.isActive || 0),
        };
        result.working_state = protoWorkingState;
        console.log('=== [DEBUG] Controller: After proto mapping ===');
        console.log('protoWorkingState:', JSON.stringify(protoWorkingState));
      }
      
      return result;
    } catch (error: any) {
      this.logger.error('ExpMestSummaryGrpcController#getExpMestCabinetSummary.error', {
        expMestId: data.expMestId,
        error: error.message,
        stack: error.stack,
      });
      
      if (error instanceof RpcException) {
        throw error;
      }
      
      // Convert regular errors to RpcException
      const errorMessage = error.message || 'Failed to get ExpMestCabinet summary';
      const errorCode = error.message?.includes('not found') ? 5 : 13; // NOT_FOUND : INTERNAL
      throw new RpcException({
        code: errorCode,
        message: errorMessage,
      });
    }
  }

  @GrpcMethod('InventoryService', 'GetExpMestOtherSummary')
  async getExpMestOtherSummary(data: { expMestId: number; orderBy?: string }): Promise<any> {
    this.logger.info('ExpMestSummaryGrpcController#getExpMestOtherSummary.call', data);
    
    try {
      const result = await this.expMestSummaryService.getExpMestOtherSummary(
        data.expMestId,
        data.orderBy
      );
      
      // Serialize Long objects before returning
      this.serializeLongObjects(result);
      
      // Convert Date objects in working_state to ISO strings for gRPC serialization
      if (result.working_state) {
        if (result.working_state.createdAt instanceof Date) {
          result.working_state.createdAt = result.working_state.createdAt.toISOString();
        } else if (typeof result.working_state.createdAt === 'string' && result.working_state.createdAt.includes('GMT')) {
          const date = new Date(result.working_state.createdAt);
          if (!isNaN(date.getTime())) {
            result.working_state.createdAt = date.toISOString();
          }
        }
        if (result.working_state.updatedAt instanceof Date) {
          result.working_state.updatedAt = result.working_state.updatedAt.toISOString();
        } else if (typeof result.working_state.updatedAt === 'string' && result.working_state.updatedAt.includes('GMT')) {
          const date = new Date(result.working_state.updatedAt);
          if (!isNaN(date.getTime())) {
            result.working_state.updatedAt = date.toISOString();
          }
        }
      }
      
      // Debug: Log working_state details using console.log for better visibility
      console.log('=== [DEBUG] ExpMestSummaryGrpcController#getExpMestOtherSummary.result ===');
      console.log('workingStateId:', result.workingStateId);
      console.log('hasWorkingState:', !!result.working_state);
      console.log('working_state type:', typeof result.working_state);
      console.log('working_state is null:', result.working_state === null);
      console.log('working_state is undefined:', result.working_state === undefined);
      if (result.working_state) {
        console.log('working_state keys:', Object.keys(result.working_state));
        console.log('working_state code:', result.working_state.code);
        console.log('working_state name:', result.working_state.name);
        console.log('working_state full:', JSON.stringify(result.working_state, null, 2));
      }
      console.log('result keys:', Object.keys(result || {}));
      console.log('result (first 1000 chars):', JSON.stringify(result).substring(0, 1000));
      
      // Ensure working_state is present in result
      if (!result.working_state && result.workingStateId) {
        console.error('=== [ERROR] working_state is missing but workingStateId exists ===');
        console.error('workingStateId:', result.workingStateId);
        this.logger.warn('working_state is missing but workingStateId exists', {
          workingStateId: result.workingStateId,
        });
      }
      
      this.logger.info('ExpMestSummaryGrpcController#getExpMestOtherSummary.result', {
        expMestId: data.expMestId,
        medicinesCount: result.medicines?.length || 0,
        workingStateId: result.workingStateId,
        hasWorkingState: !!result.working_state,
      });
      
      return result;
    } catch (error: any) {
      this.logger.error('ExpMestSummaryGrpcController#getExpMestOtherSummary.error', {
        expMestId: data.expMestId,
        error: error.message,
        stack: error.stack,
      });
      
      if (error instanceof RpcException) {
        throw error;
      }
      
      // Convert regular errors to RpcException
      const errorMessage = error.message || 'Failed to get ExpMestOther summary';
      const errorCode = error.message?.includes('not found') ? 5 : 13; // NOT_FOUND : INTERNAL
      throw new RpcException({
        code: errorCode,
        message: errorMessage,
      });
    }
  }

  @GrpcMethod('InventoryService', 'GetInpatientExpMestSummary')
  async getInpatientExpMestSummary(data: { expMestId: number; orderBy?: string }): Promise<any> {
    this.logger.info('ExpMestSummaryGrpcController#getInpatientExpMestSummary.call', data);
    
    try {
      const result = await this.expMestSummaryService.getInpatientExpMestSummary(
        data.expMestId,
        data.orderBy
      );
      
      // Serialize Long objects before returning
      this.serializeLongObjects(result);
      
      // Convert Date objects in working_state to ISO strings for gRPC serialization
      if (result.working_state) {
        if (result.working_state.createdAt instanceof Date) {
          result.working_state.createdAt = result.working_state.createdAt.toISOString();
        } else if (typeof result.working_state.createdAt === 'string' && result.working_state.createdAt.includes('GMT')) {
          const date = new Date(result.working_state.createdAt);
          if (!isNaN(date.getTime())) {
            result.working_state.createdAt = date.toISOString();
          }
        }
        if (result.working_state.updatedAt instanceof Date) {
          result.working_state.updatedAt = result.working_state.updatedAt.toISOString();
        } else if (typeof result.working_state.updatedAt === 'string' && result.working_state.updatedAt.includes('GMT')) {
          const date = new Date(result.working_state.updatedAt);
          if (!isNaN(date.getTime())) {
            result.working_state.updatedAt = date.toISOString();
          }
        }
      }
      
      this.logger.info('ExpMestSummaryGrpcController#getInpatientExpMestSummary.result', {
        expMestId: data.expMestId,
        medicinesCount: result.medicines?.length || 0,
        workingStateId: result.workingStateId,
        hasWorkingState: !!result.working_state,
        workingStateCode: result.working_state?.code,
      });
      
      return result;
    } catch (error: any) {
      this.logger.error('ExpMestSummaryGrpcController#getInpatientExpMestSummary.error', {
        expMestId: data.expMestId,
        error: error.message,
        stack: error.stack,
      });
      
      if (error instanceof RpcException) {
        throw error;
      }
      
      // Convert regular errors to RpcException
      const errorMessage = error.message || 'Failed to get InpatientExpMest summary';
      const errorCode = error.message?.includes('not found') ? 5 : 13; // NOT_FOUND : INTERNAL
      throw new RpcException({
        code: errorCode,
        message: errorMessage,
      });
    }
  }

  /**
   * Serialize Long objects recursively in the entire response object
   * This ensures no Long objects remain in the final response
   */
  private serializeLongObjects(obj: any): void {
    if (obj === null || obj === undefined) {
      return;
    }

    // Handle arrays
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        if (typeof item === 'object' && item !== null && !(item instanceof Date)) {
          // Check if it's a Long object (has low and high properties)
          if ('low' in item && 'high' in item) {
            // It's a Long object, convert it
            const longValue = item as { low: number; high: number };
            obj[index] = longValue.low + (longValue.high * 0x100000000);
          } else {
            // Recursively process nested objects/arrays
            this.serializeLongObjects(item);
          }
        }
      });
      return;
    }

    // Handle objects
    if (typeof obj === 'object' && !(obj instanceof Date)) {
      const keys = Object.keys(obj);
      for (const key of keys) {
        const value = obj[key];
        
        if (value === null || value === undefined) {
          continue;
        }

        // Check if it's a Long object (has low and high properties)
        if (typeof value === 'object' && 'low' in value && 'high' in value) {
          const longValue = value as { low: number; high: number };
          obj[key] = longValue.low + (longValue.high * 0x100000000);
        } else if (typeof value === 'object' && !(value instanceof Date)) {
          // Recursively process nested objects/arrays
          this.serializeLongObjects(value);
        }
      }
    }
  }
}
