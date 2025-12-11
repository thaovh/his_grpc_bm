import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
    CreateMachineUnitCommand,
    UpdateMachineUnitCommand,
    DeleteMachineUnitCommand,
    GetMachineUnitsQuery,
    GetMachineUnitByIdQuery,
    GetMachineUnitByCodeQuery,
    CountMachineUnitsQuery,
} from '../machine-unit/machine-unit.cqrs';
import { CreateMachineUnitDto } from '../machine-unit/dto/create-machine-unit.dto';
import { UpdateMachineUnitDto } from '../machine-unit/dto/update-machine-unit.dto';
import { FindManyOptions } from 'typeorm';
import { MachineUnit } from '../machine-unit/entities/machine-unit.entity';

@Injectable()
export class MachineUnitService {
    constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) { }

    async findAll(options?: FindManyOptions<MachineUnit>) {
        return this.queryBus.execute(new GetMachineUnitsQuery(options));
    }

    async findById(id: string) {
        return this.queryBus.execute(new GetMachineUnitByIdQuery(id));
    }

    async findByCode(code: string) {
        return this.queryBus.execute(new GetMachineUnitByCodeQuery(code));
    }

    async count(options?: FindManyOptions<MachineUnit>) {
        return this.queryBus.execute(new CountMachineUnitsQuery(options));
    }

    async create(dto: CreateMachineUnitDto) {
        return this.commandBus.execute(new CreateMachineUnitCommand(dto));
    }

    async update(id: string, dto: UpdateMachineUnitDto) {
        return this.commandBus.execute(new UpdateMachineUnitCommand(id, dto));
    }

    async delete(id: string) {
        return this.commandBus.execute(new DeleteMachineUnitCommand(id));
    }
}
