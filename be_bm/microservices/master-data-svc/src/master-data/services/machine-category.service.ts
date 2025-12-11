import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import {
    CreateMachineCategoryCommand,
    UpdateMachineCategoryCommand,
    DeleteMachineCategoryCommand,
    GetMachineCategoriesQuery,
    GetMachineCategoryByIdQuery,
    GetMachineCategoryByCodeQuery,
    CountMachineCategoriesQuery
} from '../machine-category/machine-category.cqrs';
import { CreateMachineCategoryDto } from '../machine-category/dto/create-machine-category.dto';
import { UpdateMachineCategoryDto } from '../machine-category/dto/update-machine-category.dto';
import { MachineCategory } from '../machine-category/entities/machine-category.entity';

@Injectable()
export class MachineCategoryService {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(MachineCategoryService.name);
    }

    async findAll(query?: any): Promise<MachineCategory[]> {
        this.logger.info('MachineCategoryService#findAll.call', query);
        return this.queryBus.execute(new GetMachineCategoriesQuery(query));
    }

    async findById(id: string): Promise<MachineCategory> {
        this.logger.info('MachineCategoryService#findById.call', { id });
        return this.queryBus.execute(new GetMachineCategoryByIdQuery(id));
    }

    async findByCode(code: string): Promise<MachineCategory> {
        this.logger.info('MachineCategoryService#findByCode.call', { code });
        return this.queryBus.execute(new GetMachineCategoryByCodeQuery(code));
    }

    async count(query?: any): Promise<number> {
        this.logger.info('MachineCategoryService#count.call', query);
        return this.queryBus.execute(new CountMachineCategoriesQuery(query));
    }

    async create(dto: CreateMachineCategoryDto): Promise<MachineCategory> {
        this.logger.info('MachineCategoryService#create.call', { code: dto.code });
        return this.commandBus.execute(new CreateMachineCategoryCommand(dto));
    }

    async update(id: string, dto: UpdateMachineCategoryDto): Promise<MachineCategory> {
        this.logger.info('MachineCategoryService#update.call', { id });
        return this.commandBus.execute(new UpdateMachineCategoryCommand(id, dto));
    }

    async delete(id: string): Promise<void> {
        this.logger.info('MachineCategoryService#delete.call', { id });
        return this.commandBus.execute(new DeleteMachineCategoryCommand(id));
    }
}
