import { CommandHandler, ICommandHandler, QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import {
    CreateManufacturerCountryCommand,
    UpdateManufacturerCountryCommand,
    GetManufacturerCountriesQuery,
    GetManufacturerCountryByIdQuery,
    GetManufacturerCountryByCodeQuery,
    CountManufacturerCountriesQuery
} from '../../manufacturer-country.cqrs';
import { ManufacturerCountryRepository } from '../../repositories/manufacturer-country.repository';
import { ManufacturerCountry } from '../../entities/manufacturer-country.entity';

@CommandHandler(CreateManufacturerCountryCommand)
export class CreateManufacturerCountryHandler implements ICommandHandler<CreateManufacturerCountryCommand> {
    constructor(
        private readonly repository: ManufacturerCountryRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(CreateManufacturerCountryHandler.name);
    }

    async execute(command: CreateManufacturerCountryCommand): Promise<ManufacturerCountry> {
        this.logger.info('CreateManufacturerCountryHandler#execute.call', { code: command.dto.code });
        return this.repository.create(command.dto);
    }
}

@CommandHandler(UpdateManufacturerCountryCommand)
export class UpdateManufacturerCountryHandler implements ICommandHandler<UpdateManufacturerCountryCommand> {
    constructor(
        private readonly repository: ManufacturerCountryRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(UpdateManufacturerCountryHandler.name);
    }

    async execute(command: UpdateManufacturerCountryCommand): Promise<ManufacturerCountry> {
        this.logger.info('UpdateManufacturerCountryHandler#execute.call', { id: command.id });
        return this.repository.update(command.id, command.dto);
    }
}

@QueryHandler(GetManufacturerCountriesQuery)
export class GetManufacturerCountriesHandler implements IQueryHandler<GetManufacturerCountriesQuery> {
    constructor(
        private readonly repository: ManufacturerCountryRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(GetManufacturerCountriesHandler.name);
    }

    async execute(query: GetManufacturerCountriesQuery): Promise<ManufacturerCountry[]> {
        this.logger.info('GetManufacturerCountriesHandler#execute.call', query.options);
        return this.repository.findAll(query.options);
    }
}

@QueryHandler(GetManufacturerCountryByIdQuery)
export class GetManufacturerCountryByIdHandler implements IQueryHandler<GetManufacturerCountryByIdQuery> {
    constructor(
        private readonly repository: ManufacturerCountryRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(GetManufacturerCountryByIdHandler.name);
    }

    async execute(query: GetManufacturerCountryByIdQuery): Promise<ManufacturerCountry | null> {
        this.logger.info('GetManufacturerCountryByIdHandler#execute.call', { id: query.id });
        return this.repository.findOne(query.id);
    }
}

@QueryHandler(GetManufacturerCountryByCodeQuery)
export class GetManufacturerCountryByCodeHandler implements IQueryHandler<GetManufacturerCountryByCodeQuery> {
    constructor(
        private readonly repository: ManufacturerCountryRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(GetManufacturerCountryByCodeHandler.name);
    }

    async execute(query: GetManufacturerCountryByCodeQuery): Promise<ManufacturerCountry | null> {
        this.logger.info('GetManufacturerCountryByCodeHandler#execute.call', { code: query.code });
        return this.repository.findByCode(query.code);
    }
}

@QueryHandler(CountManufacturerCountriesQuery)
export class CountManufacturerCountriesHandler implements IQueryHandler<CountManufacturerCountriesQuery> {
    constructor(
        private readonly repository: ManufacturerCountryRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(CountManufacturerCountriesHandler.name);
    }

    async execute(query: CountManufacturerCountriesQuery): Promise<number> {
        this.logger.info('CountManufacturerCountriesHandler#execute.call', query.options);
        return this.repository.count(query.options);
    }
}

export const ManufacturerCountryHandlers = [
    CreateManufacturerCountryHandler,
    UpdateManufacturerCountryHandler,
    GetManufacturerCountriesHandler,
    GetManufacturerCountryByIdHandler,
    GetManufacturerCountryByCodeHandler,
    CountManufacturerCountriesHandler,
];
