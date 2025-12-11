import { Injectable, Logger } from '@nestjs/common';
import { ExpMestCabinetRepository } from '../repositories/exp-mest-cabinet.repository';
import { ExpMestCabinetMedicineRepository } from '../repositories/exp-mest-cabinet-medicine.repository';
import { In, DataSource } from 'typeorm';
import { ExpMestCabinet } from '../entities/exp-mest-cabinet.entity';
import { convertLongToNumberRequired } from '../utils/oracle-utils';

@Injectable()
export class ExpMestCabinetService {
    private readonly logger = new Logger(ExpMestCabinetService.name);

    constructor(
        private readonly expMestCabinetRepository: ExpMestCabinetRepository,
        private readonly expMestCabinetMedicineRepository: ExpMestCabinetMedicineRepository,
        private readonly dataSource: DataSource,
    ) { }

    /**
     * Check if ExpMestCabinets exist by HIS IDs
     */
    async findByHisIds(ids: number[]): Promise<ExpMestCabinet[]> {
        if (!ids || ids.length === 0) return [];

        this.logger.log(`findByHisIds called with ids: ${JSON.stringify(ids)}`);

        // Split into chunks if too many ids (Oracle limit 1000)
        const chunkSize = 900;
        let results: ExpMestCabinet[] = [];

        for (let i = 0; i < ids.length; i += chunkSize) {
            const chunk = ids.slice(i, i + chunkSize);
            this.logger.log(`Querying chunk: ${JSON.stringify(chunk)}`);

            const found = await this.expMestCabinetRepository.find({
                where: {
                    expMestId: In(chunk),
                },
            });

            this.logger.log(`Found ${found.length} records for chunk`);
            if (found.length > 0) {
                this.logger.log(`Sample record: ${JSON.stringify({ id: found[0].id, expMestId: found[0].expMestId, expMestCode: found[0].expMestCode })}`);
            }

            results = results.concat(found);
        }

        this.logger.log(`findByHisIds returning ${results.length} total records`);
        return results;
    }

    async findByHisId(hisId: number): Promise<ExpMestCabinet | null> {
        // Ensure hisId is a number (not Long object) for Oracle binding
        const hisIdNumber = convertLongToNumberRequired(hisId, 'hisId');
        return this.expMestCabinetRepository.findByExpMestId(hisIdNumber);
    }

    /**
     * Sync cabinet exp mest with medicines in a transaction
     */
    async syncAllInTransaction(data: {
        parentData: any;
        medicinesData?: any[];
        userId: string;
        workingStateId?: string | null;
    }): Promise<{ parent: ExpMestCabinet; medicines: any[] }> {
        this.logger.log('syncAllInTransaction called');

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. Upsert parent
            // Prioritize expMestId (HIS ID) over id (UUID)
            const expMestId = data.parentData.expMestId || data.parentData.ID || data.parentData.id;

            this.logger.log(`syncAllInTransaction processing expMestId: ${expMestId}`, {
                parentDataKeys: Object.keys(data.parentData),
                medicinesCount: data.medicinesData?.length || 0
            });

            const existing = await this.expMestCabinetRepository.findByExpMestId(expMestId);

            let parent: ExpMestCabinet;
            if (existing) {
                // Update existing
                parent = await this.expMestCabinetRepository.updateCabinet(existing.id, {
                    ...data.parentData,
                    workingStateId: data.workingStateId,
                    updatedBy: data.userId,
                });
            } else {
                // Create new
                parent = await this.expMestCabinetRepository.createCabinet({
                    expMestId,
                    ...data.parentData,
                    workingStateId: data.workingStateId,
                    createdBy: data.userId,
                });
            }

            // 2. Sync medicines
            let medicines: any[] = [];
            if (data.medicinesData && data.medicinesData.length > 0) {
                // Delete old medicines
                await this.expMestCabinetMedicineRepository.deleteByExpMestId(expMestId);

                // Create new medicines
                for (const medData of data.medicinesData) {
                    const medicine = await this.expMestCabinetMedicineRepository.create({
                        ...medData,
                        expMestId,
                        expMestLocalId: parent.id,
                        createdBy: data.userId,
                    });
                    medicines.push(medicine);
                }
            }

            await queryRunner.commitTransaction();
            this.logger.log(`syncAllInTransaction success: parent=${parent.id}, medicines=${medicines.length}`);

            return { parent, medicines };
        } catch (error: any) {
            await queryRunner.rollbackTransaction();
            this.logger.error('syncAllInTransaction error', error);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async update(id: string, updateDto: any): Promise<ExpMestCabinet> {
        this.logger.log(`update called with id=${id}`);
        return this.expMestCabinetRepository.updateCabinet(id, updateDto);
    }
}
