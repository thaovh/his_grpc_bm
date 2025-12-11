
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpMestCabinetMedicine } from '../entities/exp-mest-cabinet-medicine.entity';
import { ExpMestCabinetMedicineRepository } from '../repositories/exp-mest-cabinet-medicine.repository';

@Injectable()
export class ExpMestCabinetMedicineService {
    private readonly logger = new Logger(ExpMestCabinetMedicineService.name);

    constructor(
        private readonly expMestCabinetMedicineRepository: ExpMestCabinetMedicineRepository,
    ) { }

    async findByExpMestId(expMestId: number): Promise<ExpMestCabinetMedicine[]> {
        this.logger.log(`findByExpMestId called with expMestId=${expMestId}`);
        try {
            // Ensure expMestId is a number (not Long object) for Oracle binding
            const expMestIdNumber = Number(expMestId);
            if (isNaN(expMestIdNumber)) {
                throw new Error(`Invalid expMestId: ${expMestId}`);
            }

            // Use repository method instead of direct find to avoid order clause issues
            const medicines = await this.expMestCabinetMedicineRepository.findByExpMestId(expMestIdNumber);
            return medicines;
        } catch (error: any) {
            this.logger.error(`findByExpMestId error: ${error.message}`, error.stack);
            throw error;
        }
    }

    async findByHisIds(hisIds: number[]): Promise<ExpMestCabinetMedicine[]> {
        this.logger.log(`findByHisIds called with ${hisIds.length} IDs`);
        return this.expMestCabinetMedicineRepository.findByHisIds(hisIds);
    }

    async updateExportFieldsByHisIds(
        hisIds: number[],
        exportTime: number | null,
        userId: string,
    ): Promise<number> {
        this.logger.log(`updateExportFieldsByHisIds called with ${hisIds.length} IDs, exportTime: ${exportTime}, userId: ${userId}`);

        let updatedCount = 0;

        // Find medicines by HIS IDs
        const medicines = await this.expMestCabinetMedicineRepository.findByHisIds(hisIds);
        if (!medicines || medicines.length === 0) {
            return 0;
        }

        // Update each medicine
        for (const medicine of medicines) {
            try {
                const updateDto: any = {
                    isExport: 1,
                    exportAmount: medicine.amount, // Default to amount
                    exportTime: exportTime || undefined,
                    expTime: exportTime || undefined, // Also update expTime for cabinet
                    exportByUser: userId,
                    updatedBy: userId,
                };

                await this.expMestCabinetMedicineRepository.update(medicine.id, updateDto);
                updatedCount++;
            } catch (error: any) {
                this.logger.error(`updateExportFieldsByHisIds error for medicine ${medicine.id}`, {
                    id: medicine.id,
                    hisId: medicine.hisId,
                    error: error.message,
                });
            }
        }

        return updatedCount;
    }

    async updateActualExportFieldsByHisIds(
        hisIds: number[],
        actualExportTime: number | null,
        userId: string,
    ): Promise<number> {
        this.logger.log(`updateActualExportFieldsByHisIds called with ${hisIds.length} IDs, actualExportTime: ${actualExportTime}, userId: ${userId}`);

        let updatedCount = 0;

        // Find medicines by HIS IDs
        const medicines = await this.expMestCabinetMedicineRepository.findByHisIds(hisIds);
        if (!medicines || medicines.length === 0) {
            return 0;
        }

        // Update each medicine
        for (const medicine of medicines) {
            try {
                const updateDto: any = {
                    actualExportAmount: medicine.amount, // Default to amount
                    actualExportTime: actualExportTime || undefined,
                    actualExportByUser: userId,
                    updatedBy: userId,
                };

                await this.expMestCabinetMedicineRepository.update(medicine.id, updateDto);
                updatedCount++;
            } catch (error: any) {
                this.logger.error(`updateActualExportFieldsByHisIds error for medicine ${medicine.id}`, {
                    id: medicine.id,
                    hisId: medicine.hisId,
                    error: error.message,
                });
            }
        }

        return updatedCount;
    }
}
