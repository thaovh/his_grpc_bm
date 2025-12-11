import { CommandHandler, ICommandHandler, QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
import { MachineRepository } from '../repositories/machine.repository';
import { MachineDocumentRepository } from '../../document/repositories/machine-document.repository';
import { MachineTransferRepository } from '../../transfer/repositories/transfer.repository';
import {
    CreateMachineCommand,
    UpdateMachineCommand,
    DeleteMachineCommand,
    GetAllMachinesQuery,
    GetMachineByIdQuery,
    GetMachineByCodeQuery,
    CountMachinesQuery,
} from '../machine.cqrs';
import { Machine } from '../entities/machine.entity';
import { MachineTransfer } from '../../transfer/entities/transfer.entity';
import { RpcException } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';

@CommandHandler(CreateMachineCommand)
export class CreateMachineHandler implements ICommandHandler<CreateMachineCommand> {
    constructor(
        private readonly repository: MachineRepository,
        private readonly transferRepository: MachineTransferRepository,
        private readonly dataSource: DataSource,
    ) { }

    async execute(command: CreateMachineCommand): Promise<Machine> {
        const { branchId, departmentId, transferDate, transferTypeId, createdBy, ...dto } = command.dto as any;

        return await this.dataSource.transaction(async (manager) => {
            // 1. Check if code already exists (pre-emptive check within transaction)
            const existing = await manager.findOne(Machine, { where: { code: dto.code } });
            if (existing) {
                throw new RpcException({
                    code: 6, // ALREADY_EXISTS
                    message: 'MACHINE_CODE_EXISTS',
                });
            }

            // 2. Create Machine
            const now = new Date();
            const machineEntity = manager.create(Machine, {
                ...dto,
                branchId,
                departmentId,
                id: uuidv4(),
                createdAt: now,
                updatedAt: now,
                version: 1,
                isActive: 1,
                createdBy: createdBy || 'SYSTEM',
            });
            const machine = await manager.save(Machine, machineEntity);

            // 3. Create initial transfer record if branch or department info is provided
            if (branchId || departmentId) {
                const transferEntity = manager.create(MachineTransfer, {
                    id: uuidv4(),
                    machineId: machine.id,
                    toBranchId: branchId,
                    toDepartmentId: departmentId,
                    transferDate: transferDate ? new Date(transferDate) : now,
                    statusId: 'COMPLETED',
                    transferTypeId: transferTypeId || 'INITIAL',
                    reason: 'Initial machine setup',
                    createdBy: createdBy || 'SYSTEM',
                    createdAt: now,
                    updatedAt: now,
                    version: 1,
                    isActive: 1,
                });
                await manager.save(MachineTransfer, transferEntity);
            }

            return machine;
        });
    }
}

@CommandHandler(UpdateMachineCommand)
export class UpdateMachineHandler implements ICommandHandler<UpdateMachineCommand> {
    constructor(private readonly repository: MachineRepository) { }
    async execute(command: UpdateMachineCommand): Promise<Machine> {
        return this.repository.update(command.id, command.dto);
    }
}

@CommandHandler(DeleteMachineCommand)
export class DeleteMachineHandler implements ICommandHandler<DeleteMachineCommand> {
    constructor(private readonly repository: MachineRepository) { }
    async execute(command: DeleteMachineCommand): Promise<void> {
        return this.repository.delete(command.id);
    }
}

@QueryHandler(GetAllMachinesQuery)
export class GetAllMachinesHandler implements IQueryHandler<GetAllMachinesQuery> {
    constructor(
        private readonly repository: MachineRepository,
        private readonly documentRepository: MachineDocumentRepository,
    ) { }
    async execute(query: GetAllMachinesQuery): Promise<Machine[]> {
        const machines = await this.repository.findAll(query.options);
        // For performance, we might not want to fetch all documents for all machines in a list
        // but if the user requested it via 'include' or similar, we should.
        // For now, let's keep it simple and just return machines.
        return machines;
    }
}

@QueryHandler(GetMachineByIdQuery)
export class GetMachineByIdHandler implements IQueryHandler<GetMachineByIdQuery> {
    constructor(
        private readonly repository: MachineRepository,
        private readonly documentRepository: MachineDocumentRepository,
    ) { }
    async execute(query: GetMachineByIdQuery): Promise<any | null> {
        const machine = await this.repository.findById(query.id);
        if (machine) {
            const documents = await this.documentRepository.findAll({
                where: { machineId: machine.id } as any,
            });
            return {
                ...machine,
                documents,
            };
        }
        throw new RpcException({
            code: 5, // NOT_FOUND
            message: 'MACHINE_NOT_FOUND',
        });
    }
}

@QueryHandler(GetMachineByCodeQuery)
export class GetMachineByCodeHandler implements IQueryHandler<GetMachineByCodeQuery> {
    constructor(private readonly repository: MachineRepository) { }
    async execute(query: GetMachineByCodeQuery): Promise<Machine | null> {
        return this.repository.findByCode(query.code);
    }
}

@QueryHandler(CountMachinesQuery)
export class CountMachinesHandler implements IQueryHandler<CountMachinesQuery> {
    constructor(private readonly repository: MachineRepository) { }
    async execute(query: CountMachinesQuery): Promise<number> {
        return this.repository.count(query.options);
    }
}

export const MachineHandlers = [
    CreateMachineHandler,
    UpdateMachineHandler,
    DeleteMachineHandler,
    GetAllMachinesHandler,
    GetMachineByIdHandler,
    GetMachineByCodeHandler,
    CountMachinesHandler,
];
