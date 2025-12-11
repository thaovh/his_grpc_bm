import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
    CreateMaintenanceTypeCommand,
    UpdateMaintenanceTypeCommand,
    DeleteMaintenanceTypeCommand,
    GetMaintenanceTypesQuery,
    GetMaintenanceTypeByIdQuery,
    GetMaintenanceTypeByCodeQuery,
    CountMaintenanceTypesQuery,
} from '../maintenance-type/maintenance-type.cqrs';
import { CreateMaintenanceTypeDto } from '../maintenance-type/dto/create-maintenance-type.dto';
import { UpdateMaintenanceTypeDto } from '../maintenance-type/dto/update-maintenance-type.dto';
import { FindManyOptions } from 'typeorm';
import { MaintenanceType } from '../maintenance-type/entities/maintenance-type.entity';

@Injectable()
export class MaintenanceTypeService {
    constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) { }

    async findAll(options?: FindManyOptions<MaintenanceType>) {
        return this.queryBus.execute(new GetMaintenanceTypesQuery(options));
    }

    async findById(id: string) {
        return this.queryBus.execute(new GetMaintenanceTypeByIdQuery(id));
    }

    async findByCode(code: string) {
        return this.queryBus.execute(new GetMaintenanceTypeByCodeQuery(code));
    }

    async count(options?: FindManyOptions<MaintenanceType>) {
        return this.queryBus.execute(new CountMaintenanceTypesQuery(options));
    }

    async create(dto: CreateMaintenanceTypeDto) {
        return this.commandBus.execute(new CreateMaintenanceTypeCommand(dto));
    }

    async update(id: string, dto: UpdateMaintenanceTypeDto) {
        return this.commandBus.execute(new UpdateMaintenanceTypeCommand(id, dto));
    }

    async delete(id: string) {
        return this.commandBus.execute(new DeleteMaintenanceTypeCommand(id));
    }
}
