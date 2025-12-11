import { PinoLogger } from 'nestjs-pino';
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindManyOptions } from 'typeorm';

import { UnitOfMeasure } from '../unit-of-measure/entities/unit-of-measure.entity';
import { CreateUnitOfMeasureDto } from '../unit-of-measure/dto/create-unit-of-measure.dto';
import { UpdateUnitOfMeasureDto } from '../unit-of-measure/dto/update-unit-of-measure.dto';

import { CreateUnitOfMeasureCommand } from '../unit-of-measure/commands/create-unit-of-measure.command';
import { UpdateUnitOfMeasureCommand } from '../unit-of-measure/commands/update-unit-of-measure.command';
import { GetUnitOfMeasuresQuery } from '../unit-of-measure/queries/get-unit-of-measures.query';
import { GetUnitOfMeasureByIdQuery } from '../unit-of-measure/queries/get-unit-of-measure-by-id.query';
import { GetUnitOfMeasureByCodeQuery } from '../unit-of-measure/queries/get-unit-of-measure-by-code.query';
import { CountUnitOfMeasuresQuery } from '../unit-of-measure/queries/count-unit-of-measures.query';
import { UnitOfMeasureRepository } from '../unit-of-measure/repositories/unit-of-measure.repository';

@Injectable()
export class UnitOfMeasureService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly repository: UnitOfMeasureRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UnitOfMeasureService.name);
  }

  async findAll(query?: FindManyOptions<UnitOfMeasure>): Promise<Array<UnitOfMeasure>> {
    this.logger.info('UnitOfMeasureService#findAll.call', query);
    return this.queryBus.execute(new GetUnitOfMeasuresQuery(query));
  }

  async findById(id: string): Promise<UnitOfMeasure | null> {
    this.logger.info('UnitOfMeasureService#findById.call', { id });
    return this.queryBus.execute(new GetUnitOfMeasureByIdQuery(id));
  }

  async findByCode(code: string): Promise<UnitOfMeasure | null> {
    this.logger.info('UnitOfMeasureService#findByCode.call', { code });
    return this.queryBus.execute(new GetUnitOfMeasureByCodeQuery(code));
  }

  async count(query?: FindManyOptions<UnitOfMeasure>): Promise<number> {
    this.logger.info('UnitOfMeasureService#count.call', query);
    return this.queryBus.execute(new CountUnitOfMeasuresQuery(query));
  }

  async create(unitOfMeasureDto: CreateUnitOfMeasureDto): Promise<UnitOfMeasure> {
    this.logger.info('UnitOfMeasureService#create.call', { code: unitOfMeasureDto.code });
    return this.commandBus.execute(new CreateUnitOfMeasureCommand(unitOfMeasureDto));
  }

  async update(id: string, unitOfMeasureDto: UpdateUnitOfMeasureDto): Promise<UnitOfMeasure> {
    this.logger.info('UnitOfMeasureService#update.call', { id });
    return this.commandBus.execute(new UpdateUnitOfMeasureCommand(id, unitOfMeasureDto));
  }

  async delete(id: string): Promise<void> {
    this.logger.info('UnitOfMeasureService#delete.call', { id });
    await this.repository.delete(id);
  }
}

