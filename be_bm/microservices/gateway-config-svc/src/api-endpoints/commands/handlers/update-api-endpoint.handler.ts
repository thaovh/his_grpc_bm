import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ApiEndpointRepository } from '../../repositories/api-endpoint.repository';
import { UpdateApiEndpointCommand } from '../update-api-endpoint.command';
import { ApiEndpoint } from '../../entities/api-endpoint.entity';

@CommandHandler(UpdateApiEndpointCommand)
export class UpdateApiEndpointHandler implements ICommandHandler<UpdateApiEndpointCommand> {
    constructor(private readonly repository: ApiEndpointRepository) { }

    async execute(command: UpdateApiEndpointCommand): Promise<ApiEndpoint> {
        return this.repository.update(command.id, command.dto);
    }
}
