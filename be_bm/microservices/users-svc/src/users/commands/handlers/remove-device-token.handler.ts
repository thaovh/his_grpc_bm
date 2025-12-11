import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { DeviceTokenRepository } from '../../repositories/device-token.repository';
import { RemoveDeviceTokenCommand } from '../device-token.cqrs';

@CommandHandler(RemoveDeviceTokenCommand)
export class RemoveDeviceTokenHandler implements ICommandHandler<RemoveDeviceTokenCommand> {
    private readonly logger = new Logger(RemoveDeviceTokenHandler.name);

    constructor(private readonly repository: DeviceTokenRepository) { }

    async execute(command: RemoveDeviceTokenCommand): Promise<void> {
        await this.repository.deactivateToken(command.deviceToken);
        this.logger.log(`Deactivated device token: ${command.deviceToken.substring(0, 20)}...`);
    }
}
