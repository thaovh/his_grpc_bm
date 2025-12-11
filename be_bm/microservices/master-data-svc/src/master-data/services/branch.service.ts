import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindManyOptions } from 'typeorm';
import { PinoLogger } from 'nestjs-pino';
import { Branch } from '../branch/entities/branch.entity';
import { CreateBranchDto } from '../branch/dto/create-branch.dto';
import { UpdateBranchDto } from '../branch/dto/update-branch.dto';
import {
    CreateBranchCommand,
    UpdateBranchCommand,
    GetBranchesQuery,
    GetBranchByIdQuery,
    GetBranchByCodeQuery,
    CountBranchesQuery
} from '../branch/branch.cqrs';
import { BranchRepository } from '../branch/repositories/branch.repository';

@Injectable()
export class BranchService {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly repository: BranchRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(BranchService.name);
    }

    async findAll(query?: FindManyOptions<Branch>): Promise<Branch[]> {
        return this.queryBus.execute(new GetBranchesQuery(query));
    }

    async findById(id: string): Promise<Branch | null> {
        return this.queryBus.execute(new GetBranchByIdQuery(id));
    }

    async findByCode(code: string): Promise<Branch | null> {
        return this.queryBus.execute(new GetBranchByCodeQuery(code));
    }

    async count(query?: FindManyOptions<Branch>): Promise<number> {
        return this.queryBus.execute(new CountBranchesQuery(query));
    }

    async create(dto: CreateBranchDto): Promise<Branch> {
        return this.commandBus.execute(new CreateBranchCommand(dto));
    }

    async update(id: string, dto: UpdateBranchDto): Promise<Branch> {
        return this.commandBus.execute(new UpdateBranchCommand(id, dto));
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete(id);
    }
}
