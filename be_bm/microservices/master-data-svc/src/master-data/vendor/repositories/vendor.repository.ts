import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { Vendor } from '../entities/vendor.entity';
import { CreateVendorDto } from '../dto/create-vendor.dto';
import { UpdateVendorDto } from '../dto/update-vendor.dto';
import { v4 as uuidv4 } from 'uuid';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class VendorRepository {
    constructor(
        @InjectRepository(Vendor)
        private readonly repository: Repository<Vendor>,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(VendorRepository.name);
    }

    async findAll(options?: FindManyOptions<Vendor>): Promise<Vendor[]> {
        this.logger.info('VendorRepository#findAll.call', options);
        return this.repository.find(options);
    }

    async findOne(options: FindOneOptions<Vendor>): Promise<Vendor | null> {
        this.logger.info('VendorRepository#findOne.call', options);
        return this.repository.findOne(options);
    }

    async findById(id: string): Promise<Vendor | null> {
        return this.findOne({ where: { id } as any });
    }

    async findByCode(code: string): Promise<Vendor | null> {
        return this.findOne({ where: { code } as any });
    }

    async count(options?: FindManyOptions<Vendor>): Promise<number> {
        this.logger.info('VendorRepository#count.call', options);
        return this.repository.count(options);
    }

    async create(dto: CreateVendorDto): Promise<Vendor> {
        this.logger.info('VendorRepository#create.call', { code: dto.code });
        const now = new Date();
        const entity = this.repository.create({
            ...dto,
            id: uuidv4(),
            createdAt: now,
            updatedAt: now,
            version: 1,
            isActive: 1,
        });
        return this.repository.save(entity);
    }

    async update(id: string, dto: UpdateVendorDto): Promise<Vendor> {
        this.logger.info('VendorRepository#update.call', { id });
        const entity = await this.findById(id);
        if (!entity) throw new Error('Vendor not found');

        Object.assign(entity, dto);
        entity.updatedAt = new Date();
        entity.version += 1;

        return this.repository.save(entity);
    }

    async delete(id: string): Promise<void> {
        this.logger.info('VendorRepository#delete.call', { id });
        const entity = await this.findById(id);
        if (!entity) throw new Error('Vendor not found');
        await this.repository.remove(entity);
    }
}
