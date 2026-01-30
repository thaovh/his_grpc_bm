import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PinoLogger } from 'nestjs-pino';
import { IntegrationService } from '../../auth/integration.service';
import { InventoryService } from '../../inventory/inventory.service';
import { ExpMestMedicineService } from '../../inventory/exp-mest-medicine.service';
import { MasterDataService } from '../../master-data/master-data.service';

/**
 * Base controller with shared helper methods for Integration controllers
 */
export abstract class IntegrationBaseController {
    constructor(
        protected readonly integrationService: IntegrationService,
        protected readonly inventoryService: InventoryService,
        protected readonly expMestMedicineService: ExpMestMedicineService,
        protected readonly masterDataService: MasterDataService,
        protected readonly configService: ConfigService,
        protected readonly logger: PinoLogger,
        protected readonly eventEmitter: EventEmitter2,
    ) { }

    /**
     * Helper method to enrich HIS data with sync status and working state
     * Replaces inline logic across multiple endpoints
     */
    protected async enrichWithSyncStatus(
        hisData: any[],
        expMestType: 'inpatient' | 'other' | 'cabinet',
    ): Promise<any[]> {
        if (!hisData || hisData.length === 0) {
            return hisData;
        }

        try {
            // Extract HIS IDs
            const hisIds = hisData
                .map((item: any) => Number(item.id || item.ID))
                .filter((id: number) => !isNaN(id));

            if (hisIds.length === 0) {
                return hisData;
            }


            // Call enrichment service
            const enrichmentResult = await this.integrationService.enrichExpMestsWithSyncStatus(
                hisIds,
                expMestType,

            );

            // Apply enrichment to data
            const enrichedData = await Promise.all(hisData.map(async (item: any) => {
                const hisId = Number(item.id || item.ID);
                if (isNaN(hisId)) {
                    return item;
                }

                // Force key to string for lookup just in case
                // this.logger.debug -> warn for visibility
                if (enrichmentResult.syncStatusMap) {
                    // Only log periodically or for specific IDs to avoid spam, but for now log all for the targeted ID if possible? 
                    // Or just log keys once per batch?
                    // Let's log if it's one of the known IDs we are looking for
                    if (String(hisId).includes('19386783')) {
                        this.logger.warn(`[DEBUG] Mapping HIS ID: ${hisId} (type: ${typeof hisId})`);
                        this.logger.warn(`[DEBUG] syncStatusMap keys sample: ${Object.keys(enrichmentResult.syncStatusMap).slice(0, 5).join(', ')}...`);
                        this.logger.warn(`[DEBUG] Value for ${hisId}: ${enrichmentResult.syncStatusMap[hisId]}`);
                        this.logger.warn(`[DEBUG] Value for String(${hisId}): ${enrichmentResult.syncStatusMap[String(hisId)]}`);
                    }
                }


                // Get default workingStateId from config
                const defaultWorkingStateId = this.configService.get<string>('DEFAULT_NOT_SYNC_EXPORT_STATUS_ID') || null;

                const is_sync = enrichmentResult.syncStatusMap?.[hisId] || enrichmentResult.syncStatusMap?.[String(hisId)] || false;

                // If synced, use the one from DB. If not synced, use default from Config.
                let workingStateId = enrichmentResult.workingStateIdMap?.[hisId] || enrichmentResult.workingStateIdMap?.[String(hisId)];

                if (!is_sync && !workingStateId && defaultWorkingStateId) {
                    workingStateId = defaultWorkingStateId;
                }

                let working_state = null;
                if (workingStateId) {
                    working_state = enrichmentResult.workingStateMap?.[workingStateId] || enrichmentResult.workingStateMap?.[String(workingStateId)];

                    // Fallback: If workingStateId exists but object is missing (e.g. default value not in fetched list), fetch it explicitly.
                    // Note: Ideally we should batch this, but for now let's do safe check.
                    if (!working_state) {
                        try {
                            working_state = await this.masterDataService.findExportStatusById(workingStateId);
                        } catch (e) {
                            // Suppress error if not found
                        }
                    }
                }

                return {
                    ...item,
                    is_sync,
                    workingStateId: workingStateId || null,
                    working_state: working_state || null,
                };
            }));

            return enrichedData;
        } catch (error: any) {
            this.logger.warn('IntegrationBaseController#enrichWithSyncStatus.error', {
                error: error.message,
                expMestType,
            });
            // Return original data if enrichment fails
            return hisData;
        }
    }

    /**
     * Helper to get inventory exp mests by HIS IDs
     */
    protected async getInventoryExpMestsByIds(hisIds: number[]): Promise<any[]> {
        try {
            const result = await this.inventoryService.findInpatientExpMestsByHisIds(hisIds);
            return result?.data || [];
        } catch (error: any) {
            this.logger.warn('IntegrationBaseController#getInventoryExpMestsByIds.error', {
                error: error.message,
            });
            return [];
        }
    }

    /**
     * Helper to get inventory other exp mests by HIS IDs
     */
    protected async getInventoryExpMestOthersByHisIds(hisIds: number[]): Promise<any[]> {
        try {
            const result = await this.inventoryService.findExpMestOthersByHisIds(hisIds);
            return result?.data || [];
        } catch (error: any) {
            this.logger.warn('IntegrationBaseController#getInventoryExpMestOthersByHisIds.error', {
                error: error.message,
            });
            return [];
        }
    }
}
