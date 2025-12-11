import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { AuthToken } from '../entities/auth-token.entity';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(AuthToken)
    private readonly authTokenRepository: Repository<AuthToken>,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(AuthRepository.name);
  }

  async findTokenByRefreshToken(refreshToken: string): Promise<AuthToken | null> {
    this.logger.info('AuthRepository#findTokenByRefreshToken.call', { refreshToken: refreshToken.substring(0, 20) + '...' });
    const result = await this.authTokenRepository.findOne({
      where: { refreshToken, isRevoked: 0 },
    });
    this.logger.info('AuthRepository#findTokenByRefreshToken.result', { found: !!result });
    return result;
  }

  async findTokenByUserId(userId: string, deviceId?: string): Promise<AuthToken | null> {
    this.logger.info('AuthRepository#findTokenByUserId.call', { userId, deviceId });
    const where: any = { userId, isRevoked: 0 };
    if (deviceId) {
      where.deviceId = deviceId;
    }
    const result = await this.authTokenRepository.findOne({
      where,
      order: { expiresAt: 'DESC' },
    });
    this.logger.info('AuthRepository#findTokenByUserId.result', { found: !!result });
    return result;
  }

  async createToken(tokenData: Partial<AuthToken>): Promise<AuthToken> {
    this.logger.info('AuthRepository#createToken.call', { userId: tokenData.userId });
    
    const { randomUUID } = require('crypto');
    const tokenId = randomUUID();
    const now = new Date();
    
    const token: Partial<AuthToken> = {
      id: tokenId,
      userId: tokenData.userId!,
      refreshToken: tokenData.refreshToken!,
      deviceId: tokenData.deviceId || null,
      ipAddress: tokenData.ipAddress || null,
      userAgent: tokenData.userAgent || null,
      expiresAt: tokenData.expiresAt!,
      isRevoked: 0,
      isActive: 1,
      version: 1,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      createdBy: null,
      updatedBy: null,
    };
    
    const createdToken = this.authTokenRepository.create(token);
    await this.authTokenRepository.save(createdToken);
    
    this.logger.info('AuthRepository#createToken.result', { id: createdToken.id });
    return createdToken;
  }

  async revokeToken(refreshToken: string): Promise<void> {
    this.logger.info('AuthRepository#revokeToken.call', { refreshToken: refreshToken.substring(0, 20) + '...' });
    await this.authTokenRepository.update(
      { refreshToken },
      { isRevoked: 1, updatedAt: new Date() }
    );
    this.logger.info('AuthRepository#revokeToken.result', { revoked: true });
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    this.logger.info('AuthRepository#revokeAllUserTokens.call', { userId });
    await this.authTokenRepository.update(
      { userId, isRevoked: 0 },
      { isRevoked: 1, updatedAt: new Date() }
    );
    this.logger.info('AuthRepository#revokeAllUserTokens.result', { revoked: true });
  }

  async deleteExpiredTokens(): Promise<number> {
    this.logger.info('AuthRepository#deleteExpiredTokens.call');
    const result = await this.authTokenRepository
      .createQueryBuilder()
      .delete()
      .where('EXPIRES_AT < :now', { now: new Date() })
      .execute();
    this.logger.info('AuthRepository#deleteExpiredTokens.result', { deleted: result.affected || 0 });
    return result.affected || 0;
  }
}

