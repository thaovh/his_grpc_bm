import { PinoLogger } from 'nestjs-pino';
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindManyOptions } from 'typeorm';

import { InventoryService } from '../inventory.interface';
import { ExpMest } from '../entities/exp-mest.entity';
import { CreateExpMestDto } from '../dto/create-exp-mest.dto';
import { UpdateExpMestDto } from '../dto/update-exp-mest.dto';

import { CreateExpMestCommand } from '../commands/create-exp-mest.command';
import { UpdateExpMestCommand } from '../commands/update-exp-mest.command';
import { GetExpMestsQuery } from '../queries/get-exp-mests.query';
import { GetExpMestByIdQuery } from '../queries/get-exp-mest-by-id.query';
import { GetExpMestByExpMestIdQuery } from '../queries/get-exp-mest-by-exp-mest-id.query';
import { CountExpMestsQuery } from '../queries/count-exp-mests.query';
import { InventoryRepository } from '../repositories/inventory.repository';

@Injectable()
export class InventoryServiceImpl implements InventoryService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly repository: InventoryRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(InventoryServiceImpl.name);
  }

  async findAll(query?: FindManyOptions<ExpMest>): Promise<Array<ExpMest>> {
    this.logger.info('InventoryService#findAll.call', query);
    return this.queryBus.execute(new GetExpMestsQuery(query));
  }

  async findById(id: string): Promise<ExpMest | null> {
    this.logger.info('InventoryService#findById.call', { id });
    return this.queryBus.execute(new GetExpMestByIdQuery(id));
  }

  async findByExpMestId(expMestId: number): Promise<ExpMest | null> {
    this.logger.info('InventoryService#findByExpMestId.call', { expMestId });
    return this.queryBus.execute(new GetExpMestByExpMestIdQuery(expMestId));
  }

  async count(query?: FindManyOptions<ExpMest>): Promise<number> {
    this.logger.info('InventoryService#count.call', query);
    return this.queryBus.execute(new CountExpMestsQuery(query));
  }

  async create(expMestDto: CreateExpMestDto): Promise<ExpMest> {
    this.logger.info('InventoryService#create.call', { expMestId: expMestDto.expMestId });
    return this.commandBus.execute(new CreateExpMestCommand(expMestDto));
  }

  async update(id: string, expMestDto: UpdateExpMestDto): Promise<ExpMest> {
    this.logger.info('InventoryService#update.call', { id });
    return this.commandBus.execute(new UpdateExpMestCommand(id, expMestDto));
  }

  async delete(id: string): Promise<void> {
    this.logger.info('InventoryService#delete.call', { id });
    await this.repository.delete(id);
  }
}

