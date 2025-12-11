import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ApiEndpointRepository } from '../../repositories/api-endpoint.repository';
import { CreateApiEndpointCommand } from '../create-api-endpoint.command';
import { ApiEndpoint } from '../../entities/api-endpoint.entity';

@CommandHandler(CreateApiEndpointCommand)
export class CreateApiEndpointHandler implements ICommandHandler<CreateApiEndpointCommand> {
    constructor(private readonly repository: ApiEndpointRepository) { }

    async execute(command: CreateApiEndpointCommand): Promise<ApiEndpoint> {
        return this.repository.create(command.dto);
    }
}
