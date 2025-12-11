import { CommandHandler, ICommandHandler, QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
import { PinoLogger } from 'nestjs-pino';
import {
    CreateDepartmentCommand,
    UpdateDepartmentCommand,
    GetDepartmentsQuery,
    GetDepartmentByIdQuery,
    GetDepartmentByCodeQuery,
    CountDepartmentsQuery
} from '../../department.cqrs';
import { DepartmentRepository } from '../../repositories/department.repository';
import { Department } from '../../entities/department.entity';

@CommandHandler(CreateDepartmentCommand)
export class CreateDepartmentHandler implements ICommandHandler<CreateDepartmentCommand> {
    constructor(private readonly repository: DepartmentRepository, private readonly logger: PinoLogger) {
        this.logger.setContext(CreateDepartmentHandler.name);
    }
    async execute(command: CreateDepartmentCommand): Promise<Department> {
        return this.repository.create(command.departmentDto);
    }
}

@CommandHandler(UpdateDepartmentCommand)
export class UpdateDepartmentHandler implements ICommandHandler<UpdateDepartmentCommand> {
    constructor(private readonly repository: DepartmentRepository, private readonly logger: PinoLogger) {
        this.logger.setContext(UpdateDepartmentHandler.name);
    }
    async execute(command: UpdateDepartmentCommand): Promise<Department> {
        return this.repository.update(command.id, command.departmentDto);
    }
}

@QueryHandler(GetDepartmentsQuery)
export class GetDepartmentsHandler implements IQueryHandler<GetDepartmentsQuery> {
    constructor(private readonly repository: DepartmentRepository) { }
    async execute(query: GetDepartmentsQuery): Promise<Department[]> {
        return this.repository.findAll(query.options);
    }
}

@QueryHandler(GetDepartmentByIdQuery)
export class GetDepartmentByIdHandler implements IQueryHandler<GetDepartmentByIdQuery> {
    constructor(private readonly repository: DepartmentRepository) { }
    async execute(query: GetDepartmentByIdQuery): Promise<Department | null> {
        const result = await this.repository.findOne(query.id);
        if (!result) {
            throw new RpcException({
                code: 5, // NOT_FOUND
                message: 'DEPARTMENT_NOT_FOUND',
            });
        }
        return result;
    }
}

@QueryHandler(GetDepartmentByCodeQuery)
export class GetDepartmentByCodeHandler implements IQueryHandler<GetDepartmentByCodeQuery> {
    constructor(private readonly repository: DepartmentRepository) { }
    async execute(query: GetDepartmentByCodeQuery): Promise<Department | null> {
        return this.repository.findByCode(query.code);
    }
}

@QueryHandler(CountDepartmentsQuery)
export class CountDepartmentsHandler implements IQueryHandler<CountDepartmentsQuery> {
    constructor(private readonly repository: DepartmentRepository) { }
    async execute(query: CountDepartmentsQuery): Promise<number> {
        return this.repository.count(query.options);
    }
}

export const DepartmentHandlers = [
    CreateDepartmentHandler,
    UpdateDepartmentHandler,
    GetDepartmentsHandler,
    GetDepartmentByIdHandler,
    GetDepartmentByCodeHandler,
    CountDepartmentsHandler,
];
