import { CommandHandler, ICommandHandler, QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import {
    CreateMachineFundingSourceCommand,
    UpdateMachineFundingSourceCommand,
    GetMachineFundingSourcesQuery,
    GetMachineFundingSourceByIdQuery,
    GetMachineFundingSourceByCodeQuery,
    CountMachineFundingSourcesQuery
} from '../../machine-funding-source.cqrs';
import { MachineFundingSourceRepository } from '../../repositories/machine-funding-source.repository';
import { MachineFundingSource } from '../../entities/machine-funding-source.entity';

@CommandHandler(CreateMachineFundingSourceCommand)
export class CreateMachineFundingSourceHandler implements ICommandHandler<CreateMachineFundingSourceCommand> {
    constructor(
        private readonly repository: MachineFundingSourceRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(CreateMachineFundingSourceHandler.name);
    }

    async execute(command: CreateMachineFundingSourceCommand): Promise<MachineFundingSource> {
        this.logger.info('CreateMachineFundingSourceHandler#execute.call', { code: command.dto.code });
        return this.repository.create(command.dto);
    }
}

@CommandHandler(UpdateMachineFundingSourceCommand)
export class UpdateMachineFundingSourceHandler implements ICommandHandler<UpdateMachineFundingSourceCommand> {
    constructor(
        private readonly repository: MachineFundingSourceRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(UpdateMachineFundingSourceHandler.name);
    }

    async execute(command: UpdateMachineFundingSourceCommand): Promise<MachineFundingSource> {
        this.logger.info('UpdateMachineFundingSourceHandler#execute.call', { id: command.id });
        return this.repository.update(command.id, command.dto);
    }
}

@QueryHandler(GetMachineFundingSourcesQuery)
export class GetMachineFundingSourcesHandler implements IQueryHandler<GetMachineFundingSourcesQuery> {
    constructor(
        private readonly repository: MachineFundingSourceRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(GetMachineFundingSourcesHandler.name);
    }

    async execute(query: GetMachineFundingSourcesQuery): Promise<MachineFundingSource[]> {
        this.logger.info('GetMachineFundingSourcesHandler#execute.call', query.options);
        return this.repository.findAll(query.options);
    }
}

@QueryHandler(GetMachineFundingSourceByIdQuery)
export class GetMachineFundingSourceByIdHandler implements IQueryHandler<GetMachineFundingSourceByIdQuery> {
    constructor(
        private readonly repository: MachineFundingSourceRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(GetMachineFundingSourceByIdHandler.name);
    }

    async execute(query: GetMachineFundingSourceByIdQuery): Promise<MachineFundingSource | null> {
        this.logger.info('GetMachineFundingSourceByIdHandler#execute.call', { id: query.id });
        return this.repository.findOne(query.id);
    }
}

@QueryHandler(GetMachineFundingSourceByCodeQuery)
export class GetMachineFundingSourceByCodeHandler implements IQueryHandler<GetMachineFundingSourceByCodeQuery> {
    constructor(
        private readonly repository: MachineFundingSourceRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(GetMachineFundingSourceByCodeHandler.name);
    }

    async execute(query: GetMachineFundingSourceByCodeQuery): Promise<MachineFundingSource | null> {
        this.logger.info('GetMachineFundingSourceByCodeHandler#execute.call', { code: query.code });
        return this.repository.findByCode(query.code);
    }
}

@QueryHandler(CountMachineFundingSourcesQuery)
export class CountMachineFundingSourcesHandler implements IQueryHandler<CountMachineFundingSourcesQuery> {
    constructor(
        private readonly repository: MachineFundingSourceRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(CountMachineFundingSourcesHandler.name);
    }

    async execute(query: CountMachineFundingSourcesQuery): Promise<number> {
        this.logger.info('CountMachineFundingSourcesHandler#execute.call', query.options);
        return this.repository.count(query.options);
    }
}

export const MachineFundingSourceHandlers = [
    CreateMachineFundingSourceHandler,
    UpdateMachineFundingSourceHandler,
    GetMachineFundingSourcesHandler,
    GetMachineFundingSourceByIdHandler,
    GetMachineFundingSourceByCodeHandler,
    CountMachineFundingSourcesHandler,
];
