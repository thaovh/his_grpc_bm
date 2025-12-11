import { CommandHandler, ICommandHandler, QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { MachineTransferRepository } from '../repositories/transfer.repository';
import { MachineRepository } from '../../machine/repositories/machine.repository';
import {
    CreateTransferCommand,
    UpdateTransferCommand,
    DeleteTransferCommand,
    GetTransferByIdQuery,
    GetAllTransfersQuery,
    CountTransfersQuery,
} from '../transfer.cqrs';

@CommandHandler(CreateTransferCommand)
export class CreateTransferHandler implements ICommandHandler<CreateTransferCommand> {
    constructor(private readonly repository: MachineTransferRepository) { }
    async execute(command: CreateTransferCommand) {
        return this.repository.create(command.data);
    }
}

@CommandHandler(UpdateTransferCommand)
export class UpdateTransferHandler implements ICommandHandler<UpdateTransferCommand> {
    constructor(
        private readonly repository: MachineTransferRepository,
        private readonly machineRepository: MachineRepository,
    ) { }
    async execute(command: UpdateTransferCommand) {
        const transfer = await this.repository.update(command.id, command.data);

        // Sync machine location if transfer is COMPLETED
        if (transfer.statusId === 'COMPLETED' || (command.data as any).statusId === 'COMPLETED') {
            await this.machineRepository.update(transfer.machineId, {
                branchId: transfer.toBranchId,
                departmentId: transfer.toDepartmentId,
            } as any);
        }

        return transfer;
    }
}

@CommandHandler(DeleteTransferCommand)
export class DeleteTransferHandler implements ICommandHandler<DeleteTransferCommand> {
    constructor(private readonly repository: MachineTransferRepository) { }
    async execute(command: DeleteTransferCommand) {
        return this.repository.delete(command.id);
    }
}

@QueryHandler(GetTransferByIdQuery)
export class GetTransferByIdHandler implements IQueryHandler<GetTransferByIdQuery> {
    constructor(private readonly repository: MachineTransferRepository) { }
    async execute(query: GetTransferByIdQuery) {
        return this.repository.findById(query.id);
    }
}

@QueryHandler(GetAllTransfersQuery)
export class GetAllTransfersHandler implements IQueryHandler<GetAllTransfersQuery> {
    constructor(private readonly repository: MachineTransferRepository) { }
    async execute(query: GetAllTransfersQuery) {
        return this.repository.findAll(query.options);
    }
}

@QueryHandler(CountTransfersQuery)
export class CountTransfersHandler implements IQueryHandler<CountTransfersQuery> {
    constructor(private readonly repository: MachineTransferRepository) { }
    async execute(query: CountTransfersQuery) {
        return this.repository.count(query.options);
    }
}

export const MachineTransferHandlers = [
    CreateTransferHandler,
    UpdateTransferHandler,
    DeleteTransferHandler,
    GetTransferByIdHandler,
    GetAllTransfersHandler,
    CountTransfersHandler,
];
