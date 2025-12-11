import { CommandHandler, ICommandHandler, QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { VendorRepository } from '../repositories/vendor.repository';
import {
    CreateVendorCommand,
    UpdateVendorCommand,
    DeleteVendorCommand,
    GetVendorsQuery,
    GetVendorByIdQuery,
    GetVendorByCodeQuery,
    CountVendorsQuery,
} from '../vendor.cqrs';

@CommandHandler(CreateVendorCommand)
export class CreateVendorHandler implements ICommandHandler<CreateVendorCommand> {
    constructor(private readonly repository: VendorRepository) { }
    async execute(command: CreateVendorCommand) {
        return this.repository.create(command.dto);
    }
}

@CommandHandler(UpdateVendorCommand)
export class UpdateVendorHandler implements ICommandHandler<UpdateVendorCommand> {
    constructor(private readonly repository: VendorRepository) { }
    async execute(command: UpdateVendorCommand) {
        return this.repository.update(command.id, command.dto);
    }
}

@CommandHandler(DeleteVendorCommand)
export class DeleteVendorHandler implements ICommandHandler<DeleteVendorCommand> {
    constructor(private readonly repository: VendorRepository) { }
    async execute(command: DeleteVendorCommand) {
        return this.repository.delete(command.id);
    }
}

@QueryHandler(GetVendorsQuery)
export class GetVendorsHandler implements IQueryHandler<GetVendorsQuery> {
    constructor(private readonly repository: VendorRepository) { }
    async execute(query: GetVendorsQuery) {
        return this.repository.findAll(query.options);
    }
}

@QueryHandler(GetVendorByIdQuery)
export class GetVendorByIdHandler implements IQueryHandler<GetVendorByIdQuery> {
    constructor(private readonly repository: VendorRepository) { }
    async execute(query: GetVendorByIdQuery) {
        return this.repository.findById(query.id);
    }
}

@QueryHandler(GetVendorByCodeQuery)
export class GetVendorByCodeHandler implements IQueryHandler<GetVendorByCodeQuery> {
    constructor(private readonly repository: VendorRepository) { }
    async execute(query: GetVendorByCodeQuery) {
        return this.repository.findByCode(query.code);
    }
}

@QueryHandler(CountVendorsQuery)
export class CountVendorsHandler implements IQueryHandler<CountVendorsQuery> {
    constructor(private readonly repository: VendorRepository) { }
    async execute(query: CountVendorsQuery) {
        return this.repository.count(query.options);
    }
}

export const VendorHandlers = [
    CreateVendorHandler,
    UpdateVendorHandler,
    DeleteVendorHandler,
    GetVendorsHandler,
    GetVendorByIdHandler,
    GetVendorByCodeHandler,
    CountVendorsHandler,
];
