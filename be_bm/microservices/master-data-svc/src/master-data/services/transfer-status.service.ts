import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
    CreateTransferStatusCommand,
    UpdateTransferStatusCommand,
    DeleteTransferStatusCommand,
    GetTransferStatusesQuery,
    GetTransferStatusByIdQuery,
    GetTransferStatusByCodeQuery,
    CountTransferStatusesQuery,
} from '../transfer-status/transfer-status.cqrs';
import { CreateTransferStatusDto } from '../transfer-status/dto/create-transfer-status.dto';
import { UpdateTransferStatusDto } from '../transfer-status/dto/update-transfer-status.dto';
import { FindManyOptions } from 'typeorm';
import { TransferStatus } from '../transfer-status/entities/transfer-status.entity';

@Injectable()
export class TransferStatusService {
    constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) { }

    async findAll(options?: FindManyOptions<TransferStatus>) {
        return this.queryBus.execute(new GetTransferStatusesQuery(options));
    }

    async findById(id: string) {
        return this.queryBus.execute(new GetTransferStatusByIdQuery(id));
    }

    async findByCode(code: string) {
        return this.queryBus.execute(new GetTransferStatusByCodeQuery(code));
    }

    async count(options?: FindManyOptions<TransferStatus>) {
        return this.queryBus.execute(new CountTransferStatusesQuery(options));
    }

    async create(dto: CreateTransferStatusDto) {
        return this.commandBus.execute(new CreateTransferStatusCommand(dto));
    }

    async update(id: string, dto: UpdateTransferStatusDto) {
        return this.commandBus.execute(new UpdateTransferStatusCommand(id, dto));
    }

    async delete(id: string) {
        return this.commandBus.execute(new DeleteTransferStatusCommand(id));
    }
}
