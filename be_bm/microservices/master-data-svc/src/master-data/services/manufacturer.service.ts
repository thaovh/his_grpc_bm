import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateManufacturerDto } from '../manufacturer/dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from '../manufacturer/dto/update-manufacturer.dto';
import {
    CreateManufacturerCommand,
    DeleteManufacturerCommand,
    GetManufacturerByCodeQuery,
    GetManufacturerByIdQuery,
    GetManufacturersQuery,
    UpdateManufacturerCommand,
    CountManufacturersQuery,
} from '../manufacturer/manufacturer.cqrs';

@Injectable()
export class ManufacturerService {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    async create(createManufacturerDto: CreateManufacturerDto) {
        return this.commandBus.execute(
            new CreateManufacturerCommand(createManufacturerDto),
        );
    }

    async findAll(query: any) {
        return this.queryBus.execute(new GetManufacturersQuery(query));
    }

    async findOne(id: string) {
        return this.queryBus.execute(new GetManufacturerByIdQuery(id));
    }

    async findByCode(code: string) {
        return this.queryBus.execute(new GetManufacturerByCodeQuery(code));
    }

    async update(updateManufacturerDto: UpdateManufacturerDto) {
        return this.commandBus.execute(
            new UpdateManufacturerCommand(updateManufacturerDto),
        );
    }

    async remove(id: string) {
        return this.commandBus.execute(new DeleteManufacturerCommand(id));
    }

    async count(query: any) {
        return this.queryBus.execute(new CountManufacturersQuery(query));
    }
}
