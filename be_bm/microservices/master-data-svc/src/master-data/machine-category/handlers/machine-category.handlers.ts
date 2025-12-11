import { CommandHandler, ICommandHandler, QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import {
    CreateMachineCategoryCommand,
    UpdateMachineCategoryCommand,
    DeleteMachineCategoryCommand,
    GetMachineCategoriesQuery,
    GetMachineCategoryByIdQuery,
    GetMachineCategoryByCodeQuery,
    CountMachineCategoriesQuery
} from '../machine-category.cqrs';
import { MachineCategoryRepository } from '../repositories/machine-category.repository';
import { MachineCategory } from '../entities/machine-category.entity';

@CommandHandler(CreateMachineCategoryCommand)
export class CreateMachineCategoryHandler implements ICommandHandler<CreateMachineCategoryCommand> {
    constructor(
        private readonly repository: MachineCategoryRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(CreateMachineCategoryHandler.name);
    }

    async execute(command: CreateMachineCategoryCommand): Promise<MachineCategory> {
        this.logger.info('CreateMachineCategoryHandler#execute.call', { code: command.dto.code });
        return this.repository.create(command.dto);
    }
}

@CommandHandler(UpdateMachineCategoryCommand)
export class UpdateMachineCategoryHandler implements ICommandHandler<UpdateMachineCategoryCommand> {
    constructor(
        private readonly repository: MachineCategoryRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(UpdateMachineCategoryHandler.name);
    }

    async execute(command: UpdateMachineCategoryCommand): Promise<MachineCategory> {
        this.logger.info('UpdateMachineCategoryHandler#execute.call', { id: command.id });
        return this.repository.update(command.id, command.dto);
    }
}

@CommandHandler(DeleteMachineCategoryCommand)
export class DeleteMachineCategoryHandler implements ICommandHandler<DeleteMachineCategoryCommand> {
    constructor(
        private readonly repository: MachineCategoryRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(DeleteMachineCategoryHandler.name);
    }

    async execute(command: DeleteMachineCategoryCommand): Promise<void> {
        this.logger.info('DeleteMachineCategoryHandler#execute.call', { id: command.id });
        return this.repository.delete(command.id);
    }
}

@QueryHandler(GetMachineCategoriesQuery)
export class GetMachineCategoriesHandler implements IQueryHandler<GetMachineCategoriesQuery> {
    constructor(
        private readonly repository: MachineCategoryRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(GetMachineCategoriesHandler.name);
    }

    async execute(query: GetMachineCategoriesQuery): Promise<MachineCategory[]> {
        this.logger.info('GetMachineCategoriesHandler#execute.call', query.options);
        return this.repository.findAll(query.options);
    }
}

@QueryHandler(GetMachineCategoryByIdQuery)
export class GetMachineCategoryByIdHandler implements IQueryHandler<GetMachineCategoryByIdQuery> {
    constructor(
        private readonly repository: MachineCategoryRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(GetMachineCategoryByIdHandler.name);
    }

    async execute(query: GetMachineCategoryByIdQuery): Promise<MachineCategory | null> {
        this.logger.info('GetMachineCategoryByIdHandler#execute.call', { id: query.id });
        return this.repository.findOne(query.id);
    }
}

@QueryHandler(GetMachineCategoryByCodeQuery)
export class GetMachineCategoryByCodeHandler implements IQueryHandler<GetMachineCategoryByCodeQuery> {
    constructor(
        private readonly repository: MachineCategoryRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(GetMachineCategoryByCodeHandler.name);
    }

    async execute(query: GetMachineCategoryByCodeQuery): Promise<MachineCategory | null> {
        this.logger.info('GetMachineCategoryByCodeHandler#execute.call', { code: query.code });
        return this.repository.findByCode(query.code);
    }
}

@QueryHandler(CountMachineCategoriesQuery)
export class CountMachineCategoriesHandler implements IQueryHandler<CountMachineCategoriesQuery> {
    constructor(
        private readonly repository: MachineCategoryRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(CountMachineCategoriesHandler.name);
    }

    async execute(query: CountMachineCategoriesQuery): Promise<number> {
        this.logger.info('CountMachineCategoriesHandler#execute.call', query.options);
        return this.repository.count(query.options);
    }
}

export const MachineCategoryHandlers = [
    CreateMachineCategoryHandler,
    UpdateMachineCategoryHandler,
    DeleteMachineCategoryHandler,
    GetMachineCategoriesHandler,
    GetMachineCategoryByIdHandler,
    GetMachineCategoryByCodeHandler,
    CountMachineCategoriesHandler,
];
