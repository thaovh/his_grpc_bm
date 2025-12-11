import { FindManyOptions } from 'typeorm';
import { ExpMest } from './entities/exp-mest.entity';
import { CreateExpMestDto } from './dto/create-exp-mest.dto';
import { UpdateExpMestDto } from './dto/update-exp-mest.dto';

export interface ExpMestQueryResult {
  data: Array<ExpMest>;
}

export interface InventoryService {
  findAll(query?: FindManyOptions<ExpMest>): Promise<Array<ExpMest>>;
  findById(id: string): Promise<ExpMest | null>;
  findByExpMestId(expMestId: number): Promise<ExpMest | null>;
  count(query?: FindManyOptions<ExpMest>): Promise<number>;
  create(expMestDto: CreateExpMestDto): Promise<ExpMest>;
  update(id: string, expMestDto: UpdateExpMestDto): Promise<ExpMest>;
  delete(id: string): Promise<void>;
}

