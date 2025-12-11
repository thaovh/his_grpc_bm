import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { Redis } from 'ioredis';

export interface TokenData {
  tokenCode: string;
  renewCode: string;
  expireTime: string;
  loginTime: string;
}

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly redisClient: Redis;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(RedisService.name);

    const redisHost = 
      this.configService.get('REDIS_HOST') || 
      process.env.REDIS_HOST || 
      'localhost';
    
    const redisPort = 
      parseInt(this.configService.get('REDIS_PORT') || process.env.REDIS_PORT || '6379', 10);
    
    const redisPassword = 
      this.configService.get('REDIS_PASSWORD') || 
      process.env.REDIS_PASSWORD || 
      undefined;

    const redisDb = 
      parseInt(this.configService.get('REDIS_DB') || process.env.REDIS_DB || '0', 10);

    this.redisClient = new Redis({
      host: redisHost,
      port: redisPort,
      password: redisPassword || undefined, // Only set password if provided
      db: redisDb,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
      connectTimeout: 10000, // 10 seconds
      lazyConnect: false, // Connect immediately
    });

    this.redisClient.on('error', (error) => {
      this.logger.error('RedisService#error', { error: error.message });
    });

    this.redisClient.on('connect', () => {
      this.logger.info('RedisService#connected', { host: redisHost, port: redisPort });
    });

    this.redisClient.on('ready', () => {
      this.logger.info('RedisService#ready');
    });
  }

  onModuleInit() {
    // Connection is already established in constructor
  }

  onModuleDestroy() {
    this.redisClient.disconnect();
  }

  /**
   * Store external token in Redis
   * Key format: external_token:{userId}
   */
  async setExternalToken(userId: string, tokenData: TokenData, ttlSeconds?: number): Promise<void> {
    const key = `external_token:${userId}`;
    const value = JSON.stringify(tokenData);
    
    let ttl = ttlSeconds;
    
    if (!ttl) {
      // Calculate TTL from expireTime
      try {
        const expireDate = new Date(tokenData.expireTime);
        const now = new Date();
        ttl = Math.floor((expireDate.getTime() - now.getTime()) / 1000);
        
        // If TTL is negative or too large, set a default
        if (ttl <= 0) {
          ttl = 86400; // 1 day default
        } else if (ttl > 31536000) {
          // More than 1 year, cap at 1 year
          ttl = 31536000;
        }
      } catch (error) {
        this.logger.warn('RedisService#setExternalToken.invalidExpireTime', {
          expireTime: tokenData.expireTime,
          error: error.message,
        });
        ttl = 86400; // 1 day default
      }
    }
    
    if (ttl > 0) {
      await this.redisClient.setex(key, ttl, value);
      this.logger.info('RedisService#setExternalToken', { 
        userId, 
        key,
        ttl,
      });
    } else {
      await this.redisClient.set(key, value);
      this.logger.info('RedisService#setExternalToken.noTTL', { userId, key });
    }
  }

  /**
   * Get external token from Redis
   */
  async getExternalToken(userId: string): Promise<TokenData | null> {
    const key = `external_token:${userId}`;
    
    try {
      const value = await this.redisClient.get(key);
      
      if (!value) {
        this.logger.debug('RedisService#getExternalToken.notFound', { userId, key });
        return null;
      }

      const tokenData = JSON.parse(value) as TokenData;
      this.logger.debug('RedisService#getExternalToken.found', { userId, key });
      return tokenData;
    } catch (error) {
      this.logger.error('RedisService#getExternalToken.error', {
        userId,
        key,
        error: error.message,
      });
      return null;
    }
  }

  /**
   * Delete external token from Redis
   */
  async deleteExternalToken(userId: string): Promise<void> {
    const key = `external_token:${userId}`;
    const result = await this.redisClient.del(key);
    this.logger.info('RedisService#deleteExternalToken', { 
      userId, 
      key,
      deleted: result > 0,
    });
  }

  /**
   * Check if token exists in Redis
   */
  async hasExternalToken(userId: string): Promise<boolean> {
    const key = `external_token:${userId}`;
    const exists = await this.redisClient.exists(key);
    return exists === 1;
  }

  /**
   * Scan keys with pattern
   */
  async scanKeys(pattern: string, count: number = 100): Promise<string[]> {
    const keys: string[] = [];
    let cursor = '0';
    do {
      const [newCursor, batch] = await this.redisClient.scan(cursor, 'MATCH', pattern, 'COUNT', count);
      cursor = newCursor;
      if (batch && batch.length > 0) {
        keys.push(...batch);
      }
    } while (cursor !== '0');
    return keys;
  }

  /**
   * Get external token by redis key (external_token:{userId})
   */
  async getExternalTokenByKey(key: string): Promise<TokenData | null> {
    try {
      const value = await this.redisClient.get(key);
      if (!value) return null;
      return JSON.parse(value) as TokenData;
    } catch (error: any) {
      this.logger.error('RedisService#getExternalTokenByKey.error', { key, error: error.message });
      return null;
    }
  }

  /**
   * Store user rooms in Redis
   * Key format: user_rooms:{userId}
   * TTL: 1 day (86400 seconds)
   */
  async setUserRooms(userId: string, rooms: any[], ttlSeconds: number = 86400): Promise<void> {
    const key = `user_rooms:${userId}`;
    const value = JSON.stringify(rooms);
    
    await this.redisClient.setex(key, ttlSeconds, value);
    this.logger.info('RedisService#setUserRooms', { 
      userId, 
      key,
      roomCount: rooms.length,
      ttl: ttlSeconds,
    });
  }

  /**
   * Get user rooms from Redis
   */
  async getUserRooms(userId: string): Promise<any[] | null> {
    const key = `user_rooms:${userId}`;
    
    try {
      const value = await this.redisClient.get(key);
      
      if (!value) {
        this.logger.debug('RedisService#getUserRooms.notFound', { userId, key });
        return null;
      }

      const rooms = JSON.parse(value) as any[];
      this.logger.debug('RedisService#getUserRooms.found', { 
        userId, 
        key,
        roomCount: rooms.length,
      });
      return rooms;
    } catch (error) {
      this.logger.error('RedisService#getUserRooms.error', {
        userId,
        key,
        error: error.message,
      });
      return null;
    }
  }

  /**
   * Delete user rooms from Redis
   */
  async deleteUserRooms(userId: string): Promise<void> {
    const key = `user_rooms:${userId}`;
    const result = await this.redisClient.del(key);
    this.logger.info('RedisService#deleteUserRooms', { 
      userId, 
      key,
      deleted: result > 0,
    });
  }

  /**
   * Store medi stocks list in Redis
   * Key: his_medi_stock:list
   */
  async setMediStocks(stocks: any[], ttlSeconds: number = 86400): Promise<void> {
    const key = 'his_medi_stock:list';
    const value = JSON.stringify(stocks);
    await this.redisClient.setex(key, ttlSeconds, value);
    this.logger.info('RedisService#setMediStocks', { key, ttl: ttlSeconds, count: stocks.length });
  }

  /**
   * Get medi stocks list from Redis
   */
  async getMediStocks(): Promise<any[] | null> {
    const key = 'his_medi_stock:list';
    try {
      const value = await this.redisClient.get(key);
      if (!value) {
        this.logger.debug('RedisService#getMediStocks.notFound', { key });
        return null;
      }
      const data = JSON.parse(value) as any[];
      this.logger.debug('RedisService#getMediStocks.found', { key, count: data.length });
      return data;
    } catch (error: any) {
      this.logger.error('RedisService#getMediStocks.error', { key, error: error.message });
      return null;
    }
  }

  /**
   * Delete medi stocks list from Redis
   */
  async deleteMediStocks(): Promise<void> {
    const key = 'his_medi_stock:list';
    const result = await this.redisClient.del(key);
    this.logger.info('RedisService#deleteMediStocks', { key, deleted: result > 0 });
  }

  /**
   * Store medi stock map by roomId for quick lookup
   * Key: his_medi_stock:by_room_id (hash: roomId -> mediStockId)
   */
  async setMediStockRoomMap(map: Record<string, number>, ttlSeconds: number = 86400): Promise<void> {
    const key = 'his_medi_stock:by_room_id';
    if (Object.keys(map).length > 0) {
      await this.redisClient.hset(key, map);
      await this.redisClient.expire(key, ttlSeconds);
      this.logger.info('RedisService#setMediStockRoomMap', { key, count: Object.keys(map).length, ttl: ttlSeconds });
    }
  }

  /**
   * Get mediStockId by roomId from hash
   */
  async getMediStockIdByRoomId(roomId: number | string): Promise<number | null> {
    const key = 'his_medi_stock:by_room_id';
    const value = await this.redisClient.hget(key, String(roomId));
    if (value === null || value === undefined) {
      this.logger.debug('RedisService#getMediStockIdByRoomId.notFound', { key, roomId });
      return null;
    }
    const num = Number(value);
    return Number.isNaN(num) ? null : num;
  }

  /**
   * Delete medi stock room map
   */
  async deleteMediStockRoomMap(): Promise<void> {
    const key = 'his_medi_stock:by_room_id';
    const result = await this.redisClient.del(key);
    this.logger.info('RedisService#deleteMediStockRoomMap', { key, deleted: result > 0 });
  }

  /**
   * Store exp mest status list in Redis
   * Key: his_exp_mest_stt:list
   */
  async setExpMestStt(list: any[], ttlSeconds: number = 86400): Promise<void> {
    const key = 'his_exp_mest_stt:list';
    const value = JSON.stringify(list);
    await this.redisClient.setex(key, ttlSeconds, value);
    this.logger.info('RedisService#setExpMestStt', { key, ttl: ttlSeconds, count: list.length });
  }

  /**
   * Get exp mest status list from Redis
   */
  async getExpMestStt(): Promise<any[] | null> {
    const key = 'his_exp_mest_stt:list';
    try {
      const value = await this.redisClient.get(key);
      if (!value) {
        this.logger.debug('RedisService#getExpMestStt.notFound', { key });
        return null;
      }
      const data = JSON.parse(value) as any[];
      this.logger.debug('RedisService#getExpMestStt.found', { key, count: data.length });
      return data;
    } catch (error: any) {
      this.logger.error('RedisService#getExpMestStt.error', { key, error: error.message });
      return null;
    }
  }

  /**
   * Delete exp mest status list from Redis
   */
  async deleteExpMestStt(): Promise<void> {
    const key = 'his_exp_mest_stt:list';
    const result = await this.redisClient.del(key);
    this.logger.info('RedisService#deleteExpMestStt', { key, deleted: result > 0 });
  }

  /**
   * Store exp mest type list in Redis
   * Key: his_exp_mest_type:list
   */
  async setExpMestType(list: any[], ttlSeconds: number = 86400): Promise<void> {
    const key = 'his_exp_mest_type:list';
    const value = JSON.stringify(list);
    await this.redisClient.setex(key, ttlSeconds, value);
    this.logger.info('RedisService#setExpMestType', { key, ttl: ttlSeconds, count: list.length });
  }

  /**
   * Get exp mest type list from Redis
   */
  async getExpMestType(): Promise<any[] | null> {
    const key = 'his_exp_mest_type:list';
    try {
      const value = await this.redisClient.get(key);
      if (!value) {
        this.logger.debug('RedisService#getExpMestType.notFound', { key });
        return null;
      }
      const data = JSON.parse(value) as any[];
      this.logger.debug('RedisService#getExpMestType.found', { key, count: data.length });
      return data;
    } catch (error: any) {
      this.logger.error('RedisService#getExpMestType.error', { key, error: error.message });
      return null;
    }
  }

  /**
   * Delete exp mest type list from Redis
   */
  async deleteExpMestType(): Promise<void> {
    const key = 'his_exp_mest_type:list';
    const result = await this.redisClient.del(key);
    this.logger.info('RedisService#deleteExpMestType', { key, deleted: result > 0 });
  }
}

