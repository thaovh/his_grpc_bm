import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { PinoLogger } from 'nestjs-pino';
import { MachineDocument } from '../entities/machine-document.entity';
import { CreateMachineDocumentDto } from '../dto/create-machine-document.dto';
import { UpdateMachineDocumentDto } from '../dto/update-machine-document.dto';

@Injectable()
export class MachineDocumentRepository {
    constructor(
        @InjectRepository(MachineDocument)
        private readonly repository: Repository<MachineDocument>,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(MachineDocumentRepository.name);
    }

    async findAll(options?: FindManyOptions<MachineDocument>): Promise<MachineDocument[]> {
        this.logger.info('MachineDocumentRepository#findAll.call', options);
        return this.repository.find(options);
    }

    async findOne(options: FindOneOptions<MachineDocument>): Promise<MachineDocument | null> {
        this.logger.info('MachineDocumentRepository#findOne.call', options);
        return this.repository.findOne(options);
    }

    async findById(id: string): Promise<MachineDocument | null> {
        return this.findOne({ where: { id } as any });
    }

    async count(options?: FindManyOptions<MachineDocument>): Promise<number> {
        this.logger.info('MachineDocumentRepository#count.call', options);
        return this.repository.count(options);
    }

    async create(dto: CreateMachineDocumentDto): Promise<MachineDocument> {
        this.logger.info('MachineDocumentRepository#create.call', { machineId: dto.machineId });
        const now = new Date();
        const entity = this.repository.create({
            ...dto,
            id: uuidv4(),
            createdAt: now,
            updatedAt: now,
            version: 1,
            isActive: 1,
        } as any) as unknown as MachineDocument;
        return this.repository.save(entity);
    }

    async update(id: string, dto: UpdateMachineDocumentDto): Promise<MachineDocument> {
        this.logger.info('MachineDocumentRepository#update.call', { id });
        const entity = await this.findById(id);
        if (!entity) throw new Error('MachineDocument not found');

        Object.assign(entity, dto);
        entity.updatedAt = new Date();
        entity.version += 1;

        return this.repository.save(entity);
    }

    async delete(id: string): Promise<void> {
        this.logger.info('MachineDocumentRepository#delete.call', { id });
        const entity = await this.findById(id);
        if (!entity) throw new Error('MachineDocument not found');
        await this.repository.remove(entity);
    }
}
