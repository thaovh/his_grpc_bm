import { Injectable, Logger } from '@nestjs/common';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

/**
 * Service để auto-update expMestSttId khi khác với HIS
 * Thay thế logic inline trong Gateway
 */
@Injectable()
export class ExpMestAutoUpdateService implements OnModuleInit {
    private readonly logger = new Logger(ExpMestAutoUpdateService.name);
    private inventoryService: any;

    constructor(
        @Inject('INVENTORY_PACKAGE') private inventoryClient: ClientGrpc,
    ) { }

    onModuleInit() {
        this.inventoryService = this.inventoryClient.getService('InventoryService');
    }

    /**
     * Auto-update expMestSttId cho danh sách ExpMests nếu khác với HIS
     * @param expMestIds - Danh sách HIS IDs
     * @param expMestType - "inpatient" | "other"
     * @param hisDataMap - Map từ HIS ID -> HIS data (chứa EXP_MEST_STT_ID)
     * @returns Số lượng records đã update
     */
    async autoUpdateExpMestSttId(
        expMestIds: number[],
        expMestType: string,
        hisDataMap: Map<number, any>,
    ): Promise<{
        updatedCount: number;
        updatedExpMestIds: number[];
    }> {
        this.logger.log(`Auto-updating expMestSttId for ${expMestIds.length} exp mests (type: ${expMestType})`);

        const updatedExpMestIds: number[] = [];

        if (expMestIds.length === 0) {
            return { updatedCount: 0, updatedExpMestIds };
        }

        try {
            // 1. Fetch existing records từ inventory-svc
            let existingRecords: any[] = [];

            if (expMestType === 'inpatient') {
                const response = await firstValueFrom(
                    this.inventoryService.findInpatientExpMestsByHisIds({ hisIds: expMestIds }),
                ) as any;
                existingRecords = response?.data || [];
            } else if (expMestType === 'other') {
                const response = await firstValueFrom(
                    this.inventoryService.findExpMestOthersByHisIds({ hisIds: expMestIds }),
                ) as any;
                existingRecords = response?.data || [];
            }

            // 2. So sánh và update nếu khác
            for (const record of existingRecords) {
                const hisId = Number(record.hisExpMestId || record.expMestId);
                const hisData = hisDataMap.get(hisId);

                if (!hisData) continue;

                const localSttId = Number(record.expMestSttId);
                const hisSttId = Number(hisData.EXP_MEST_STT_ID || hisData.expMestSttId);

                // Nếu khác nhau, update
                if (localSttId !== hisSttId && !isNaN(hisSttId)) {
                    this.logger.log(
                        `Updating expMestSttId for ${hisId}: ${localSttId} -> ${hisSttId}`,
                    );

                    try {
                        if (expMestType === 'inpatient') {
                            await firstValueFrom(
                                this.inventoryService.updateInpatientExpMest({
                                    id: record.id,
                                    expMestSttId: hisSttId,
                                }),
                            );
                        } else if (expMestType === 'other') {
                            await firstValueFrom(
                                this.inventoryService.updateExpMestOther({
                                    id: record.id,
                                    expMestSttId: hisSttId,
                                }),
                            );
                        }

                        updatedExpMestIds.push(hisId);
                    } catch (error: any) {
                        this.logger.warn(
                            `Failed to update expMestSttId for ${hisId}: ${error.message}`,
                        );
                    }
                }
            }
        } catch (error: any) {
            this.logger.error(`Failed to auto-update expMestSttId: ${error.message}`);
        }

        return {
            updatedCount: updatedExpMestIds.length,
            updatedExpMestIds,
        };
    }
}
