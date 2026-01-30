import { Injectable, Logger } from '@nestjs/common';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

/**
 * Service để enrich ExpMest data với sync status và working state
 * Thay thế logic inline trong Gateway
 */
@Injectable()
export class ExpMestEnrichmentService implements OnModuleInit {
    private readonly logger = new Logger(ExpMestEnrichmentService.name);
    private inventoryService: any;
    private masterDataService: any;

    constructor(
        @Inject('INVENTORY_PACKAGE') private inventoryClient: ClientGrpc,
        @Inject('MASTER_DATA_PACKAGE') private masterDataClient: ClientGrpc,
    ) { }

    onModuleInit() {
        this.inventoryService = this.inventoryClient.getService('InventoryService');
        this.masterDataService = this.masterDataClient.getService('MasterDataService');
    }

    /**
     * Enrich danh sách ExpMests với sync status và working state
     * @param expMestIds - Danh sách HIS IDs
     * @param expMestType - "inpatient" | "other" | "cabinet"
     */
    async enrichExpMestsWithSyncStatus(
        expMestIds: any[],
        expMestType: string,
    ): Promise<any> {
        // Ensure inputs are numbers
        const numericIds = expMestIds.map(id => this.convertToNumber(id)).filter(id => !isNaN(id));
        this.logger.log(`Enriching ${numericIds.length} exp mests (type: ${expMestType})`);

        // 1. Check sync status từ inventory-svc
        const syncStatusMap = await this.checkSyncStatus(numericIds, expMestType);

        // 2. Fetch working states từ synced records
        const { workingStateIdMap, workingStateMap } = await this.fetchWorkingStates(
            numericIds,
            expMestType,
            syncStatusMap,
        );

        return {
            syncStatusMap,
            workingStateIdMap,
            workingStateMap,
        };

        return {
            syncStatusMap,
            workingStateIdMap,
            workingStateMap,
        };
    }

    /**
     * Check sync status cho danh sách ExpMests
     */
    private async checkSyncStatus(
        expMestIds: number[],
        expMestType: string,
    ): Promise<any> {
        const syncStatusMap = new Map<string, boolean>();

        if (expMestIds.length === 0) {
            return syncStatusMap;
        }

        try {
            let existingRecords: any[] = [];

            // Gọi inventory-svc để check existing records
            if (expMestType === 'inpatient') {
                const response = await firstValueFrom(
                    this.inventoryService.findInpatientExpMestsByHisIds({ hisExpMestIds: expMestIds }),
                ) as any;
                existingRecords = response?.data || [];
            } else if (expMestType === 'other') {
                // [DEBUG] Try single fetch for the specific ID to see if it works isolated
                if (expMestIds.includes(19390192)) {
                    try {
                        this.logger.warn(`[DEBUG-SINGLE] Attempting to fetch 19390192 individually...`);
                        const single = await firstValueFrom(
                            this.inventoryService.findExpMestOtherByHisId({ id: '19390192' }) // Pass as string for commons.Id
                        ) as any;
                        this.logger.warn(`[DEBUG-SINGLE] Success: ${JSON.stringify(single).substring(0, 100)}...`);
                    } catch (e: any) {
                        this.logger.warn(`[DEBUG-SINGLE] Failed: ${e.message}`);
                    }
                }

                // [DEBUG] Log all input IDs
                this.logger.warn(`[DEBUG-ENRICH] Input IDs (${expMestIds.length}): ${expMestIds.join(', ')}`);

                const response = await firstValueFrom(
                    this.inventoryService.findExpMestOthersByHisIds({ hisExpMestIds: expMestIds }),
                ) as any;

                const returnedRecords = response?.data || [];
                const returnedIds = returnedRecords.map((r: any) => this.convertToNumber(r.hisExpMestId || r.expMestId));
                this.logger.warn(`[DEBUG-ENRICH] Returned IDs (${returnedIds.length}): ${returnedIds.join(', ')}`);

                existingRecords = returnedRecords;

            } else if (expMestType === 'cabinet') {
                const response = await firstValueFrom(
                    this.inventoryService.findExpMestCabinetsByHisIds({ hisExpMestIds: expMestIds }),
                ) as any;
                existingRecords = response?.data || [];
            }

            // Build sync status map
            const existingHisIds = new Set(
                existingRecords.map((r: any) => this.convertToNumber(r.hisExpMestId || r.expMestId)),
            );


            for (const expMestId of expMestIds) {
                syncStatusMap.set(String(expMestId), existingHisIds.has(expMestId));
            }
        } catch (error: any) {
            this.logger.warn(`Failed to check sync status: ${error.message}`);
            // Default to false nếu có lỗi
            for (const expMestId of expMestIds) {
                syncStatusMap.set(String(expMestId), false);
            }
        }

        // Convert Map to plain object for gRPC
        return Object.fromEntries(syncStatusMap) as any; // Map<number, boolean> -> {[key: string]: boolean}
    }

    /**
     * Fetch working states cho synced records
     */
    private async fetchWorkingStates(
        expMestIds: number[],
        expMestType: string,
        syncStatusMap: any,
    ): Promise<{
        workingStateIdMap: any;
        workingStateMap: any;
    }> {
        const workingStateIdMap = new Map<string, string>();
        const workingStateMap = new Map<string, any>();

        // Chỉ fetch cho những records đã sync
        const syncedIds = expMestIds.filter((id) => syncStatusMap[String(id)] === true);

        if (syncedIds.length === 0) {
            return { workingStateIdMap, workingStateMap };
        }

        try {
            let records: any[] = [];

            // Fetch records từ inventory-svc
            if (expMestType === 'inpatient') {
                const response = await firstValueFrom(
                    this.inventoryService.findInpatientExpMestsByHisIds({ hisExpMestIds: syncedIds }),
                ) as any;
                records = response?.data || [];
            } else if (expMestType === 'other') {
                const response = await firstValueFrom(
                    this.inventoryService.findExpMestOthersByHisIds({ hisExpMestIds: syncedIds }),
                ) as any;
                records = response?.data || [];
                // DEBUG: Check records after fetch
                if (records.length === 0) {
                    // this.logger.warn(`No inventory records found for syncedIds: ${syncedIds.join(', ')}`);
                }
            } else if (expMestType === 'cabinet') {
                const response = await firstValueFrom(
                    this.inventoryService.findExpMestCabinetsByHisIds({ hisExpMestIds: syncedIds }),
                ) as any;
                records = response?.data || [];
            }

            // Build workingStateId map
            for (const record of records) {
                const hisId = this.convertToNumber(record.hisExpMestId || record.expMestId);
                if (record.workingStateId) {
                    workingStateIdMap.set(String(hisId), record.workingStateId);
                }
            }

            // Fetch working states từ master-data-svc
            const uniqueStateIds = Array.from(new Set(workingStateIdMap.values()));
            if (uniqueStateIds.length > 0) {
                const states = await this.fetchExportStatuses(uniqueStateIds);
                for (const state of states) {
                    workingStateMap.set(state.id, state);
                }
            }
        } catch (error: any) {
            this.logger.warn(`Failed to fetch working states: ${error.message}`);
        }

        return {
            workingStateIdMap: Object.fromEntries(workingStateIdMap),
            workingStateMap: Object.fromEntries(workingStateMap),
        };
    }

    private convertToNumber(value: any): number {
        if (value === null || value === undefined) return NaN;
        if (typeof value === 'number') return value;
        if (typeof value === 'object' && 'low' in value && 'high' in value) {
            return value.low + value.high * 0x100000000;
        }
        return Number(value);
    }

    /**
     * Fetch export statuses từ master-data-svc
     */
    private async fetchExportStatuses(stateIds: string[]): Promise<any[]> {
        try {
            const response = await firstValueFrom(
                this.masterDataService.findExportStatusesByIds({ ids: stateIds }),
            ) as any;
            return response?.data || [];
        } catch (error: any) {
            this.logger.warn(`Failed to fetch export statuses: ${error.message}`);
            return [];
        }
    }
}
