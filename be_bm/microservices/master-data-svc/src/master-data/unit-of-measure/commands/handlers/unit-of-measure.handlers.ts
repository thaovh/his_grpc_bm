import { CommandHandler, ICommandHandler, QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import { CreateUnitOfMeasureCommand } from '../create-unit-of-measure.command';
import { UpdateUnitOfMeasureCommand } from '../update-unit-of-measure.command';
import { GetUnitOfMeasuresQuery } from '../../queries/get-unit-of-measures.query';
import { GetUnitOfMeasureByIdQuery } from '../../queries/get-unit-of-measure-by-id.query';
import { GetUnitOfMeasureByCodeQuery } from '../../queries/get-unit-of-measure-by-code.query';
import { CountUnitOfMeasuresQuery } from '../../queries/count-unit-of-measures.query';
import { UnitOfMeasureRepository } from '../../repositories/unit-of-measure.repository';
import { UnitOfMeasure } from '../../entities/unit-of-measure.entity';

@CommandHandler(CreateUnitOfMeasureCommand)
export class CreateUnitOfMeasureHandler implements ICommandHandler<CreateUnitOfMeasureCommand> {
    constructor(
        private readonly repository: UnitOfMeasureRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(CreateUnitOfMeasureHandler.name);
    }

    async execute(command: CreateUnitOfMeasureCommand): Promise<UnitOfMeasure> {
        this.logger.info('CreateUnitOfMeasureHandler#execute.call', { code: command.unitOfMeasureDto.code });
        const unitOfMeasure = await this.repository.create(command.unitOfMeasureDto);
        this.logger.info('CreateUnitOfMeasureHandler#execute.result', { id: unitOfMeasure.id, code: unitOfMeasure.code });
        return unitOfMeasure;
    }
}

@CommandHandler(UpdateUnitOfMeasureCommand)
export class UpdateUnitOfMeasureHandler implements ICommandHandler<UpdateUnitOfMeasureCommand> {
    constructor(
        private readonly repository: UnitOfMeasureRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(UpdateUnitOfMeasureHandler.name);
    }

    async execute(command: UpdateUnitOfMeasureCommand): Promise<UnitOfMeasure> {
        this.logger.info('UpdateUnitOfMeasureHandler#execute.call', { id: command.id });
        const unitOfMeasure = await this.repository.update(command.id, command.unitOfMeasureDto);
        this.logger.info('UpdateUnitOfMeasureHandler#execute.result', { id: unitOfMeasure.id });
        return unitOfMeasure;
    }
}

@QueryHandler(GetUnitOfMeasuresQuery)
export class GetUnitOfMeasuresHandler implements IQueryHandler<GetUnitOfMeasuresQuery> {
    constructor(
        private readonly repository: UnitOfMeasureRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(GetUnitOfMeasuresHandler.name);
    }

    async execute(query: GetUnitOfMeasuresQuery): Promise<UnitOfMeasure[]> {
        this.logger.info('GetUnitOfMeasuresHandler#execute.call', query.options);
        return this.repository.findAll(query.options);
    }
}

@QueryHandler(GetUnitOfMeasureByIdQuery)
export class GetUnitOfMeasureByIdHandler implements IQueryHandler<GetUnitOfMeasureByIdQuery> {
    constructor(
        private readonly repository: UnitOfMeasureRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(GetUnitOfMeasureByIdHandler.name);
    }

    async execute(query: GetUnitOfMeasureByIdQuery): Promise<UnitOfMeasure | null> {
        this.logger.info('GetUnitOfMeasureByIdHandler#execute.call', { id: query.id });
        return this.repository.findOne(query.id);
    }
}

@QueryHandler(GetUnitOfMeasureByCodeQuery)
export class GetUnitOfMeasureByCodeHandler implements IQueryHandler<GetUnitOfMeasureByCodeQuery> {
    constructor(
        private readonly repository: UnitOfMeasureRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(GetUnitOfMeasureByCodeHandler.name);
    }

    async execute(query: GetUnitOfMeasureByCodeQuery): Promise<UnitOfMeasure | null> {
        this.logger.info('GetUnitOfMeasureByCodeHandler#execute.call', { code: query.code });
        return this.repository.findByCode(query.code);
    }
}

@QueryHandler(CountUnitOfMeasuresQuery)
export class CountUnitOfMeasuresHandler implements IQueryHandler<CountUnitOfMeasuresQuery> {
    constructor(
        private readonly repository: UnitOfMeasureRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(CountUnitOfMeasuresHandler.name);
    }

    async execute(query: CountUnitOfMeasuresQuery): Promise<number> {
        this.logger.info('CountUnitOfMeasuresHandler#execute.call', query.options);
        return this.repository.count(query.options);
    }
}

export const UnitOfMeasureHandlers = [
    CreateUnitOfMeasureHandler,
    UpdateUnitOfMeasureHandler,
    GetUnitOfMeasuresHandler,
    GetUnitOfMeasureByIdHandler,
    GetUnitOfMeasureByCodeHandler,
    CountUnitOfMeasuresHandler,
];
