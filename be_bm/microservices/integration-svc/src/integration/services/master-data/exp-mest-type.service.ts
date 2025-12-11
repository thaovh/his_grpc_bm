import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { HisProvider } from '../../providers/his.provider';
import { RedisService } from '../redis.service';
import { AuthTokenService } from '../auth/auth-token.service';
import { ExpMestType } from '../../integration.interface';
import { LongConverter } from '../../utils/long-converter.util';

@Injectable()
export class ExpMestTypeService {
  constructor(
    private readonly hisProvider: HisProvider,
    private readonly redisService: RedisService,
    private readonly authTokenService: AuthTokenService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ExpMestTypeService.name);
  }

  /**
   * Get ExpMestType (cached, reload if empty)
   */
  async getExpMestType(): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMestType[];
  }> {
    this.logger.info('ExpMestTypeService#getExpMestType.call');
    try {
      const cached = await this.redisService.getExpMestType();
      if (cached && cached.length > 0) {
        this.logger.info('ExpMestTypeService#getExpMestType.cacheHit', { count: cached.length });
        const data = cached.map((t: any) => this.convertExpMestTypeNumberFields(t));
        return { success: true, data };
      }

      this.logger.info('ExpMestTypeService#getExpMestType.cacheMiss');
      const reloadResult = await this.reloadExpMestType();
      if (!reloadResult.success) {
        return { success: false, message: reloadResult.message || 'Failed to reload exp mest type cache' };
      }
      const after = await this.redisService.getExpMestType();
      const data = after?.map((t: any) => this.convertExpMestTypeNumberFields(t)) || [];
      return { success: true, data };
    } catch (error: any) {
      this.logger.error('ExpMestTypeService#getExpMestType.error', {
        error: error.message,
        errorType: error.constructor?.name,
        stack: error.stack?.substring(0, 500),
      });
      return { success: false, message: error.message || 'Failed to get exp mest type' };
    }
  }

  /**
   * Reload ExpMestType cache from HIS
   */
  async reloadExpMestType(): Promise<{
    success: boolean;
    message?: string;
    count?: number;
  }> {
    this.logger.info('ExpMestTypeService#reloadExpMestType.call');
    try {
      // Clear cache
      await this.redisService.deleteExpMestType();

      // Choose any external token
      const tokenData = await this.authTokenService.getAnyExternalToken();
      if (!tokenData?.tokenCode) {
        return { success: false, message: 'No external token available. Please login first.' };
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

      this.logger.info('ExpMestTypeService#reloadExpMestType.success', {
        count: mapped.length,
      });

      return { success: true, count: mapped.length, message: 'Reload exp mest type cache successfully' };
    } catch (error: any) {
      this.logger.error('ExpMestTypeService#reloadExpMestType.error', {
        error: error.message,
        errorType: error.constructor?.name,
        stack: error.stack?.substring(0, 500),
      });
      return { success: false, message: error.message || 'Failed to reload exp mest type cache' };
    }
  }

  private convertExpMestTypeNumberFields(t: any): any {
    const convert = (v: any) => {
      if (v === null || v === undefined) return null;
      if (typeof v === 'object' && 'low' in v && 'high' in v) {
        const lv = v as { low: number; high: number };
        return lv.low + lv.high * 0x100000000;
      }
      return typeof v === 'number' ? v : Number(v);
    };
    const copy = { ...t };
    ['id', 'createTime', 'modifyTime'].forEach(f => {
      if (copy[f] !== undefined) copy[f] = convert(copy[f]);
    });
    return copy;
  }
}

