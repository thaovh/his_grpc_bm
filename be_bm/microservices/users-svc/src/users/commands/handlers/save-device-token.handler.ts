import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DeviceTokenRepository } from '../../repositories/device-token.repository';
import { SaveDeviceTokenCommand } from '../device-token.cqrs';
import { DeviceToken } from '../../entities/device-token.entity';

@CommandHandler(SaveDeviceTokenCommand)
export class SaveDeviceTokenHandler implements ICommandHandler<SaveDeviceTokenCommand> {
    private readonly logger = new Logger(SaveDeviceTokenHandler.name);

    constructor(private readonly repository: DeviceTokenRepository) { }

    async execute(command: SaveDeviceTokenCommand): Promise<DeviceToken> {
        // Check if token already exists
        let token = await this.repository.findByToken(command.deviceToken);

        if (token) {
            // Update existing token
            token.userId = command.userId;
            token.employeeCode = command.employeeCode;
            token.deviceType = command.deviceType;
            token.deviceName = command.deviceName;
            token.deviceOsVersion = command.deviceOsVersion;
            token.appVersion = command.appVersion;
            token.lastUsedAt = new Date();
            token.isActive = 1;
            token.updatedAt = new Date();

            this.logger.log(`Updated device token for user: ${command.userId}`);
        } else {
            // Create new token
            token = new DeviceToken();
            token.id = uuidv4();
            token.userId = command.userId;
            token.employeeCode = command.employeeCode;
            token.deviceToken = command.deviceToken;
            token.deviceType = command.deviceType;
            token.deviceName = command.deviceName;
            token.deviceOsVersion = command.deviceOsVersion;
            token.appVersion = command.appVersion;
            token.lastUsedAt = new Date();
            token.isActive = 1;
            token.version = 1;
            token.createdAt = new Date();
            token.updatedAt = new Date();
            token.deletedAt = null;
            token.createdBy = command.userId;
            token.updatedBy = null;

            this.logger.log(`Created new device token for user: ${command.userId}`);
        }

        return await this.repository.save(token);
    }
}
