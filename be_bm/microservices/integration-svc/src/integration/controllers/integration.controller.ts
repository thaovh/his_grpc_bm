import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PinoLogger } from 'nestjs-pino';
import { IntegrationServiceImpl } from '../services/integration.service';
import { HisLoginRequest, HisLoginResponse, HisUserInfo } from '../providers/his.provider';
import { Count } from '../../commons/interfaces/commons.interface';
import { UserRoom } from '../integration.interface';

import { ExpMestSyncService } from '../services/exp-mest-sync.service';
import { ExpMestEnrichmentService } from '../services/exp-mest-enrichment.service';
import { ExpMestAutoUpdateService } from '../services/exp-mest-auto-update.service';

@Controller()
export class IntegrationController {
  constructor(
    private readonly integrationService: IntegrationServiceImpl,
    private readonly expMestSyncService: ExpMestSyncService,
    private readonly expMestEnrichmentService: ExpMestEnrichmentService,
    private readonly expMestAutoUpdateService: ExpMestAutoUpdateService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(IntegrationController.name);
  }

  @GrpcMethod('IntegrationService', 'hisLogin')
  async hisLogin(data: HisLoginRequest): Promise<HisLoginResponse> {
    this.logger.info('IntegrationController#hisLogin.call', { username: data.username });

    try {
      const result = await this.integrationService.hisLogin(data);
      this.logger.info('IntegrationController#hisLogin.result', {
        Success: result.Success,
        loginName: result.user?.loginName,
        hasUser: !!result.user,
      });
      return result;
    } catch (error: any) {
      this.logger.error('IntegrationController#hisLogin.error', {
        username: data.username,
        error: error.message,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status,
      });
      // Re-throw với message rõ ràng hơn
      throw new Error(`HIS authentication failed: ${error.message}`);
    }
  }

  @GrpcMethod('IntegrationService', 'updateWorkInfo')
  async updateWorkInfo(data: any): Promise<{
    success: boolean;
    message?: string;
    data?: any;
  }> {
    this.logger.info('IntegrationController#updateWorkInfo.call', {
      roomIdsLength: data?.roomIds?.length || 0,
      roomsLength: data?.rooms?.length || 0,
    });

    try {
      const result = await this.integrationService.updateWorkInfo(data);
      this.logger.info('IntegrationController#updateWorkInfo.result', { success: result.success });
      return result;
    } catch (error: any) {
      this.logger.error('IntegrationController#updateWorkInfo.error', {
        error: error.message,
        stack: error.stack?.substring(0, 500),
      });
      return {
        success: false,
        message: error.message || 'Failed to update work info',
      };
    }
  }

  @GrpcMethod('IntegrationService', 'syncUser')
  async syncUser(data: { user: HisUserInfo }): Promise<{
    userId: string;
    created: boolean;
    username: string;
    email: string;
  }> {
    this.logger.info('IntegrationController#syncUser.call', {
      loginName: data.user.loginName
    });

    try {
      const result = await this.integrationService.syncUser(data.user);
      this.logger.info('IntegrationController#syncUser.result', {
        userId: result.userId,
        created: result.created,
      });
      return result;
    } catch (error: any) {
      this.logger.error('IntegrationController#syncUser.error', {
        loginName: data.user.loginName,
        error: error.message,
      });
      throw error;
    }
  }

  @GrpcMethod('IntegrationService', 'getToken')
  async getToken(data: { userId: string }): Promise<{
    found: boolean;
    tokenCode?: string;
    renewCode?: string;
    expireTime?: string;
    loginTime?: string;
  }> {
    this.logger.info('IntegrationController#getToken.call', { userId: data.userId });

    try {
      const result = await this.integrationService.getToken(data.userId);
      this.logger.info('IntegrationController#getToken.result', {
        found: result.found,
        userId: data.userId,
      });
      return result;
    } catch (error: any) {
      this.logger.error('IntegrationController#getToken.error', {
        userId: data.userId,
        error: error.message,
      });
      throw error;
    }
  }

  @GrpcMethod('IntegrationService', 'invalidateToken')
  async invalidateToken(data: { userId: string }): Promise<Count> {
    this.logger.info('IntegrationController#invalidateToken.call', { userId: data.userId });

    try {
      const count = await this.integrationService.invalidateToken(data.userId);
      this.logger.info('IntegrationController#invalidateToken.result', {
        count,
        userId: data.userId,
      });
      return { count };
    } catch (error: any) {
      this.logger.error('IntegrationController#invalidateToken.error', {
        userId: data.userId,
        error: error.message,
      });
      throw error;
    }
  }

  @GrpcMethod('IntegrationService', 'renewToken')
  async renewToken(data: { renewCode: string; userId?: string }): Promise<{
    success: boolean;
    message?: string;
    tokenCode?: string;
    renewCode?: string;
    loginTime?: string;
    expireTime?: string;
    validAddress?: string;
    loginAddress?: string;
    versionApp?: string;
    machineName?: string;
    lastAccessTime?: string;
  }> {
    this.logger.info('IntegrationController#renewToken.call', {
      userId: data.userId,
      renewCodePrefix: data.renewCode?.substring(0, 20) + '...',
    });

    try {
      const result = await this.integrationService.renewToken(data.renewCode, data.userId);
      this.logger.info('IntegrationController#renewToken.result', {
        success: result.success,
        userId: data.userId,
      });
      return result;
    } catch (error: any) {
      this.logger.error('IntegrationController#renewToken.error', {
        userId: data.userId,
        error: error.message,
      });
      throw error;
    }
  }

  @GrpcMethod('IntegrationService', 'enrichData')
  async enrichData(data: { username: string }): Promise<{
    success: boolean;
    totalRecords: number;
    processedRecords: number;
    failedRecords: number;
    message?: string;
  }> {
    this.logger.info('IntegrationController#enrichData.call', { username: data.username });

    try {
      const result = await this.integrationService.enrichData(data.username);
      this.logger.info('IntegrationController#enrichData.result', {
        success: result.success,
        processedRecords: result.processedRecords,
        failedRecords: result.failedRecords,
      });
      return result;
    } catch (error: any) {
      this.logger.error('IntegrationController#enrichData.error', {
        username: data.username,
        error: error.message,
      });
      throw error;
    }
  }

  @GrpcMethod('IntegrationService', 'getUserRooms')
  async getUserRooms(data: { userId: string }): Promise<{
    success: boolean;
    message?: string;
    data?: UserRoom[];
  }> {
    this.logger.info('IntegrationController#getUserRooms.call', { userId: data.userId });

    try {
      const result = await this.integrationService.getUserRooms(data.userId);
      this.logger.info('IntegrationController#getUserRooms.result', {
        success: result.success,
        roomCount: result.data?.length || 0,
      });
      return result;
    } catch (error: any) {
      this.logger.error('IntegrationController#getUserRooms.error', {
        userId: data.userId,
        error: error.message,
      });
      throw error;
    }
  }

  @GrpcMethod('IntegrationService', 'reloadUserRooms')
  async reloadUserRooms(data: { userId: string }): Promise<{
    success: boolean;
    message?: string;
    data?: UserRoom[];
  }> {
    this.logger.info('IntegrationController#reloadUserRooms.call', { userId: data.userId });

    try {
      const result = await this.integrationService.reloadUserRooms(data.userId);
      this.logger.info('IntegrationController#reloadUserRooms.result', {
        success: result.success,
        roomCount: result.data?.length || 0,
      });
      return result;
    } catch (error: any) {
      this.logger.error('IntegrationController#reloadUserRooms.error', {
        userId: data.userId,
        error: error.message,
      });
      throw error;
    }
  }

  @GrpcMethod('IntegrationService', 'getMediStockByRoomId')
  async getMediStockByRoomId(data: { roomId: number }): Promise<{
    success: boolean;
    message?: string;
    id?: number | null;
    data?: any;
  }> {
    this.logger.info('IntegrationController#getMediStockByRoomId.call', { roomId: data.roomId });
    try {
      const result = await this.integrationService.getMediStockByRoomId(data.roomId);
      this.logger.info('IntegrationController#getMediStockByRoomId.result', {
        success: result.success,
        id: result.id,
      });
      return result;
    } catch (error: any) {
      this.logger.error('IntegrationController#getMediStockByRoomId.error', {
        roomId: data.roomId,
        error: error.message,
      });
      throw error;
    }
  }

  @GrpcMethod('IntegrationService', 'reloadMediStock')
  async reloadMediStock(): Promise<{
    success: boolean;
    message?: string;
    count?: number;
  }> {
    this.logger.info('IntegrationController#reloadMediStock.call');
    try {
      const result = await this.integrationService.reloadMediStock();
      this.logger.info('IntegrationController#reloadMediStock.result', {
        success: result.success,
        count: result.count,
      });
      return result;
    } catch (error: any) {
      this.logger.error('IntegrationController#reloadMediStock.error', {
        error: error.message,
      });
      throw error;
    }
  }

  @GrpcMethod('IntegrationService', 'getExpMestStt')
  async getExpMestStt(): Promise<{
    success: boolean;
    message?: string;
    data?: any[];
  }> {
    this.logger.info('IntegrationController#getExpMestStt.call');
    try {
      const result = await this.integrationService.getExpMestStt();
      this.logger.info('IntegrationController#getExpMestStt.result', {
        success: result.success,
        count: result.data?.length || 0,
      });
      return result;
    } catch (error: any) {
      this.logger.error('IntegrationController#getExpMestStt.error', {
        error: error.message,
      });
      throw error;
    }
  }

  @GrpcMethod('IntegrationService', 'reloadExpMestStt')
  async reloadExpMestStt(): Promise<{
    success: boolean;
    message?: string;
    count?: number;
  }> {
    this.logger.info('IntegrationController#reloadExpMestStt.call');
    try {
      const result = await this.integrationService.reloadExpMestStt();
      this.logger.info('IntegrationController#reloadExpMestStt.result', {
        success: result.success,
        count: result.count,
      });
      return result;
    } catch (error: any) {
      this.logger.error('IntegrationController#reloadExpMestStt.error', {
        error: error.message,
      });
      throw error;
    }
  }

  @GrpcMethod('IntegrationService', 'getExpMestType')
  async getExpMestType(): Promise<{
    success: boolean;
    message?: string;
    data?: any[];
  }> {
    this.logger.info('IntegrationController#getExpMestType.call');
    try {
      const result = await this.integrationService.getExpMestType();
      this.logger.info('IntegrationController#getExpMestType.result', {
        success: result.success,
        count: result.data?.length || 0,
      });
      return result;
    } catch (error: any) {
      this.logger.error('IntegrationController#getExpMestType.error', {
        error: error.message,
      });
      throw error;
    }
  }

  @GrpcMethod('IntegrationService', 'reloadExpMestType')
  async reloadExpMestType(): Promise<{
    success: boolean;
    message?: string;
    count?: number;
  }> {
    this.logger.info('IntegrationController#reloadExpMestType.call');
    try {
      const result = await this.integrationService.reloadExpMestType();
      this.logger.info('IntegrationController#reloadExpMestType.result', {
        success: result.success,
        count: result.count,
      });
      return result;
    } catch (error: any) {
      this.logger.error('IntegrationController#reloadExpMestType.error', {
        error: error.message,
      });
      throw error;
    }
  }

  @GrpcMethod('IntegrationService', 'getExpMests')
  async getExpMests(data: {
    expMestSttIds?: number[];
    expMestTypeIds?: number[];
    impOrExpMediStockId?: number;
    createTimeFrom?: number;
    createTimeTo?: number;
    start?: number;
    limit?: number;
    keyword?: string;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: any[];
    start?: number;
    limit?: number;
    count?: number;
    total?: number;
  }> {
    this.logger.info({
      receivedKeys: Object.keys(data),
      rawData: JSON.stringify(data),
      expMestSttIds: data.expMestSttIds,
      expMestTypeIds: data.expMestTypeIds,
      impOrExpMediStockId: data.impOrExpMediStockId,
      createTimeFrom: data.createTimeFrom,
      createTimeTo: data.createTimeTo,
      start: data.start,
      limit: data.limit,
    }, 'IntegrationController#getExpMests.call');
    try {
      const result = await this.integrationService.getExpMests(data);
      this.logger.info('IntegrationController#getExpMests.result', {
        success: result.success,
        dataCount: result.data?.length || 0,
        start: result.start,
        limit: result.limit,
        count: result.count,
        total: result.total,
      });
      return result;
    } catch (error: any) {
      this.logger.error('IntegrationController#getExpMests.error', {
        error: error.message,
      });
      throw error;
    }
  }

  @GrpcMethod('IntegrationService', 'getExpMestCabinets')
  async getExpMestCabinets(data: any): Promise<{
    success: boolean;
    message?: string;
    data?: any[];
  }> {
    this.logger.info('IntegrationController#getExpMestCabinets.call', {
      ...data,
      rawData: JSON.stringify(data)
    });
    try {
      const result = await this.integrationService.getExpMestCabinets(data);
      this.logger.info('IntegrationController#getExpMestCabinets.result', {
        success: result.success,
        dataCount: result.data?.length || 0,
      });
      return result;
    } catch (error: any) {
      this.logger.error('IntegrationController#getExpMestCabinets.error', {
        error: error.message,
      });
      throw error;
    }
  }

  @GrpcMethod('IntegrationService', 'getExpMestById')
  async getExpMestById(data: {
    id?: number;
    expMestId?: number;
    includeDeleted?: boolean;
    dataDomainFilter?: boolean;
    userId?: string;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: any | null;
  }> {
    this.logger.info('IntegrationController#getExpMestById.call', data);
    try {
      // Map 'id' from proto to 'expMestId' for service
      const payload = {
        ...data,
        expMestId: data.expMestId ?? data.id,
      };

      // Validate required ID
      if (!payload.expMestId) {
        return { success: false, message: 'ExpMest ID is required' };
      }

      const result = await this.integrationService.getExpMestById(payload as any);
      this.logger.info('IntegrationController#getExpMestById.result', {
        success: result.success,
        hasData: !!result.data,
      });
      return result;
    } catch (error: any) {
      this.logger.error('IntegrationController#getExpMestById.error', {
        error: error.message,
      });
      throw error;
    }
  }

  @GrpcMethod('IntegrationService', 'getInpatientExpMests')
  async getInpatientExpMests(data: any): Promise<{
    success: boolean;
    message?: string;
    data?: any[];
    start?: number;
    limit?: number;
    count?: number;
    total?: number;
  }> {
    this.logger.info('IntegrationController#getInpatientExpMests.call', data);
    console.log('🔍 [Microservice Controller Inpatient] Received data:', JSON.stringify(data));
    console.log('🔍 [Microservice Controller Inpatient] Keyword:', data.keyword);
    try {
      const result = await this.integrationService.getInpatientExpMests(data);

      // Log first item to check virCreateMonth before returning
      if (result.data && result.data.length > 0) {
        const firstItem = result.data[0];
        console.log('=== INTEGRATION CONTROLLER - BEFORE RETURN ===');
        console.log('virCreateMonth:', firstItem.virCreateMonth);
        console.log('virCreateMonth type:', typeof firstItem.virCreateMonth);
        console.log('CREATE_DATE:', firstItem.createDate);
        console.log('=============================================');
      }

      this.logger.info('IntegrationController#getInpatientExpMests.result', {
        success: result.success,
        dataCount: result.data?.length || 0,
        start: result.start,
        limit: result.limit,
        count: result.count,
        total: result.total,
      });
      return result;
    } catch (error: any) {
      this.logger.error('IntegrationController#getInpatientExpMests.error', {
        error: error.message,
      });
      throw error;
    }
  }

  @GrpcMethod('IntegrationService', 'getInpatientExpMestById')
  async getInpatientExpMestById(data: any): Promise<{
    success: boolean;
    message?: string;
    data?: any | null;
  }> {
    this.logger.info('IntegrationController#getInpatientExpMestById.call', data);
    try {
      // Map 'id' from proto to 'expMestId' for service
      const payload = {
        ...data,
        expMestId: data.expMestId ?? data.id,
      };

      // Validate required ID
      if (!payload.expMestId) {
        return { success: false, message: 'ExpMest ID is required' };
      }

      const result = await this.integrationService.getInpatientExpMestById(payload);
      this.logger.info('IntegrationController#getInpatientExpMestById.result', {
        success: result.success,
        hasData: !!result.data,
      });
      return result;
    } catch (error: any) {
      this.logger.error('IntegrationController#getInpatientExpMestById.error', {
        error: error.message,
      });
      throw error;
    }
  }

  @GrpcMethod('IntegrationService', 'getInpatientExpMestDetails')
  async getInpatientExpMestDetails(data: any): Promise<{
    success: boolean;
    message?: string;
    data?: any[];
  }> {
    this.logger.info('IntegrationController#getInpatientExpMestDetails.call', data);
    try {
      // Map 'id' from proto to 'aggrExpMestId' for service logic
      const payload = {
        ...data,
        aggrExpMestId: data.aggrExpMestId ?? data.id,
      };

      const result = await this.integrationService.getInpatientExpMestDetails(payload);
      this.logger.info('IntegrationController#getInpatientExpMestDetails.result', {
        success: result.success,
        dataCount: result.data?.length || 0,
      });
      return result;
    } catch (error: any) {
      this.logger.error('IntegrationController#getInpatientExpMestDetails.error', {
        error: error.message,
      });
      throw error;
    }
  }

  @GrpcMethod('IntegrationService', 'getExpMestMedicines')
  async getExpMestMedicines(data: {
    expMestId: number;
    userId?: string; // Added userId parameter
  }): Promise<{
    success: boolean;
    message?: string;
    data?: any[];
  }> {
    this.logger.info('IntegrationController#getExpMestMedicines.call', {
      expMestId: data.expMestId,
      userId: data.userId, // Log userId
    });
    try {
      const result = await this.integrationService.getExpMestMedicines(data.expMestId, data.userId); // Pass userId
      this.logger.info('IntegrationController#getExpMestMedicines.result', {
        success: result.success,
        dataCount: result.data?.length || 0,
      });
      return result;
    } catch (error: any) {
      this.logger.error('IntegrationController#getExpMestMedicines.error', {
        error: error.message,
        expMestId: data.expMestId,
      });
      throw error;
    }
  }

  @GrpcMethod('IntegrationService', 'getExpMestMedicinesByIds')
  async getExpMestMedicinesByIds(data: {
    expMestIds: number[];
    includeDeleted?: boolean;
    dataDomainFilter?: boolean;
    userId?: string;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: any[];
  }> {
    this.logger.info('IntegrationController#getExpMestMedicinesByIds.call', {
      expMestIdsCount: data.expMestIds?.length || 0,
      includeDeleted: data.includeDeleted,
      dataDomainFilter: data.dataDomainFilter,
    });
    try {
      const result = await this.integrationService.getExpMestMedicinesByIds(
        data.expMestIds || [],
        data.includeDeleted ?? false,
        data.dataDomainFilter ?? false,
        data.userId // Pass userId relevant for authentication
      );
      this.logger.info('IntegrationController#getExpMestMedicinesByIds.result', {
        success: result.success,
        dataCount: result.data?.length || 0,
      });
      return result;
    } catch (error: any) {
      this.logger.error('IntegrationController#getExpMestMedicinesByIds.error', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  @GrpcMethod('IntegrationService', 'EnrichExpMestsWithSyncStatus')
  async enrichExpMestsWithSyncStatus(data: {
    expMestIds: number[];
    expMestType: string;
  }): Promise<{
    syncStatusMap: Record<number, boolean>;
    workingStateIdMap: Record<number, string>;
    workingStateMap: Record<string, any>;
  }> {
    this.logger.info('IntegrationController#enrichExpMestsWithSyncStatus.call', {
      expMestIdsCount: data.expMestIds?.length || 0,
      expMestType: data.expMestType,
    });

    try {
      const result = await this.expMestEnrichmentService.enrichExpMestsWithSyncStatus(
        data.expMestIds || [],
        data.expMestType,
      );

      this.logger.info('IntegrationController#enrichExpMestsWithSyncStatus.result', {
        syncedCount: Object.values(result.syncStatusMap).filter(Boolean).length,
        workingStateCount: Object.keys(result.workingStateMap).length,
      });

      return result;
    } catch (error: any) {
      this.logger.error('IntegrationController#enrichExpMestsWithSyncStatus.error', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  @GrpcMethod('IntegrationService', 'AutoUpdateExpMestSttId')
  async autoUpdateExpMestSttId(data: {
    expMestIds: number[];
    expMestType: string;
    userId: string;
    hisDataMap?: Record<number, any>;
  }): Promise<{
    updatedCount: number;
    updatedExpMestIds: number[];
  }> {
    this.logger.info('IntegrationController#autoUpdateExpMestSttId.call', {
      expMestIdsCount: data.expMestIds?.length || 0,
      expMestType: data.expMestType,
      userId: data.userId,
    });

    try {
      // Convert plain object to Map
      const hisDataMap = new Map<number, any>();
      if (data.hisDataMap) {
        Object.entries(data.hisDataMap).forEach(([key, value]) => {
          hisDataMap.set(Number(key), value);
        });
      }

      const result = await this.expMestAutoUpdateService.autoUpdateExpMestSttId(
        data.expMestIds || [],
        data.expMestType,
        hisDataMap,
      );

      this.logger.info('IntegrationController#autoUpdateExpMestSttId.result', {
        updatedCount: result.updatedCount,
      });

      return result;
    } catch (error: any) {
      this.logger.error('IntegrationController#autoUpdateExpMestSttId.error', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}

