import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { firstValueFrom } from 'rxjs';
import { MasterDataService } from '../master-data/master-data.service';

interface InventoryGrpcService {
  findAll(data: any): any;
  findById(data: { id: string }): any;
  findByExpMestId(data: { id: string }): any;
  count(data: any): any;
  create(data: any): any;
  update(data: any): any;
  destroy(data: any): any;
  // InpatientExpMest methods
  findAllInpatientExpMests(data: any): any;
  findInpatientExpMestById(data: { id: string }): any;
  findInpatientExpMestByHisId(data: { id: string }): any;
  findInpatientExpMestsByHisIds(data: { hisExpMestIds: number[] }): any;
  createInpatientExpMest(data: any): any;
  updateInpatientExpMest(data: any): any;
  countInpatientExpMests(data: any): any;
  syncInpatientExpMest(data: any): any;
  syncAllInpatientExpMest(data: any): any;
  // InpatientExpMestChild methods
  findInpatientExpMestChildrenByAggrExpMestId(data: { aggrExpMestId: number }): any;
  findInpatientExpMestChildByHisId(data: { hisExpMestId: number }): any;
  // InpatientExpMestMedicine methods
  findInpatientExpMestMedicinesByInpatientExpMestId(data: { inpatientExpMestId: number }): any;
  findInpatientExpMestMedicineByHisId(data: { hisId: number }): any;
  updateExportFieldsByHisIds(data: {
    hisIds: number[];
    exportTime?: number | null;
    userId: string;
  }): any;
  updateActualExportFieldsByHisIds(data: {
    hisIds: number[];
    actualExportTime?: number | null;
    userId: string;
  }): any;
  // ExpMestOther methods
  findAllExpMestOthers(data: any): any;
  findExpMestOtherById(data: { id: string }): any;
  findExpMestOtherByHisId(data: { id: string }): any;
  findExpMestOthersByHisIds(data: { hisExpMestIds: number[] }): any;
  syncAllExpMestOther(data: any): any;
  updateExpMestOther(data: any): any;
  createExpMestOther(data: any): any;
  // ExpMestOtherMedicine methods
  findAllExpMestOtherMedicines(data: any): any;
  findExpMestOtherMedicineById(data: { id: string }): any;
  findExpMestOtherMedicineByHisId(data: { hisId: number }): any;
  findExpMestOtherMedicinesByHisIds(data: { hisIds: number[] }): any;
  findExpMestOtherMedicinesByExpMestId(data: { expMestId: number }): any;
  updateExpMestOtherMedicineExportFieldsByHisIds(data: {
    hisIds: number[];
    exportTime?: number | null;
    userId: string;
  }): any;
  updateExpMestOtherMedicineActualExportFieldsByHisIds(data: {
    hisIds: number[];
    actualExportTime?: number | null;
    userId: string;
  }): any;
  // ExpMestCabinet methods
  findExpMestCabinetsByHisIds(data: { hisIds: number[] }): any;
  findExpMestCabinetByHisId(data: { id: string }): any;
  syncAllExpMestCabinet(data: any): any;
  updateExpMestCabinet(data: any): any;
  findExpMestCabinetMedicinesByExpMestId(data: { expMestId: number }): any;
  findExpMestCabinetMedicinesByHisIds(data: { hisIds: number[] }): any;
  updateExpMestCabinetMedicineExportFieldsByHisIds(data: {
    hisIds: number[];
    exportTime: number | null;
    userId: string;
  }): any;
  updateExpMestCabinetMedicineActualExportFieldsByHisIds(data: {
    hisIds: number[];
    actualExportTime: number | null;
    userId: string;
  }): any;
  // Summary methods (NEW - Phase 1 Refactor)
  GetExpMestCabinetSummary(data: { expMestId: number; orderBy?: string }): any;
  GetExpMestOtherSummary(data: { expMestId: number; orderBy?: string }): any;
  GetInpatientExpMestSummary(data: { expMestId: number; orderBy?: string }): any;
  // Working state update methods (NEW - Phase 1 Refactor)
  CheckAndUpdateExpMestCabinetWorkingState(data: { expMestId: number; expMestType: string }): any;
  CheckAndUpdateExpMestOtherWorkingState(data: { expMestId: number; expMestType: string }): any;
  CheckAndUpdateInpatientExpMestWorkingState(data: { expMestId: number; expMestType: string }): any;
}

@Injectable()
export class InventoryService implements OnModuleInit {
  private inventoryGrpcService: InventoryGrpcService;

  constructor(
    @Inject('INVENTORY_PACKAGE') private readonly client: ClientGrpc,
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
    private readonly masterDataService: MasterDataService,
  ) {
    this.logger.setContext(InventoryService.name);
  }

  onModuleInit() {
    this.inventoryGrpcService = this.client.getService<InventoryGrpcService>('InventoryService');
  }

  async findAll(query?: any) {
    this.logger.info('InventoryService#findAll.call', query);
    const result = await firstValueFrom(this.inventoryGrpcService.findAll(query || {})) as any;
    this.logger.info('InventoryService#findAll.result', result);
    const expMests = result.data || [];
    // Convert Long objects to numbers for Oracle compatibility
    expMests.forEach((expMest: any) => this.convertLongToNumber(expMest));
    // Enrich with ExportStatus from local DB
    await this.enrichWithExportStatus(expMests);
    return expMests;
  }

  async findById(id: string) {
    this.logger.info('InventoryService#findById.call', { id });
    const result = await firstValueFrom(this.inventoryGrpcService.findById({ id })) as any;
    this.logger.info('InventoryService#findById.result', result);
    // Convert Long objects to numbers for Oracle compatibility
    this.convertLongToNumber(result);
    // Enrich with ExportStatus from local DB
    if (result) {
      await this.enrichWithExportStatus([result]);
    }
    return result;
  }

  async findByExpMestId(expMestId: number) {
    this.logger.info('InventoryService#findByExpMestId.call', { expMestId });
    const result = await firstValueFrom(this.inventoryGrpcService.findByExpMestId({ id: expMestId.toString() })) as any;
    this.logger.info('InventoryService#findByExpMestId.result', result);
    // Convert Long objects to numbers for Oracle compatibility
    this.convertLongToNumber(result);
    // Enrich with ExportStatus from local DB
    if (result) {
      await this.enrichWithExportStatus([result]);
    }
    return result;
  }

  async count(query?: any) {
    this.logger.info('InventoryService#count.call', query);
    const result = await firstValueFrom(this.inventoryGrpcService.count(query || {})) as any;
    this.logger.info('InventoryService#count.result', result);
    return result.count || 0;
  }

  async create(data: any) {
    this.logger.info('InventoryService#create.call', { expMestId: data.expMestId, createdBy: data.createdBy });
    const result = await firstValueFrom(this.inventoryGrpcService.create(data)) as any;
    this.logger.info('InventoryService#create.result', result);
    // Convert Long objects to numbers for Oracle compatibility
    this.convertLongToNumber(result);
    // Enrich with ExportStatus from local DB
    if (result) {
      await this.enrichWithExportStatus([result]);
    }
    return result;
  }

  async update(id: string, data: any) {
    this.logger.info('InventoryService#update.call', { id, updatedBy: data.updatedBy });
    const result = await firstValueFrom(this.inventoryGrpcService.update({ id, ...data })) as any;
    this.logger.info('InventoryService#update.result', result);
    // Convert Long objects to numbers for Oracle compatibility
    this.convertLongToNumber(result);
    // Enrich with ExportStatus from local DB
    if (result) {
      await this.enrichWithExportStatus([result]);
    }
    return result;
  }

  async delete(id: string) {
    this.logger.info('InventoryService#delete.call', { id });
    const result = await firstValueFrom(this.inventoryGrpcService.destroy({ id })) as any;
    this.logger.info('InventoryService#delete.result', result);
    return result;
  }

  /**
   * Convert Long objects to numbers for Oracle compatibility
   */
  private convertLongToNumber(expMest: any): void {
    if (!expMest) return;

    const numberFields = [
      'expMestId', 'expMestTypeId', 'expMestSttId', 'mediStockId',
      'reqRoomId', 'reqDepartmentId', 'createDate', 'serviceReqId',
      'tdlTotalPrice', 'tdlIntructionTime', 'tdlIntructionDate',
      'tdlTreatmentId', 'tdlPatientId', 'tdlPatientDob',
      'tdlPatientIsHasNotDayDob', 'tdlPatientGenderId', 'tdlPatientTypeId',
      'virCreateMonth', 'virCreateYear', 'priority', 'treatmentIsActive',
      // Newly added numeric fields from HIS
      'lastExpTime', 'finishTime', 'finishDate', 'isExportEqualApprove',
      'lastApprovalTime', 'lastApprovalDate', 'numOrder', 'tdlIntructionDateMin',
    ];

    numberFields.forEach(field => {
      const value = expMest[field];
      if (value !== null && value !== undefined && typeof value === 'object' && 'low' in value) {
        const longValue = value as { low: number; high: number };
        expMest[field] = longValue.low + (longValue.high * 0x100000000);
      }
    });
  }

  /**
   * Enrich ExpMest records with ExportStatus from local DB
   */
  private async enrichWithExportStatus(expMests: any[]): Promise<void> {
    if (!expMests || expMests.length === 0) return;

    // Collect unique exportStatusIds or workingStateIds
    const exportStatusIds = new Set<string>();
    expMests.forEach(expMest => {
      if (expMest.exportStatusId) {
        exportStatusIds.add(expMest.exportStatusId);
      }
      if (expMest.workingStateId) {
        exportStatusIds.add(expMest.workingStateId);
      }
    });

    if (exportStatusIds.size === 0) return;

    // Fetch all ExportStatuses in batch
    const exportStatusMap = new Map<string, any>();
    try {
      for (const exportStatusId of exportStatusIds) {
        try {
          const exportStatus = await this.masterDataService.findExportStatusById(exportStatusId);
          if (exportStatus) {
            exportStatusMap.set(exportStatusId, exportStatus);
          }
        } catch (error) {
          this.logger.warn('Failed to fetch ExportStatus', { exportStatusId, error: error.message });
        }
      }
    } catch (error) {
      this.logger.error('Error enriching ExportStatus', error);
    }

    // Attach ExportStatus to each ExpMest
    expMests.forEach(expMest => {
      if (expMest.exportStatusId && exportStatusMap.has(expMest.exportStatusId)) {
        expMest.exportStatus = exportStatusMap.get(expMest.exportStatusId);
      }
      // For InpatientExpMest, also attach as working_state
      if (expMest.workingStateId && exportStatusMap.has(expMest.workingStateId)) {
        expMest.working_state = exportStatusMap.get(expMest.workingStateId);
      }
    });
  }

  // InpatientExpMest methods
  async findAllInpatientExpMests(query?: any) {
    this.logger.info('InventoryService#findAllInpatientExpMests.call', query);
    const result = await firstValueFrom(this.inventoryGrpcService.findAllInpatientExpMests(query || {})) as any;
    const items = result.data || [];
    items.forEach((item: any) => this.convertInpatientLongToNumber(item));
    await this.enrichWithExportStatus(items);
    return items;
  }

  async findInpatientExpMestById(id: string) {
    this.logger.info('InventoryService#findInpatientExpMestById.call', { id });
    const result = await firstValueFrom(this.inventoryGrpcService.findInpatientExpMestById({ id })) as any;
    this.convertInpatientLongToNumber(result);
    await this.enrichWithExportStatus([result]);
    return result;
  }

  async findInpatientExpMestByHisId(hisExpMestId: number) {
    this.logger.info('InventoryService#findInpatientExpMestByHisId.call', { hisExpMestId });
    const result = await firstValueFrom(this.inventoryGrpcService.findInpatientExpMestByHisId({ id: hisExpMestId.toString() })) as any;
    this.convertInpatientLongToNumber(result);
    await this.enrichWithExportStatus([result]);
    return result;
  }

  async findInpatientExpMestsByHisIds(hisExpMestIds: number[]) {
    this.logger.info('InventoryService#findInpatientExpMestsByHisIds.call', { count: hisExpMestIds.length });
    try {
      const result = await firstValueFrom(
        this.inventoryGrpcService.findInpatientExpMestsByHisIds({ hisExpMestIds })
      ) as any;
      const items = result.data || [];
      items.forEach((item: any) => this.convertInpatientLongToNumber(item));
      await this.enrichWithExportStatus(items);
      return items;
    } catch (error: any) {
      this.logger.error('InventoryService#findInpatientExpMestsByHisIds.error', {
        error: error.message,
        stack: error.stack,
        code: error.code,
      });
      throw error;
    }
  }

  async countInpatientExpMests(query?: any): Promise<number> {
    this.logger.info('InventoryService#countInpatientExpMests.call', query);
    const result = await firstValueFrom(this.inventoryGrpcService.countInpatientExpMests(query || {})) as any;
    // gRPC returns { count: number } from commons.Count
    return result?.count || 0;
  }

  async syncInpatientExpMest(data: {
    hisData: any;
    userId: string;
    workingStateId?: string | null;
  }) {
    this.logger.info('InventoryService#syncInpatientExpMest.call', {
      hisExpMestId: data.hisData?.id,
      userId: data.userId,
      workingStateId: data.workingStateId,
    });

    try {
      // Convert hisData to JSON string for proto (proto expects map<string, string> but we'll pass as JSON string)
      const hisDataJson = JSON.stringify(data.hisData);
      const hisDataMap: { [key: string]: string } = {
        data: hisDataJson, // Pass as single key-value pair
      };

      const grpcRequest = {
        hisData: hisDataMap,
        userId: data.userId,
        workingStateId: data.workingStateId || '',
      };

      const result = await firstValueFrom(
        this.inventoryGrpcService.syncInpatientExpMest(grpcRequest)
      ) as any;

      this.convertInpatientLongToNumber(result);
      await this.enrichWithExportStatus([result]);

      return result;
    } catch (error: any) {
      this.logger.error('InventoryService#syncInpatientExpMest.error', {
        error: error.message,
        stack: error.stack,
        code: error.code,
      });
      throw error;
    }
  }

  async syncAllInpatientExpMest(data: {
    parentData: any;
    childrenData?: any[];
    medicinesData?: any[];
    userId: string;
    workingStateId?: string | null;
  }) {
    this.logger.info('InventoryService#syncAllInpatientExpMest.call', {
      hisExpMestId: data.parentData?.id,
      childrenCount: data.childrenData?.length || 0,
      medicinesCount: data.medicinesData?.length || 0,
      userId: data.userId,
      workingStateId: data.workingStateId,
    });

    try {
      // Convert parentData to JSON string for proto
      const parentDataJson = JSON.stringify(data.parentData);
      const parentDataMap: { [key: string]: string } = {
        data: parentDataJson,
      };

      // Convert childrenData array to array of JSON strings
      const childrenDataStrings: string[] = [];
      if (data.childrenData && data.childrenData.length > 0) {
        data.childrenData.forEach((childData: any) => {
          const childDataJson = JSON.stringify(childData);
          childrenDataStrings.push(childDataJson);
        });
      }

      // Convert medicinesData array to array of JSON strings
      const medicinesDataStrings: string[] = [];
      if (data.medicinesData && data.medicinesData.length > 0) {
        data.medicinesData.forEach((medicineData: any) => {
          const medicineDataJson = JSON.stringify(medicineData);
          medicinesDataStrings.push(medicineDataJson);
        });
      }

      const grpcRequest = {
        parentData: parentDataMap,
        childrenData: childrenDataStrings,
        medicinesData: medicinesDataStrings,
        userId: data.userId,
        workingStateId: data.workingStateId || '',
      };

      const result = await firstValueFrom(
        this.inventoryGrpcService.syncAllInpatientExpMest(grpcRequest)
      ) as any;

      if (result.parent) {
        this.convertInpatientLongToNumber(result.parent);
      }
      if (result.children && Array.isArray(result.children)) {
        result.children.forEach((child: any) => {
          this.convertInpatientLongToNumber(child);
        });
      }
      if (result.medicines && Array.isArray(result.medicines)) {
        result.medicines.forEach((medicine: any) => {
          this.convertMedicineLongToNumber(medicine);
        });
      }

      if (result.parent) {
        await this.enrichWithExportStatus([result.parent]);
      }

      return result;
    } catch (error: any) {
      this.logger.error('InventoryService#syncAllInpatientExpMest.error', {
        error: error.message,
        stack: error.stack,
        code: error.code,
      });
      throw error;
    }
  }

  async syncAllExpMestOther(data: {
    parentData: any;
    medicinesData?: any[];
    userId: string;
    workingStateId?: string | null;
  }) {
    console.log('=== [DEBUG] InventoryService#syncAllExpMestOther.start ===');
    console.log('parentData.id:', data.parentData?.id);
    console.log('medicinesCount:', data.medicinesData?.length || 0);
    console.log('userId:', data.userId);
    console.log('workingStateId:', data.workingStateId);
    this.logger.info('InventoryService#syncAllExpMestOther.call', {
      hisExpMestId: data.parentData?.id,
      medicinesCount: data.medicinesData?.length || 0,
      userId: data.userId,
      workingStateId: data.workingStateId,
    });

    try {
      // Convert parentData to JSON string for proto
      console.log('=== [DEBUG] InventoryService#syncAllExpMestOther.step1: Convert parentData ===');
      const parentDataJson = JSON.stringify(data.parentData);
      console.log('parentDataJson length:', parentDataJson.length);
      const parentDataMap: { [key: string]: string } = {
        data: parentDataJson,
      };

      // Convert medicinesData array to array of JSON strings
      console.log('=== [DEBUG] InventoryService#syncAllExpMestOther.step2: Convert medicinesData ===');
      const medicinesDataStrings: string[] = [];
      if (data.medicinesData && data.medicinesData.length > 0) {
        data.medicinesData.forEach((medicineData: any, index: number) => {
          const medicineDataJson = JSON.stringify(medicineData);
          medicinesDataStrings.push(medicineDataJson);
          if (index === 0) {
            console.log('First medicine sample:', JSON.stringify(medicineData, null, 2).substring(0, 200));
          }
        });
      }
      console.log('medicinesDataStrings.length:', medicinesDataStrings.length);

      const grpcRequest = {
        parentData: parentDataMap,
        medicinesData: medicinesDataStrings,
        userId: data.userId,
        workingStateId: data.workingStateId || '',
      };
      console.log('=== [DEBUG] InventoryService#syncAllExpMestOther.step3: Call gRPC ===');
      console.log('grpcRequest keys:', Object.keys(grpcRequest));
      console.log('grpcRequest.medicinesData.length:', grpcRequest.medicinesData.length);

      const result = await firstValueFrom(
        this.inventoryGrpcService.syncAllExpMestOther(grpcRequest)
      ) as any;
      console.log('=== [DEBUG] InventoryService#syncAllExpMestOther.step3.result ===');
      console.log('result.parent:', !!result?.parent);
      console.log('result.medicines:', !!result?.medicines);
      console.log('result.medicines.length:', result?.medicines?.length);

      if (result.parent) {
        console.log('=== [DEBUG] InventoryService#syncAllExpMestOther.step4: Convert parent Long ===');
        this.convertExpMestOtherLongToNumber(result.parent);
      }
      if (result.medicines && Array.isArray(result.medicines)) {
        console.log('=== [DEBUG] InventoryService#syncAllExpMestOther.step5: Convert medicines Long ===');
        result.medicines.forEach((medicine: any) => {
          this.convertExpMestOtherMedicineLongToNumber(medicine);
        });
      }

      if (result.parent) {
        console.log('=== [DEBUG] InventoryService#syncAllExpMestOther.step6: Enrich export status ===');
        await this.enrichWithExportStatus([result.parent]);
      }

      console.log('=== [DEBUG] InventoryService#syncAllExpMestOther.success ===');
      return result;
    } catch (error: any) {
      console.error('=== [DEBUG] InventoryService#syncAllExpMestOther.error ===');
      console.error('Error type:', error?.constructor?.name);
      console.error('Error message:', error?.message);
      console.error('Error stack:', error?.stack);
      console.error('Error code:', error?.code);
      this.logger.error('InventoryService#syncAllExpMestOther.error', {
        error: error.message,
        stack: error.stack,
        code: error.code,
      });
      throw error;
    }
  }

  async createExpMestOther(data: any) {
    this.logger.info('InventoryService#createExpMestOther.call', { hisExpMestId: data.hisExpMestId });
    const result = await firstValueFrom(this.inventoryGrpcService.createExpMestOther(data)) as any;
    this.convertLongToNumber(result);
    await this.enrichWithExportStatus([result]);
    return result;
  }

  async updateExpMestOther(data: {
    id: string;
    dto: any;
  }) {
    this.logger.info('InventoryService#updateExpMestOther.call', { id: data.id });
    const { id, dto } = data;
    const result = await firstValueFrom(this.inventoryGrpcService.updateExpMestOther({ id, ...dto })) as any;
    this.convertLongToNumber(result);
    await this.enrichWithExportStatus([result]);
    return result;
  }

  async updateInpatientExpMest(data: {
    id: string;
    expMestSttId?: number | null;
    [key: string]: any;
  }): Promise<any> {
    this.logger.info('InventoryService#updateInpatientExpMest.call', { id: data.id });
    try {
      const result = await firstValueFrom(
        this.inventoryGrpcService.updateInpatientExpMest(data)
      ) as any;
      this.convertInpatientLongToNumber(result);
      await this.enrichWithExportStatus([result]);
      return result;
    } catch (error: any) {
      this.logger.error('InventoryService#updateInpatientExpMest.error', {
        error: error.message,
        stack: error.stack,
        code: error.code,
      });
      throw error;
    }
  }

  /**
   * Convert Long objects to numbers for InpatientExpMest and InpatientExpMestChild
   */
  private convertInpatientLongToNumber(item: any): void {
    if (!item) return;

    const convert = (value: any): any => {
      if (value === null || value === undefined) return null;
      if (typeof value === 'object' && 'low' in value && 'high' in value) {
        const longValue = value as { low: number; high: number };
        return longValue.low + (longValue.high * 0x100000000);
      }
      if (typeof value === 'number') return value;
      const num = Number(value);
      return isNaN(num) ? null : num;
    };

    // List of all numeric fields that might be Long objects
    const numberFields = [
      'hisExpMestId', 'aggrExpMestId', 'expMestTypeId', 'expMestSttId', 'mediStockId',
      'reqRoomId', 'reqDepartmentId', 'createDate', 'tdlPatientTypeId',
      'virCreateMonth', 'virCreateYear', 'numOrder', 'tdlIntructionDateMin',
      'lastExpTime', 'finishTime', 'finishDate', 'isExportEqualApprove',
      'lastApprovalTime', 'lastApprovalDate', 'hisCreateTime', 'hisModifyTime',
      // Service Request fields
      'serviceReqId', 'tdlTotalPrice',
      // Instruction fields
      'tdlIntructionTime', 'tdlIntructionDate',
      // Treatment fields
      'tdlTreatmentId',
      // Patient fields
      'tdlPatientId', 'tdlPatientDob', 'tdlPatientIsHasNotDayDob', 'tdlPatientGenderId',
      // Other numeric fields
      'priority',
    ];

    // Convert known numeric fields
    numberFields.forEach(field => {
      if (field in item) {
        const converted = convert(item[field]);
        // For tdlIntructionDateMin, ensure it's an integer (not decimal)
        if (field === 'tdlIntructionDateMin' && converted !== null && typeof converted === 'number') {
          item[field] = Math.floor(converted);
        } else {
          item[field] = converted;
        }
      }
    });

    // Also check all properties for Long objects (catch any we might have missed)
    Object.keys(item).forEach(key => {
      const value = item[key];
      if (value !== null && value !== undefined && typeof value === 'object' && 'low' in value && 'high' in value) {
        item[key] = convert(value);
      }
    });
  }

  /**
   * Convert Long objects to numbers for InpatientExpMestMedicine
   */
  /**
   * Convert Long object to number
   */
  private convertLongValue(value: any): number {
    if (value === null || value === undefined) return value;
    if (typeof value === 'number') return value;
    if (typeof value === 'object' && 'low' in value && 'high' in value) {
      const longValue = value as { low: number; high: number };
      return longValue.low + (longValue.high * 0x100000000);
    }
    return Number(value);
  }

  /**
   * Convert array of Long objects to array of numbers
   */
  private convertLongArray(arr: any[]): number[] {
    if (!arr || !Array.isArray(arr)) return arr;
    return arr.map(item => this.convertLongValue(item));
  }

  /**
   * Serialize Long objects recursively in the entire response object
   * This ensures no Long objects remain in the final response
   */
  private serializeLongObjects(obj: any): void {
    if (obj === null || obj === undefined) {
      return;
    }

    // Handle arrays
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        if (typeof item === 'object' && item !== null && !(item instanceof Date)) {
          // Check if it's a Long object (has low and high properties)
          if ('low' in item && 'high' in item) {
            // It's a Long object, convert it
            const longValue = item as { low: number; high: number };
            obj[index] = longValue.low + (longValue.high * 0x100000000);
          } else {
            // Recursively process nested objects/arrays
            this.serializeLongObjects(item);
          }
        }
      });
      return;
    }

    // Handle objects
    if (typeof obj === 'object' && !(obj instanceof Date)) {
      const keys = Object.keys(obj);
      for (const key of keys) {
        const value = obj[key];
        
        if (value === null || value === undefined) {
          continue;
        }

        // Check if it's a Long object (has low and high properties)
        if (typeof value === 'object' && 'low' in value && 'high' in value) {
          const longValue = value as { low: number; high: number };
          obj[key] = longValue.low + (longValue.high * 0x100000000);
        } else if (typeof value === 'object' && !(value instanceof Date)) {
          // Recursively process nested objects/arrays
          this.serializeLongObjects(value);
        }
      }
    }
  }

  private convertMedicineLongToNumber(item: any): void {
    if (!item) return;

    const convert = (value: any): any => {
      if (value === null || value === undefined) return null;
      if (typeof value === 'object' && 'low' in value && 'high' in value) {
        const longValue = value as { low: number; high: number };
        return longValue.low + (longValue.high * 0x100000000);
      }
      if (typeof value === 'number') return value;
      const num = Number(value);
      return isNaN(num) ? null : num;
    };

    // Convert all numeric fields
    const numberFields = [
      'hisId', 'inpatientExpMestId', 'medicineId', 'tdlMediStockId', 'tdlMedicineTypeId',
      'expMestMetyReqId', 'ckImpMestMedicineId', 'isExport', 'amount', 'exportAmount',
      'exportTime', 'actualExportAmount', 'actualExportTime', 'approvalTime', 'approvalDate', 'expTime', 'expDate',
      'mediStockId', 'expMestSttId', 'impPrice', 'impVatRatio', 'bidId', 'expiredDate',
      'medicineTypeId', 'impTime', 'supplierId', 'serviceId', 'manufacturerId',
      'medicineGroupId', 'serviceUnitId', 'medicineNumOrder', 'medicineUseFormNumOrder',
      'sumInStock', 'sumByMedicineInStock', 'materialNumOrder', 'price', 'vatRatio',
      'virPrice', 'taxRatio', 'numOrder', 'presAmount', 'patientTypeId', 'tdlPatientId',
      'tdlTreatmentId', 'tdlServiceReqId', 'useTimeTo', 'tdlIntructionTime',
      'tdlIntructionDate', 'expMestTypeId', 'tdlAggrExpMestId', 'aggrExpMestId',
      'reqRoomId', 'reqDepartmentId', 'medicineUseFormId', 'medicineLineId',
      'medicineGroupNumOrder',
    ];

    numberFields.forEach(field => {
      if (field in item) {
        item[field] = convert(item[field]);
      }
    });
  }

  /**
   * Convert Long objects to numbers for ExpMestOther
   */
  private convertExpMestOtherLongToNumber(item: any): void {
    if (!item) return;

    const convert = (value: any): any => {
      if (value === null || value === undefined) return null;
      if (typeof value === 'object' && 'low' in value && 'high' in value) {
        const longValue = value as { low: number; high: number };
        return longValue.low + (longValue.high * 0x100000000);
      }
      if (typeof value === 'number') return value;
      const num = Number(value);
      return isNaN(num) ? null : num;
    };

    // List of all numeric fields that might be Long objects
    const numberFields = [
      'hisExpMestId', 'expMestTypeId', 'expMestSttId', 'mediStockId',
      'reqRoomId', 'reqDepartmentId', 'createDate', 'serviceReqId',
      'tdlTotalPrice', 'tdlIntructionTime', 'tdlIntructionDate', 'tdlIntructionDateMin',
      'tdlTreatmentId', 'tdlPatientId', 'tdlPatientDob', 'tdlPatientIsHasNotDayDob',
      'tdlPatientGenderId', 'tdlPatientTypeId', 'virCreateMonth', 'virCreateYear',
      'numOrder', 'priority', 'treatmentIsActive', 'lastExpTime',
      'finishTime', 'finishDate', 'isExportEqualApprove',
      'lastApprovalTime', 'lastApprovalDate', 'hisCreateTime', 'hisModifyTime',
    ];

    // Convert known numeric fields
    numberFields.forEach(field => {
      if (field in item) {
        const converted = convert(item[field]);
        // For tdlIntructionDateMin, ensure it's an integer (not decimal)
        if (field === 'tdlIntructionDateMin' && converted !== null && typeof converted === 'number') {
          item[field] = Math.floor(converted);
        } else {
          item[field] = converted;
        }
      }
    });

    // Also check all properties for Long objects (catch any we might have missed)
    Object.keys(item).forEach(key => {
      const value = item[key];
      if (value !== null && value !== undefined && typeof value === 'object' && 'low' in value && 'high' in value) {
        item[key] = convert(value);
      }
    });
  }

  /**
   * Convert Long objects to numbers for ExpMestOtherMedicine
   */
  private convertExpMestOtherMedicineLongToNumber(item: any): void {
    if (!item) return;

    const convert = (value: any): any => {
      if (value === null || value === undefined) return null;
      if (typeof value === 'object' && 'low' in value && 'high' in value) {
        const longValue = value as { low: number; high: number };
        return longValue.low + (longValue.high * 0x100000000);
      }
      if (typeof value === 'number') return value;
      const num = Number(value);
      return isNaN(num) ? null : num;
    };

    // Convert all numeric fields
    const numberFields = [
      'hisId', 'expMestId', 'medicineId', 'tdlMediStockId', 'tdlMedicineTypeId',
      'expMestMetyReqId', 'ckImpMestMedicineId', 'isExport', 'amount', 'exportAmount',
      'exportTime', 'actualExportAmount', 'actualExportTime', 'approvalTime', 'approvalDate', 'expTime', 'expDate',
      'mediStockId', 'expMestSttId', 'impPrice', 'impVatRatio', 'bidId', 'expiredDate',
      'medicineTypeId', 'impTime', 'supplierId', 'serviceId', 'manufacturerId',
      'medicineGroupId', 'serviceUnitId', 'medicineNumOrder', 'medicineUseFormNumOrder',
      'sumInStock', 'sumByMedicineInStock', 'numOrder', 'price', 'vatRatio',
      'virPrice', 'taxRatio', 'presAmount', 'patientTypeId', 'tdlPatientId',
      'tdlTreatmentId', 'tdlServiceReqId', 'useTimeTo', 'tdlIntructionTime',
      'tdlIntructionDate', 'expMestTypeId', 'tdlAggrExpMestId', 'aggrExpMestId',
      'reqRoomId', 'reqDepartmentId', 'medicineUseFormId', 'medicineLineId',
      'medicineGroupNumOrder',
    ];

    numberFields.forEach(field => {
      if (field in item) {
        item[field] = convert(item[field]);
      }
    });
  }

  async findInpatientExpMestChildrenByAggrExpMestId(aggrExpMestId: number) {
    this.logger.info('InventoryService#findInpatientExpMestChildrenByAggrExpMestId.call', { aggrExpMestId });
    try {
      const result = await firstValueFrom(
        this.inventoryGrpcService.findInpatientExpMestChildrenByAggrExpMestId({ aggrExpMestId })
      ) as any;
      const children = result.data || [];
      children.forEach((child: any) => this.convertInpatientLongToNumber(child));
      return children;
    } catch (error: any) {
      this.logger.error('InventoryService#findInpatientExpMestChildrenByAggrExpMestId.error', {
        error: error.message,
        stack: error.stack,
        code: error.code,
      });
      throw error;
    }
  }

  async findInpatientExpMestChildByHisId(hisExpMestId: number) {
    this.logger.info('InventoryService#findInpatientExpMestChildByHisId.call', { hisExpMestId });
    try {
      const result = await firstValueFrom(
        this.inventoryGrpcService.findInpatientExpMestChildByHisId({ hisExpMestId })
      ) as any;
      this.convertInpatientLongToNumber(result);
      return result;
    } catch (error: any) {
      this.logger.error('InventoryService#findInpatientExpMestChildByHisId.error', {
        error: error.message,
        stack: error.stack,
        code: error.code,
      });
      throw error;
    }
  }

  async findInpatientExpMestMedicinesByInpatientExpMestId(inpatientExpMestId: number) {
    this.logger.info('InventoryService#findInpatientExpMestMedicinesByInpatientExpMestId.call', { inpatientExpMestId });
    try {
      const result = await firstValueFrom(
        this.inventoryGrpcService.findInpatientExpMestMedicinesByInpatientExpMestId({ inpatientExpMestId })
      ) as any;
      const medicines = result.data || [];
      medicines.forEach((medicine: any) => this.convertMedicineLongToNumber(medicine));
      return medicines;
    } catch (error: any) {
      this.logger.error('InventoryService#findInpatientExpMestMedicinesByInpatientExpMestId.error', {
        error: error.message,
        stack: error.stack,
        code: error.code,
      });
      throw error;
    }
  }

  // ExpMestCabinet methods
  async findExpMestCabinetsByHisIds(hisIds: number[]) {
    this.logger.info('InventoryService#findExpMestCabinetsByHisIds.call', { count: hisIds.length });
    try {
      const result = await firstValueFrom(
        this.inventoryGrpcService.findExpMestCabinetsByHisIds({ hisIds })
      ) as any;

      // result should be ExpMestCabinetList { data: ExpMestCabinet[] }
      const items = result.data || [];
      // We can convert longs if needed, but for simple ID check it might not be strictly necessary
      // if we only use it for presence check. However, good to be consistent.
      // Reuse convertLongToNumber or similar if properties match ExpMest
      items.forEach((item: any) => this.convertLongToNumber(item));
      await this.enrichWithExportStatus(items);
      return items;
    } catch (error: any) {
      this.logger.error('InventoryService#findExpMestCabinetsByHisIds.error', {
        error: error.message,
        stack: error.stack,
        code: error.code,
      });
      throw error;
    }
  }

  async findExpMestCabinetByHisId(hisExpMestId: number) {
    this.logger.info('InventoryService#findExpMestCabinetByHisId.call', { hisExpMestId });
    try {
      const result = await firstValueFrom(
        this.inventoryGrpcService.findExpMestCabinetByHisId({ id: hisExpMestId.toString() })
      ) as any;
      this.convertLongToNumber(result);
      await this.enrichWithExportStatus([result]);
      return result;
    } catch (error: any) {
      this.logger.error('InventoryService#findExpMestCabinetByHisId.error', {
        error: error.message,
        stack: error.stack,
        code: error.code,
      });
      throw error;
    }
  }

  async syncAllExpMestCabinet(data: {
    parentData: any;
    medicinesData?: any[];
    userId: string;
    workingStateId?: string | null;
  }) {
    this.logger.info('InventoryService#syncAllExpMestCabinet.call', {
      hisExpMestId: data.parentData?.id,
      medicinesCount: data.medicinesData?.length || 0,
      userId: data.userId,
      workingStateId: data.workingStateId,
    });

    try {
      // Convert parentData to JSON string for proto
      const parentDataJson = JSON.stringify(data.parentData);
      const parentDataMap: { [key: string]: string } = {
        data: parentDataJson,
      };

      // Convert medicinesData array to array of JSON strings
      const medicinesDataStrings: string[] = [];
      if (data.medicinesData && data.medicinesData.length > 0) {
        data.medicinesData.forEach((medicineData: any) => {
          const medicineDataJson = JSON.stringify(medicineData);
          medicinesDataStrings.push(medicineDataJson);
        });
      }

      const grpcRequest = {
        parentData: parentDataMap,
        medicinesData: medicinesDataStrings,
        userId: data.userId,
        workingStateId: data.workingStateId || '',
      };

      const result = await firstValueFrom(
        this.inventoryGrpcService.syncAllExpMestCabinet(grpcRequest)
      ) as any;

      if (result.parent) {
        this.convertLongToNumber(result.parent);
      }
      if (result.medicines && Array.isArray(result.medicines)) {
        result.medicines.forEach((medicine: any) => {
          this.convertMedicineLongToNumber(medicine);
        });
      }

      if (result.parent) {
        await this.enrichWithExportStatus([result.parent]);
      }

      return result;
    } catch (error: any) {
      this.logger.error('InventoryService#syncAllExpMestCabinet.error', {
        error: error.message,
        stack: error.stack,
        code: error.code,
      });
      throw error;
    }
  }

  async updateExpMestCabinet(data: {
    id: string;
    dto: any;
  }) {
    this.logger.info('InventoryService#updateExpMestCabinet.call', { id: data.id });
    const { id, dto } = data;
    const result = await firstValueFrom(this.inventoryGrpcService.updateExpMestCabinet({ id, ...dto })) as any;
    this.convertLongToNumber(result);
    await this.enrichWithExportStatus([result]);
    return result;
  }

  async findExpMestCabinetMedicinesByExpMestId(expMestId: number) {
    this.logger.info('InventoryService#findExpMestCabinetMedicinesByExpMestId.call', { expMestId });
    try {
      const result = await firstValueFrom(
        this.inventoryGrpcService.findExpMestCabinetMedicinesByExpMestId({ expMestId })
      ) as any;
      const medicines = result.data || [];
      medicines.forEach((medicine: any) => this.convertMedicineLongToNumber(medicine));
      return medicines;
    } catch (error: any) {
      this.logger.error('InventoryService#findExpMestCabinetMedicinesByExpMestId.error', {
        error: error.message,
        stack: error.stack,
        code: error.code,
      });
      throw error;
    }
  }

  async findExpMestCabinetMedicinesByHisIds(hisIds: number[]) {
    this.logger.info('InventoryService#findExpMestCabinetMedicinesByHisIds.call', { count: hisIds.length });
    try {
      const result = await firstValueFrom(
        this.inventoryGrpcService.findExpMestCabinetMedicinesByHisIds({ hisIds })
      ) as any;
      const medicines = result.data || [];
      medicines.forEach((medicine: any) => this.convertMedicineLongToNumber(medicine));
      return medicines;
    } catch (error: any) {
      this.logger.error('InventoryService#findExpMestCabinetMedicinesByHisIds.error', {
        error: error.message,
        stack: error.stack,
        code: error.code,
      });
      throw error;
    }
  }

  async updateExpMestCabinetMedicineExportFieldsByHisIds(
    hisIds: number[],
    exportTime: number | null,
    userId: string,
  ): Promise<{ updatedCount: number; hisIds: number[] }> {
    this.logger.info('InventoryService#updateExpMestCabinetMedicineExportFieldsByHisIds.call', {
      hisIdsCount: hisIds.length,
      exportTime,
      userId,
    });
    try {
      const result = await firstValueFrom(
        this.inventoryGrpcService.updateExpMestCabinetMedicineExportFieldsByHisIds({
          hisIds,
          exportTime,
          userId,
        })
      ) as any;

      // Convert Long objects in response to numbers
      if (result) {
        if (result.hisIds && Array.isArray(result.hisIds)) {
          result.hisIds = this.convertLongArray(result.hisIds);
        }
        if (result.updatedCount !== null && result.updatedCount !== undefined) {
          result.updatedCount = this.convertLongValue(result.updatedCount);
        }
      }

      return result;
    } catch (error: any) {
      this.logger.error('InventoryService#updateExpMestCabinetMedicineExportFieldsByHisIds.error', {
        error: error.message,
        stack: error.stack,
        code: error.code,
      });
      throw error;
    }
  }

  async updateExpMestCabinetMedicineActualExportFieldsByHisIds(
    hisIds: number[],
    actualExportTime: number | null,
    userId: string,
  ): Promise<{ updatedCount: number; hisIds: number[] }> {
    this.logger.info('InventoryService#updateExpMestCabinetMedicineActualExportFieldsByHisIds.call', {
      hisIdsCount: hisIds.length,
      actualExportTime,
      userId,
    });
    try {
      const result = await firstValueFrom(
        this.inventoryGrpcService.updateExpMestCabinetMedicineActualExportFieldsByHisIds({
          hisIds,
          actualExportTime,
          userId,
        })
      ) as any;

      // Convert Long objects in response to numbers
      if (result) {
        if (result.hisIds && Array.isArray(result.hisIds)) {
          result.hisIds = this.convertLongArray(result.hisIds);
        }
        if (result.updatedCount !== null && result.updatedCount !== undefined) {
          result.updatedCount = this.convertLongValue(result.updatedCount);
        }
      }

      return result;
    } catch (error: any) {
      this.logger.error('InventoryService#updateExpMestCabinetMedicineActualExportFieldsByHisIds.error', {
        error: error.message,
        stack: error.stack,
        code: error.code,
      });
      throw error;
    }
  }

  async findInpatientExpMestMedicineByHisId(hisId: number) {
    console.log('=== [API-GATEWAY DEBUG] InventoryService#findInpatientExpMestMedicineByHisId.call ===');
    console.log('hisId:', hisId);
    this.logger.info('InventoryService#findInpatientExpMestMedicineByHisId.call', { hisId });
    try {
      const result = await firstValueFrom(
        this.inventoryGrpcService.findInpatientExpMestMedicineByHisId({ hisId })
      ) as any;

      console.log('=== [API-GATEWAY DEBUG] Raw gRPC result ===');
      console.log('result:', JSON.stringify(result, null, 2));
      console.log('result.inpatientExpMestId (before convert):', result?.inpatientExpMestId);
      console.log('result.inpatientExpMestId type:', typeof result?.inpatientExpMestId);

      this.convertMedicineLongToNumber(result);

      console.log('=== [API-GATEWAY DEBUG] After convertMedicineLongToNumber ===');
      console.log('result.inpatientExpMestId (after convert):', result?.inpatientExpMestId);
      console.log('result keys:', Object.keys(result || {}));
      console.log('result:', JSON.stringify({
        hisId: result?.hisId,
        inpatientExpMestId: result?.inpatientExpMestId,
        medicineTypeCode: result?.medicineTypeCode,
        medicineTypeName: result?.medicineTypeName,
      }, null, 2));

      return result;
    } catch (error: any) {
      console.error('=== [API-GATEWAY DEBUG] Error ===');
      console.error('error:', error?.message);
      console.error('error code:', error?.code);
      this.logger.error('InventoryService#findInpatientExpMestMedicineByHisId.error', {
        error: error.message,
        stack: error.stack,
        code: error.code,
      });
      throw error;
    }
  }

  async updateExportFieldsByHisIds(
    hisIds: number[],
    exportTime: number | null | undefined,
    userId: string,
  ): Promise<{ updatedCount: number; hisIds: number[] }> {
    this.logger.info('InventoryService#updateExportFieldsByHisIds.call', {
      hisIdsCount: hisIds.length,
      exportTime,
      userId,
    });
    try {
      const result = await firstValueFrom(
        this.inventoryGrpcService.updateExportFieldsByHisIds({
          hisIds,
          exportTime: exportTime !== undefined ? exportTime : null,
          userId,
        })
      ) as any;

      // Convert Long objects in response to numbers
      if (result) {
        if (result.hisIds && Array.isArray(result.hisIds)) {
          result.hisIds = this.convertLongArray(result.hisIds);
        }
        if (result.updatedCount !== null && result.updatedCount !== undefined) {
          result.updatedCount = this.convertLongValue(result.updatedCount);
        }
      }

      return result;
    } catch (error: any) {
      this.logger.error('InventoryService#updateExportFieldsByHisIds.error', {
        error: error.message,
        stack: error.stack,
        code: error.code,
      });
      throw error;
    }
  }

  async updateActualExportFieldsByHisIds(
    hisIds: number[],
    actualExportTime: number | null | undefined,
    userId: string,
  ): Promise<{ updatedCount: number; hisIds: number[] }> {
    this.logger.info('InventoryService#updateActualExportFieldsByHisIds.call', {
      hisIdsCount: hisIds.length,
      actualExportTime,
      userId,
    });
    try {
      const result = await firstValueFrom(
        this.inventoryGrpcService.updateActualExportFieldsByHisIds({
          hisIds,
          actualExportTime: actualExportTime !== undefined ? actualExportTime : null,
          userId,
        })
      ) as any;

      // Convert Long objects in response to numbers
      if (result) {
        if (result.hisIds && Array.isArray(result.hisIds)) {
          result.hisIds = this.convertLongArray(result.hisIds);
        }
        if (result.updatedCount !== null && result.updatedCount !== undefined) {
          result.updatedCount = this.convertLongValue(result.updatedCount);
        }
      }

      return result;
    } catch (error: any) {
      this.logger.error('InventoryService#updateActualExportFieldsByHisIds.error', {
        error: error.message,
        stack: error.stack,
        code: error.code,
      });
      throw error;
    }
  }

  async findExpMestOthersByHisIds(hisExpMestIds: number[]) {
    this.logger.info('InventoryService#findExpMestOthersByHisIds.call', { count: hisExpMestIds.length });
    try {
      const result = await firstValueFrom(
        this.inventoryGrpcService.findExpMestOthersByHisIds({ hisExpMestIds })
      ) as any;
      const items = result.data || [];
      items.forEach((item: any) => this.convertExpMestOtherLongToNumber(item));
      await this.enrichWithExportStatus(items);
      return items;
    } catch (error: any) {
      this.logger.error('InventoryService#findExpMestOthersByHisIds.error', {
        error: error.message,
        stack: error.stack,
        code: error.code,
      });
      throw error;
    }
  }

  async findExpMestOtherByHisId(hisExpMestId: number) {
    this.logger.info('InventoryService#findExpMestOtherByHisId.call', { hisExpMestId });
    const result = await firstValueFrom(this.inventoryGrpcService.findExpMestOtherByHisId({ id: hisExpMestId.toString() })) as any;
    this.convertExpMestOtherLongToNumber(result);
    await this.enrichWithExportStatus([result]);
    return result;
  }

  async findExpMestOtherMedicinesByExpMestId(expMestId: number) {
    this.logger.info('InventoryService#findExpMestOtherMedicinesByExpMestId.call', { expMestId });
    try {
      const result = await firstValueFrom(
        this.inventoryGrpcService.findExpMestOtherMedicinesByExpMestId({ expMestId })
      ) as any;
      const medicines = result.data || [];
      medicines.forEach((medicine: any) => this.convertExpMestOtherMedicineLongToNumber(medicine));
      return medicines;
    } catch (error: any) {
      this.logger.error('InventoryService#findExpMestOtherMedicinesByExpMestId.error', {
        error: error.message,
        stack: error.stack,
        code: error.code,
      });
      throw error;
    }
  }

  async findExpMestOtherMedicinesByHisIds(hisIds: number[]) {
    this.logger.info('InventoryService#findExpMestOtherMedicinesByHisIds.call', { count: hisIds.length });
    try {
      const result = await firstValueFrom(
        this.inventoryGrpcService.findExpMestOtherMedicinesByHisIds({ hisIds })
      ) as any;
      const medicines = result.data || [];
      medicines.forEach((medicine: any) => this.convertExpMestOtherMedicineLongToNumber(medicine));
      return medicines;
    } catch (error: any) {
      this.logger.error('InventoryService#findExpMestOtherMedicinesByHisIds.error', {
        error: error.message,
        stack: error.stack,
        code: error.code,
      });
      throw error;
    }
  }

  async updateExpMestOtherMedicineExportFieldsByHisIds(
    hisIds: number[],
    exportTime: number | null | undefined,
    userId: string,
  ): Promise<{ updatedCount: number; hisIds: number[] }> {
    this.logger.info('InventoryService#updateExpMestOtherMedicineExportFieldsByHisIds.call', {
      hisIdsCount: hisIds.length,
      exportTime,
      userId,
    });
    try {
      const result = await firstValueFrom(
        this.inventoryGrpcService.updateExpMestOtherMedicineExportFieldsByHisIds({
          hisIds,
          exportTime: exportTime !== undefined ? exportTime : null,
          userId,
        })
      ) as any;

      // Convert Long objects in response to numbers
      if (result) {
        if (result.hisIds && Array.isArray(result.hisIds)) {
          result.hisIds = this.convertLongArray(result.hisIds);
        }
        if (result.updatedCount !== null && result.updatedCount !== undefined) {
          result.updatedCount = this.convertLongValue(result.updatedCount);
        }
      }

      return result;
    } catch (error: any) {
      this.logger.error('InventoryService#updateExpMestOtherMedicineExportFieldsByHisIds.error', {
        error: error.message,
        stack: error.stack,
        code: error.code,
      });
      throw error;
    }
  }

  async updateExpMestOtherMedicineActualExportFieldsByHisIds(
    hisIds: number[],
    actualExportTime: number | null | undefined,
    userId: string,
  ): Promise<{ updatedCount: number; hisIds: number[] }> {
    this.logger.info('InventoryService#updateExpMestOtherMedicineActualExportFieldsByHisIds.call', {
      hisIdsCount: hisIds.length,
      actualExportTime,
      userId,
    });
    try {
      const result = await firstValueFrom(
        this.inventoryGrpcService.updateExpMestOtherMedicineActualExportFieldsByHisIds({
          hisIds,
          actualExportTime: actualExportTime !== undefined ? actualExportTime : null,
          userId,
        })
      ) as any;

      // Convert Long objects in response to numbers
      if (result) {
        if (result.hisIds && Array.isArray(result.hisIds)) {
          result.hisIds = this.convertLongArray(result.hisIds);
        }
        if (result.updatedCount !== null && result.updatedCount !== undefined) {
          result.updatedCount = this.convertLongValue(result.updatedCount);
        }
      }

      return result;
    } catch (error: any) {
      this.logger.error('InventoryService#updateExpMestOtherMedicineActualExportFieldsByHisIds.error', {
        error: error.message,
        stack: error.stack,
        code: error.code,
      });
      throw error;
    }
  }

  // Summary methods (NEW - Phase 1 Refactor)
  async getExpMestCabinetSummary(expMestId: number, orderBy?: string): Promise<any> {
    this.logger.info('InventoryService#getExpMestCabinetSummary.call', { expMestId, orderBy });
    const result = await firstValueFrom(
      this.inventoryGrpcService.GetExpMestCabinetSummary({
        expMestId,
        orderBy: orderBy || '',
      })
    ) as any;
    
    console.log('=== [DEBUG] API Gateway: After gRPC call ===');
    console.log('result.working_state:', result.working_state);
    console.log('hasWorkingState:', !!result.working_state);
    console.log('result keys:', Object.keys(result || {}));
    console.log('result (first 1000 chars):', JSON.stringify(result).substring(0, 1000));
    
    // Serialize Long objects from gRPC response
    this.serializeLongObjects(result);
    
    console.log('=== [DEBUG] API Gateway: After serializeLongObjects ===');
    console.log('result.working_state:', result.working_state);
    console.log('hasWorkingState:', !!result.working_state);
    console.log('result keys:', Object.keys(result || {}));
    
    return result;
  }

  async getExpMestOtherSummary(expMestId: number, orderBy?: string): Promise<any> {
    this.logger.info('InventoryService#getExpMestOtherSummary.call', { expMestId, orderBy });
    const result = await firstValueFrom(
      this.inventoryGrpcService.GetExpMestOtherSummary({
        expMestId,
        orderBy: orderBy || '',
      })
    ) as any;
    
    console.log('=== [DEBUG] API Gateway: After gRPC call ===');
    console.log('result.working_state:', result.working_state);
    console.log('hasWorkingState:', !!result.working_state);
    console.log('result keys:', Object.keys(result || {}));
    console.log('result (first 1000 chars):', JSON.stringify(result).substring(0, 1000));
    
    // Serialize Long objects from gRPC response
    this.serializeLongObjects(result);
    
    console.log('=== [DEBUG] API Gateway: After serializeLongObjects ===');
    console.log('result.working_state:', result.working_state);
    console.log('hasWorkingState:', !!result.working_state);
    console.log('result keys:', Object.keys(result || {}));
    
    return result;
  }

  async getInpatientExpMestSummary(expMestId: number, orderBy?: string): Promise<any> {
    this.logger.info('InventoryService#getInpatientExpMestSummary.call', { expMestId, orderBy });
    const result = await firstValueFrom(
      this.inventoryGrpcService.GetInpatientExpMestSummary({
        expMestId,
        orderBy: orderBy || '',
      })
    ) as any;
    
    console.log('=== [DEBUG] API Gateway: After gRPC call ===');
    console.log('result.working_state:', result.working_state);
    console.log('hasWorkingState:', !!result.working_state);
    console.log('result keys:', Object.keys(result || {}));
    
    // Serialize Long objects from gRPC response
    this.serializeLongObjects(result);
    
    console.log('=== [DEBUG] API Gateway: After serializeLongObjects ===');
    console.log('result.working_state:', result.working_state);
    console.log('hasWorkingState:', !!result.working_state);
    console.log('result keys:', Object.keys(result || {}));
    
    return result;
  }

  // Working state update methods (NEW - Phase 1 Refactor)
  async checkAndUpdateExpMestCabinetWorkingState(expMestId: number): Promise<any> {
    this.logger.info('InventoryService#checkAndUpdateExpMestCabinetWorkingState.call', { expMestId });
    return firstValueFrom(
      this.inventoryGrpcService.CheckAndUpdateExpMestCabinetWorkingState({
        expMestId,
        expMestType: 'cabinet',
      })
    );
  }

  async checkAndUpdateExpMestOtherWorkingState(expMestId: number): Promise<any> {
    this.logger.info('InventoryService#checkAndUpdateExpMestOtherWorkingState.call', { expMestId });
    return firstValueFrom(
      this.inventoryGrpcService.CheckAndUpdateExpMestOtherWorkingState({
        expMestId,
        expMestType: 'other',
      })
    );
  }

  async checkAndUpdateInpatientExpMestWorkingState(expMestId: number): Promise<any> {
    this.logger.info('InventoryService#checkAndUpdateInpatientExpMestWorkingState.call', { expMestId });
    return firstValueFrom(
      this.inventoryGrpcService.CheckAndUpdateInpatientExpMestWorkingState({
        expMestId,
        expMestType: 'inpatient',
      })
    );
  }
}
