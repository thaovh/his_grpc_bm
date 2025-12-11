import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { MachineTransfer } from '../entities/transfer.entity';
import { v4 as uuidv4 } from 'uuid';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class MachineTransferRepository {
    constructor(
        @InjectRepository(MachineTransfer)
        private readonly repository: Repository<MachineTransfer>,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(MachineTransferRepository.name);
    }

    async findAll(options?: FindManyOptions<MachineTransfer>): Promise<MachineTransfer[]> {
        this.logger.info('MachineTransferRepository#findAll.call', options);
        return this.repository.find(options);
    }

    async findOne(options: FindOneOptions<MachineTransfer>): Promise<MachineTransfer | null> {
        this.logger.info('MachineTransferRepository#findOne.call', options);
        return this.repository.findOne(options);
    }

    async findById(id: string): Promise<MachineTransfer | null> {
        return this.findOne({ where: { id } as any });
    }

    async count(options?: FindManyOptions<MachineTransfer>): Promise<number> {
        this.logger.info('MachineTransferRepository#count.call', options);
        return this.repository.count(options);
    }

    async create(data: any): Promise<MachineTransfer> {
        this.logger.info('MachineTransferRepository#create.call', { machineId: data.machineId });
        const now = new Date();
        const {
            machineId, fromBranchId, toBranchId, fromDepartmentId,
            toDepartmentId, transferDate, statusId, transferTypeId, reason, referenceNumber,
            createdBy
        } = data;

        const entity = this.repository.create({
            machineId,
            fromBranchId,
            toBranchId,
            fromDepartmentId,
            toDepartmentId,
            transferDate: transferDate ? new Date(transferDate) : null,
            statusId,
            transferTypeId,
            reason,
            referenceNumber,
            id: uuidv4(),
            createdAt: now,
            updatedAt: now,
            createdBy,
            version: 1,
            isActive: 1,
        });
        return this.repository.save(entity);
    }

    async update(id: string, data: any): Promise<MachineTransfer> {
        this.logger.info('MachineTransferRepository#update.call', { id });
        const entity = await this.findById(id);
        if (!entity) throw new Error('MachineTransfer not found');

        const { statusId, transferTypeId, reason, referenceNumber, updatedBy } = data;

        if (statusId !== undefined) entity.statusId = statusId;
        if (transferTypeId !== undefined) entity.transferTypeId = transferTypeId;
        if (reason !== undefined) entity.reason = reason;
        if (referenceNumber !== undefined) entity.referenceNumber = referenceNumber;
        if (updatedBy !== undefined) entity.updatedBy = updatedBy;

        entity.updatedAt = new Date();
        entity.version += 1;

        return this.repository.save(entity);
    }

    async delete(id: string): Promise<void> {
        this.logger.info('MachineTransferRepository#delete.call', { id });
        const entity = await this.findById(id);
        if (!entity) throw new Error('MachineTransfer not found');
        await this.repository.remove(entity);
    }
}
