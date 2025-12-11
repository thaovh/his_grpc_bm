import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
    CreateVendorCommand,
    UpdateVendorCommand,
    DeleteVendorCommand,
    GetVendorsQuery,
    GetVendorByIdQuery,
    GetVendorByCodeQuery,
    CountVendorsQuery,
} from '../vendor/vendor.cqrs';
import { CreateVendorDto } from '../vendor/dto/create-vendor.dto';
import { UpdateVendorDto } from '../vendor/dto/update-vendor.dto';
import { FindManyOptions } from 'typeorm';
import { Vendor } from '../vendor/entities/vendor.entity';

@Injectable()
export class VendorService {
    constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) { }

    async findAll(options?: FindManyOptions<Vendor>) {
        return this.queryBus.execute(new GetVendorsQuery(options));
    }

    async findById(id: string) {
        return this.queryBus.execute(new GetVendorByIdQuery(id));
    }

    async findByCode(code: string) {
        return this.queryBus.execute(new GetVendorByCodeQuery(code));
    }

    async count(options?: FindManyOptions<Vendor>) {
        return this.queryBus.execute(new CountVendorsQuery(options));
    }

    async create(dto: CreateVendorDto) {
        return this.commandBus.execute(new CreateVendorCommand(dto));
    }

    async update(id: string, dto: UpdateVendorDto) {
        return this.commandBus.execute(new UpdateVendorCommand(id, dto));
    }

    async delete(id: string) {
        return this.commandBus.execute(new DeleteVendorCommand(id));
    }
}
