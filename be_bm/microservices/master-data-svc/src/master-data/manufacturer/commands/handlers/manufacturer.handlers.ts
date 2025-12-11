import { CommandHandler, ICommandHandler, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from 'typeorm';
import * as _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { Manufacturer } from '../../entities/manufacturer.entity';
import { ManufacturerRepository } from '../../repositories/manufacturer.repository';
import { CreateManufacturerDto } from '../../dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from '../../dto/update-manufacturer.dto';
import {
    CreateManufacturerCommand,
    DeleteManufacturerCommand,
    GetManufacturerByCodeQuery,
    GetManufacturerByIdQuery,
    GetManufacturersQuery,
    UpdateManufacturerCommand,
} from '../../manufacturer.cqrs';

// Command Handlers

@CommandHandler(CreateManufacturerCommand)
export class CreateManufacturerHandler
    implements ICommandHandler<CreateManufacturerCommand> {
    constructor(
        @InjectRepository(Manufacturer)
        private readonly manufacturerRepository: ManufacturerRepository,
    ) { }

    async execute(command: CreateManufacturerCommand): Promise<Manufacturer> {
        const { createManufacturerDto } = command;
        const existing = await this.manufacturerRepository.findOne({
            where: { code: createManufacturerDto.code },
        });
        if (existing) {
            throw new RpcException({
                code: 6,
                message: 'MANUFACTURER_ALREADY_EXISTS',
            });
        }

        const manufacturer = this.manufacturerRepository.create({
            ...createManufacturerDto,
            id: uuidv4(),
            createdAt: new Date(),
            updatedAt: new Date(),
            version: 1,
            isActive: 1,
        });
        return this.manufacturerRepository.save(manufacturer);
    }
}

@CommandHandler(UpdateManufacturerCommand)
export class UpdateManufacturerHandler
    implements ICommandHandler<UpdateManufacturerCommand> {
    constructor(
        @InjectRepository(Manufacturer)
        private readonly manufacturerRepository: ManufacturerRepository,
    ) { }

    async execute(command: UpdateManufacturerCommand): Promise<Manufacturer> {
        const { updateManufacturerDto } = command;
        const manufacturer = await this.manufacturerRepository.findOne({
            where: { id: updateManufacturerDto.id },
        });

        if (!manufacturer) {
            throw new RpcException({
                code: 5,
                message: 'MANUFACTURER_NOT_FOUND',
            });
        }

        const updated = this.manufacturerRepository.merge(
            manufacturer,
            updateManufacturerDto,
            { updatedAt: new Date() },
        );
        return this.manufacturerRepository.save(updated);
    }
}

@CommandHandler(DeleteManufacturerCommand)
export class DeleteManufacturerHandler
    implements ICommandHandler<DeleteManufacturerCommand> {
    constructor(
        @InjectRepository(Manufacturer)
        private readonly manufacturerRepository: ManufacturerRepository,
    ) { }

    async execute(command: DeleteManufacturerCommand): Promise<any> {
        const { id } = command;
        return this.manufacturerRepository.delete(id);
    }
}

// Query Handlers

@QueryHandler(GetManufacturersQuery)
export class GetManufacturersHandler
    implements IQueryHandler<GetManufacturersQuery> {
    constructor(
        @InjectRepository(Manufacturer)
        private readonly manufacturerRepository: ManufacturerRepository,
    ) { }

    async execute(query: GetManufacturersQuery): Promise<any> {
        const { query: q } = query;
        const { skip, limit, order, where } = q || {};

        let findConditions: any = where ? JSON.parse(where) : {};

        // Basic support for searching by name/code
        if (findConditions.keyword) {
            const keyword = findConditions.keyword;
            delete findConditions.keyword;
            findConditions = [
                { code: Like(`%${keyword}%`), ...findConditions },
                { name: Like(`%${keyword}%`), ...findConditions },
            ];
        }

        // Explicitly select columns to avoid huge payloads if necessary, though base entity usually ok
        const [data, total] = await this.manufacturerRepository.findAndCount({
            where: findConditions,
            skip,
            take: limit,
            order: order ? JSON.parse(order) : { createdAt: 'DESC' },
        });

        return {
            data,
            total,
            skip,
            limit,
        };
    }
}

@QueryHandler(GetManufacturerByIdQuery)
export class GetManufacturerByIdHandler
    implements IQueryHandler<GetManufacturerByIdQuery> {
    constructor(
        @InjectRepository(Manufacturer)
        private readonly manufacturerRepository: ManufacturerRepository,
    ) { }

    async execute(query: GetManufacturerByIdQuery): Promise<Manufacturer> {
        const { id } = query;
        const manufacturer = await this.manufacturerRepository.findOne({
            where: { id },
        });
        if (!manufacturer) {
            throw new RpcException({
                code: 5,
                message: 'MANUFACTURER_NOT_FOUND',
            });
        }
        return manufacturer;
    }
}

@QueryHandler(GetManufacturerByCodeQuery)
export class GetManufacturerByCodeHandler
    implements IQueryHandler<GetManufacturerByCodeQuery> {
    constructor(
        @InjectRepository(Manufacturer)
        private readonly manufacturerRepository: ManufacturerRepository,
    ) { }

    async execute(query: GetManufacturerByCodeQuery): Promise<Manufacturer> {
        const { code } = query;
        const manufacturer = await this.manufacturerRepository.findOne({
            where: { code },
        });
        if (!manufacturer) {
            throw new RpcException({
                code: 5,
                message: 'MANUFACTURER_NOT_FOUND',
            });
        }
        return manufacturer;
    }
}

import { CountManufacturersHandler } from '../../queries/handlers/count-manufacturers.handler';

export const ManufacturerHandlers = [
    CreateManufacturerHandler,
    UpdateManufacturerHandler,
    DeleteManufacturerHandler,
    GetManufacturersHandler,
    GetManufacturerByIdHandler,
    GetManufacturerByCodeHandler,
    CountManufacturersHandler,
];
