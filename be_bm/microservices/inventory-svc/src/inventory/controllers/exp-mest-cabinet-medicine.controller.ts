
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ExpMestCabinetMedicineService } from '../services/exp-mest-cabinet-medicine.service';
import { Logger } from '@nestjs/common';

@Controller()
export class ExpMestCabinetMedicineController {
    private readonly logger = new Logger(ExpMestCabinetMedicineController.name);

    constructor(private readonly expMestCabinetMedicineService: ExpMestCabinetMedicineService) { }

    @GrpcMethod('InventoryService', 'findExpMestCabinetMedicinesByExpMestId')
    async findExpMestCabinetMedicinesByExpMestId(data: { expMestId: number }): Promise<any> {
        this.logger.log(`findExpMestCabinetMedicinesByExpMestId called with expMestId=${data.expMestId}`);
        try {
            // Convert Long object to number if needed (from gRPC)
            let expMestId: number;
            const expMestIdValue = data.expMestId;

            if (expMestIdValue !== null &&
                expMestIdValue !== undefined &&
                typeof expMestIdValue === 'object' &&
                'low' in (expMestIdValue as object) &&
                'high' in (expMestIdValue as object)) {
                const longValue = expMestIdValue as { low: number; high: number };
                expMestId = longValue.low + (longValue.high * 0x100000000);
            } else {
                expMestId = Number(expMestIdValue);
            }

            if (isNaN(expMestId)) {
                throw new Error('Invalid expMestId: must be a valid number');
            }

            const medicines = await this.expMestCabinetMedicineService.findByExpMestId(expMestId);

            // Map to Proto format if needed (Entity structure should match mostly)
            // Ensure Longs are converted if sending back to Gateway which expects Numbers or formatted objects
            // But internal communication usually handles objects.
            // We will return wrapped data
            return { data: medicines };
        } catch (error: any) {
            this.logger.error(`findExpMestCabinetMedicinesByExpMestId error: ${error.message}`);
            throw error;
        }
    }

    @GrpcMethod('InventoryService', 'findExpMestCabinetMedicinesByHisIds')
    async findByHisIds(data: { hisIds: number[] }): Promise<any> {
        this.logger.log(`findExpMestCabinetMedicinesByHisIds called with ${data.hisIds?.length || 0} IDs`);

        // Convert hisIds from Long objects if needed
        const hisIds: number[] = (data.hisIds || []).map((id: any) => {
            if (id !== null && id !== undefined && typeof id === 'object' && 'low' in id && 'high' in id) {
                const longValue = id as { low: number; high: number };
                return longValue.low + (longValue.high * 0x100000000);
            }
            return Number(id);
        }).filter((id): id is number => !isNaN(id));

        if (hisIds.length === 0) {
            return { data: [] };
        }

        const result = await this.expMestCabinetMedicineService.findByHisIds(hisIds);
        this.logger.log(`findExpMestCabinetMedicinesByHisIds returning ${result.length} medicines`);
        return { data: result };
    }

    @GrpcMethod('InventoryService', 'updateExpMestCabinetMedicineExportFieldsByHisIds')
    async updateExportFieldsByHisIds(data: {
        hisIds: number[];
        exportTime: number | null;
        userId: string;
    }): Promise<{ updatedCount: number; hisIds: number[] }> {
        this.logger.log(`updateExpMestCabinetMedicineExportFieldsByHisIds called with ${data.hisIds?.length || 0} IDs, exportTime: ${data.exportTime}, userId: ${data.userId}`);

        // Convert hisIds from Long objects
        const hisIds: number[] = (data.hisIds || []).map((id: any) => {
            if (id !== null && id !== undefined && typeof id === 'object' && 'low' in id && 'high' in id) {
                const longValue = id as { low: number; high: number };
                return longValue.low + (longValue.high * 0x100000000);
            }
            return Number(id);
        }).filter(id => !isNaN(id));

        // Convert exportTime from Long object
        let exportTime: number | null = null;
        if (data.exportTime !== null && data.exportTime !== undefined) {
            if (typeof data.exportTime === 'object' && 'low' in (data.exportTime as any) && 'high' in (data.exportTime as any)) {
                const longValue = data.exportTime as any;
                exportTime = longValue.low + (longValue.high * 0x100000000);
            } else {
                exportTime = Number(data.exportTime);
            }
        }

        const updatedCount = await this.expMestCabinetMedicineService.updateExportFieldsByHisIds(hisIds, exportTime, data.userId);

        return {
            updatedCount,
            hisIds
        };
    }

    @GrpcMethod('InventoryService', 'updateExpMestCabinetMedicineActualExportFieldsByHisIds')
    async updateActualExportFieldsByHisIds(data: {
        hisIds: number[];
        actualExportTime: number | null;
        userId: string;
    }): Promise<{ updatedCount: number; hisIds: number[] }> {
        this.logger.log(`updateExpMestCabinetMedicineActualExportFieldsByHisIds called with ${data.hisIds?.length || 0} IDs, actualExportTime: ${data.actualExportTime}, userId: ${data.userId}`);

        // Convert hisIds from Long objects
        const hisIds: number[] = (data.hisIds || []).map((id: any) => {
            if (id !== null && id !== undefined && typeof id === 'object' && 'low' in id && 'high' in id) {
                const longValue = id as { low: number; high: number };
                return longValue.low + (longValue.high * 0x100000000);
            }
            return Number(id);
        }).filter(id => !isNaN(id));

        // Convert actualExportTime from Long object
        let actualExportTime: number | null = null;
        if (data.actualExportTime !== null && data.actualExportTime !== undefined) {
            if (typeof data.actualExportTime === 'object' && 'low' in (data.actualExportTime as any) && 'high' in (data.actualExportTime as any)) {
                const longValue = data.actualExportTime as any;
                actualExportTime = longValue.low + (longValue.high * 0x100000000);
            } else {
                actualExportTime = Number(data.actualExportTime);
            }
        }

        const updatedCount = await this.expMestCabinetMedicineService.updateActualExportFieldsByHisIds(hisIds, actualExportTime, data.userId);

        return {
            updatedCount,
            hisIds
        };
    }
}
