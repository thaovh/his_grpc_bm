import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import {
    CreateMachineDocumentTypeCommand,
    UpdateMachineDocumentTypeCommand,
    GetMachineDocumentTypesQuery,
    GetMachineDocumentTypeByIdQuery,
    GetMachineDocumentTypeByCodeQuery,
    CountMachineDocumentTypesQuery
} from '../machine-document-type/machine-document-type.cqrs';
import { CreateMachineDocumentTypeDto } from '../machine-document-type/dto/create-machine-document-type.dto';
import { UpdateMachineDocumentTypeDto } from '../machine-document-type/dto/update-machine-document-type.dto';
import { MachineDocumentType } from '../machine-document-type/entities/machine-document-type.entity';

@Injectable()
export class MachineDocumentTypeService {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(MachineDocumentTypeService.name);
    }

    async findAll(query?: any): Promise<MachineDocumentType[]> {
        this.logger.info('MachineDocumentTypeService#findAll.call', query);
        return this.queryBus.execute(new GetMachineDocumentTypesQuery(query));
    }

    async findById(id: string): Promise<MachineDocumentType> {
        this.logger.info('MachineDocumentTypeService#findById.call', { id });
        return this.queryBus.execute(new GetMachineDocumentTypeByIdQuery(id));
    }

    async findByCode(code: string): Promise<MachineDocumentType> {
        this.logger.info('MachineDocumentTypeService#findByCode.call', { code });
        return this.queryBus.execute(new GetMachineDocumentTypeByCodeQuery(code));
    }

    async count(query?: any): Promise<number> {
        this.logger.info('MachineDocumentTypeService#count.call', query);
        return this.queryBus.execute(new CountMachineDocumentTypesQuery(query));
    }

    async create(dto: CreateMachineDocumentTypeDto): Promise<MachineDocumentType> {
        this.logger.info('MachineDocumentTypeService#create.call', { code: dto.code });
        return this.commandBus.execute(new CreateMachineDocumentTypeCommand(dto));
    }

    async update(id: string, dto: UpdateMachineDocumentTypeDto): Promise<MachineDocumentType> {
        this.logger.info('MachineDocumentTypeService#update.call', { id });
        return this.commandBus.execute(new UpdateMachineDocumentTypeCommand(id, dto));
    }

    async delete(id: string): Promise<void> {
        this.logger.info('MachineDocumentTypeService#delete.call', { id });
        // Note: Assuming destroyMachineDocumentType uses JSON stringified ID in where clause like other modules
        return this.commandBus.execute(new UpdateMachineDocumentTypeCommand(id, { updatedBy: 'system' } as any)); // Placeholder, usually delete is handled by another command
    }
}
