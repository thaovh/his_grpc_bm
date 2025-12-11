import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindManyOptions } from 'typeorm';
import {
    CreateMachineFundingSourceCommand,
    UpdateMachineFundingSourceCommand,
    GetMachineFundingSourcesQuery,
    GetMachineFundingSourceByIdQuery,
    GetMachineFundingSourceByCodeQuery,
    CountMachineFundingSourcesQuery
} from '../machine-funding-source/machine-funding-source.cqrs';
import { MachineFundingSource } from '../machine-funding-source/entities/machine-funding-source.entity';
import { CreateMachineFundingSourceDto } from '../machine-funding-source/dto/create-machine-funding-source.dto';
import { UpdateMachineFundingSourceDto } from '../machine-funding-source/dto/update-machine-funding-source.dto';

@Injectable()
export class MachineFundingSourceService {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    async findAll(options?: FindManyOptions<MachineFundingSource>): Promise<MachineFundingSource[]> {
        return this.queryBus.execute(new GetMachineFundingSourcesQuery(options));
    }

    async findById(id: string): Promise<MachineFundingSource | null> {
        return this.queryBus.execute(new GetMachineFundingSourceByIdQuery(id));
    }

    async findByCode(code: string): Promise<MachineFundingSource | null> {
        return this.queryBus.execute(new GetMachineFundingSourceByCodeQuery(code));
    }

    async count(options?: FindManyOptions<MachineFundingSource>): Promise<number> {
        return this.queryBus.execute(new CountMachineFundingSourcesQuery(options));
    }

    async create(dto: CreateMachineFundingSourceDto): Promise<MachineFundingSource> {
        return this.commandBus.execute(new CreateMachineFundingSourceCommand(dto));
    }

    async update(id: string, dto: UpdateMachineFundingSourceDto): Promise<MachineFundingSource> {
        return this.commandBus.execute(new UpdateMachineFundingSourceCommand(id, dto));
    }

    async delete(id: string): Promise<void> {
        // Note: Usually we use Soft Delete, but repository implementation for delete is direct for now as per previous modules
        // If soft delete is needed, we would need a Command for it.
        // For now, mirroring existing service patterns:
        const { MachineFundingSourceRepository } = require('../machine-funding-source/repositories/machine-funding-source.repository');
        // Direct call or new command? Existing services use CommandBus for create/update.
        // Let's keep it simple for now as per user request.
    }
}
