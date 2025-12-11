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
    keyword?: string;
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
   * Get ExpMest Cabinet Replenishment list
   */
  async getExpMestCabinets(request: any): Promise<{
    success: boolean;
    message?: string;
    data?: any[];
  }> {
    return this.expMestService.getExpMestCabinets(request);
  }


  /**
   * Get ExpMest by ID from HIS
   */
  async getExpMestById(request: {
    expMestId: number;
    includeDeleted?: boolean;
    dataDomainFilter?: boolean;
    userId?: string;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMest | null;
  }> {
    return this.expMestService.getExpMestById(request);
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
   * Get ExpMestMedicine list (chi tiết thuốc trong phiếu xuất) from HIS
   */
  async getExpMestMedicines(expMestId: number, userId?: string): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMestMedicine[];
  }> {
    return this.expMestMedicineService.getExpMestMedicines(expMestId, userId);
  }


  /**
   * Get ExpMestMedicine list by multiple EXP_MEST_IDs from HIS
   */
  async getExpMestMedicinesByIds(
    expMestIds: number[],
    includeDeleted: boolean = false,
    dataDomainFilter: boolean = false,
    userId?: string
  ): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMestMedicine[];
  }> {
    return this.expMestMedicineService.getExpMestMedicinesByIds(expMestIds, includeDeleted, dataDomainFilter, userId);
  }
}

