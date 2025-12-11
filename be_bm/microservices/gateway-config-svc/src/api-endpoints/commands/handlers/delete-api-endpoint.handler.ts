import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ApiEndpointRepository } from '../../repositories/api-endpoint.repository';
import { DeleteApiEndpointCommand } from '../delete-api-endpoint.command';

@CommandHandler(DeleteApiEndpointCommand)
export class DeleteApiEndpointHandler implements ICommandHandler<DeleteApiEndpointCommand> {
    constructor(private readonly repository: ApiEndpointRepository) { }

    async execute(command: DeleteApiEndpointCommand): Promise<void> {
        return this.repository.delete(command.id);
    }
}
