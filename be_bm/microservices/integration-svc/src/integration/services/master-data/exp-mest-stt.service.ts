import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { HisProvider } from '../../providers/his.provider';
import { RedisService } from '../redis.service';
import { AuthTokenService } from '../auth/auth-token.service';
import { ExpMestStt } from '../../integration.interface';
import { LongConverter } from '../../utils/long-converter.util';

@Injectable()
export class ExpMestSttService {
  constructor(
    private readonly hisProvider: HisProvider,
    private readonly redisService: RedisService,
    private readonly authTokenService: AuthTokenService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ExpMestSttService.name);
  }

  /**
   * Get ExpMestStt (cached, reload if empty)
   */
  async getExpMestStt(): Promise<{
    success: boolean;
    message?: string;
    data?: ExpMestStt[];
  }> {
    this.logger.info('ExpMestSttService#getExpMestStt.call');
    try {
      // 1. Try cache
      const cached = await this.redisService.getExpMestStt();
      if (cached && cached.length > 0) {
        this.logger.info('ExpMestSttService#getExpMestStt.cacheHit', { count: cached.length });
        // Convert numeric fields and map legacy keys
        const data = cached.map((s: any) => {
          const converted = this.convertExpMestSttNumberFields(s);
          // Handle legacy cache structure
          if (!converted.code && converted.expMestSttCode) converted.code = converted.expMestSttCode;
          if (!converted.name && converted.expMestSttName) converted.name = converted.expMestSttName;
          return converted;
        });
        return { success: true, data };
      }

      this.logger.info('ExpMestSttService#getExpMestStt.cacheMiss');
      const reloadResult = await this.reloadExpMestStt();
      if (!reloadResult.success) {
        return { success: false, message: reloadResult.message || 'Failed to reload exp mest status cache' };
      }
      const after = await this.redisService.getExpMestStt();
      const data = after?.map((s: any) => this.convertExpMestSttNumberFields(s)) || [];
      return { success: true, data };
    } catch (error: any) {
      this.logger.error('ExpMestSttService#getExpMestStt.error', {
        error: error.message,
        errorType: error.constructor?.name,
        stack: error.stack?.substring(0, 500),
      });
      return { success: false, message: error.message || 'Failed to get exp mest status' };
    }
  }

  async reloadExpMestStt(): Promise<{
    success: boolean;
    message?: string;
    count?: number;
  }> {
    this.logger.info('ExpMestSttService#reloadExpMestStt.call');
    try {
      // Clear cache
      await this.redisService.deleteExpMestStt();

      // Choose any external token
      const tokenData = await this.authTokenService.getAnyExternalToken();
      if (!tokenData?.tokenCode) {
        return { success: false, message: 'No external token available. Please login first.' };
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
        code: s.EXP_MEST_STT_CODE,
        name: s.EXP_MEST_STT_NAME,
      }));

      await this.redisService.setExpMestStt(mapped, 86400);

      this.logger.info('ExpMestSttService#reloadExpMestStt.success', {
        count: mapped.length,
      });

      return { success: true, count: mapped.length, message: 'Reload exp mest status cache successfully' };
    } catch (error: any) {
      this.logger.error('ExpMestSttService#reloadExpMestStt.error', {
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
}

