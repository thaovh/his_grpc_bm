import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ExpMestCabinetService } from '../services/exp-mest-cabinet.service';
// import { FindExpMestCabinetsByHisIdsInput, ExpMestCabinetList } from '../../_proto/inventory/exp-mest-cabinet';
// Define interfaces locally to avoid build issues with missing proto generated files
interface FindExpMestCabinetsByHisIdsInput {
    ids: number[];
}

interface ExpMestCabinetList {
    data: any[];
}
// Note: We need to ensure the proto types are generated or available.
// If generated types are not available, we can define interfaces or use 'any' temporarily.

@Controller()
export class ExpMestCabinetController {
    private readonly logger = new Logger(ExpMestCabinetController.name);

    constructor(private readonly expMestCabinetService: ExpMestCabinetService) { }

    @GrpcMethod('InventoryService', 'findExpMestCabinetsByHisIds')
    async findExpMestCabinetsByHisIds(data: FindExpMestCabinetsByHisIdsInput): Promise<ExpMestCabinetList> {
        this.logger.log(`findExpMestCabinetsByHisIds called with ${data.ids?.length} IDs`);
        const results = await this.expMestCabinetService.findByHisIds(data.ids);

        // Map entity to proto message with all required fields for summary API
        // Note: working_state will be enriched later in API gateway via enrichWithExportStatus()
        return {
            data: results.map(item => ({
                id: item.id, // UUID - required for API gateway
                expMestId: item.expMestId, // HIS ID
                hisExpMestId: item.expMestId, // Alias for consistency
                expMestCode: item.expMestCode,
                mediStockCode: item.mediStockCode,
                mediStockName: item.mediStockName,
                reqDepartmentCode: item.reqDepartmentCode,
                reqDepartmentName: item.reqDepartmentName,
                workingStateId: item.workingStateId,
            } as any)),
        };
    }

    @GrpcMethod('InventoryService', 'findExpMestCabinetByHisId')
    async findExpMestCabinetByHisId(data: { id: string | number }): Promise<any> {
        const id = Number(data.id);
        this.logger.log(`findExpMestCabinetByHisId called with id=${id}`);
        const result = await this.expMestCabinetService.findByHisId(id);
        if (!result) {
            // Return empty or null as per proto convention, or throw RpcException
            return {};
        }
        this.convertLongToNumber(result);
        return result;
    }

    private convertLongToNumber(obj: any): void {
        if (!obj || typeof obj !== 'object') return;

        const keys = Object.keys(obj);
        for (const key of keys) {
            const value = obj[key];
            if (value === null || value === undefined) continue;

            // Check if it's a Long object (from Oracle/TypeORM)
            if (typeof value === 'object' && 'low' in value && 'high' in value) {
                const longValue = value as { low: number; high: number };
                obj[key] = longValue.low + (longValue.high * 0x100000000);
            } else if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
                // Recursively convert nested objects
                this.convertLongToNumber(value);
            }
        }
    }

    @GrpcMethod('InventoryService', 'syncAllExpMestCabinet')
    async syncAllExpMestCabinet(data: {
        parentData: { [key: string]: string } | any;
        medicinesData?: { [key: string]: string }[] | any[];
        userId: string;
        workingStateId?: string | null;
    }): Promise<{
        parent: any;
        medicines: any[];
    }> {
        this.logger.log('syncAllExpMestCabinet called');

        try {
            // Convert parentData
            let parentDataObj: any = data.parentData;
            if (data.parentData && typeof data.parentData === 'object' && !Array.isArray(data.parentData)) {
                if (data.parentData.data && typeof data.parentData.data === 'string') {
                    try {
                        parentDataObj = JSON.parse(data.parentData.data);
                    } catch (error: any) {
                        this.logger.error('Failed to parse parentData JSON', error);
                        throw new Error('Invalid parentData format');
                    }
                }
            }

            // Convert medicinesData
            let medicinesDataArray: any[] = [];
            if (data.medicinesData && Array.isArray(data.medicinesData)) {
                medicinesDataArray = data.medicinesData.map((item: any) => {
                    if (typeof item === 'string') {
                        try {
                            return JSON.parse(item);
                        } catch (error: any) {
                            this.logger.warn(`Failed to parse medicine: ${error.message}`);
                            return item;
                        }
                    }
                    return item;
                });
            }

            const result = await this.expMestCabinetService.syncAllInTransaction({
                parentData: parentDataObj,
                medicinesData: medicinesDataArray.length > 0 ? medicinesDataArray : undefined,
                userId: data.userId,
                workingStateId: data.workingStateId || null,
            });

            this.logger.log(`syncAllExpMestCabinet success: parent=${result.parent.id}, medicines=${result.medicines.length}`);
            return result;
        } catch (error: any) {
            this.logger.error('syncAllExpMestCabinet error', error);
            throw error;
        }
    }

    @GrpcMethod('InventoryService', 'updateExpMestCabinet')
    async updateExpMestCabinet(data: { id: string } & any): Promise<any> {
        this.logger.log(`updateExpMestCabinet called with id=${data.id}`);
        const { id, ...updateDto } = data;
        const result = await this.expMestCabinetService.update(id, updateDto);
        this.convertLongToNumber(result);
        return result;
    }
}
