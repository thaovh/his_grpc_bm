import { PinoLogger } from 'nestjs-pino';
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FindManyOptions } from 'typeorm';

import { ExpMestMedicine } from '../entities/exp-mest-medicine.entity';
import { CreateExpMestMedicineDto } from '../dto/create-exp-mest-medicine.dto';
import { UpdateExpMestMedicineDto } from '../dto/update-exp-mest-medicine.dto';

import { CreateExpMestMedicineCommand } from '../commands/create-exp-mest-medicine.command';
import { UpdateExpMestMedicineCommand } from '../commands/update-exp-mest-medicine.command';
import { GetExpMestMedicinesQuery } from '../queries/get-exp-mest-medicines.query';
import { GetExpMestMedicineByIdQuery } from '../queries/get-exp-mest-medicine-by-id.query';
import { GetExpMestMedicineByHisIdQuery } from '../queries/get-exp-mest-medicine-by-his-id.query';
import { GetExpMestMedicinesByExpMestIdQuery } from '../queries/get-exp-mest-medicines-by-exp-mest-id.query';
import { CountExpMestMedicinesQuery } from '../queries/count-exp-mest-medicines.query';
import { ExpMestMedicineRepository } from '../repositories/exp-mest-medicine.repository';

export interface ExpMestMedicineService {
  findAll(query?: FindManyOptions<ExpMestMedicine>): Promise<Array<ExpMestMedicine>>;
  findById(id: string): Promise<ExpMestMedicine | null>;
  findByHisId(hisId: number): Promise<ExpMestMedicine | null>;
  findByExpMestId(expMestId: number): Promise<Array<ExpMestMedicine>>;
  count(query?: FindManyOptions<ExpMestMedicine>): Promise<number>;
  create(medicineDto: CreateExpMestMedicineDto): Promise<ExpMestMedicine>;
  update(id: string, medicineDto: UpdateExpMestMedicineDto): Promise<ExpMestMedicine>;
  delete(id: string): Promise<void>;
}

@Injectable()
export class ExpMestMedicineServiceImpl implements ExpMestMedicineService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly repository: ExpMestMedicineRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ExpMestMedicineServiceImpl.name);
  }

  async findAll(query?: FindManyOptions<ExpMestMedicine>): Promise<Array<ExpMestMedicine>> {
    this.logger.info('ExpMestMedicineService#findAll.call', query);
    return this.queryBus.execute(new GetExpMestMedicinesQuery(query));
  }

  async findById(id: string): Promise<ExpMestMedicine | null> {
    this.logger.info('ExpMestMedicineService#findById.call', { id });
    return this.queryBus.execute(new GetExpMestMedicineByIdQuery(id));
  }

  async findByHisId(hisId: number): Promise<ExpMestMedicine | null> {
    this.logger.info('ExpMestMedicineService#findByHisId.call', { hisId });
    return this.queryBus.execute(new GetExpMestMedicineByHisIdQuery(hisId));
  }

  async findByExpMestId(expMestId: number): Promise<Array<ExpMestMedicine>> {
    this.logger.info('ExpMestMedicineService#findByExpMestId.call', { expMestId });
    return this.queryBus.execute(new GetExpMestMedicinesByExpMestIdQuery(expMestId));
  }

  async count(query?: FindManyOptions<ExpMestMedicine>): Promise<number> {
    this.logger.info('ExpMestMedicineService#count.call', query);
    return this.queryBus.execute(new CountExpMestMedicinesQuery(query));
  }

  async create(medicineDto: CreateExpMestMedicineDto): Promise<ExpMestMedicine> {
    this.logger.info('ExpMestMedicineService#create.call', { hisId: medicineDto.hisId, expMestId: medicineDto.expMestId });
    return this.commandBus.execute(new CreateExpMestMedicineCommand(medicineDto));
  }

  async update(id: string, medicineDto: UpdateExpMestMedicineDto): Promise<ExpMestMedicine> {
    this.logger.info('ExpMestMedicineService#update.call', { id });
    return this.commandBus.execute(new UpdateExpMestMedicineCommand(id, medicineDto));
  }

  async delete(id: string): Promise<void> {
    this.logger.info('ExpMestMedicineService#delete.call', { id });
    await this.repository.delete(id);
  }
}

