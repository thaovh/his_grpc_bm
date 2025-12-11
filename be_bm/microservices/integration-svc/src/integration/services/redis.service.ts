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
}

