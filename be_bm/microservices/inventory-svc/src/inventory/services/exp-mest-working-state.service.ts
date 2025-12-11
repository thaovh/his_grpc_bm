import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { firstValueFrom } from 'rxjs';
import { ExpMestCabinetService } from './exp-mest-cabinet.service';
import { ExpMestCabinetMedicineService } from './exp-mest-cabinet-medicine.service';
import { ExpMestOtherService } from './exp-mest-other.service';
import { ExpMestOtherMedicineService } from './exp-mest-other-medicine.service';
import { InpatientExpMestService } from './inpatient-exp-mest.service';
import { InpatientExpMestChildService } from './inpatient-exp-mest-child.service';
import { InpatientExpMestMedicineService } from './inpatient-exp-mest-medicine.service';
import { ExpMestSummaryService } from './exp-mest-summary.service';

interface MasterDataGrpcService {
  findExportStatusById(data: { id: string }): any;
}

@Injectable()
export class ExpMestWorkingStateService implements OnModuleInit {
  private masterDataGrpcService: MasterDataGrpcService;

  constructor(
    private readonly expMestCabinetService: ExpMestCabinetService,
    private readonly expMestCabinetMedicineService: ExpMestCabinetMedicineService,
    private readonly expMestOtherService: ExpMestOtherService,
    private readonly expMestOtherMedicineService: ExpMestOtherMedicineService,
    private readonly inpatientExpMestService: InpatientExpMestService,
    private readonly inpatientExpMestChildService: InpatientExpMestChildService,
    private readonly inpatientExpMestMedicineService: InpatientExpMestMedicineService,
    private readonly expMestSummaryService: ExpMestSummaryService,
    @Inject('MASTER_DATA_PACKAGE') private readonly masterDataClient: ClientGrpc,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ExpMestWorkingStateService.name);
  }

  onModuleInit() {
    this.masterDataGrpcService = this.masterDataClient.getService<MasterDataGrpcService>('MasterDataService');
  }

  /**
   * Check and update ExpMestCabinet working state
   */
  async checkAndUpdateExpMestCabinetWorkingState(expMestId: number): Promise<any> {
    this.logger.info('ExpMestWorkingStateService#checkAndUpdateExpMestCabinetWorkingState.call', { expMestId });

    try {
      // 1. Fetch parent record
      const parent = await this.expMestCabinetService.findByHisId(expMestId);
      if (!parent) {
        return {
          updated: false,
          reason: 'parent_not_found',
        };
      }

      const currentWorkingStateId = parent.workingStateId;

      // 2. Get config values
      const defaultAllExportedWorkingStateId = this.configService.get<string>('DEFAULT_ALL_EXPORTED_WORKING_STATE_ID') || null;
      const defaultAllActualStatusId = this.configService.get<string>('DEFAULT_ALL_ACTUAL_STATUS_ID') || null;

      // 3. Fetch all medicines
      const medicines = await this.expMestCabinetMedicineService.findByExpMestId(expMestId);
      if (!medicines || medicines.length === 0) {
        return {
          updated: false,
          reason: 'no_medicines',
        };
      }

      // 4. Check statuses
      // For cabinet, check expTime instead of exportTime
      const allExported = medicines.every((m: any) => 
        m.isExport === 1 || 
        (m.exportByUser && m.exportByUser !== '') || 
        (m.expTime && m.expTime > 0)
      );
      const allActualExported = medicines.every((m: any) => 
        (m.actualExportByUser && m.actualExportByUser !== '') || 
        (m.actualExportTime && m.actualExportTime > 0)
      );

      let newWorkingStateId: string | null = null;
      let reason = '';

      // Determine new state based on priority (Actual > Exported)
      if (allActualExported && defaultAllActualStatusId && currentWorkingStateId !== defaultAllActualStatusId) {
        newWorkingStateId = defaultAllActualStatusId;
        reason = 'all_actual_exported';
      } else if (allExported && defaultAllExportedWorkingStateId && currentWorkingStateId !== defaultAllExportedWorkingStateId) {
        if (currentWorkingStateId !== defaultAllActualStatusId) {
          newWorkingStateId = defaultAllExportedWorkingStateId;
          reason = 'all_exported';
        }
      }

      if (!newWorkingStateId) {
        return {
          updated: false,
          oldWorkingStateId: currentWorkingStateId,
          newWorkingStateId: currentWorkingStateId,
          reason: 'no_state_change_needed',
        };
      }

      // 5. Update parent
      await this.expMestCabinetService.update(parent.id, {
        workingStateId: newWorkingStateId,
        updatedBy: 'SYSTEM',
      });

      // 6. Emit status update event
      const updatedParent = await this.expMestCabinetService.findByHisId(expMestId);

      // Enrich with working_state object
      let working_state: any = null;
      try {
        working_state = await firstValueFrom(
          this.masterDataGrpcService.findExportStatusById({ id: newWorkingStateId })
        );
      } catch (e) {
        this.logger.warn('Failed to fetch working_state', { workingStateId: newWorkingStateId, error: e });
      }

      const enrichedData = {
        ...updatedParent,
        is_sync: true,
        workingStateId: newWorkingStateId,
        working_state: working_state,
      };

      this.eventEmitter.emit('exp-mest-cabinet.stt-updated', {
        expMestId,
        expMestCode: parent.expMestCode,
        oldSttId: parent.workingStateId,
        newSttId: newWorkingStateId,
        timestamp: Date.now(),
        data: enrichedData,
        reason,
      });

      // 7. Get updated summary
      const expMest = await this.expMestSummaryService.getExpMestCabinetSummary(expMestId);

      this.logger.info('ExpMestWorkingStateService#checkAndUpdateExpMestCabinetWorkingState.updated', {
        expMestId,
        oldState: currentWorkingStateId,
        newState: newWorkingStateId,
        reason,
      });

      return {
        updated: true,
        oldWorkingStateId: currentWorkingStateId,
        newWorkingStateId,
        reason,
        expMest,
      };
    } catch (error: any) {
      this.logger.error('ExpMestWorkingStateService#checkAndUpdateExpMestCabinetWorkingState.error', {
        expMestId,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Check and update ExpMestOther working state
   */
  async checkAndUpdateExpMestOtherWorkingState(expMestId: number): Promise<any> {
    this.logger.info('ExpMestWorkingStateService#checkAndUpdateExpMestOtherWorkingState.call', { expMestId });

    try {
      // 1. Fetch parent record
      const parent = await this.expMestOtherService.findByHisExpMestId(expMestId);
      if (!parent) {
        return {
          updated: false,
          reason: 'parent_not_found',
        };
      }

      const currentWorkingStateId = parent.workingStateId;

      // 2. Get config values
      const defaultAllExportedWorkingStateId = this.configService.get<string>('DEFAULT_ALL_EXPORTED_WORKING_STATE_ID') || null;
      const defaultAllActualStatusId = this.configService.get<string>('DEFAULT_ALL_ACTUAL_STATUS_ID') || null;

      // 3. Fetch all medicines
      const medicines = await this.expMestOtherMedicineService.findByExpMestId(expMestId);
      if (!medicines || medicines.length === 0) {
        return {
          updated: false,
          reason: 'no_medicines',
        };
      }

      // 4. Check statuses
      const allExported = medicines.every((m: any) => 
        m.isExport === 1 || 
        (m.exportByUser && m.exportByUser !== '') || 
        m.exportTime > 0
      );
      const allActualExported = medicines.every((m: any) => 
        (m.actualExportByUser && m.actualExportByUser !== '') || 
        m.actualExportTime > 0
      );

      let newWorkingStateId: string | null = null;
      let reason = '';

      // Determine new state based on priority (Actual > Exported)
      if (allActualExported && defaultAllActualStatusId && currentWorkingStateId !== defaultAllActualStatusId) {
        newWorkingStateId = defaultAllActualStatusId;
        reason = 'all_actual_exported';
      } else if (allExported && defaultAllExportedWorkingStateId && currentWorkingStateId !== defaultAllExportedWorkingStateId) {
        if (currentWorkingStateId !== defaultAllActualStatusId) {
          newWorkingStateId = defaultAllExportedWorkingStateId;
          reason = 'all_exported';
        }
      }

      if (!newWorkingStateId) {
        return {
          updated: false,
          oldWorkingStateId: currentWorkingStateId,
          newWorkingStateId: currentWorkingStateId,
          reason: 'no_state_change_needed',
        };
      }

      // 5. Update parent
      await this.expMestOtherService.update(parent.id, {
        workingStateId: newWorkingStateId,
        updatedBy: 'SYSTEM',
      });

      // 6. Emit status update event
      const updatedParent = await this.expMestOtherService.findByHisExpMestId(expMestId);

      // Enrich with working_state object
      let working_state: any = null;
      try {
        working_state = await firstValueFrom(
          this.masterDataGrpcService.findExportStatusById({ id: newWorkingStateId })
        );
      } catch (e) {
        this.logger.warn('Failed to fetch working_state', { workingStateId: newWorkingStateId, error: e });
      }

      const enrichedData = {
        ...updatedParent,
        is_sync: true,
        workingStateId: newWorkingStateId,
        working_state: working_state,
      };

      this.eventEmitter.emit('exp-mest-other.stt-updated', {
        expMestId,
        expMestCode: parent.expMestCode,
        oldSttId: parent.workingStateId,
        newSttId: newWorkingStateId,
        timestamp: Date.now(),
        data: enrichedData,
        reason,
      });

      // 7. Get updated summary
      const expMest = await this.expMestSummaryService.getExpMestOtherSummary(expMestId);

      this.logger.info('ExpMestWorkingStateService#checkAndUpdateExpMestOtherWorkingState.updated', {
        expMestId,
        oldState: currentWorkingStateId,
        newState: newWorkingStateId,
        reason,
      });

      return {
        updated: true,
        oldWorkingStateId: currentWorkingStateId,
        newWorkingStateId,
        reason,
        expMest,
      };
    } catch (error: any) {
      this.logger.error('ExpMestWorkingStateService#checkAndUpdateExpMestOtherWorkingState.error', {
        expMestId,
        error: error.message,
      });
      throw error;
    }
  }

  /**
   * Check and update InpatientExpMest working state
   */
  async checkAndUpdateInpatientExpMestWorkingState(expMestId: number): Promise<any> {
    this.logger.info('ExpMestWorkingStateService#checkAndUpdateInpatientExpMestWorkingState.call', { expMestId });

    try {
      // 1. Fetch parent record
      const parent = await this.inpatientExpMestService.findByHisExpMestId(expMestId);
      if (!parent) {
        return {
          updated: false,
          reason: 'parent_not_found',
        };
      }

      const currentWorkingStateId = parent.workingStateId;

      // 2. Get config values
      const defaultAllExportedWorkingStateId = this.configService.get<string>('DEFAULT_ALL_EXPORTED_WORKING_STATE_ID') || null;
      const defaultAllActualStatusId = this.configService.get<string>('DEFAULT_ALL_ACTUAL_STATUS_ID') || null;

      // 3. Fetch all medicines from all children
      // Note: This logic should match the summary logic
      const children = await this.inpatientExpMestChildService.findByAggrExpMestId(expMestId);
      const allMedicines: any[] = [];
      for (const child of children) {
        const medicines = await this.inpatientExpMestMedicineService.findByInpatientExpMestId(child.hisExpMestId);
        allMedicines.push(...medicines);
      }

      if (!allMedicines || allMedicines.length === 0) {
        return {
          updated: false,
          reason: 'no_medicines',
        };
      }

      // 4. Check statuses
      const allExported = allMedicines.every((m: any) => 
        m.isExport === 1 || 
        (m.exportByUser && m.exportByUser !== '') || 
        m.exportTime > 0
      );
      const allActualExported = allMedicines.every((m: any) => 
        (m.actualExportByUser && m.actualExportByUser !== '') || 
        m.actualExportTime > 0
      );

      let newWorkingStateId: string | null = null;
      let reason = '';

      // Determine new state based on priority (Actual > Exported)
      if (allActualExported && defaultAllActualStatusId && currentWorkingStateId !== defaultAllActualStatusId) {
        newWorkingStateId = defaultAllActualStatusId;
        reason = 'all_actual_exported';
      } else if (allExported && defaultAllExportedWorkingStateId && currentWorkingStateId !== defaultAllExportedWorkingStateId) {
        if (currentWorkingStateId !== defaultAllActualStatusId) {
          newWorkingStateId = defaultAllExportedWorkingStateId;
          reason = 'all_exported';
        }
      }

      if (!newWorkingStateId) {
        return {
          updated: false,
          oldWorkingStateId: currentWorkingStateId,
          newWorkingStateId: currentWorkingStateId,
          reason: 'no_state_change_needed',
        };
      }

      // 5. Update parent
      await this.inpatientExpMestService.update(parent.id, {
        workingStateId: newWorkingStateId,
        updatedBy: 'SYSTEM',
      });

      // 6. Emit status update event
      const updatedParent = await this.inpatientExpMestService.findByHisExpMestId(expMestId);

      // Enrich with working_state object
      let working_state: any = null;
      try {
        working_state = await firstValueFrom(
          this.masterDataGrpcService.findExportStatusById({ id: newWorkingStateId })
        );
      } catch (e) {
        this.logger.warn('Failed to fetch working_state', { workingStateId: newWorkingStateId, error: e });
      }

      const enrichedData = {
        ...updatedParent,
        is_sync: true,
        workingStateId: newWorkingStateId,
        working_state: working_state,
      };

      this.eventEmitter.emit('exp-mest-inpatient.stt-updated', {
        expMestId,
        expMestCode: parent.expMestCode,
        oldSttId: parent.workingStateId,
        newSttId: newWorkingStateId,
        timestamp: Date.now(),
        data: enrichedData,
        reason,
      });

      // 7. Get updated summary
      const expMest = await this.expMestSummaryService.getInpatientExpMestSummary(expMestId);

      this.logger.info('ExpMestWorkingStateService#checkAndUpdateInpatientExpMestWorkingState.updated', {
        expMestId,
        oldState: currentWorkingStateId,
        newState: newWorkingStateId,
        reason,
      });

      return {
        updated: true,
        oldWorkingStateId: currentWorkingStateId,
        newWorkingStateId,
        reason,
        expMest,
      };
    } catch (error: any) {
      this.logger.error('ExpMestWorkingStateService#checkAndUpdateInpatientExpMestWorkingState.error', {
        expMestId,
        error: error.message,
      });
      throw error;
    }
  }
}
