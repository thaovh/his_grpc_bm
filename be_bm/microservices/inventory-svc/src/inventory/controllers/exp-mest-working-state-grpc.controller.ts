import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PinoLogger } from 'nestjs-pino';
import { ExpMestWorkingStateService } from '../services/exp-mest-working-state.service';

@Controller()
export class ExpMestWorkingStateGrpcController {
  constructor(
    private readonly expMestWorkingStateService: ExpMestWorkingStateService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ExpMestWorkingStateGrpcController.name);
  }

  @GrpcMethod('InventoryService', 'CheckAndUpdateExpMestCabinetWorkingState')
  async checkAndUpdateExpMestCabinetWorkingState(data: { expMestId: number; expMestType: string }): Promise<any> {
    this.logger.info('ExpMestWorkingStateGrpcController#checkAndUpdateExpMestCabinetWorkingState.call', data);
    
    try {
      const result = await this.expMestWorkingStateService.checkAndUpdateExpMestCabinetWorkingState(
        data.expMestId
      );
      
      this.logger.info('ExpMestWorkingStateGrpcController#checkAndUpdateExpMestCabinetWorkingState.result', {
        expMestId: data.expMestId,
        updated: result.updated,
      });
      
      return result;
    } catch (error: any) {
      this.logger.error('ExpMestWorkingStateGrpcController#checkAndUpdateExpMestCabinetWorkingState.error', {
        expMestId: data.expMestId,
        error: error.message,
      });
      throw error;
    }
  }

  @GrpcMethod('InventoryService', 'CheckAndUpdateExpMestOtherWorkingState')
  async checkAndUpdateExpMestOtherWorkingState(data: { expMestId: number; expMestType: string }): Promise<any> {
    this.logger.info('ExpMestWorkingStateGrpcController#checkAndUpdateExpMestOtherWorkingState.call', data);
    
    try {
      const result = await this.expMestWorkingStateService.checkAndUpdateExpMestOtherWorkingState(
        data.expMestId
      );
      
      this.logger.info('ExpMestWorkingStateGrpcController#checkAndUpdateExpMestOtherWorkingState.result', {
        expMestId: data.expMestId,
        updated: result.updated,
      });
      
      return result;
    } catch (error: any) {
      this.logger.error('ExpMestWorkingStateGrpcController#checkAndUpdateExpMestOtherWorkingState.error', {
        expMestId: data.expMestId,
        error: error.message,
      });
      throw error;
    }
  }

  @GrpcMethod('InventoryService', 'CheckAndUpdateInpatientExpMestWorkingState')
  async checkAndUpdateInpatientExpMestWorkingState(data: { expMestId: number; expMestType: string }): Promise<any> {
    this.logger.info('ExpMestWorkingStateGrpcController#checkAndUpdateInpatientExpMestWorkingState.call', data);
    
    try {
      const result = await this.expMestWorkingStateService.checkAndUpdateInpatientExpMestWorkingState(
        data.expMestId
      );
      
      this.logger.info('ExpMestWorkingStateGrpcController#checkAndUpdateInpatientExpMestWorkingState.result', {
        expMestId: data.expMestId,
        updated: result.updated,
      });
      
      return result;
    } catch (error: any) {
      this.logger.error('ExpMestWorkingStateGrpcController#checkAndUpdateInpatientExpMestWorkingState.error', {
        expMestId: data.expMestId,
        error: error.message,
      });
      throw error;
    }
  }
}
