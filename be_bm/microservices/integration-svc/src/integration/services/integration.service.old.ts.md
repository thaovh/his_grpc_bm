import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PinoLogger } from 'nestjs-pino';
import { HisProvider, HisLoginRequest, HisLoginResponse, HisUserInfo, HisUserRoom, HisMediStock, GetExpMestRequest, HisExpMestMedicine, GetInpatientExpMestRequest } from '../providers/his.provider';
import { RedisService } from './redis.service';
import { UserSyncService } from './user-sync.service';
import { UsersEnrichmentJob } from '../enrichment/jobs/users-enrichment.job';
import { IntegrationService as IIntegrationService, UserRoom, MediStock, ExpMestStt, ExpMestType, ExpMest, ExpMestMedicine } from '../integration.interface';
// Auth services
import { AuthTokenService } from './auth/auth-token.service';
import { AuthLoginService } from './auth/auth-login.service';
// Master data services
import { MediStockService } from './master-data/medi-stock.service';
import { ExpMestSttService } from './master-data/exp-mest-stt.service';
import { ExpMestTypeService } from './master-data/exp-mest-type.service';
// ExpMest services
import { ExpMestService } from './exp-mest/exp-mest.service';
import { InpatientExpMestService } from './exp-mest/inpatient-exp-mest.service';
import { ExpMestMedicineService } from './exp-mest/exp-mest-medicine.service';
// User & Work info services
import { UserRoomService } from './user/user-room.service';
import { WorkInfoService } from './work-info/work-info.service';

interface UsersGrpcService {
  findById(data: { id: string }): any;
  findByUsername(data: { name: string }): any;
}

@Injectable()
export class IntegrationServiceImpl implements IIntegrationService, OnModuleInit {
  private usersGrpcService: UsersGrpcService;

  constructor(
    @Inject('USERS_PACKAGE') private readonly usersClient: ClientGrpc,
    private readonly hisProvider: HisProvider,
    private readonly redisService: RedisService,
    private readonly userSyncService: UserSyncService,
    private readonly usersEnrichmentJob: UsersEnrichmentJob,
    // Auth services
    private readonly authTokenService: AuthTokenService,
    private readonly authLoginService: AuthLoginService,
    // Master data services
    private readonly mediStockService: MediStockService,
    private readonly expMestSttService: ExpMestSttService,
    private readonly expMestTypeService: ExpMestTypeService,
    // ExpMest services
    private readonly expMestService: ExpMestService,
    private readonly inpatientExpMestService: InpatientExpMestService,
    private readonly expMestMedicineService: ExpMestMedicineService,
    // User & Work info services
    private readonly userRoomService: UserRoomService,
    private readonly workInfoService: WorkInfoService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(IntegrationServiceImpl.name);
  }

  async updateWorkInfo(request: {
    roomIds?: number[];
    rooms?: { roomId: number; deskId?: number | null }[];
    workingShiftId?: number | null;
    nurseLoginName?: string | null;
    nurseUserName?: string | null;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: any;
  }> {
    return this.workInfoService.updateWorkInfo(request);
  }

  onModuleInit() {
    this.usersGrpcService = this.usersClient.getService<UsersGrpcService>('UsersService');
  }

  /**
   * Login to HIS system and sync user if needed
   */
  async hisLogin(request: HisLoginRequest): Promise<HisLoginResponse> {
    return this.authLoginService.hisLogin(request);
  }


  /**
   * Sync user from external system
   */
  async syncUser(user: HisUserInfo, password?: string): Promise<{
    userId: string;
    created: boolean;
    username: string;
    email: string;
  }> {
    return this.authLoginService.syncUser(user, password);
  }

  /**
   * Get token from Redis
   */
  async getToken(userId: string): Promise<{
    found: boolean;
    tokenCode?: string;
    renewCode?: string;
    expireTime?: string;
    loginTime?: string;
  }> {
    return this.authTokenService.getToken(userId);
  }

  /**
   * Invalidate token in Redis
   */
  async invalidateToken(userId: string): Promise<number> {
    return this.authTokenService.invalidateToken(userId);
  }

  /**
   * Renew token from HIS system
   */
  async renewToken(renewCode: string, userId?: string): Promise<{
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
    return this.authTokenService.renewToken(renewCode, userId);
  }

  /**
   * Enrich user data from external database
   */
  async enrichData(username: string): Promise<{
    success: boolean;
    totalRecords: number;
    processedRecords: number;
    failedRecords: number;
    message?: string;
  }> {
    this.logger.info('IntegrationService#enrichData.call', { username });

    try {
      await this.usersEnrichmentJob.executeForUser(username);

      return {
        success: true,
        totalRecords: 1,
        processedRecords: 1,
        failedRecords: 0,
        message: 'Data enrichment completed successfully',
      };
    } catch (error: any) {
      this.logger.error('IntegrationService#enrichData.error', {
        username,
        error: error.message,
        stack: error.stack?.substring(0, 500),
      });

      return {
        success: false,
        totalRecords: 1,
        processedRecords: 0,
        failedRecords: 1,
        message: error.message || 'Data enrichment failed',
      };
    }
  }

  /**
   * Get user rooms from HIS system (with cache)
   */
  async getUserRooms(userId: string): Promise<{
    success: boolean;
    message?: string;
    data?: UserRoom[];
  }> {
    return this.userRoomService.getUserRooms(userId);
  }

    this.logger.info('IntegrationService#getUserRooms.call', { userId });

    try {
      // 1. Check cache first
      const cachedRooms = await this.redisService.getUserRooms(userId);
      if (cachedRooms && cachedRooms.length > 0) {
        this.logger.info('IntegrationService#getUserRooms.cacheHit', {
          userId,
          roomCount: cachedRooms.length,
        });
        return {
          success: true,
          data: cachedRooms as UserRoom[],
        };
      }

      this.logger.info('IntegrationService#getUserRooms.cacheMiss', { userId });

      // 2. Get user info from users-svc to get loginname
      let user: any;
      try {
        user = await firstValueFrom(
          this.usersGrpcService.findById({ id: userId })
        );
      } catch (userError: any) {
        this.logger.error('IntegrationService#getUserRooms.userNotFound', {
          userId,
          error: userError.message,
        });
        return {
          success: false,
          message: 'User not found',
        };
      }

      if (!user || !user.username) {
        this.logger.error('IntegrationService#getUserRooms.invalidUser', {
          userId,
          hasUser: !!user,
          hasUsername: !!user?.username,
        });
        return {
          success: false,
          message: 'Invalid user data: username not found',
        };
      }

      const loginname = user.username;

      // 3. Get token from Redis
      const tokenData = await this.redisService.getExternalToken(userId);
      if (!tokenData || !tokenData.tokenCode) {
        this.logger.warn('IntegrationService#getUserRooms.noToken', {
          userId,
          loginname,
        });
        return {
          success: false,
          message: 'External token not found. Please login again.',
        };
      }

      // 4. Call HIS API to get user rooms
      const hisResponse = await this.hisProvider.getUserRooms(
        tokenData.tokenCode,
        loginname
      );

      if (!hisResponse.Success || !hisResponse.Data) {
        this.logger.warn('IntegrationService#getUserRooms.hisApiFailed', {
          userId,
          loginname,
          Success: hisResponse.Success,
          hasData: !!hisResponse.Data,
        });
        return {
          success: false,
          message: 'Failed to get user rooms from HIS',
        };
      }

      this.logger.info('IntegrationService#getUserRooms.success', {
        userId,
        loginname,
        roomCount: hisResponse.Data.length,
        firstRoomSample: hisResponse.Data[0] ? {
          ID: hisResponse.Data[0].ID,
          ROOM_CODE: hisResponse.Data[0].ROOM_CODE,
          ROOM_NAME: hisResponse.Data[0].ROOM_NAME,
        } : null,
      });

      // Map UPPERCASE fields from external API to camelCase for proto message
      const mappedData: UserRoom[] = hisResponse.Data.map((room: HisUserRoom) => {
        if (!room) {
          this.logger.warn('IntegrationService#getUserRooms.nullRoom', { userId, loginname });
          return null as any; // Will be filtered out
        }
        
        return {
        id: room.ID,
        createTime: room.CREATE_TIME,
        modifyTime: room.MODIFY_TIME,
        creator: room.CREATOR,
        modifier: room.MODIFIER,
        appCreator: room.APP_CREATOR,
        appModifier: room.APP_MODIFIER,
        isActive: room.IS_ACTIVE,
        isDelete: room.IS_DELETE,
        loginname: room.LOGINNAME,
        roomId: room.ROOM_ID,
        roomCode: room.ROOM_CODE,
        roomName: room.ROOM_NAME,
        departmentId: room.DEPARTMENT_ID,
        roomTypeId: room.ROOM_TYPE_ID,
        roomTypeCode: room.ROOM_TYPE_CODE,
        roomTypeName: room.ROOM_TYPE_NAME,
        departmentCode: room.DEPARTMENT_CODE,
        departmentName: room.DEPARTMENT_NAME,
        isPause: room.IS_PAUSE,
        branchId: room.BRANCH_ID,
        branchCode: room.BRANCH_CODE,
        branchName: room.BRANCH_NAME,
        heinMediOrgCode: room.HEIN_MEDI_ORG_CODE,
      } as UserRoom;
      }).filter((room): room is UserRoom => room !== null); // Filter out any null rooms

      this.logger.info('IntegrationService#getUserRooms.mapped', {
        userId,
        loginname,
        mappedCount: mappedData.length,
        firstMappedRoom: mappedData[0] ? {
          id: mappedData[0].id,
          roomCode: mappedData[0].roomCode,
          roomName: mappedData[0].roomName,
        } : null,
      });

      // 5. Cache the result (TTL: 1 day = 86400 seconds)
      try {
        await this.redisService.setUserRooms(userId, mappedData, 86400);
        this.logger.info('IntegrationService#getUserRooms.cached', {
          userId,
          roomCount: mappedData.length,
        });
      } catch (cacheError: any) {
        this.logger.error('IntegrationService#getUserRooms.cacheError', {
          userId,
          error: cacheError.message,
        });
        // Continue even if cache fails
      }

      return {
        success: true,
        data: mappedData,
      };
    } catch (error: any) {
      this.logger.error('IntegrationService#getUserRooms.error', {
        userId,
        error: error.message,
        errorType: error.constructor?.name,
        stack: error.stack?.substring(0, 500),
      });

      return {
        success: false,
        message: error.message || 'Failed to get user rooms',
      };
    }
  }

  /**
   * Reload user rooms from HIS system (bypass cache)
   */
  async reloadUserRooms(userId: string): Promise<{
    success: boolean;
    message?: string;
    data?: UserRoom[];
  }> {
    return this.userRoomService.reloadUserRooms(userId);
  }


  /**
   * Get medi stock by roomId (with cache)
   */
  async getMediStockByRoomId(roomId: number): Promise<{
    success: boolean;
    message?: string;
    id?: number | null;
    data?: MediStock | null;
  }> {
    return this.mediStockService.getMediStockByRoomId(roomId);
  }

  /**
   * @deprecated Use mediStockService.getMediStockByRoomId instead
   */
  private async _getMediStockByRoomId_OLD(roomId: number): Promise<{
    success: boolean;
    message?: string;
    id?: number | null;
    data?: MediStock | null;
  }> {
    this.logger.info('IntegrationService#getMediStockByRoomId.call', { roomId });

    try {
      // 1. Check cached id
      const cachedId = await this.redisService.getMediStockIdByRoomId(roomId);
      if (cachedId !== null && cachedId !== undefined) {
        const cachedList = await this.redisService.getMediStocks();
        const found = cachedList?.find(ms => Number(ms.roomId) === Number(roomId)) || null;
        this.logger.info('IntegrationService#getMediStockByRoomId.cacheHit', { roomId, id: cachedId });
        return {
          success: true,
          id: cachedId,
          data: found,
        };
      }

      this.logger.info('IntegrationService#getMediStockByRoomId.cacheMiss', { roomId });

      // 2. Reload cache then try again
      const reloadResult = await this.reloadMediStock();
      if (!reloadResult.success) {
        return {
          success: false,
          message: reloadResult.message || 'Failed to reload medi stock cache',
          id: null,
          data: null,
        };
      }

      const idAfterReload = await this.redisService.getMediStockIdByRoomId(roomId);
      const listAfterReload = await this.redisService.getMediStocks();
      const foundAfter = listAfterReload?.find(ms => Number(ms.roomId) === Number(roomId)) || null;

      if (idAfterReload !== null && idAfterReload !== undefined) {
        return {
          success: true,
          id: idAfterReload,
          data: foundAfter,
        };
      }

      return {
        success: false,
        message: 'Not found',
        id: null,
        data: null,
      };
    } catch (error: any) {
      this.logger.error('IntegrationService#getMediStockByRoomId.error', {
        roomId,
        error: error.message,
        errorType: error.constructor?.name,
        stack: error.stack?.substring(0, 500),
      });
      return {
        success: false,
        message: error.message || 'Failed to get medi stock by roomId',
        id: null,
        data: null,
      };
    }
  }

  /**
   * Reload medi stock cache from HIS
   */
  async reloadMediStock(): Promise<{
    success: boolean;
    message?: string;
    count?: number;
  }> {
    return this.mediStockService.reloadMediStock();
  }

  /**
   * @deprecated Use mediStockService.reloadMediStock instead
   */
  private async _reloadMediStock_OLD(): Promise<{
    success: boolean;
    message?: string;
    count?: number;
  }> {
    this.logger.info('IntegrationService#reloadMediStock.call');

    try {
      // Clear cache
      await this.redisService.deleteMediStocks();
      await this.redisService.deleteMediStockRoomMap();

      // Pick any external token from cache
      const tokenKeyPattern = 'external_token:*';
      const keys = await this.redisService.scanKeys(tokenKeyPattern);
      if (!keys || keys.length === 0) {
        this.logger.warn('IntegrationService#reloadMediStock.noTokenAvailable');
        return { success: false, message: 'No external token available. Please login first.' };
      }

      const tokenKey = keys[0];
      const tokenData = await this.redisService.getExternalTokenByKey(tokenKey);
      if (!tokenData?.tokenCode) {
        return { success: false, message: 'External token not found. Please login first.' };
      }

      // Call HIS
      const hisResponse = await this.hisProvider.getMediStocks(tokenData.tokenCode);
      if (!hisResponse.Success || !hisResponse.Data) {
        return { success: false, message: 'Failed to get medi stocks from HIS' };
      }

      // Map to camelCase
      const mapped: MediStock[] = hisResponse.Data.map((ms) => ({
        id: ms.ID,
        createTime: ms.CREATE_TIME,
        modifyTime: ms.MODIFY_TIME,
        creator: ms.CREATOR,
        modifier: ms.MODIFIER,
        appCreator: ms.APP_CREATOR,
        appModifier: ms.APP_MODIFIER,
        isActive: ms.IS_ACTIVE,
        isDelete: ms.IS_DELETE,
        mediStockCode: ms.MEDI_STOCK_CODE,
        mediStockName: ms.MEDI_STOCK_NAME,
        roomId: ms.ROOM_ID,
        isAllowImpSupplier: ms.IS_ALLOW_IMP_SUPPLIER,
        isBusiness: ms.IS_BUSINESS,
        isAutoCreateChmsImp: ms.IS_AUTO_CREATE_CHMS_IMP,
        isDrugStore: ms.IS_DRUG_STORE,
        departmentId: ms.DEPARTMENT_ID,
        roomTypeId: ms.ROOM_TYPE_ID,
        roomTypeCode: ms.ROOM_TYPE_CODE,
        roomTypeName: ms.ROOM_TYPE_NAME,
        departmentCode: ms.DEPARTMENT_CODE,
        departmentName: ms.DEPARTMENT_NAME,
        gCode: ms.G_CODE,
      }));

      const map: Record<string, number> = {};
      mapped.forEach((m) => {
        if (m.roomId !== null && m.roomId !== undefined) {
          map[String(m.roomId)] = m.id;
        }
      });

      // Cache
      await this.redisService.setMediStocks(mapped, 86400);
      await this.redisService.setMediStockRoomMap(map, 86400);

      this.logger.info('IntegrationService#reloadMediStock.success', {
        count: mapped.length,
        mapCount: Object.keys(map).length,
      });

      return {
        success: true,
        count: mapped.length,
        message: 'Reload medi stock cache successfully',
      };
    } catch (error: any) {
      this.logger.error('IntegrationService#reloadMediStock.error', {
        error: error.message,
        errorType: error.constructor?.name,
        stack: error.stack?.substring(0, 500),
      });
      return {
        success: false,
        message: error.message || 'Failed to reload medi stock cache',
      };
    }
  }

  /**
   * Get ExpMestStt (cached, reload if empty)
   */
  async getExpMestStt(): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMestStt[];
  }> {
    return this.expMestSttService.getExpMestStt();
  }

  /**
   * @deprecated Use expMestSttService.getExpMestStt instead
   */
  private async _getExpMestStt_OLD(): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMestStt[];
  }> {
    this.logger.info('IntegrationService#getExpMestStt.call');
    try {
      // 1. Try cache
      const cached = await this.redisService.getExpMestStt();
      if (cached && cached.length > 0) {
        this.logger.info('IntegrationService#getExpMestStt.cacheHit', { count: cached.length });
        // Convert numeric fields
        const data = cached.map((s: any) => this.convertExpMestSttNumberFields(s));
        return { success: true, data };
      }

      this.logger.info('IntegrationService#getExpMestStt.cacheMiss');
      const reloadResult = await this.reloadExpMestStt();
      if (!reloadResult.success) {
        return { success: false, message: reloadResult.message || 'Failed to reload exp mest status cache' };
      }
      const after = await this.redisService.getExpMestStt();
      const data = after?.map((s: any) => this.convertExpMestSttNumberFields(s)) || [];
      return { success: true, data };
    } catch (error: any) {
      this.logger.error('IntegrationService#getExpMestStt.error', {
        error: error.message,
        errorType: error.constructor?.name,
        stack: error.stack?.substring(0, 500),
      });
      return { success: false, message: error.message || 'Failed to get exp mest status' };
    }
  }

  /**
   * Reload ExpMestStt cache from HIS
   */
  async reloadExpMestStt(): Promise<{
    success: boolean;
    message?: string;
    count?: number;
  }> {
    return this.expMestSttService.reloadExpMestStt();
  }

  /**
   * @deprecated Use expMestSttService.reloadExpMestStt instead
   */
  private async _reloadExpMestStt_OLD(): Promise<{
    success: boolean;
    message?: string;
    count?: number;
  }> {
    this.logger.info('IntegrationService#reloadExpMestStt.call');
    try {
      // Clear cache
      await this.redisService.deleteExpMestStt();

      // Choose any external token
      const keys = await this.redisService.scanKeys('external_token:*');
      if (!keys || keys.length === 0) {
        return { success: false, message: 'No external token available. Please login first.' };
      }
      const tokenData = await this.redisService.getExternalTokenByKey(keys[0]);
      if (!tokenData?.tokenCode) {
        return { success: false, message: 'External token not found. Please login first.' };
      }

      // Call HIS
      const hisResponse = await this.hisProvider.getExpMestStt(tokenData.tokenCode);
      if (!hisResponse.Success || !hisResponse.Data) {
        return { success: false, message: 'Failed to get exp mest statuses from HIS' };
      }

      // Map to camelCase
      const mapped: ExpMestStt[] = hisResponse.Data.map((s) => ({
        id: s.ID,
        createTime: s.CREATE_TIME,
        modifyTime: s.MODIFY_TIME,
        modifier: s.MODIFIER || null,
        appModifier: s.APP_MODIFIER || null,
        isActive: s.IS_ACTIVE,
        isDelete: s.IS_DELETE,
        expMestSttCode: s.EXP_MEST_STT_CODE,
        expMestSttName: s.EXP_MEST_STT_NAME,
      }));

      await this.redisService.setExpMestStt(mapped, 86400);

      this.logger.info('IntegrationService#reloadExpMestStt.success', {
        count: mapped.length,
      });

      return { success: true, count: mapped.length, message: 'Reload exp mest status cache successfully' };
    } catch (error: any) {
      this.logger.error('IntegrationService#reloadExpMestStt.error', {
        error: error.message,
        errorType: error.constructor?.name,
        stack: error.stack?.substring(0, 500),
      });
      return { success: false, message: error.message || 'Failed to reload exp mest status cache' };
    }
  }

  private convertExpMestSttNumberFields(s: any): any {
    const convert = (v: any) => {
      if (v === null || v === undefined) return null;
      if (typeof v === 'object' && 'low' in v && 'high' in v) {
        const lv = v as { low: number; high: number };
        return lv.low + lv.high * 0x100000000;
      }
      return typeof v === 'number' ? v : Number(v);
    };
    const copy = { ...s };
    ['id', 'createTime', 'modifyTime'].forEach(f => {
      if (copy[f] !== undefined) copy[f] = convert(copy[f]);
    });
    return copy;
  }

  /**
   * Get ExpMestType (cached, reload if empty)
   */
  async getExpMestType(): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMestType[];
  }> {
    return this.expMestTypeService.getExpMestType();
  }

  /**
   * @deprecated Use expMestTypeService.getExpMestType instead
   * This method is kept for reference only and should not be used
   */
  private async _getExpMestType_OLD(): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMestType[];
  }> {
    // This method is deprecated and should not be used
    // Use expMestTypeService.getExpMestType instead
    throw new Error('This method is deprecated. Use expMestTypeService.getExpMestType instead.');
  }

  /**
   * Reload ExpMestType cache from HIS
   */
  async reloadExpMestType(): Promise<{
    success: boolean;
    message?: string;
    count?: number;
  }> {
    return this.expMestTypeService.reloadExpMestType();
  }

  /**
   * @deprecated Use expMestTypeService.reloadExpMestType instead
   */
  private async _reloadExpMestType_OLD(): Promise<{
    success: boolean;
    message?: string;
    count?: number;
  }> {
    this.logger.info('IntegrationService#reloadExpMestType.call');
    try {
      // Clear cache
      await this.redisService.deleteExpMestType();

      // Choose any external token
      const keys = await this.redisService.scanKeys('external_token:*');
      if (!keys || keys.length === 0) {
        return { success: false, message: 'No external token available. Please login first.' };
      }
      const tokenData = await this.redisService.getExternalTokenByKey(keys[0]);
      if (!tokenData?.tokenCode) {
        return { success: false, message: 'External token not found. Please login first.' };
      }

      // Call HIS
      const hisResponse = await this.hisProvider.getExpMestType(tokenData.tokenCode);
      if (!hisResponse.Success || !hisResponse.Data) {
        return { success: false, message: 'Failed to get exp mest types from HIS' };
      }

      // Map to camelCase
      const mapped: ExpMestType[] = hisResponse.Data.map((t) => ({
        id: t.ID,
        createTime: t.CREATE_TIME,
        modifyTime: t.MODIFY_TIME,
        isActive: t.IS_ACTIVE,
        isDelete: t.IS_DELETE,
        expMestTypeCode: t.EXP_MEST_TYPE_CODE,
        expMestTypeName: t.EXP_MEST_TYPE_NAME,
      }));

      await this.redisService.setExpMestType(mapped, 86400);

      this.logger.info('IntegrationService#reloadExpMestType.success', {
        count: mapped.length,
      });

      return { success: true, count: mapped.length, message: 'Reload exp mest type cache successfully' };
    } catch (error: any) {
      this.logger.error('IntegrationService#reloadExpMestType.error', {
        error: error.message,
        errorType: error.constructor?.name,
        stack: error.stack?.substring(0, 500),
      });
      return { success: false, message: error.message || 'Failed to reload exp mest type cache' };
    }
  }

  /**
   * Get ExpMest list with filters (pagination)
   */
  async getExpMests(request: {
    expMestSttIds?: number[];
    expMestTypeIds?: number[];
    impOrExpMediStockId?: number;
    createTimeFrom?: number;
    createTimeTo?: number;
    start?: number;
    limit?: number;
    expMestCodeExact?: string;
    workingRoomId?: number;
    dataDomainFilter?: boolean;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMest[];
    start?: number;
    limit?: number;
    count?: number;
    total?: number;
  }> {
    return this.expMestService.getExpMests(request);
  }

  /**
   * @deprecated Use expMestService.getExpMests instead
   */
  private async _getExpMests_OLD(request: {
    expMestSttIds?: number[];
    expMestTypeIds?: number[];
    impOrExpMediStockId?: number;
    createTimeFrom?: number;
    createTimeTo?: number;
    start?: number;
    limit?: number;
    expMestCodeExact?: string;
    workingRoomId?: number;
    dataDomainFilter?: boolean;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMest[];
    start?: number;
    limit?: number;
    count?: number;
    total?: number;
  }> {
    this.logger.info('IntegrationService#getExpMests.call', { request });

    try {
      // Get any available external token
      const tokenData = await this.getAnyExternalToken();
      if (!tokenData?.tokenCode) {
        return {
          success: false,
          message: 'No external token available. Please login first.',
        };
      }

      // Helper function to convert Long objects to numbers
      const convertToNumber = (value: any): number | null => {
        if (value === null || value === undefined) return null;
        if (typeof value === 'object' && 'low' in value && 'high' in value) {
          const longValue = value as { low: number; high: number };
          return longValue.low + (longValue.high * 0x100000000);
        }
        if (typeof value === 'number') return value;
        const num = Number(value);
        return isNaN(num) ? null : num;
      };

      // Convert arrays of Long objects to arrays of numbers
      const convertArray = (arr: any[] | undefined): number[] | undefined => {
        if (!arr || arr.length === 0) return undefined;
        return arr.map(item => convertToNumber(item)).filter(id => id !== null) as number[];
      };

      // Call HIS API - Convert Long objects to numbers before sending
      const hisRequest: GetExpMestRequest = {
        expMestSttIds: convertArray(request.expMestSttIds),
        expMestTypeIds: convertArray(request.expMestTypeIds),
        impOrExpMediStockId: convertToNumber(request.impOrExpMediStockId) ?? undefined,
        createTimeFrom: convertToNumber(request.createTimeFrom) ?? undefined,
        createTimeTo: convertToNumber(request.createTimeTo) ?? undefined,
        start: convertToNumber(request.start) ?? undefined,
        limit: convertToNumber(request.limit) ?? undefined,
        expMestCodeExact: request.expMestCodeExact ?? undefined,
        workingRoomId: convertToNumber(request.workingRoomId) ?? undefined,
        dataDomainFilter: request.dataDomainFilter ?? undefined,
      };

      const hisResponse = await this.hisProvider.getExpMests(tokenData.tokenCode, hisRequest);
      
      this.logger.info('IntegrationService#getExpMests.hisResponse', {
        Success: hisResponse.Success,
        hasData: !!hisResponse.Data,
        dataCount: hisResponse.Data?.length || 0,
        param: hisResponse.Param,
      });
      
      if (!hisResponse.Success) {
        this.logger.warn('IntegrationService#getExpMests.unsuccessful', {
          Success: hisResponse.Success,
          Param: hisResponse.Param,
          Messages: hisResponse.Param?.Messages,
          BugCodes: hisResponse.Param?.BugCodes,
          HasException: hisResponse.Param?.HasException,
        });
        return {
          success: false,
          message: `Failed to get exp mests from HIS: ${hisResponse.Param?.Messages?.join(', ') || 'Unknown error'}`,
        };
      }
      
      // Data can be empty array, that's OK
      if (!hisResponse.Data) {
        this.logger.warn('IntegrationService#getExpMests.noDataField', {
          Success: hisResponse.Success,
          Param: hisResponse.Param,
        });
        // Return empty result if Data is missing but Success is true
        const start = hisResponse.Param?.Start ?? request.start ?? 0;
        const limit = hisResponse.Param?.Limit ?? request.limit ?? 100;
        const count = hisResponse.Param?.Count ?? 0;
        return {
          success: true,
          data: [],
          start,
          limit,
          count,
          total: count,
        };
      }

      // Map from UPPERCASE to camelCase
      const mapped: ExpMest[] = hisResponse.Data.map((item) => ({
        id: item.ID,
        createTime: item.CREATE_TIME,
        modifyTime: item.MODIFY_TIME,
        creator: item.CREATOR || '',
        modifier: item.MODIFIER || '',
        appCreator: item.APP_CREATOR || '',
        appModifier: item.APP_MODIFIER || '',
        isActive: item.IS_ACTIVE,
        isDelete: item.IS_DELETE,
        expMestCode: item.EXP_MEST_CODE || '',
        expMestTypeId: item.EXP_MEST_TYPE_ID,
        expMestSttId: item.EXP_MEST_STT_ID,
        mediStockId: item.MEDI_STOCK_ID,
        reqLoginname: item.REQ_LOGINNAME || '',
        reqUsername: item.REQ_USERNAME || '',
        reqRoomId: item.REQ_ROOM_ID,
        reqDepartmentId: item.REQ_DEPARTMENT_ID,
        createDate: item.CREATE_DATE,
        serviceReqId: item.SERVICE_REQ_ID,
        tdlTotalPrice: item.TDL_TOTAL_PRICE || 0,
        tdlServiceReqCode: item.TDL_SERVICE_REQ_CODE || '',
        tdlIntructionTime: item.TDL_INTRUCTION_TIME,
        tdlIntructionDate: item.TDL_INTRUCTION_DATE,
        tdlTreatmentId: item.TDL_TREATMENT_ID,
        tdlTreatmentCode: item.TDL_TREATMENT_CODE || '',
        tdlPatientId: item.TDL_PATIENT_ID,
        tdlPatientCode: item.TDL_PATIENT_CODE || '',
        tdlPatientName: item.TDL_PATIENT_NAME || '',
        tdlPatientFirstName: item.TDL_PATIENT_FIRST_NAME || '',
        tdlPatientLastName: item.TDL_PATIENT_LAST_NAME || '',
        tdlPatientDob: item.TDL_PATIENT_DOB,
        tdlPatientIsHasNotDayDob: item.TDL_PATIENT_IS_HAS_NOT_DAY_DOB || 0,
        tdlPatientAddress: item.TDL_PATIENT_ADDRESS || '',
        tdlPatientGenderId: item.TDL_PATIENT_GENDER_ID,
        tdlPatientGenderName: item.TDL_PATIENT_GENDER_NAME || '',
        tdlPatientTypeId: item.TDL_PATIENT_TYPE_ID,
        tdlHeinCardNumber: item.TDL_HEIN_CARD_NUMBER || '',
        tdlPatientPhone: item.TDL_PATIENT_PHONE || '',
        tdlPatientProvinceCode: item.TDL_PATIENT_PROVINCE_CODE || '',
        tdlPatientCommuneCode: item.TDL_PATIENT_COMMUNE_CODE || '',
        tdlPatientNationalName: item.TDL_PATIENT_NATIONAL_NAME || '',
        virCreateMonth: item.VIR_CREATE_MONTH || 0,
        icdCode: item.ICD_CODE || '',
        icdName: item.ICD_NAME || '',
        reqUserTitle: item.REQ_USER_TITLE || '',
        expMestSubCode2: item.EXP_MEST_SUB_CODE_2 || '',
        virCreateYear: item.VIR_CREATE_YEAR || 0,
        virHeinCardPrefix: item.VIR_HEIN_CARD_PREFIX || '',
        priority: item.PRIORITY || 0,
        expMestTypeCode: item.EXP_MEST_TYPE_CODE || '',
        expMestTypeName: item.EXP_MEST_TYPE_NAME || '',
        expMestSttCode: item.EXP_MEST_STT_CODE || '',
        expMestSttName: item.EXP_MEST_STT_NAME || '',
        mediStockCode: item.MEDI_STOCK_CODE || '',
        mediStockName: item.MEDI_STOCK_NAME || '',
        reqDepartmentCode: item.REQ_DEPARTMENT_CODE || '',
        reqDepartmentName: item.REQ_DEPARTMENT_NAME || '',
        reqRoomCode: item.REQ_ROOM_CODE || '',
        reqRoomName: item.REQ_ROOM_NAME || '',
        treatmentIsActive: item.TREATMENT_IS_ACTIVE || 0,
        patientTypeName: item.PATIENT_TYPE_NAME || '',
        patientTypeCode: item.PATIENT_TYPE_CODE || '',
        icdSubCode: item.ICD_SUB_CODE || null,
        icdText: item.ICD_TEXT || null,
        tdlPatientDistrictCode: item.TDL_PATIENT_DISTRICT_CODE || null,
        tdlAggrPatientCode: item.TDL_AGGR_PATIENT_CODE || '',
        tdlAggrTreatmentCode: item.TDL_AGGR_TREATMENT_CODE || '',
        lastExpLoginname: item.LAST_EXP_LOGINNAME || '',
        lastExpUsername: item.LAST_EXP_USERNAME || '',
        lastExpTime: item.LAST_EXP_TIME,
        finishTime: item.FINISH_TIME,
        finishDate: item.FINISH_DATE,
        isExportEqualApprove: item.IS_EXPORT_EQUAL_APPROVE,
        expMestSubCode: item.EXP_MEST_SUB_CODE || '',
        lastApprovalLoginname: item.LAST_APPROVAL_LOGINNAME || '',
        lastApprovalUsername: item.LAST_APPROVAL_USERNAME || '',
        lastApprovalTime: item.LAST_APPROVAL_TIME,
        lastApprovalDate: item.LAST_APPROVAL_DATE,
        numOrder: item.NUM_ORDER,
        tdlIntructionDateMin: item.TDL_INTRUCTION_DATE_MIN,
        groupCode: item.GROUP_CODE || '',
      }));

      const start = hisResponse.Param?.Start ?? request.start ?? 0;
      const limit = hisResponse.Param?.Limit ?? request.limit ?? 100;
      const count = hisResponse.Param?.Count ?? mapped.length;
      const total = count; // Total available records

      this.logger.info('IntegrationService#getExpMests.success', {
        dataCount: mapped.length,
        start,
        limit,
        count,
        total,
      });

      return {
        success: true,
        data: mapped,
        start,
        limit,
        count,
        total,
      };
    } catch (error: any) {
      this.logger.error('IntegrationService#getExpMests.error', {
        error: error.message,
        errorType: error.constructor?.name,
        stack: error.stack?.substring(0, 500),
      });
      return {
        success: false,
        message: error.message || 'Failed to get exp mests',
      };
    }
  }

  /**
   * Get inpatient aggregated ExpMest list (HIS GetView3)
   */
  async getInpatientExpMests(request: GetInpatientExpMestRequest): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMest[];
    start?: number;
    limit?: number;
    count?: number;
    total?: number;
  }> {
    return this.inpatientExpMestService.getInpatientExpMests(request);
  }

  /**
   * @deprecated Use inpatientExpMestService.getInpatientExpMests instead
   */
  private async _getInpatientExpMests_OLD(request: GetInpatientExpMestRequest): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMest[];
    start?: number;
    limit?: number;
    count?: number;
    total?: number;
  }> {
    this.logger.info('IntegrationService#getInpatientExpMests.call', { request });

    try {
      const tokenData = await this.getAnyExternalToken();
      if (!tokenData?.tokenCode) {
        return {
          success: false,
          message: 'No external token available. Please login first.',
        };
      }

      const hisRequest: GetInpatientExpMestRequest = {
        ...request,
      };

      const hisResponse = await this.hisProvider.getInpatientExpMests(tokenData.tokenCode, hisRequest);

      // Log first item to debug data from HIS
      if (hisResponse.Data && hisResponse.Data.length > 0) {
        const firstItem = hisResponse.Data[0];
        this.logger.info('IntegrationService#getInpatientExpMests.hisDataSample', {
          ID: firstItem.ID,
          VIR_CREATE_MONTH: firstItem.VIR_CREATE_MONTH,
          VIR_CREATE_MONTH_type: typeof firstItem.VIR_CREATE_MONTH,
          VIR_CREATE_MONTH_string: String(firstItem.VIR_CREATE_MONTH),
          VIR_CREATE_YEAR: firstItem.VIR_CREATE_YEAR,
          TDL_INTRUCTION_DATE_MIN: firstItem.TDL_INTRUCTION_DATE_MIN,
        });
      }

      if (!hisResponse.Success) {
        return {
          success: false,
          message: `Failed to get inpatient exp mests: ${hisResponse.Param?.Messages?.join(', ') || 'Unknown error'}`,
        };
      }

      if (!hisResponse.Data) {
        const start = hisResponse.Param?.Start ?? request.start ?? 0;
        const limit = hisResponse.Param?.Limit ?? request.limit ?? 100;
        const count = hisResponse.Param?.Count ?? 0;
        return {
          success: true,
          data: [],
          start,
          limit,
          count,
          total: count,
        };
      }

      // Map only fields that HIS GetView3 actually returns
      // Based on HIS response structure, only include fields that are present in the response
      const mapped: ExpMest[] = hisResponse.Data.map((item: any) => {
        const result: any = {
          id: item.ID,
          createTime: item.CREATE_TIME,
          modifyTime: item.MODIFY_TIME,
          creator: item.CREATOR || '',
          modifier: item.MODIFIER || '',
          appCreator: item.APP_CREATOR || '',
          appModifier: item.APP_MODIFIER || '',
          isActive: item.IS_ACTIVE,
          isDelete: item.IS_DELETE,
          expMestCode: item.EXP_MEST_CODE || '',
          expMestTypeId: item.EXP_MEST_TYPE_ID,
          expMestSttId: item.EXP_MEST_STT_ID,
          mediStockId: item.MEDI_STOCK_ID,
          reqLoginname: item.REQ_LOGINNAME || '',
          reqUsername: item.REQ_USERNAME || '',
          reqRoomId: item.REQ_ROOM_ID,
          reqDepartmentId: item.REQ_DEPARTMENT_ID,
          createDate: item.CREATE_DATE,
          tdlPatientTypeId: item.TDL_PATIENT_TYPE_ID,
          virCreateMonth: item.VIR_CREATE_MONTH !== null && item.VIR_CREATE_MONTH !== undefined
            ? (typeof item.VIR_CREATE_MONTH === 'number' ? item.VIR_CREATE_MONTH : Number(item.VIR_CREATE_MONTH))
            : null,
          virCreateYear: (() => {
            const val = item.VIR_CREATE_YEAR;
            if (val === null || val === undefined) return null;
            if (typeof val === 'string') {
              const parsed = parseFloat(val);
              return isNaN(parsed) ? null : parsed;
            }
            if (typeof val === 'number') return val;
            const num = Number(val);
            return isNaN(num) ? null : num;
          })(),
          reqUserTitle: item.REQ_USER_TITLE || '',
          expMestSubCode: item.EXP_MEST_SUB_CODE || '',
          expMestSubCode2: item.EXP_MEST_SUB_CODE_2 || '',
          numOrder: item.NUM_ORDER,
          tdlAggrPatientCode: item.TDL_AGGR_PATIENT_CODE || '',
          tdlAggrTreatmentCode: item.TDL_AGGR_TREATMENT_CODE || '',
          expMestTypeCode: item.EXP_MEST_TYPE_CODE || '',
          expMestTypeName: item.EXP_MEST_TYPE_NAME || '',
          expMestSttCode: item.EXP_MEST_STT_CODE || '',
          expMestSttName: item.EXP_MEST_STT_NAME || '',
          mediStockCode: item.MEDI_STOCK_CODE || '',
          mediStockName: item.MEDI_STOCK_NAME || '',
          reqDepartmentCode: item.REQ_DEPARTMENT_CODE || '',
          reqDepartmentName: item.REQ_DEPARTMENT_NAME || '',
          tdlIntructionDateMin: item.TDL_INTRUCTION_DATE_MIN !== null && item.TDL_INTRUCTION_DATE_MIN !== undefined
            ? Math.floor(typeof item.TDL_INTRUCTION_DATE_MIN === 'number' ? item.TDL_INTRUCTION_DATE_MIN : Number(item.TDL_INTRUCTION_DATE_MIN))
            : null,
        };

        // Only include optional fields if they exist in HIS response
        if (item.LAST_EXP_LOGINNAME !== undefined) {
          result.lastExpLoginname = item.LAST_EXP_LOGINNAME || '';
        }
        if (item.LAST_EXP_USERNAME !== undefined) {
          result.lastExpUsername = item.LAST_EXP_USERNAME || '';
        }
        if (item.LAST_EXP_TIME !== undefined) {
          result.lastExpTime = item.LAST_EXP_TIME;
        }
        if (item.FINISH_TIME !== undefined) {
          result.finishTime = item.FINISH_TIME;
        }
        if (item.FINISH_DATE !== undefined) {
          result.finishDate = item.FINISH_DATE;
        }
        if (item.IS_EXPORT_EQUAL_APPROVE !== undefined) {
          result.isExportEqualApprove = item.IS_EXPORT_EQUAL_APPROVE;
        }
        if (item.LAST_APPROVAL_LOGINNAME !== undefined) {
          result.lastApprovalLoginname = item.LAST_APPROVAL_LOGINNAME || '';
        }
        if (item.LAST_APPROVAL_USERNAME !== undefined) {
          result.lastApprovalUsername = item.LAST_APPROVAL_USERNAME || '';
        }
        if (item.LAST_APPROVAL_TIME !== undefined) {
          result.lastApprovalTime = item.LAST_APPROVAL_TIME;
        }
        if (item.LAST_APPROVAL_DATE !== undefined) {
          result.lastApprovalDate = item.LAST_APPROVAL_DATE;
        }
        if (item.REQ_ROOM_CODE !== undefined) {
          result.reqRoomCode = item.REQ_ROOM_CODE || '';
        }
        if (item.REQ_ROOM_NAME !== undefined) {
          result.reqRoomName = item.REQ_ROOM_NAME || '';
        }
        if (item.GROUP_CODE !== undefined) {
          result.groupCode = item.GROUP_CODE || '';
        }

        return result;
      });

      const start = hisResponse.Param?.Start ?? request.start ?? 0;
      const limit = hisResponse.Param?.Limit ?? request.limit ?? 100;
      const count = hisResponse.Param?.Count ?? mapped.length;


      return {
        success: true,
        data: mapped,
        start,
        limit,
        count,
        total: count,
      };
    } catch (error: any) {
      this.logger.error('IntegrationService#getInpatientExpMests.error', {
        error: error.message,
        errorType: error.constructor?.name,
        stack: error.stack?.substring(0, 500),
      });
      return {
        success: false,
        message: error.message || 'Failed to get inpatient exp mests',
      };
    }
  }

  /**
   * Get ExpMest by ID from HIS (inpatient format - GetView3)
   */
  async getInpatientExpMestById(request: {
    expMestId: number;
    includeDeleted?: boolean;
    dataDomainFilter?: boolean;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMest | null;
  }> {
    return this.inpatientExpMestService.getInpatientExpMestById(request);
  }

  /**
   * @deprecated Use inpatientExpMestService.getInpatientExpMestById instead
   */
  private async _getInpatientExpMestById_OLD(request: {
    expMestId: number;
    includeDeleted?: boolean;
    dataDomainFilter?: boolean;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMest | null;
  }> {
    this.logger.info('IntegrationService#getInpatientExpMestById.call', request);

    try {
      // Get any available external token
      const tokenData = await this.getAnyExternalToken();
      if (!tokenData?.tokenCode) {
        return {
          success: false,
          message: 'No external token available. Please login first.',
        };
      }

      // Helper function to convert Long objects to numbers
      const convertToNumber = (value: any): number | null => {
        if (value === null || value === undefined) return null;
        if (typeof value === 'object' && 'low' in value && 'high' in value) {
          const longValue = value as { low: number; high: number };
          return longValue.low + (longValue.high * 0x100000000);
        }
        if (typeof value === 'number') return value;
        const num = Number(value);
        return isNaN(num) ? null : num;
      };

      // Convert expMestId from Long object to number if needed
      const expMestIdNumber = convertToNumber(request.expMestId);
      if (expMestIdNumber === null) {
        return {
          success: false,
          message: 'Invalid expMestId: must be a valid number',
        };
      }

      const hisResponse = await this.hisProvider.getExpMestById(
        tokenData.tokenCode,
        expMestIdNumber,
        request.includeDeleted ?? false,
        request.dataDomainFilter ?? false,
      );

      if (!hisResponse.Success) {
        return {
          success: false,
          message: `Failed to get inpatient exp mest by ID: ${hisResponse.Param?.Messages?.join(', ') || 'Unknown error'}`,
        };
      }

      if (!hisResponse.Data || hisResponse.Data.length === 0) {
        return {
          success: true,
          data: null,
        };
      }

      // Map from UPPERCASE to camelCase (same mapping as getInpatientExpMests)
      const item = hisResponse.Data[0];
      
      const mapped: any = {
        id: item.ID,
        createTime: item.CREATE_TIME,
        modifyTime: item.MODIFY_TIME,
        creator: item.CREATOR || '',
        modifier: item.MODIFIER || '',
        appCreator: item.APP_CREATOR || '',
        appModifier: item.APP_MODIFIER || '',
        isActive: item.IS_ACTIVE,
        isDelete: item.IS_DELETE,
        expMestCode: item.EXP_MEST_CODE || '',
        expMestTypeId: item.EXP_MEST_TYPE_ID,
        expMestSttId: item.EXP_MEST_STT_ID,
        mediStockId: item.MEDI_STOCK_ID,
        reqLoginname: item.REQ_LOGINNAME || '',
        reqUsername: item.REQ_USERNAME || '',
        reqRoomId: item.REQ_ROOM_ID,
        reqDepartmentId: item.REQ_DEPARTMENT_ID,
        createDate: item.CREATE_DATE,
        tdlPatientTypeId: item.TDL_PATIENT_TYPE_ID,
        virCreateMonth: item.VIR_CREATE_MONTH !== null && item.VIR_CREATE_MONTH !== undefined
          ? (typeof item.VIR_CREATE_MONTH === 'number' ? item.VIR_CREATE_MONTH : Number(item.VIR_CREATE_MONTH))
          : null,
        virCreateYear: (() => {
          const val = item.VIR_CREATE_YEAR;
          if (val === null || val === undefined) return null;
          if (typeof val === 'string') {
            const parsed = parseFloat(val);
            return isNaN(parsed) ? null : parsed;
          }
          if (typeof val === 'number') return val;
          const num = Number(val);
          return isNaN(num) ? null : num;
        })(),
        reqUserTitle: item.REQ_USER_TITLE || '',
        expMestSubCode: item.EXP_MEST_SUB_CODE || '',
        expMestSubCode2: item.EXP_MEST_SUB_CODE_2 || '',
        numOrder: item.NUM_ORDER,
        tdlAggrPatientCode: item.TDL_AGGR_PATIENT_CODE || '',
        tdlAggrTreatmentCode: item.TDL_AGGR_TREATMENT_CODE || '',
        expMestTypeCode: item.EXP_MEST_TYPE_CODE || '',
        expMestTypeName: item.EXP_MEST_TYPE_NAME || '',
        expMestSttCode: item.EXP_MEST_STT_CODE || '',
        expMestSttName: item.EXP_MEST_STT_NAME || '',
        mediStockCode: item.MEDI_STOCK_CODE || '',
        mediStockName: item.MEDI_STOCK_NAME || '',
        reqDepartmentCode: item.REQ_DEPARTMENT_CODE || '',
        reqDepartmentName: item.REQ_DEPARTMENT_NAME || '',
        tdlIntructionDateMin: (() => {
          // If TDL_INTRUCTION_DATE_MIN exists in HIS response, use it
          if (item.TDL_INTRUCTION_DATE_MIN !== null && item.TDL_INTRUCTION_DATE_MIN !== undefined) {
            return Math.floor(typeof item.TDL_INTRUCTION_DATE_MIN === 'number' ? item.TDL_INTRUCTION_DATE_MIN : Number(item.TDL_INTRUCTION_DATE_MIN));
          }
          // Otherwise, calculate from CREATE_DATE (first day of month, e.g., 20251220000000 -> 20251201000000)
          if (item.CREATE_DATE) {
            const createDateStr = String(item.CREATE_DATE);
            if (createDateStr.length >= 6) {
              const yearMonth = createDateStr.substring(0, 6); // YYYYMM
              return parseInt(yearMonth + '01000000', 10); // YYYYMM01000000
            }
          }
          return null;
        })(),
      };

      // Only include optional fields if they exist in HIS response
      if (item.LAST_EXP_LOGINNAME !== undefined) {
        mapped.lastExpLoginname = item.LAST_EXP_LOGINNAME || '';
      }
      if (item.LAST_EXP_USERNAME !== undefined) {
        mapped.lastExpUsername = item.LAST_EXP_USERNAME || '';
      }
      if (item.LAST_EXP_TIME !== undefined) {
        mapped.lastExpTime = item.LAST_EXP_TIME;
      }
      if (item.FINISH_TIME !== undefined) {
        mapped.finishTime = item.FINISH_TIME;
      }
      if (item.FINISH_DATE !== undefined) {
        mapped.finishDate = item.FINISH_DATE;
      }
      if (item.IS_EXPORT_EQUAL_APPROVE !== undefined) {
        mapped.isExportEqualApprove = item.IS_EXPORT_EQUAL_APPROVE;
      }
      if (item.LAST_APPROVAL_LOGINNAME !== undefined) {
        mapped.lastApprovalLoginname = item.LAST_APPROVAL_LOGINNAME || '';
      }
      if (item.LAST_APPROVAL_USERNAME !== undefined) {
        mapped.lastApprovalUsername = item.LAST_APPROVAL_USERNAME || '';
      }
      if (item.LAST_APPROVAL_TIME !== undefined) {
        mapped.lastApprovalTime = item.LAST_APPROVAL_TIME;
      }
      if (item.LAST_APPROVAL_DATE !== undefined) {
        mapped.lastApprovalDate = item.LAST_APPROVAL_DATE;
      }
      if (item.REQ_ROOM_CODE !== undefined) {
        mapped.reqRoomCode = item.REQ_ROOM_CODE || '';
      }
      if (item.REQ_ROOM_NAME !== undefined) {
        mapped.reqRoomName = item.REQ_ROOM_NAME || '';
      }
      if (item.GROUP_CODE !== undefined) {
        mapped.groupCode = item.GROUP_CODE || '';
      }

      return {
        success: true,
        data: mapped,
      };
    } catch (error: any) {
      this.logger.error('IntegrationService#getInpatientExpMestById.error', {
        error: error.message,
        errorType: error.constructor?.name,
        stack: error.stack?.substring(0, 500),
      });
      return {
        success: false,
        message: error.message || 'Failed to get inpatient exp mest by ID',
      };
    }
  }

  /**
   * Get Inpatient ExpMest details (chi tiết các phiếu con) by AGGR_EXP_MEST_ID from HIS
   * Returns list of child exp mests in an aggregated exp mest
   */
  async getInpatientExpMestDetails(request: {
    aggrExpMestId: number;
    includeDeleted?: boolean;
    dataDomainFilter?: boolean;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMest[];
  }> {
    return this.inpatientExpMestService.getInpatientExpMestDetails(request);
  }

  /**
   * @deprecated Use inpatientExpMestService.getInpatientExpMestDetails instead
   */
  private async _getInpatientExpMestDetails_OLD(request: {
    aggrExpMestId: number;
    includeDeleted?: boolean;
    dataDomainFilter?: boolean;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMest[];
  }> {
    this.logger.info('IntegrationService#getInpatientExpMestDetails.call', request);

    try {
      // Get any available external token
      const tokenData = await this.getAnyExternalToken();
      if (!tokenData?.tokenCode) {
        return {
          success: false,
          message: 'No external token available. Please login first.',
        };
      }

      // Helper function to convert Long objects to numbers
      const convertToNumber = (value: any): number | null => {
        if (value === null || value === undefined) return null;
        if (typeof value === 'object' && 'low' in value && 'high' in value) {
          const longValue = value as { low: number; high: number };
          return longValue.low + (longValue.high * 0x100000000);
        }
        if (typeof value === 'number') return value;
        const num = Number(value);
        return isNaN(num) ? null : num;
      };

      // Convert aggrExpMestId from Long object to number if needed
      const aggrExpMestIdNumber = convertToNumber(request.aggrExpMestId);
      if (aggrExpMestIdNumber === null) {
        return {
          success: false,
          message: 'Invalid aggrExpMestId: must be a valid number',
        };
      }

      const hisResponse = await this.hisProvider.getInpatientExpMestDetails(
        tokenData.tokenCode,
        aggrExpMestIdNumber,
        request.includeDeleted ?? false,
        request.dataDomainFilter ?? false,
      );

      if (!hisResponse.Success) {
        return {
          success: false,
          message: `Failed to get inpatient exp mest details: ${hisResponse.Param?.Messages?.join(', ') || 'Unknown error'}`,
        };
      }

      if (!hisResponse.Data || hisResponse.Data.length === 0) {
        return {
          success: true,
          data: [],
        };
      }

      // Map from UPPERCASE to camelCase (full mapping with all fields from GetView)
      const mapped = hisResponse.Data.map((item: any) => {
        const mappedItem: any = {
          id: item.ID,
          createTime: item.CREATE_TIME,
          modifyTime: item.MODIFY_TIME,
          creator: item.CREATOR || '',
          modifier: item.MODIFIER || '',
          appCreator: item.APP_CREATOR || '',
          appModifier: item.APP_MODIFIER || '',
          isActive: item.IS_ACTIVE,
          isDelete: item.IS_DELETE,
          expMestCode: item.EXP_MEST_CODE || '',
          expMestTypeId: item.EXP_MEST_TYPE_ID,
          expMestSttId: item.EXP_MEST_STT_ID,
          mediStockId: item.MEDI_STOCK_ID,
          reqLoginname: item.REQ_LOGINNAME || '',
          reqUsername: item.REQ_USERNAME || '',
          reqRoomId: item.REQ_ROOM_ID,
          reqDepartmentId: item.REQ_DEPARTMENT_ID,
          createDate: item.CREATE_DATE,
          virCreateMonth: item.VIR_CREATE_MONTH !== null && item.VIR_CREATE_MONTH !== undefined
            ? (typeof item.VIR_CREATE_MONTH === 'number' ? item.VIR_CREATE_MONTH : Number(item.VIR_CREATE_MONTH))
            : null,
          virCreateYear: (() => {
            const val = item.VIR_CREATE_YEAR;
            if (val === null || val === undefined) return null;
            if (typeof val === 'string') {
              const parsed = parseFloat(val);
              return isNaN(parsed) ? null : parsed;
            }
            if (typeof val === 'number') return val;
            const num = Number(val);
            return isNaN(num) ? null : num;
          })(),
          reqUserTitle: item.REQ_USER_TITLE || '',
          expMestSubCode: item.EXP_MEST_SUB_CODE || '',
          expMestSubCode2: item.EXP_MEST_SUB_CODE_2 || '',
          numOrder: item.NUM_ORDER,
          expMestTypeCode: item.EXP_MEST_TYPE_CODE || '',
          expMestTypeName: item.EXP_MEST_TYPE_NAME || '',
          expMestSttCode: item.EXP_MEST_STT_CODE || '',
          expMestSttName: item.EXP_MEST_STT_NAME || '',
          mediStockCode: item.MEDI_STOCK_CODE || '',
          mediStockName: item.MEDI_STOCK_NAME || '',
          reqDepartmentCode: item.REQ_DEPARTMENT_CODE || '',
          reqDepartmentName: item.REQ_DEPARTMENT_NAME || '',
        };

        // Map all optional fields if they exist in HIS response
        if (item.SERVICE_REQ_ID !== undefined) mappedItem.serviceReqId = item.SERVICE_REQ_ID;
        if (item.TDL_TOTAL_PRICE !== undefined) mappedItem.tdlTotalPrice = item.TDL_TOTAL_PRICE;
        if (item.TDL_SERVICE_REQ_CODE !== undefined) mappedItem.tdlServiceReqCode = item.TDL_SERVICE_REQ_CODE || '';
        if (item.TDL_INTRUCTION_TIME !== undefined) mappedItem.tdlIntructionTime = item.TDL_INTRUCTION_TIME;
        if (item.TDL_INTRUCTION_DATE !== undefined) mappedItem.tdlIntructionDate = item.TDL_INTRUCTION_DATE;
        if (item.TDL_TREATMENT_ID !== undefined) mappedItem.tdlTreatmentId = item.TDL_TREATMENT_ID;
        if (item.TDL_TREATMENT_CODE !== undefined) mappedItem.tdlTreatmentCode = item.TDL_TREATMENT_CODE || '';
        if (item.AGGR_EXP_MEST_ID !== undefined) mappedItem.aggrExpMestId = item.AGGR_EXP_MEST_ID;
        if (item.TDL_AGGR_EXP_MEST_CODE !== undefined) mappedItem.tdlAggrExpMestCode = item.TDL_AGGR_EXP_MEST_CODE || '';
        if (item.TDL_PATIENT_ID !== undefined) mappedItem.tdlPatientId = item.TDL_PATIENT_ID;
        if (item.TDL_PATIENT_CODE !== undefined) mappedItem.tdlPatientCode = item.TDL_PATIENT_CODE || '';
        if (item.TDL_PATIENT_NAME !== undefined) mappedItem.tdlPatientName = item.TDL_PATIENT_NAME || '';
        if (item.TDL_PATIENT_FIRST_NAME !== undefined) mappedItem.tdlPatientFirstName = item.TDL_PATIENT_FIRST_NAME || '';
        if (item.TDL_PATIENT_LAST_NAME !== undefined) mappedItem.tdlPatientLastName = item.TDL_PATIENT_LAST_NAME || '';
        if (item.TDL_PATIENT_DOB !== undefined) mappedItem.tdlPatientDob = item.TDL_PATIENT_DOB;
        if (item.TDL_PATIENT_IS_HAS_NOT_DAY_DOB !== undefined) mappedItem.tdlPatientIsHasNotDayDob = item.TDL_PATIENT_IS_HAS_NOT_DAY_DOB;
        if (item.TDL_PATIENT_ADDRESS !== undefined) mappedItem.tdlPatientAddress = item.TDL_PATIENT_ADDRESS || '';
        if (item.TDL_PATIENT_GENDER_ID !== undefined) mappedItem.tdlPatientGenderId = item.TDL_PATIENT_GENDER_ID;
        if (item.TDL_PATIENT_GENDER_NAME !== undefined) mappedItem.tdlPatientGenderName = item.TDL_PATIENT_GENDER_NAME || '';
        if (item.TDL_PATIENT_TYPE_ID !== undefined) mappedItem.tdlPatientTypeId = item.TDL_PATIENT_TYPE_ID;
        if (item.TDL_HEIN_CARD_NUMBER !== undefined) mappedItem.tdlHeinCardNumber = item.TDL_HEIN_CARD_NUMBER || '';
        if (item.TDL_PATIENT_PHONE !== undefined) mappedItem.tdlPatientPhone = item.TDL_PATIENT_PHONE || '';
        if (item.TDL_PATIENT_PROVINCE_CODE !== undefined) mappedItem.tdlPatientProvinceCode = item.TDL_PATIENT_PROVINCE_CODE || '';
        if (item.TDL_PATIENT_COMMUNE_CODE !== undefined) mappedItem.tdlPatientCommuneCode = item.TDL_PATIENT_COMMUNE_CODE || '';
        if (item.TDL_PATIENT_NATIONAL_NAME !== undefined) mappedItem.tdlPatientNationalName = item.TDL_PATIENT_NATIONAL_NAME || '';
        if (item.TDL_PATIENT_DISTRICT_CODE !== undefined) mappedItem.tdlPatientDistrictCode = item.TDL_PATIENT_DISTRICT_CODE || '';
        if (item.ICD_CODE !== undefined) mappedItem.icdCode = item.ICD_CODE || '';
        if (item.ICD_NAME !== undefined) mappedItem.icdName = item.ICD_NAME || '';
        if (item.ICD_SUB_CODE !== undefined) mappedItem.icdSubCode = item.ICD_SUB_CODE || '';
        if (item.ICD_TEXT !== undefined) mappedItem.icdText = item.ICD_TEXT || '';
        if (item.VIR_HEIN_CARD_PREFIX !== undefined) mappedItem.virHeinCardPrefix = item.VIR_HEIN_CARD_PREFIX || '';
        if (item.PRIORITY !== undefined) mappedItem.priority = item.PRIORITY;
        if (item.TREATMENT_IS_ACTIVE !== undefined) mappedItem.treatmentIsActive = item.TREATMENT_IS_ACTIVE;
        if (item.PATIENT_TYPE_NAME !== undefined) mappedItem.patientTypeName = item.PATIENT_TYPE_NAME || '';
        if (item.PATIENT_TYPE_CODE !== undefined) mappedItem.patientTypeCode = item.PATIENT_TYPE_CODE || '';
        if (item.REQ_HEAD_USERNAME !== undefined) mappedItem.reqHeadUsername = item.REQ_HEAD_USERNAME || '';
        if (item.REQ_ROOM_CODE !== undefined) mappedItem.reqRoomCode = item.REQ_ROOM_CODE || '';
        if (item.REQ_ROOM_NAME !== undefined) mappedItem.reqRoomName = item.REQ_ROOM_NAME || '';
        if (item.CURRENT_BED_IDS !== undefined) mappedItem.currentBedIds = item.CURRENT_BED_IDS || '';
        if (item.LAST_EXP_LOGINNAME !== undefined) mappedItem.lastExpLoginname = item.LAST_EXP_LOGINNAME || '';
        if (item.LAST_EXP_USERNAME !== undefined) mappedItem.lastExpUsername = item.LAST_EXP_USERNAME || '';
        if (item.LAST_EXP_TIME !== undefined) mappedItem.lastExpTime = item.LAST_EXP_TIME;
        if (item.FINISH_TIME !== undefined) mappedItem.finishTime = item.FINISH_TIME;
        if (item.FINISH_DATE !== undefined) mappedItem.finishDate = item.FINISH_DATE;
        if (item.IS_EXPORT_EQUAL_APPROVE !== undefined) mappedItem.isExportEqualApprove = item.IS_EXPORT_EQUAL_APPROVE;
        if (item.LAST_APPROVAL_LOGINNAME !== undefined) mappedItem.lastApprovalLoginname = item.LAST_APPROVAL_LOGINNAME || '';
        if (item.LAST_APPROVAL_USERNAME !== undefined) mappedItem.lastApprovalUsername = item.LAST_APPROVAL_USERNAME || '';
        if (item.LAST_APPROVAL_TIME !== undefined) mappedItem.lastApprovalTime = item.LAST_APPROVAL_TIME;
        if (item.LAST_APPROVAL_DATE !== undefined) mappedItem.lastApprovalDate = item.LAST_APPROVAL_DATE;
        if (item.TDL_AGGR_PATIENT_CODE !== undefined) mappedItem.tdlAggrPatientCode = item.TDL_AGGR_PATIENT_CODE || '';
        if (item.TDL_AGGR_TREATMENT_CODE !== undefined) mappedItem.tdlAggrTreatmentCode = item.TDL_AGGR_TREATMENT_CODE || '';
        if (item.TDL_INTRUCTION_DATE_MIN !== undefined) mappedItem.tdlIntructionDateMin = item.TDL_INTRUCTION_DATE_MIN !== null && item.TDL_INTRUCTION_DATE_MIN !== undefined
          ? Math.floor(typeof item.TDL_INTRUCTION_DATE_MIN === 'number' ? item.TDL_INTRUCTION_DATE_MIN : Number(item.TDL_INTRUCTION_DATE_MIN))
          : null;
        if (item.GROUP_CODE !== undefined) mappedItem.groupCode = item.GROUP_CODE || '';

        return mappedItem;
      });

      return {
        success: true,
        data: mapped,
      };
    } catch (error: any) {
      this.logger.error('IntegrationService#getInpatientExpMestDetails.error', {
        error: error.message,
        errorType: error.constructor?.name,
        stack: error.stack?.substring(0, 500),
      });
      return {
        success: false,
        message: error.message || 'Failed to get inpatient exp mest details',
      };
    }
  }

  /**
   * Get ExpMestMedicine list (chi tiết thuốc trong phiếu xuất) from HIS
   */
  async getExpMestMedicines(expMestId: number): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMestMedicine[];
  }> {
    return this.expMestMedicineService.getExpMestMedicines(expMestId);
  }

  /**
   * @deprecated Use expMestMedicineService.getExpMestMedicines instead
   */
  private async _getExpMestMedicines_OLD(expMestId: number): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMestMedicine[];
  }> {
    this.logger.info('IntegrationService#getExpMestMedicines.call', { expMestId });

    try {
      // Get any available external token
      const tokenData = await this.getAnyExternalToken();
      if (!tokenData?.tokenCode) {
        return {
          success: false,
          message: 'No external token available. Please login first.',
        };
      }

      // Helper function to convert Long objects to numbers
      const convertToNumber = (value: any): number | null => {
        if (value === null || value === undefined) return null;
        if (typeof value === 'object' && 'low' in value && 'high' in value) {
          const longValue = value as { low: number; high: number };
          return longValue.low + (longValue.high * 0x100000000);
        }
        if (typeof value === 'number') return value;
        const num = Number(value);
        return isNaN(num) ? null : num;
      };

      // Convert expMestId from Long object to number if needed
      const expMestIdNumber = convertToNumber(expMestId);
      if (expMestIdNumber === null) {
        return {
          success: false,
          message: 'Invalid expMestId: must be a valid number',
        };
      }

      // Call HIS API with converted number
      const hisResponse = await this.hisProvider.getExpMestMedicines(tokenData.tokenCode, expMestIdNumber);
      
      this.logger.info('IntegrationService#getExpMestMedicines.hisResponse', {
        Success: hisResponse.Success,
        hasData: !!hisResponse.Data,
        dataCount: hisResponse.Data?.length || 0,
        param: hisResponse.Param,
      });
      
      if (!hisResponse.Success) {
        this.logger.warn('IntegrationService#getExpMestMedicines.unsuccessful', {
          Success: hisResponse.Success,
          Param: hisResponse.Param,
          Messages: hisResponse.Param?.Messages,
          BugCodes: hisResponse.Param?.BugCodes,
          HasException: hisResponse.Param?.HasException,
        });
        return {
          success: false,
          message: `Failed to get exp mest medicines from HIS: ${hisResponse.Param?.Messages?.join(', ') || 'Unknown error'}`,
        };
      }
      
      // Data can be empty array, that's OK
      if (!hisResponse.Data) {
        this.logger.warn('IntegrationService#getExpMestMedicines.noDataField', {
          Success: hisResponse.Success,
          Param: hisResponse.Param,
        });
        return {
          success: true,
          data: [],
        };
      }

      // Map from UPPERCASE to camelCase
      const mapped: ExpMestMedicine[] = hisResponse.Data.map((item) => ({
        id: item.ID,
        createTime: item.CREATE_TIME,
        modifyTime: item.MODIFY_TIME,
        creator: item.CREATOR || '',
        modifier: item.MODIFIER || '',
        appCreator: item.APP_CREATOR || '',
        appModifier: item.APP_MODIFIER || '',
        isActive: item.IS_ACTIVE,
        isDelete: item.IS_DELETE,
        expMestId: item.EXP_MEST_ID,
        medicineId: item.MEDICINE_ID,
        tdlMediStockId: item.TDL_MEDI_STOCK_ID,
        tdlMedicineTypeId: item.TDL_MEDICINE_TYPE_ID,
        expMestMetyReqId: item.EXP_MEST_METY_REQ_ID,
        ckImpMestMedicineId: item.CK_IMP_MEST_MEDICINE_ID,
        isExport: item.IS_EXPORT,
        amount: item.AMOUNT || 0,
        approvalLoginname: item.APPROVAL_LOGINNAME || '',
        approvalUsername: item.APPROVAL_USERNAME || '',
        approvalTime: item.APPROVAL_TIME,
        approvalDate: item.APPROVAL_DATE,
        expLoginname: item.EXP_LOGINNAME || '',
        expUsername: item.EXP_USERNAME || '',
        expTime: item.EXP_TIME,
        expDate: item.EXP_DATE,
        expMestCode: item.EXP_MEST_CODE || '',
        mediStockId: item.MEDI_STOCK_ID,
        expMestSttId: item.EXP_MEST_STT_ID,
        impPrice: item.IMP_PRICE || 0,
        impVatRatio: item.IMP_VAT_RATIO || 0,
        bidId: item.BID_ID,
        packageNumber: item.PACKAGE_NUMBER || '',
        expiredDate: item.EXPIRED_DATE,
        medicineTypeId: item.MEDICINE_TYPE_ID,
        impTime: item.IMP_TIME,
        supplierId: item.SUPPLIER_ID,
        medicineBytNumOrder: item.MEDICINE_BYT_NUM_ORDER || '',
        medicineRegisterNumber: item.MEDICINE_REGISTER_NUMBER || '',
        activeIngrBhytCode: item.ACTIVE_INGR_BHYT_CODE || '',
        activeIngrBhytName: item.ACTIVE_INGR_BHYT_NAME || '',
        concentra: item.CONCENTRA || '',
        tdlBidGroupCode: item.TDL_BID_GROUP_CODE || '',
        tdlBidPackageCode: item.TDL_BID_PACKAGE_CODE || '',
        medicineTypeCode: item.MEDICINE_TYPE_CODE || '',
        medicineTypeName: item.MEDICINE_TYPE_NAME || '',
        serviceId: item.SERVICE_ID,
        nationalName: item.NATIONAL_NAME || '',
        manufacturerId: item.MANUFACTURER_ID,
        bytNumOrder: item.BYT_NUM_ORDER || '',
        registerNumber: item.REGISTER_NUMBER || '',
        medicineGroupId: item.MEDICINE_GROUP_ID,
        serviceUnitId: item.SERVICE_UNIT_ID,
        serviceUnitCode: item.SERVICE_UNIT_CODE || '',
        serviceUnitName: item.SERVICE_UNIT_NAME || '',
        medicineNumOrder: item.MEDICINE_NUM_ORDER || 0,
        supplierCode: item.SUPPLIER_CODE || '',
        supplierName: item.SUPPLIER_NAME || '',
        bidNumber: item.BID_NUMBER || '',
        bidName: item.BID_NAME || '',
        medicineUseFormCode: item.MEDICINE_USE_FORM_CODE || '',
        medicineUseFormName: item.MEDICINE_USE_FORM_NAME || '',
        medicineUseFormNumOrder: item.MEDICINE_USE_FORM_NUM_ORDER || 0,
        sumInStock: item.SUM_IN_STOCK ?? 0,
        sumByMedicineInStock: item.SUM_BY_MEDICINE_IN_STOCK ?? 0,
        materialNumOrder: item.MATERIAL_NUM_ORDER ?? null,
        // Price & Tax Info (Additional) - Use !== undefined && !== null to preserve 0 values
        price: item.PRICE !== undefined && item.PRICE !== null ? item.PRICE : null,
        vatRatio: item.VAT_RATIO !== undefined && item.VAT_RATIO !== null ? item.VAT_RATIO : null,
        virPrice: item.VIR_PRICE !== undefined && item.VIR_PRICE !== null ? item.VIR_PRICE : null,
        taxRatio: item.TAX_RATIO !== undefined && item.TAX_RATIO !== null ? item.TAX_RATIO : null,
        // Order & Amount Info
        numOrder: item.NUM_ORDER !== undefined && item.NUM_ORDER !== null ? item.NUM_ORDER : null,
        presAmount: item.PRES_AMOUNT !== undefined && item.PRES_AMOUNT !== null ? item.PRES_AMOUNT : null,
        // Patient & Treatment Info
        patientTypeId: item.PATIENT_TYPE_ID !== undefined && item.PATIENT_TYPE_ID !== null ? item.PATIENT_TYPE_ID : null,
        patientTypeCode: item.PATIENT_TYPE_CODE || null,
        patientTypeName: item.PATIENT_TYPE_NAME || null,
        tdlPatientId: item.TDL_PATIENT_ID !== undefined && item.TDL_PATIENT_ID !== null ? item.TDL_PATIENT_ID : null,
        tdlTreatmentId: item.TDL_TREATMENT_ID !== undefined && item.TDL_TREATMENT_ID !== null ? item.TDL_TREATMENT_ID : null,
        tdlServiceReqId: item.TDL_SERVICE_REQ_ID !== undefined && item.TDL_SERVICE_REQ_ID !== null ? item.TDL_SERVICE_REQ_ID : null,
        // Instruction & Tutorial
        useTimeTo: item.USE_TIME_TO !== undefined && item.USE_TIME_TO !== null ? item.USE_TIME_TO : null,
        tutorial: item.TUTORIAL || null,
        tdlIntructionTime: item.TDL_INTRUCTION_TIME !== undefined && item.TDL_INTRUCTION_TIME !== null ? item.TDL_INTRUCTION_TIME : null,
        tdlIntructionDate: item.TDL_INTRUCTION_DATE !== undefined && item.TDL_INTRUCTION_DATE !== null ? item.TDL_INTRUCTION_DATE : null,
        htuText: item.HTU_TEXT || null,
        // Dosage Info
        morning: item.MORNING || null,
        evening: item.EVENING || null,
        // ExpMest Denormalized Info (Additional)
        expMestTypeId: item.EXP_MEST_TYPE_ID !== undefined && item.EXP_MEST_TYPE_ID !== null ? item.EXP_MEST_TYPE_ID : null,
        tdlAggrExpMestId: item.TDL_AGGR_EXP_MEST_ID !== undefined && item.TDL_AGGR_EXP_MEST_ID !== null ? item.TDL_AGGR_EXP_MEST_ID : null,
        aggrExpMestId: item.AGGR_EXP_MEST_ID !== undefined && item.AGGR_EXP_MEST_ID !== null ? item.AGGR_EXP_MEST_ID : null,
        reqRoomId: item.REQ_ROOM_ID !== undefined && item.REQ_ROOM_ID !== null ? item.REQ_ROOM_ID : null,
        reqDepartmentId: item.REQ_DEPARTMENT_ID !== undefined && item.REQ_DEPARTMENT_ID !== null ? item.REQ_DEPARTMENT_ID : null,
        reqUserTitle: item.REQ_USER_TITLE || null,
        reqLoginname: item.REQ_LOGINNAME || null,
        reqUsername: item.REQ_USERNAME || null,
        // Medicine Group & Use Form (Additional)
        medicineUseFormId: item.MEDICINE_USE_FORM_ID !== undefined && item.MEDICINE_USE_FORM_ID !== null ? item.MEDICINE_USE_FORM_ID : null,
        medicineLineId: item.MEDICINE_LINE_ID !== undefined && item.MEDICINE_LINE_ID !== null ? item.MEDICINE_LINE_ID : null,
        medicineGroupCode: item.MEDICINE_GROUP_CODE || null,
        medicineGroupName: item.MEDICINE_GROUP_NAME || null,
        medicineGroupNumOrder: item.MEDICINE_GROUP_NUM_ORDER !== undefined && item.MEDICINE_GROUP_NUM_ORDER !== null ? item.MEDICINE_GROUP_NUM_ORDER : null,
        // Manufacturer & Stock Info (Additional)
        manufacturerCode: item.MANUFACTURER_CODE || null,
        manufacturerName: item.MANUFACTURER_NAME || null,
        mediStockCode: item.MEDI_STOCK_CODE || null,
        mediStockName: item.MEDI_STOCK_NAME || null,
      }));

      this.logger.info('IntegrationService#getExpMestMedicines.success', {
        dataCount: mapped.length,
        expMestId,
      });

      return {
        success: true,
        data: mapped,
      };
    } catch (error: any) {
      this.logger.error('IntegrationService#getExpMestMedicines.error', {
        error: error.message,
        errorType: error.constructor?.name,
        stack: error.stack?.substring(0, 500),
        expMestId,
      });
      return {
        success: false,
        message: error.message || 'Failed to get exp mest medicines',
      };
    }
  }

  /**
   * Get ExpMestMedicine list by multiple EXP_MEST_IDs from HIS
   */
  async getExpMestMedicinesByIds(
    expMestIds: number[],
    includeDeleted: boolean = false,
    dataDomainFilter: boolean = false
  ): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMestMedicine[];
  }> {
    return this.expMestMedicineService.getExpMestMedicinesByIds(expMestIds, includeDeleted, dataDomainFilter);
  }

  /**
   * @deprecated Use expMestMedicineService.getExpMestMedicinesByIds instead
   */
  private async _getExpMestMedicinesByIds_OLD(
    expMestIds: number[],
    includeDeleted: boolean = false,
    dataDomainFilter: boolean = false
  ): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMestMedicine[];
  }> {
    this.logger.info('IntegrationService#getExpMestMedicinesByIds.call', { 
      expMestIdsCount: expMestIds?.length || 0,
      includeDeleted,
      dataDomainFilter,
    });

    try {
      if (!expMestIds || expMestIds.length === 0) {
        return {
          success: true,
          data: [],
        };
      }

      // Get any available external token
      const tokenData = await this.getAnyExternalToken();
      if (!tokenData?.tokenCode) {
        return {
          success: false,
          message: 'No external token available. Please login first.',
        };
      }

      // Helper function to convert Long objects to numbers
      const convertToNumber = (value: any): number | null => {
        if (value === null || value === undefined) return null;
        if (typeof value === 'object' && 'low' in value && 'high' in value) {
          const longValue = value as { low: number; high: number };
          return longValue.low + (longValue.high * 0x100000000);
        }
        if (typeof value === 'number') return value;
        const num = Number(value);
        return isNaN(num) ? null : num;
      };

      // Convert all expMestIds to numbers
      const expMestIdsNumbers = expMestIds
        .map(id => convertToNumber(id))
        .filter((id): id is number => id !== null);

      if (expMestIdsNumbers.length === 0) {
        return {
          success: false,
          message: 'Invalid expMestIds: must contain at least one valid number',
        };
      }

      // Call HIS API with array of IDs
      const hisResponse = await this.hisProvider.getExpMestMedicinesByIds(
        tokenData.tokenCode,
        expMestIdsNumbers,
        includeDeleted,
        dataDomainFilter
      );

      if (!hisResponse.Success) {
        return {
          success: false,
          message: `Failed to get exp mest medicines: ${hisResponse.Param?.Messages?.join(', ') || 'Unknown error'}`,
        };
      }

      if (!hisResponse.Data || hisResponse.Data.length === 0) {
        return {
          success: true,
          data: [],
        };
      }

      // Map from UPPERCASE to camelCase (same mapping as getExpMestMedicines)
      const mapped: ExpMestMedicine[] = hisResponse.Data.map((item) => {
        return {
        id: item.ID,
        createTime: item.CREATE_TIME,
        modifyTime: item.MODIFY_TIME,
        creator: item.CREATOR || '',
        modifier: item.MODIFIER || '',
        appCreator: item.APP_CREATOR || '',
        appModifier: item.APP_MODIFIER || '',
        isActive: item.IS_ACTIVE,
        isDelete: item.IS_DELETE,
        expMestId: item.EXP_MEST_ID,
        medicineId: item.MEDICINE_ID,
        tdlMediStockId: item.TDL_MEDI_STOCK_ID,
        tdlMedicineTypeId: item.TDL_MEDICINE_TYPE_ID,
        expMestMetyReqId: item.EXP_MEST_METY_REQ_ID,
        ckImpMestMedicineId: item.CK_IMP_MEST_MEDICINE_ID,
        isExport: item.IS_EXPORT,
        amount: item.AMOUNT || 0,
        approvalLoginname: item.APPROVAL_LOGINNAME || '',
        approvalUsername: item.APPROVAL_USERNAME || '',
        approvalTime: item.APPROVAL_TIME,
        approvalDate: item.APPROVAL_DATE,
        expLoginname: item.EXP_LOGINNAME || '',
        expUsername: item.EXP_USERNAME || '',
        expTime: item.EXP_TIME,
        expDate: item.EXP_DATE,
        expMestCode: item.EXP_MEST_CODE || '',
        mediStockId: item.MEDI_STOCK_ID,
        expMestSttId: item.EXP_MEST_STT_ID,
        impPrice: item.IMP_PRICE || 0,
        impVatRatio: item.IMP_VAT_RATIO || 0,
        bidId: item.BID_ID,
        packageNumber: item.PACKAGE_NUMBER || '',
        expiredDate: item.EXPIRED_DATE,
        medicineTypeId: item.MEDICINE_TYPE_ID,
        impTime: item.IMP_TIME,
        supplierId: item.SUPPLIER_ID,
        medicineBytNumOrder: item.MEDICINE_BYT_NUM_ORDER || '',
        medicineRegisterNumber: item.MEDICINE_REGISTER_NUMBER || '',
        activeIngrBhytCode: item.ACTIVE_INGR_BHYT_CODE || '',
        activeIngrBhytName: item.ACTIVE_INGR_BHYT_NAME || '',
        concentra: item.CONCENTRA || '',
        tdlBidGroupCode: item.TDL_BID_GROUP_CODE || '',
        tdlBidPackageCode: item.TDL_BID_PACKAGE_CODE || '',
        medicineTypeCode: item.MEDICINE_TYPE_CODE || '',
        medicineTypeName: item.MEDICINE_TYPE_NAME || '',
        serviceId: item.SERVICE_ID,
        nationalName: item.NATIONAL_NAME || '',
        manufacturerId: item.MANUFACTURER_ID,
        bytNumOrder: item.BYT_NUM_ORDER || '',
        registerNumber: item.REGISTER_NUMBER || '',
        medicineGroupId: item.MEDICINE_GROUP_ID,
        serviceUnitId: item.SERVICE_UNIT_ID,
        serviceUnitCode: item.SERVICE_UNIT_CODE || '',
        serviceUnitName: item.SERVICE_UNIT_NAME || '',
        medicineNumOrder: item.MEDICINE_NUM_ORDER || 0,
        supplierCode: item.SUPPLIER_CODE || '',
        supplierName: item.SUPPLIER_NAME || '',
        bidNumber: item.BID_NUMBER || '',
        bidName: item.BID_NAME || '',
        medicineUseFormCode: item.MEDICINE_USE_FORM_CODE || '',
        medicineUseFormName: item.MEDICINE_USE_FORM_NAME || '',
        medicineUseFormNumOrder: item.MEDICINE_USE_FORM_NUM_ORDER || 0,
        sumInStock: item.SUM_IN_STOCK ?? 0,
        sumByMedicineInStock: item.SUM_BY_MEDICINE_IN_STOCK ?? 0,
        materialNumOrder: item.MATERIAL_NUM_ORDER ?? null,
        // Price & Tax Info (Additional) - Use !== undefined && !== null to preserve 0 values
        price: item.PRICE !== undefined && item.PRICE !== null ? item.PRICE : null,
        vatRatio: item.VAT_RATIO !== undefined && item.VAT_RATIO !== null ? item.VAT_RATIO : null,
        virPrice: item.VIR_PRICE !== undefined && item.VIR_PRICE !== null ? item.VIR_PRICE : null,
        taxRatio: item.TAX_RATIO !== undefined && item.TAX_RATIO !== null ? item.TAX_RATIO : null,
        // Order & Amount Info
        numOrder: item.NUM_ORDER !== undefined && item.NUM_ORDER !== null ? item.NUM_ORDER : null,
        presAmount: item.PRES_AMOUNT !== undefined && item.PRES_AMOUNT !== null ? item.PRES_AMOUNT : null,
        // Patient & Treatment Info
        patientTypeId: item.PATIENT_TYPE_ID !== undefined && item.PATIENT_TYPE_ID !== null ? item.PATIENT_TYPE_ID : null,
        patientTypeCode: item.PATIENT_TYPE_CODE || null,
        patientTypeName: item.PATIENT_TYPE_NAME || null,
        tdlPatientId: item.TDL_PATIENT_ID !== undefined && item.TDL_PATIENT_ID !== null ? item.TDL_PATIENT_ID : null,
        tdlTreatmentId: item.TDL_TREATMENT_ID !== undefined && item.TDL_TREATMENT_ID !== null ? item.TDL_TREATMENT_ID : null,
        tdlServiceReqId: item.TDL_SERVICE_REQ_ID !== undefined && item.TDL_SERVICE_REQ_ID !== null ? item.TDL_SERVICE_REQ_ID : null,
        // Instruction & Tutorial
        useTimeTo: item.USE_TIME_TO !== undefined && item.USE_TIME_TO !== null ? item.USE_TIME_TO : null,
        tutorial: item.TUTORIAL || null,
        tdlIntructionTime: item.TDL_INTRUCTION_TIME !== undefined && item.TDL_INTRUCTION_TIME !== null ? item.TDL_INTRUCTION_TIME : null,
        tdlIntructionDate: item.TDL_INTRUCTION_DATE !== undefined && item.TDL_INTRUCTION_DATE !== null ? item.TDL_INTRUCTION_DATE : null,
        htuText: item.HTU_TEXT || null,
        // Dosage Info
        morning: item.MORNING || null,
        evening: item.EVENING || null,
        // ExpMest Denormalized Info (Additional)
        expMestTypeId: item.EXP_MEST_TYPE_ID !== undefined && item.EXP_MEST_TYPE_ID !== null ? item.EXP_MEST_TYPE_ID : null,
        tdlAggrExpMestId: item.TDL_AGGR_EXP_MEST_ID !== undefined && item.TDL_AGGR_EXP_MEST_ID !== null ? item.TDL_AGGR_EXP_MEST_ID : null,
        aggrExpMestId: item.AGGR_EXP_MEST_ID !== undefined && item.AGGR_EXP_MEST_ID !== null ? item.AGGR_EXP_MEST_ID : null,
        reqRoomId: item.REQ_ROOM_ID !== undefined && item.REQ_ROOM_ID !== null ? item.REQ_ROOM_ID : null,
        reqDepartmentId: item.REQ_DEPARTMENT_ID !== undefined && item.REQ_DEPARTMENT_ID !== null ? item.REQ_DEPARTMENT_ID : null,
        reqUserTitle: item.REQ_USER_TITLE || null,
        reqLoginname: item.REQ_LOGINNAME || null,
        reqUsername: item.REQ_USERNAME || null,
        // Medicine Group & Use Form (Additional)
        medicineUseFormId: item.MEDICINE_USE_FORM_ID !== undefined && item.MEDICINE_USE_FORM_ID !== null ? item.MEDICINE_USE_FORM_ID : null,
        medicineLineId: item.MEDICINE_LINE_ID !== undefined && item.MEDICINE_LINE_ID !== null ? item.MEDICINE_LINE_ID : null,
        medicineGroupCode: item.MEDICINE_GROUP_CODE || null,
        medicineGroupName: item.MEDICINE_GROUP_NAME || null,
        medicineGroupNumOrder: item.MEDICINE_GROUP_NUM_ORDER !== undefined && item.MEDICINE_GROUP_NUM_ORDER !== null ? item.MEDICINE_GROUP_NUM_ORDER : null,
        // Manufacturer & Stock Info (Additional)
        manufacturerCode: item.MANUFACTURER_CODE || null,
        manufacturerName: item.MANUFACTURER_NAME || null,
        mediStockCode: item.MEDI_STOCK_CODE || null,
        mediStockName: item.MEDI_STOCK_NAME || null,
        };
      });

      this.logger.info('IntegrationService#getExpMestMedicinesByIds.success', {
        dataCount: mapped.length,
        expMestIdsCount: expMestIdsNumbers.length,
      });

      return {
        success: true,
        data: mapped,
      };
    } catch (error: any) {
      this.logger.error('IntegrationService#getExpMestMedicinesByIds.error', {
        error: error.message,
        errorType: error.constructor?.name,
        stack: error.stack?.substring(0, 500),
        expMestIdsCount: expMestIds?.length || 0,
      });
      return {
        success: false,
        message: error.message || 'Failed to get exp mest medicines by IDs',
      };
    }
  }

  /**
   * Helper: Get any available external token from Redis
   * @deprecated Use authTokenService.getAnyExternalToken instead
   */
  private async getAnyExternalToken(): Promise<{
    tokenCode?: string;
    renewCode?: string;
    expireTime?: string;
    loginTime?: string;
  } | null> {
    return this.authTokenService.getAnyExternalToken();
  }
}

