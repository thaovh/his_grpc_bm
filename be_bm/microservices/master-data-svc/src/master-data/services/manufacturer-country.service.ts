import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import { FindManyOptions } from 'typeorm';
import { ManufacturerCountry } from '../manufacturer-country/entities/manufacturer-country.entity';
import { CreateManufacturerCountryDto } from '../manufacturer-country/dto/create-manufacturer-country.dto';
import { UpdateManufacturerCountryDto } from '../manufacturer-country/dto/update-manufacturer-country.dto';
import {
    CreateManufacturerCountryCommand,
    UpdateManufacturerCountryCommand,
    GetManufacturerCountriesQuery,
    GetManufacturerCountryByIdQuery,
    GetManufacturerCountryByCodeQuery,
    CountManufacturerCountriesQuery
} from '../manufacturer-country/manufacturer-country.cqrs';
import { ManufacturerCountryRepository } from '../manufacturer-country/repositories/manufacturer-country.repository';

@Injectable()
export class ManufacturerCountryService {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly repository: ManufacturerCountryRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(ManufacturerCountryService.name);
    }

    async findAll(options?: FindManyOptions<ManufacturerCountry>): Promise<ManufacturerCountry[]> {
        this.logger.info('ManufacturerCountryService#findAll.call', options);
        return this.queryBus.execute(new GetManufacturerCountriesQuery(options));
    }

    async findById(id: string): Promise<ManufacturerCountry | null> {
        this.logger.info('ManufacturerCountryService#findById.call', { id });
        return this.queryBus.execute(new GetManufacturerCountryByIdQuery(id));
    }

    async findByCode(code: string): Promise<ManufacturerCountry | null> {
        this.logger.info('ManufacturerCountryService#findByCode.call', { code });
        return this.queryBus.execute(new GetManufacturerCountryByCodeQuery(code));
    }

    async count(options?: FindManyOptions<ManufacturerCountry>): Promise<number> {
        this.logger.info('ManufacturerCountryService#count.call');
        return this.queryBus.execute(new CountManufacturerCountriesQuery(options));
    }

    async create(dto: CreateManufacturerCountryDto): Promise<ManufacturerCountry> {
        this.logger.info('ManufacturerCountryService#create.call', { code: dto.code });
        return this.commandBus.execute(new CreateManufacturerCountryCommand(dto));
    }

    async update(id: string, dto: UpdateManufacturerCountryDto): Promise<ManufacturerCountry> {
        this.logger.info('ManufacturerCountryService#update.call', { id });
        return this.commandBus.execute(new UpdateManufacturerCountryCommand(id, dto));
    }

    async delete(id: string): Promise<void> {
        this.logger.info('ManufacturerCountryService#delete.call', { id });
        await this.repository.delete(id);
    }
}
