import { CommandHandler, ICommandHandler, QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { PinoLogger } from 'nestjs-pino';
import {
    CreateBranchCommand,
    UpdateBranchCommand,
    GetBranchesQuery,
    GetBranchByIdQuery,
    GetBranchByCodeQuery,
    CountBranchesQuery
} from '../../branch.cqrs';
import { BranchRepository } from '../../repositories/branch.repository';
import { Branch } from '../../entities/branch.entity';

@CommandHandler(CreateBranchCommand)
export class CreateBranchHandler implements ICommandHandler<CreateBranchCommand> {
    constructor(private readonly repository: BranchRepository, private readonly logger: PinoLogger) {
        this.logger.setContext(CreateBranchHandler.name);
    }
    async execute(command: CreateBranchCommand): Promise<Branch> {
        return this.repository.create(command.branchDto);
    }
}

@CommandHandler(UpdateBranchCommand)
export class UpdateBranchHandler implements ICommandHandler<UpdateBranchCommand> {
    constructor(private readonly repository: BranchRepository, private readonly logger: PinoLogger) {
        this.logger.setContext(UpdateBranchHandler.name);
    }
    async execute(command: UpdateBranchCommand): Promise<Branch> {
        return this.repository.update(command.id, command.branchDto);
    }
}

@QueryHandler(GetBranchesQuery)
export class GetBranchesHandler implements IQueryHandler<GetBranchesQuery> {
    constructor(private readonly repository: BranchRepository) { }
    async execute(query: GetBranchesQuery): Promise<Branch[]> {
        return this.repository.findAll(query.options);
    }
}

@QueryHandler(GetBranchByIdQuery)
export class GetBranchByIdHandler implements IQueryHandler<GetBranchByIdQuery> {
    constructor(private readonly repository: BranchRepository) { }
    async execute(query: GetBranchByIdQuery): Promise<Branch | null> {
        const result = await this.repository.findOne(query.id);
        if (!result) {
            throw new RpcException({
                code: 5, // NOT_FOUND
                message: 'BRANCH_NOT_FOUND',
            });
        }
        return result;
    }
}

@QueryHandler(GetBranchByCodeQuery)
export class GetBranchByCodeHandler implements IQueryHandler<GetBranchByCodeQuery> {
    constructor(private readonly repository: BranchRepository) { }
    async execute(query: GetBranchByCodeQuery): Promise<Branch | null> {
        return this.repository.findByCode(query.code);
    }
}

@QueryHandler(CountBranchesQuery)
export class CountBranchesHandler implements IQueryHandler<CountBranchesQuery> {
    constructor(private readonly repository: BranchRepository) { }
    async execute(query: CountBranchesQuery): Promise<number> {
        return this.repository.count(query.options);
    }
}

export const BranchHandlers = [
    CreateBranchHandler,
    UpdateBranchHandler,
    GetBranchesHandler,
    GetBranchByIdHandler,
    GetBranchByCodeHandler,
    CountBranchesHandler,
];
