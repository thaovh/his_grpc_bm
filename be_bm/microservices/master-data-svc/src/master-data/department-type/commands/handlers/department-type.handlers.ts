import { CommandHandler, ICommandHandler, QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import {
    CreateDepartmentTypeCommand,
    UpdateDepartmentTypeCommand,
    GetDepartmentTypesQuery,
    GetDepartmentTypeByIdQuery,
    GetDepartmentTypeByCodeQuery,
    CountDepartmentTypesQuery
} from '../../department-type.cqrs';
import { DepartmentTypeRepository } from '../../repositories/department-type.repository';
import { DepartmentType } from '../../entities/department-type.entity';

@CommandHandler(CreateDepartmentTypeCommand)
export class CreateDepartmentTypeHandler implements ICommandHandler<CreateDepartmentTypeCommand> {
    constructor(private readonly repository: DepartmentTypeRepository, private readonly logger: PinoLogger) {
        this.logger.setContext(CreateDepartmentTypeHandler.name);
    }
    async execute(command: CreateDepartmentTypeCommand): Promise<DepartmentType> {
        return this.repository.create(command.departmentTypeDto);
    }
}

@CommandHandler(UpdateDepartmentTypeCommand)
export class UpdateDepartmentTypeHandler implements ICommandHandler<UpdateDepartmentTypeCommand> {
    constructor(private readonly repository: DepartmentTypeRepository, private readonly logger: PinoLogger) {
        this.logger.setContext(UpdateDepartmentTypeHandler.name);
    }
    async execute(command: UpdateDepartmentTypeCommand): Promise<DepartmentType> {
        return this.repository.update(command.id, command.departmentTypeDto);
    }
}

@QueryHandler(GetDepartmentTypesQuery)
export class GetDepartmentTypesHandler implements IQueryHandler<GetDepartmentTypesQuery> {
    constructor(private readonly repository: DepartmentTypeRepository) { }
    async execute(query: GetDepartmentTypesQuery): Promise<DepartmentType[]> {
        return this.repository.findAll(query.options);
    }
}

@QueryHandler(GetDepartmentTypeByIdQuery)
export class GetDepartmentTypeByIdHandler implements IQueryHandler<GetDepartmentTypeByIdQuery> {
    constructor(private readonly repository: DepartmentTypeRepository) { }
    async execute(query: GetDepartmentTypeByIdQuery): Promise<DepartmentType | null> {
        return this.repository.findOne(query.id);
    }
}

@QueryHandler(GetDepartmentTypeByCodeQuery)
export class GetDepartmentTypeByCodeHandler implements IQueryHandler<GetDepartmentTypeByCodeQuery> {
    constructor(private readonly repository: DepartmentTypeRepository) { }
    async execute(query: GetDepartmentTypeByCodeQuery): Promise<DepartmentType | null> {
        return this.repository.findByCode(query.code);
    }
}

@QueryHandler(CountDepartmentTypesQuery)
export class CountDepartmentTypesHandler implements IQueryHandler<CountDepartmentTypesQuery> {
    constructor(private readonly repository: DepartmentTypeRepository) { }
    async execute(query: CountDepartmentTypesQuery): Promise<number> {
        return this.repository.count(query.options);
    }
}

export const DepartmentTypeHandlers = [
    CreateDepartmentTypeHandler,
    UpdateDepartmentTypeHandler,
    GetDepartmentTypesHandler,
    GetDepartmentTypeByIdHandler,
    GetDepartmentTypeByCodeHandler,
    CountDepartmentTypesHandler,
];
