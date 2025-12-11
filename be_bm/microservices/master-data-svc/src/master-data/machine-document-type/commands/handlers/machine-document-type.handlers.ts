import { CommandHandler, ICommandHandler, QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import {
    CreateMachineDocumentTypeCommand,
    UpdateMachineDocumentTypeCommand,
    GetMachineDocumentTypesQuery,
    GetMachineDocumentTypeByIdQuery,
    GetMachineDocumentTypeByCodeQuery,
    CountMachineDocumentTypesQuery
} from '../../machine-document-type.cqrs';
import { MachineDocumentTypeRepository } from '../../repositories/machine-document-type.repository';
import { MachineDocumentType } from '../../entities/machine-document-type.entity';

@CommandHandler(CreateMachineDocumentTypeCommand)
export class CreateMachineDocumentTypeHandler implements ICommandHandler<CreateMachineDocumentTypeCommand> {
    constructor(
        private readonly repository: MachineDocumentTypeRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(CreateMachineDocumentTypeHandler.name);
    }

    async execute(command: CreateMachineDocumentTypeCommand): Promise<MachineDocumentType> {
        this.logger.info('CreateMachineDocumentTypeHandler#execute.call', { code: command.dto.code });
        return this.repository.create(command.dto);
    }
}

@CommandHandler(UpdateMachineDocumentTypeCommand)
export class UpdateMachineDocumentTypeHandler implements ICommandHandler<UpdateMachineDocumentTypeCommand> {
    constructor(
        private readonly repository: MachineDocumentTypeRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(UpdateMachineDocumentTypeHandler.name);
    }

    async execute(command: UpdateMachineDocumentTypeCommand): Promise<MachineDocumentType> {
        this.logger.info('UpdateMachineDocumentTypeHandler#execute.call', { id: command.id });
        return this.repository.update(command.id, command.dto);
    }
}

@QueryHandler(GetMachineDocumentTypesQuery)
export class GetMachineDocumentTypesHandler implements IQueryHandler<GetMachineDocumentTypesQuery> {
    constructor(
        private readonly repository: MachineDocumentTypeRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(GetMachineDocumentTypesHandler.name);
    }

    async execute(query: GetMachineDocumentTypesQuery): Promise<MachineDocumentType[]> {
        this.logger.info('GetMachineDocumentTypesHandler#execute.call', query.options);
        return this.repository.findAll(query.options);
    }
}

@QueryHandler(GetMachineDocumentTypeByIdQuery)
export class GetMachineDocumentTypeByIdHandler implements IQueryHandler<GetMachineDocumentTypeByIdQuery> {
    constructor(
        private readonly repository: MachineDocumentTypeRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(GetMachineDocumentTypeByIdHandler.name);
    }

    async execute(query: GetMachineDocumentTypeByIdQuery): Promise<MachineDocumentType | null> {
        this.logger.info('GetMachineDocumentTypeByIdHandler#execute.call', { id: query.id });
        return this.repository.findOne(query.id);
    }
}

@QueryHandler(GetMachineDocumentTypeByCodeQuery)
export class GetMachineDocumentTypeByCodeHandler implements IQueryHandler<GetMachineDocumentTypeByCodeQuery> {
    constructor(
        private readonly repository: MachineDocumentTypeRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(GetMachineDocumentTypeByCodeHandler.name);
    }

    async execute(query: GetMachineDocumentTypeByCodeQuery): Promise<MachineDocumentType | null> {
        this.logger.info('GetMachineDocumentTypeByCodeHandler#execute.call', { code: query.code });
        return this.repository.findByCode(query.code);
    }
}

@QueryHandler(CountMachineDocumentTypesQuery)
export class CountMachineDocumentTypesHandler implements IQueryHandler<CountMachineDocumentTypesQuery> {
    constructor(
        private readonly repository: MachineDocumentTypeRepository,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(CountMachineDocumentTypesHandler.name);
    }

    async execute(query: CountMachineDocumentTypesQuery): Promise<number> {
        this.logger.info('CountMachineDocumentTypesHandler#execute.call', query.options);
        return this.repository.count(query.options);
    }
}

export const MachineDocumentTypeHandlers = [
    CreateMachineDocumentTypeHandler,
    UpdateMachineDocumentTypeHandler,
    GetMachineDocumentTypesHandler,
    GetMachineDocumentTypeByIdHandler,
    GetMachineDocumentTypeByCodeHandler,
    CountMachineDocumentTypesHandler,
];
