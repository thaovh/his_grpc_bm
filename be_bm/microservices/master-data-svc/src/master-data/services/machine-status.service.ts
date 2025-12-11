import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
    CreateMachineStatusCommand,
    UpdateMachineStatusCommand,
    DeleteMachineStatusCommand,
    GetMachineStatusesQuery,
    GetMachineStatusByIdQuery,
    GetMachineStatusByCodeQuery,
    CountMachineStatusesQuery,
} from '../machine-status/machine-status.cqrs';
import { CreateMachineStatusDto } from '../machine-status/dto/create-machine-status.dto';
import { UpdateMachineStatusDto } from '../machine-status/dto/update-machine-status.dto';
import { FindManyOptions } from 'typeorm';
import { MachineStatus } from '../machine-status/entities/machine-status.entity';

@Injectable()
export class MachineStatusService {
    constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) { }

    async findAll(options?: FindManyOptions<MachineStatus>) {
        return this.queryBus.execute(new GetMachineStatusesQuery(options));
    }

    async findById(id: string) {
        return this.queryBus.execute(new GetMachineStatusByIdQuery(id));
    }

    async findByCode(code: string) {
        return this.queryBus.execute(new GetMachineStatusByCodeQuery(code));
    }

    async count(options?: FindManyOptions<MachineStatus>) {
        return this.queryBus.execute(new CountMachineStatusesQuery(options));
    }

    async create(dto: CreateMachineStatusDto) {
        return this.commandBus.execute(new CreateMachineStatusCommand(dto));
    }

    async update(id: string, dto: UpdateMachineStatusDto) {
        return this.commandBus.execute(new UpdateMachineStatusCommand(id, dto));
    }

    async delete(id: string) {
        return this.commandBus.execute(new DeleteMachineStatusCommand(id));
    }
}
