import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
    CreateTransferTypeCommand,
    UpdateTransferTypeCommand,
    DeleteTransferTypeCommand,
    GetTransferTypesQuery,
    GetTransferTypeByIdQuery,
    GetTransferTypeByCodeQuery,
    CountTransferTypesQuery
} from '../transfer-type/transfer-type.cqrs';

@Injectable()
export class TransferTypeService {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    async findAll(options?: any) {
        return this.queryBus.execute(new GetTransferTypesQuery(options));
    }

    async findById(id: string) {
        return this.queryBus.execute(new GetTransferTypeByIdQuery(id));
    }

    async findByCode(code: string) {
        return this.queryBus.execute(new GetTransferTypeByCodeQuery(code));
    }

    async count(options?: any) {
        return this.queryBus.execute(new CountTransferTypesQuery(options));
    }

    async create(data: any) {
        return this.commandBus.execute(new CreateTransferTypeCommand(data));
    }

    async update(id: string, data: any) {
        return this.commandBus.execute(new UpdateTransferTypeCommand(id, data));
    }

    async delete(id: string) {
        return this.commandBus.execute(new DeleteTransferTypeCommand(id));
    }
}
