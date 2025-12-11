import { Injectable, Inject } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';
import { DeviceToken } from '../entities/device-token.entity';

@Injectable()
export class DeviceTokenRepository extends Repository<DeviceToken> {
    constructor(
        private dataSource: DataSource,
        @InjectPinoLogger(DeviceTokenRepository.name) private readonly logger: PinoLogger,
    ) {
        super(DeviceToken, dataSource.createEntityManager());
    }

    async findByUserId(userId: string): Promise<DeviceToken[]> {
        return this.find({
            where: { userId, isActive: 1 },
            order: { lastUsedAt: 'DESC' },
        });
    }

    async findByEmployeeCode(employeeCode: string): Promise<DeviceToken[]> {
        return this.find({
            where: { employeeCode, isActive: 1 },
            order: { lastUsedAt: 'DESC' },
        });
    }

    async findByToken(deviceToken: string): Promise<DeviceToken | null> {
        return this.findOne({ where: { deviceToken } });
    }

    async deactivateToken(deviceToken: string): Promise<void> {
        await this.update({ deviceToken }, { isActive: 0 });
    }

    async updateLastUsed(deviceToken: string): Promise<void> {
        await this.update({ deviceToken }, { lastUsedAt: new Date() });
    }

    async getActiveTokensByEmployeeCode(employeeCode: string): Promise<string[]> {
        this.logger.info(`DeviceTokenRepository#getActiveTokensByEmployeeCode.call - employeeCode: ${employeeCode}`);
        
        // First, check if there are any tokens without isActive filter
        const allTokens = await this.find({
            where: { employeeCode },
            select: ['deviceToken', 'isActive'],
        });
        this.logger.info(`DeviceTokenRepository#getActiveTokensByEmployeeCode - Found ${allTokens.length} total tokens for employeeCode: ${employeeCode}`);
        if (allTokens.length > 0) {
            allTokens.forEach((token, idx) => {
                this.logger.info(`  Token ${idx + 1}: isActive=${token.isActive}, token=${token.deviceToken?.substring(0, 30)}...`);
            });
        }
        
        // Then query with isActive filter
        const tokens = await this.find({
            where: { employeeCode, isActive: 1 },
            select: ['deviceToken'],
        });
        
        this.logger.info(`DeviceTokenRepository#getActiveTokensByEmployeeCode.result - employeeCode: ${employeeCode}, count: ${tokens.length}`);
        if (tokens.length > 0) {
            tokens.forEach((token, idx) => {
                this.logger.info(`  Active Token ${idx + 1}: ${token.deviceToken?.substring(0, 50)}...`);
            });
        }
        
        return tokens.map(t => t.deviceToken);
    }
}
