import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { HisProvider } from '../../providers/his.provider';
import { RedisService } from '../redis.service';
import { AuthTokenService } from '../auth/auth-token.service';
import { MediStock } from '../../integration.interface';

@Injectable()
export class MediStockService {
  constructor(
    private readonly hisProvider: HisProvider,
    private readonly redisService: RedisService,
    private readonly authTokenService: AuthTokenService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(MediStockService.name);
  }

  async getMediStockByRoomId(roomId: number): Promise<{
    success: boolean;
    message?: string;
    id?: number | null;
    data?: MediStock | null;
  }> {
    this.logger.info('MediStockService#getMediStockByRoomId.call', { roomId });

    try {
      // 1. Check cached id
      const cachedId = await this.redisService.getMediStockIdByRoomId(roomId);
      if (cachedId !== null && cachedId !== undefined) {
        const cachedList = await this.redisService.getMediStocks();
        const found = cachedList?.find(ms => Number(ms.roomId) === Number(roomId)) || null;
        this.logger.info('MediStockService#getMediStockByRoomId.cacheHit', { roomId, id: cachedId });
        return {
          success: true,
          id: cachedId,
          data: found,
        };
      }

      this.logger.info('MediStockService#getMediStockByRoomId.cacheMiss', { roomId });

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
      this.logger.error('MediStockService#getMediStockByRoomId.error', {
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
    this.logger.info('MediStockService#reloadMediStock.call');

    try {
      // Clear cache
      await this.redisService.deleteMediStocks();
      await this.redisService.deleteMediStockRoomMap();

      // Pick any external token from cache
      const tokenData = await this.authTokenService.getAnyExternalToken();
      if (!tokenData?.tokenCode) {
        this.logger.warn('MediStockService#reloadMediStock.noTokenAvailable');
        return { success: false, message: 'No external token available. Please login first.' };
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

      this.logger.info('MediStockService#reloadMediStock.success', {
        count: mapped.length,
        mapCount: Object.keys(map).length,
      });

      return {
        success: true,
        count: mapped.length,
        message: 'Reload medi stock cache successfully',
      };
    } catch (error: any) {
      this.logger.error('MediStockService#reloadMediStock.error', {
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
}

