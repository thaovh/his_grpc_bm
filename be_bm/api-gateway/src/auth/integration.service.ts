import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { PinoLogger } from 'nestjs-pino';
import { firstValueFrom } from 'rxjs';

interface IntegrationGrpcService {
  getUserRooms(data: { userId: string }): any;
  reloadUserRooms(data: { userId: string }): any;
  getMediStockByRoomId(data: { roomId: number }): any;
  reloadMediStock(data: {}): any;
  getExpMestStt(data: {}): any;
  reloadExpMestStt(data: {}): any;
  getExpMestType(data: {}): any;
  reloadExpMestType(data: {}): any;
  getExpMests(data: {
    expMestSttIds?: number[];
    expMestTypeIds?: number[];
    impOrExpMediStockId?: number;
    createTimeFrom?: number;
    createTimeTo?: number;
    start?: number;
    limit?: number;
    expMestCodeExact?: string;
    workingRoomId?: number;
    dataDomainFilter?: boolean;
    keyWord?: string;
    userId?: string;
  }): any;
  getExpMestById(data: {
    id: number;
    includeDeleted?: boolean;
    dataDomainFilter?: boolean;
    userId?: string;
  }): any;
  getInpatientExpMests(data: {
    expMestSttIds?: number[];
    expMestTypeId?: number;
    mediStockId?: number;
    createTimeFrom?: number;
    createTimeTo?: number;
    start?: number;
    limit?: number;
    orderField?: string;
    orderDirection?: string;
    includeDeleted?: boolean;
    keyword?: string;
    dataDomainFilter?: boolean;
    userId?: string;
  }): any;
  getInpatientExpMestById(data: {
    id: number;
    includeDeleted?: boolean;
    dataDomainFilter?: boolean;
    userId?: string;
  }): any;
  getInpatientExpMestDetails(data: {
    id: number;
    includeDeleted?: boolean;
    dataDomainFilter?: boolean;
    userId?: string;
  }): any;
  getExpMestMedicines(data: { expMestId: number; userId?: string }): any;
  getExpMestMedicinesByIds(data: {
    expMestIds: number[];
    includeDeleted?: boolean;
    dataDomainFilter?: boolean;
    userId?: string;
  }): any;
  getExpMestCabinets(data: {
    expMestSttIds?: number[];
    chmsTypeIds?: number[];
    expMestTypeId?: number;
    mediStockIdOrImpMediStockId?: number;
    createDateFrom?: string;
    createDateTo?: string;
    isIncludeDeleted?: boolean;
    keyword?: string;
    dataDomainFilter?: boolean;
    start?: number;
    limit?: number;
    userId?: string;
  }): any;
  updateWorkInfo(data: any): any;
  syncInpatientExpMest(data: { expMestId: number; userId: string }): any;
  syncExpMestOther(data: { expMestId: number; userId: string }): any;
  getInpatientExpMestSummaryFromHis(data: {
    expMestId: number;
    userId: string;
  }): any;
  enrichExpMestsWithSyncStatus(data: {
    expMestIds: number[];
    expMestType: string;
    userId?: string;
  }): any;
  autoUpdateExpMestSttId(data: {
    expMestIds: number[];
    expMestType: string;
    userId: string;
  }): any;
}

@Injectable()
export class IntegrationService implements OnModuleInit {
  private integrationGrpcService: IntegrationGrpcService;

  constructor(
    @Inject('INTEGRATION_PACKAGE') private readonly client: ClientGrpc,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(IntegrationService.name);
  }

  onModuleInit() {
    this.integrationGrpcService = this.client.getService<IntegrationGrpcService>('IntegrationService');
  }

  async getUserRooms(userId: string): Promise<{
    success: boolean;
    message?: string;
    data?: Array<{
      id: number;
      createTime: number;
      modifyTime: number;
      creator: string;
      modifier: string;
      appCreator: string;
      appModifier: string;
      isActive: number;
      isDelete: number;
      loginname: string;
      roomId: number;
      roomCode: string;
      roomName: string;
      departmentId: number;
      roomTypeId: number;
      roomTypeCode: string;
      roomTypeName: string;
      departmentCode: string;
      departmentName: string;
      isPause: number;
      branchId: number;
      branchCode: string;
      branchName: string;
      heinMediOrgCode: string;
    }>;
  }> {
    this.logger.info('IntegrationService#getUserRooms.call', { userId });
    const result = await firstValueFrom(this.integrationGrpcService.getUserRooms({ userId })) as any;
    this.logger.info('IntegrationService#getUserRooms.result', {
      success: result.success,
      roomCount: result.data?.length || 0,
      hasData: !!result.data,
      dataType: Array.isArray(result.data) ? 'array' : typeof result.data,
    });

    // Convert Long objects to numbers and handle null/undefined values
    if (result.data && Array.isArray(result.data)) {
      result.data = result.data.map((room: any) => {
        if (!room) return room;

        return {
          ...room,
          id: this.convertToNumber(room.id),
          createTime: this.convertToNumber(room.createTime),
          modifyTime: this.convertToNumber(room.modifyTime),
          roomId: this.convertToNumber(room.roomId),
          departmentId: this.convertToNumber(room.departmentId),
          roomTypeId: this.convertToNumber(room.roomTypeId),
          branchId: this.convertToNumber(room.branchId),
        };
      });
    }

    return result;
  }

  async reloadUserRooms(userId: string): Promise<{
    success: boolean;
    message?: string;
    data?: Array<{
      id: number;
      createTime: number;
      modifyTime: number;
      creator: string;
      modifier: string;
      appCreator: string;
      appModifier: string;
      isActive: number;
      isDelete: number;
      loginname: string;
      roomId: number;
      roomCode: string;
      roomName: string;
      departmentId: number;
      roomTypeId: number;
      roomTypeCode: string;
      roomTypeName: string;
      departmentCode: string;
      departmentName: string;
      isPause: number;
      branchId: number;
      branchCode: string;
      branchName: string;
      heinMediOrgCode: string;
    }>;
  }> {
    this.logger.info('IntegrationService#reloadUserRooms.call', { userId });

    try {
      const result = await firstValueFrom(this.integrationGrpcService.reloadUserRooms({ userId })) as any;
      this.logger.info('IntegrationService#reloadUserRooms.result', {
        success: result.success,
        roomCount: result.data?.length || 0,
      });

      // Convert Long objects to numbers and handle null/undefined values
      if (result.data && Array.isArray(result.data)) {
        result.data = result.data.map((room: any) => {
          if (!room) return room;

          return {
            ...room,
            id: this.convertToNumber(room.id),
            createTime: this.convertToNumber(room.createTime),
            modifyTime: this.convertToNumber(room.modifyTime),
            roomId: this.convertToNumber(room.roomId),
            departmentId: this.convertToNumber(room.departmentId),
            roomTypeId: this.convertToNumber(room.roomTypeId),
            branchId: this.convertToNumber(room.branchId),
          };
        });
      }

      return result;
    } catch (error: any) {
      this.logger.error('IntegrationService#reloadUserRooms.error', {
        userId,
        error: error.message,
        errorType: error.constructor?.name,
        code: error.code,
        details: error.details,
        stack: error.stack?.substring(0, 500),
      });
      throw error;
    }
  }

  async getMediStockByRoomId(roomId: number): Promise<{
    success: boolean;
    message?: string;
    id?: number | null;
    data?: any;
  }> {
    this.logger.info('IntegrationService#getMediStockByRoomId.call', { roomId });
    try {
      const result = await firstValueFrom(this.integrationGrpcService.getMediStockByRoomId({ roomId })) as any;
      this.logger.info('IntegrationService#getMediStockByRoomId.result', {
        success: result.success,
        id: result.id,
      });

      // Convert Longs to numbers
      const convert = (v: any) => {
        if (v === null || v === undefined) return null;
        if (typeof v === 'object' && 'low' in v && 'high' in v) {
          const lv = v as { low: number; high: number };
          return lv.low + lv.high * 0x100000000;
        }
        return typeof v === 'number' ? v : Number(v);
      };

      if (result.id !== undefined) {
        result.id = convert(result.id);
      }
      if (result.data) {
        const fields = ['id', 'createTime', 'modifyTime', 'roomId', 'departmentId', 'roomTypeId'];
        fields.forEach(f => { if (result.data[f] !== undefined) result.data[f] = convert(result.data[f]); });
      }

      return result;
    } catch (error: any) {
      this.logger.error('IntegrationService#getMediStockByRoomId.error', {
        roomId,
        error: error.message,
        errorType: error.constructor?.name,
        code: error.code,
        details: error.details,
        stack: error.stack?.substring(0, 500),
      });
      throw error;
    }
  }

  async reloadMediStock(): Promise<{
    success: boolean;
    message?: string;
    count?: number;
  }> {
    this.logger.info('IntegrationService#reloadMediStock.call');
    try {
      const result = await firstValueFrom(this.integrationGrpcService.reloadMediStock({})) as any;
      this.logger.info('IntegrationService#reloadMediStock.result', {
        success: result.success,
        count: result.count,
      });
      return result;
    } catch (error: any) {
      this.logger.error('IntegrationService#reloadMediStock.error', {
        error: error.message,
        errorType: error.constructor?.name,
        code: error.code,
        details: error.details,
        stack: error.stack?.substring(0, 500),
      });
      throw error;
    }
  }

  async getExpMestStt(): Promise<{
    success: boolean;
    message?: string;
    data?: Array<{
      id: number;
      createTime: number;
      modifyTime: number;
      modifier?: string | null;
      appModifier?: string | null;
      isActive: number;
      isDelete: number;
      expMestSttCode: string;
      expMestSttName: string;
    }>;
  }> {
    this.logger.info('IntegrationService#getExpMestStt.call');
    const result = await firstValueFrom(this.integrationGrpcService.getExpMestStt({})) as any;
    this.logger.info('IntegrationService#getExpMestStt.result', {
      success: result.success,
      count: result.data?.length || 0,
    });

    const convert = (v: any) => {
      if (v === null || v === undefined) return null;
      if (typeof v === 'object' && 'low' in v && 'high' in v) {
        const lv = v as { low: number; high: number };
        return lv.low + lv.high * 0x100000000;
      }
      return typeof v === 'number' ? v : Number(v);
    };

    if (result.data && Array.isArray(result.data)) {
      result.data = result.data.map((s: any) => {
        if (!s) return s;
        ['id', 'createTime', 'modifyTime'].forEach(f => { if (s[f] !== undefined) s[f] = convert(s[f]); });
        // Map generic code/name back to specific keys
        if (s.code !== undefined) s.expMestSttCode = s.code;
        if (s.name !== undefined) s.expMestSttName = s.name;
        return s;
      });
    }

    return result;
  }

  async reloadExpMestStt(): Promise<{
    success: boolean;
    message?: string;
    count?: number;
  }> {
    this.logger.info('IntegrationService#reloadExpMestStt.call');
    const result = await firstValueFrom(this.integrationGrpcService.reloadExpMestStt({})) as any;
    this.logger.info('IntegrationService#reloadExpMestStt.result', {
      success: result.success,
      count: result.count,
    });
    return result;
  }

  async getExpMestType(): Promise<{
    success: boolean;
    message?: string;
    data?: Array<{
      id: number;
      createTime: number;
      modifyTime: number;
      isActive: number;
      isDelete: number;
      expMestTypeCode: string;
      expMestTypeName: string;
    }>;
  }> {
    this.logger.info('IntegrationService#getExpMestType.call');
    const result = await firstValueFrom(this.integrationGrpcService.getExpMestType({})) as any;
    this.logger.info('IntegrationService#getExpMestType.result', {
      success: result.success,
      count: result.data?.length || 0,
    });

    const convert = (v: any) => {
      if (v === null || v === undefined) return null;
      if (typeof v === 'object' && 'low' in v && 'high' in v) {
        const lv = v as { low: number; high: number };
        return lv.low + lv.high * 0x100000000;
      }
      return typeof v === 'number' ? v : Number(v);
    };

    if (result.data && Array.isArray(result.data)) {
      result.data = result.data.map((t: any) => {
        if (!t) return t;
        ['id', 'createTime', 'modifyTime'].forEach(f => { if (t[f] !== undefined) t[f] = convert(t[f]); });
        // Map generic code/name back to specific keys
        if (t.code !== undefined) t.expMestTypeCode = t.code;
        if (t.name !== undefined) t.expMestTypeName = t.name;
        return t;
      });
    }

    return result;
  }

  async reloadExpMestType(): Promise<{
    success: boolean;
    message?: string;
    count?: number;
  }> {
    this.logger.info('IntegrationService#reloadExpMestType.call');
    const result = await firstValueFrom(this.integrationGrpcService.reloadExpMestType({})) as any;
    this.logger.info('IntegrationService#reloadExpMestType.result', {
      success: result.success,
      count: result.count,
    });
    return result;
  }

  async getExpMestById(params: {
    expMestId: number;
    includeDeleted?: boolean;
    dataDomainFilter?: boolean;
    userId?: string;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: any | null;
  }> {
    const { expMestId, includeDeleted = false, dataDomainFilter = false, userId } = params;

    const result = await firstValueFrom(this.integrationGrpcService.getExpMestById({
      id: expMestId,
      includeDeleted,
      dataDomainFilter,
      userId,
    })) as any;

    if (result.success && result.data) {
      const convert = (v: any) => {
        if (v === null || v === undefined) return null;
        if (typeof v === 'object' && 'low' in v && 'high' in v) {
          const lv = v as { low: number; high: number };
          return lv.low + lv.high * 0x100000000;
        }
        return typeof v === 'number' ? v : Number(v);
      };

      const item = result.data;
      // Convert typical Long fields
      ['id', 'createTime', 'modifyTime', 'expMestTypeId', 'expMestSttId', 'mediStockId',
        'reqRoomId', 'reqDepartmentId', 'createDate', 'virCreateMonth', 'lastExpTime',
        'finishTime', 'finishDate', 'lastApprovalTime', 'lastApprovalDate', 'numOrder', 'tdlIntructionDateMin'].forEach(f => {
          if (item[f] !== undefined) item[f] = convert(item[f]);
        });
    }

    return result;
  }

  async getExpMests(request: {
    expMestSttIds?: number[];
    expMestTypeIds?: number[];
    impOrExpMediStockId?: number;
    createTimeFrom?: number;
    createTimeTo?: number;
    start?: number;
    limit?: number;
    expMestCodeExact?: string;
    workingRoomId?: number;
    dataDomainFilter?: boolean;
    keyword?: string;
    userId?: string;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: Array<{
      id: number;
      createTime: number;
      modifyTime: number;
      creator: string;
      modifier: string;
      appCreator: string;
      appModifier: string;
      isActive: number;
      isDelete: number;
      expMestCode: string;
      expMestTypeId: number;
      expMestSttId: number;
      mediStockId: number;
      reqLoginname: string;
      reqUsername: string;
      reqRoomId: number;
      reqDepartmentId: number;
      createDate: number;
      serviceReqId: number;
      tdlTotalPrice: number;
      tdlServiceReqCode: string;
      tdlIntructionTime: number;
      tdlIntructionDate: number;
      tdlTreatmentId: number;
      tdlTreatmentCode: string;
      tdlPatientId: number;
      tdlPatientCode: string;
      tdlPatientName: string;
      tdlPatientFirstName: string;
      tdlPatientLastName: string;
      tdlPatientDob: number;
      tdlPatientIsHasNotDayDob: number;
      tdlPatientAddress: string;
      tdlPatientGenderId: number;
      tdlPatientGenderName: string;
      tdlPatientTypeId: number;
      tdlHeinCardNumber: string;
      tdlPatientPhone: string;
      tdlPatientProvinceCode: string;
      tdlPatientCommuneCode: string;
      tdlPatientNationalName: string;
      virCreateMonth: number;
      icdCode: string;
      icdName: string;
      reqUserTitle: string;
      expMestSubCode2: string;
      virCreateYear: number;
      virHeinCardPrefix: string;
      priority: number;
      expMestTypeCode: string;
      expMestTypeName: string;
      expMestSttCode: string;
      expMestSttName: string;
      mediStockCode: string;
      mediStockName: string;
      reqDepartmentCode: string;
      reqDepartmentName: string;
      reqRoomCode: string;
      reqRoomName: string;
      treatmentIsActive: number;
      patientTypeName: string;
      patientTypeCode: string;
      icdSubCode?: string | null;
      icdText?: string | null;
      tdlPatientDistrictCode?: string | null;
      tdlAggrPatientCode?: string | null;
      tdlAggrTreatmentCode?: string | null;
      lastExpLoginname?: string | null;
      lastExpUsername?: string | null;
      lastExpTime?: number | null;
      finishTime?: number | null;
      finishDate?: number | null;
      isExportEqualApprove?: number | null;
      expMestSubCode?: string | null;
      lastApprovalLoginname?: string | null;
      lastApprovalUsername?: string | null;
      lastApprovalTime?: number | null;
      lastApprovalDate?: number | null;
      numOrder?: number | null;
      tdlIntructionDateMin?: number | null;
      groupCode?: string | null;
    }>;
    start?: number;
    limit?: number;
    count?: number;
    total?: number;
  }> {
    this.logger.info('IntegrationService#getExpMests.call', { request });
    this.logger.info('IntegrationService#getExpMests.debugKeyword', { keyword: request.keyword, rawRequest: JSON.stringify(request) });
    console.log('🔍 [Gateway Service] About to call gRPC with request:', JSON.stringify(request));
    console.log('🔍 [Gateway Service] request.keyword value:', request.keyword);
    const result = await firstValueFrom(this.integrationGrpcService.getExpMests(request)) as any;
    this.logger.info('IntegrationService#getExpMests.result', {
      success: result.success,
      dataCount: result.data?.length || 0,
      start: result.start,
      limit: result.limit,
      count: result.count,
      total: result.total,
    });

    // Convert Long objects to numbers for all numeric fields
    if (result.data && Array.isArray(result.data)) {
      result.data = result.data.map((item: any) => {
        if (!item) return item;
        const convert = (v: any) => {
          if (v === null || v === undefined) return null;
          if (typeof v === 'object' && 'low' in v && 'high' in v) {
            const lv = v as { low: number; high: number };
            return lv.low + lv.high * 0x100000000;
          }
          return typeof v === 'number' ? v : Number(v);
        };
        return {
          ...item,
          id: convert(item.id),
          createTime: convert(item.createTime),
          modifyTime: convert(item.modifyTime),
          expMestTypeId: convert(item.expMestTypeId),
          expMestSttId: convert(item.expMestSttId),
          mediStockId: convert(item.mediStockId),
          reqRoomId: convert(item.reqRoomId),
          reqDepartmentId: convert(item.reqDepartmentId),
          createDate: convert(item.createDate),
          serviceReqId: convert(item.serviceReqId),
          tdlTotalPrice: typeof item.tdlTotalPrice === 'number' ? item.tdlTotalPrice : Number(item.tdlTotalPrice || 0),
          tdlIntructionTime: convert(item.tdlIntructionTime),
          tdlIntructionDate: convert(item.tdlIntructionDate),
          tdlTreatmentId: convert(item.tdlTreatmentId),
          tdlPatientId: convert(item.tdlPatientId),
          tdlPatientDob: convert(item.tdlPatientDob),
          tdlPatientIsHasNotDayDob: convert(item.tdlPatientIsHasNotDayDob),
          tdlPatientGenderId: convert(item.tdlPatientGenderId),
          tdlPatientTypeId: convert(item.tdlPatientTypeId),
          virCreateMonth: convert(item.virCreateMonth),
          virCreateYear: convert(item.virCreateYear),
          priority: convert(item.priority),
          treatmentIsActive: convert(item.treatmentIsActive),
          lastExpTime: convert(item.lastExpTime),
          finishTime: convert(item.finishTime),
          finishDate: convert(item.finishDate),
          isExportEqualApprove: convert(item.isExportEqualApprove),
          lastApprovalTime: convert(item.lastApprovalTime),
          lastApprovalDate: convert(item.lastApprovalDate),
          numOrder: convert(item.numOrder),
          tdlIntructionDateMin: convert(item.tdlIntructionDateMin),
        };
      });
    }

    // Convert pagination fields
    if (result.start !== undefined) result.start = this.convertToNumber(result.start);
    if (result.limit !== undefined) result.limit = this.convertToNumber(result.limit);
    if (result.count !== undefined) result.count = this.convertToNumber(result.count);
    if (result.total !== undefined) result.total = this.convertToNumber(result.total);

    return result;
  }

  async getInpatientExpMests(request: {
    expMestSttIds?: number[];
    expMestTypeId?: number;
    mediStockId?: number;
    createTimeFrom?: number;
    createTimeTo?: number;
    start?: number;
    limit?: number;
    orderField?: string;
    orderDirection?: string;
    includeDeleted?: boolean;
    keyword?: string;
    dataDomainFilter?: boolean;
    userId?: string;
  }): Promise<any> {
    this.logger.info('IntegrationService#getInpatientExpMests.call', { request });
    console.log('🔍 [Gateway Service Inpatient] Calling gRPC with:', JSON.stringify(request));
    const result = await firstValueFrom(this.integrationGrpcService.getInpatientExpMests(request)) as any;
    this.logger.info('IntegrationService#getInpatientExpMests.result', {
      success: result.success,
      dataCount: result.data?.length || 0,
      start: result.start,
      limit: result.limit,
      count: result.count,
      total: result.total,
    });

    if (result.data && Array.isArray(result.data)) {
      result.data = result.data.map((item: any, index: number) => {
        if (!item) return item;
        const convert = (v: any) => {
          if (v === null || v === undefined) return null;
          if (typeof v === 'object' && 'low' in v && 'high' in v) {
            const lv = v as { low: number; high: number };
            return lv.low + lv.high * 0x100000000;
          }
          return typeof v === 'number' ? v : Number(v);
        };

        const convertedVirCreateMonth = convert(item.virCreateMonth);

        // Only convert fields that exist in the item (from HIS)
        // Don't add fields that HIS doesn't return
        const converted: any = {
          ...item,
          id: convert(item.id),
          createTime: convert(item.createTime),
          modifyTime: convert(item.modifyTime),
          expMestTypeId: convert(item.expMestTypeId),
          expMestSttId: convert(item.expMestSttId),
          mediStockId: convert(item.mediStockId),
          reqRoomId: convert(item.reqRoomId),
          reqDepartmentId: convert(item.reqDepartmentId),
          createDate: convert(item.createDate),
          tdlPatientTypeId: convert(item.tdlPatientTypeId),
          virCreateMonth: convertedVirCreateMonth,
          virCreateYear: convert(item.virCreateYear),
          numOrder: convert(item.numOrder),
          tdlIntructionDateMin: convert(item.tdlIntructionDateMin),
        };

        // Only convert optional fields if they exist in the item
        if ('serviceReqId' in item) converted.serviceReqId = convert(item.serviceReqId);
        if ('tdlTotalPrice' in item) converted.tdlTotalPrice = typeof item.tdlTotalPrice === 'number' ? item.tdlTotalPrice : Number(item.tdlTotalPrice || 0);
        if ('tdlIntructionTime' in item) converted.tdlIntructionTime = convert(item.tdlIntructionTime);
        if ('tdlIntructionDate' in item) converted.tdlIntructionDate = convert(item.tdlIntructionDate);
        if ('tdlTreatmentId' in item) converted.tdlTreatmentId = convert(item.tdlTreatmentId);
        if ('tdlPatientId' in item) converted.tdlPatientId = convert(item.tdlPatientId);
        if ('tdlPatientDob' in item) converted.tdlPatientDob = convert(item.tdlPatientDob);
        if ('tdlPatientIsHasNotDayDob' in item) converted.tdlPatientIsHasNotDayDob = convert(item.tdlPatientIsHasNotDayDob);
        if ('tdlPatientGenderId' in item) converted.tdlPatientGenderId = convert(item.tdlPatientGenderId);
        if ('priority' in item) converted.priority = convert(item.priority);
        if ('treatmentIsActive' in item) converted.treatmentIsActive = convert(item.treatmentIsActive);
        if ('lastExpTime' in item) converted.lastExpTime = convert(item.lastExpTime);
        if ('finishTime' in item) converted.finishTime = convert(item.finishTime);
        if ('finishDate' in item) converted.finishDate = convert(item.finishDate);
        if ('isExportEqualApprove' in item) converted.isExportEqualApprove = convert(item.isExportEqualApprove);
        if ('lastApprovalTime' in item) converted.lastApprovalTime = convert(item.lastApprovalTime);
        if ('lastApprovalDate' in item) converted.lastApprovalDate = convert(item.lastApprovalDate);

        return converted;
      });
    }

    if (result.start !== undefined) result.start = this.convertToNumber(result.start);
    if (result.limit !== undefined) result.limit = this.convertToNumber(result.limit);
    if (result.count !== undefined) result.count = this.convertToNumber(result.count);
    if (result.total !== undefined) result.total = this.convertToNumber(result.total);

    return result;
  }

  async getExpMestMedicinesByIds(request: {
    expMestIds: number[];
    includeDeleted?: boolean;
    dataDomainFilter?: boolean;
    userId?: string;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: any[];
  }> {
    this.logger.info('IntegrationService#getExpMestMedicinesByIds.call', {
      expMestIdsCount: request.expMestIds?.length || 0,
      includeDeleted: request.includeDeleted,
      dataDomainFilter: request.dataDomainFilter,
    });
    const result = await firstValueFrom(
      this.integrationGrpcService.getExpMestMedicinesByIds({
        expMestIds: request.expMestIds || [],
        includeDeleted: request.includeDeleted,
        dataDomainFilter: request.dataDomainFilter,
        userId: request.userId,
      })
    ) as any;
    this.logger.info('IntegrationService#getExpMestMedicinesByIds.result', {
      success: result.success,
      dataCount: result.data?.length || 0,
    });

    // Convert Long objects to numbers for all numeric fields
    if (result.data && Array.isArray(result.data)) {
      result.data = result.data.map((item: any) => {
        if (!item) return item;
        const convert = (v: any) => {
          if (v === null || v === undefined) return null;
          if (typeof v === 'object' && 'low' in v && 'high' in v) {
            const lv = v as { low: number; high: number };
            return lv.low + lv.high * 0x100000000;
          }
          if (typeof v === 'number') return v;
          const num = Number(v);
          return isNaN(num) ? null : num;
        };
        // Create new object without spread to avoid keeping Long objects
        const converted: any = {
          id: convert(item.id),
          createTime: convert(item.createTime),
          modifyTime: convert(item.modifyTime),
          creator: item.creator || '',
          modifier: item.modifier || '',
          appCreator: item.appCreator || '',
          appModifier: item.appModifier || '',
          isActive: convert(item.isActive),
          isDelete: convert(item.isDelete),
          expMestId: convert(item.expMestId),
          medicineId: convert(item.medicineId),
          tdlMediStockId: convert(item.tdlMediStockId),
          tdlMedicineTypeId: convert(item.tdlMedicineTypeId),
          expMestMetyReqId: convert(item.expMestMetyReqId),
          ckImpMestMedicineId: convert(item.ckImpMestMedicineId),
          isExport: convert(item.isExport),
          amount: convert(item.amount) ?? 0,
          exportAmount: convert(item.exportAmount),
          exportByUser: item.exportByUser || null,
          exportTime: convert(item.exportTime),
          approvalLoginname: item.approvalLoginname || '',
          approvalUsername: item.approvalUsername || '',
          approvalTime: convert(item.approvalTime),
          approvalDate: convert(item.approvalDate),
          expLoginname: item.expLoginname || '',
          expUsername: item.expUsername || '',
          expTime: convert(item.expTime),
          expDate: convert(item.expDate),
          expMestCode: item.expMestCode || '',
          mediStockId: convert(item.mediStockId),
          expMestSttId: convert(item.expMestSttId),
          impPrice: convert(item.impPrice) ?? 0,
          impVatRatio: convert(item.impVatRatio) ?? 0,
          bidId: convert(item.bidId),
          packageNumber: item.packageNumber || '',
          expiredDate: convert(item.expiredDate),
          medicineTypeId: convert(item.medicineTypeId),
          medicineTypeCode: item.medicineTypeCode || '',
          medicineTypeName: item.medicineTypeName || '',
          impTime: convert(item.impTime),
          supplierId: convert(item.supplierId),
          medicineBytNumOrder: item.medicineBytNumOrder || '',
          medicineRegisterNumber: item.medicineRegisterNumber || '',
          activeIngrBhytCode: item.activeIngrBhytCode || '',
          activeIngrBhytName: item.activeIngrBhytName || '',
          concentra: item.concentra || '',
          tdlBidGroupCode: item.tdlBidGroupCode || '',
          tdlBidPackageCode: item.tdlBidPackageCode || '',
          serviceId: convert(item.serviceId),
          nationalName: item.nationalName || '',
          manufacturerId: convert(item.manufacturerId),
          bytNumOrder: item.bytNumOrder || '',
          registerNumber: item.registerNumber || '',
          medicineGroupId: convert(item.medicineGroupId),
          serviceUnitId: convert(item.serviceUnitId),
          serviceUnitCode: item.serviceUnitCode || '',
          serviceUnitName: item.serviceUnitName || '',
          medicineNumOrder: convert(item.medicineNumOrder) ?? 0,
          supplierCode: item.supplierCode || '',
          supplierName: item.supplierName || '',
          bidNumber: item.bidNumber || '',
          bidName: item.bidName || '',
          medicineUseFormCode: item.medicineUseFormCode || '',
          medicineUseFormName: item.medicineUseFormName || '',
          medicineUseFormNumOrder: convert(item.medicineUseFormNumOrder) ?? 0,
          sumInStock: convert(item.sumInStock) ?? 0,
          sumByMedicineInStock: convert(item.sumByMedicineInStock) ?? 0,
          materialNumOrder: convert(item.materialNumOrder),
          // Optional fields - preserve 0 values
          price: convert(item.price),
          vatRatio: convert(item.vatRatio),
          virPrice: convert(item.virPrice),
          taxRatio: convert(item.taxRatio),
          numOrder: convert(item.numOrder),
          presAmount: convert(item.presAmount),
          patientTypeId: convert(item.patientTypeId),
          patientTypeCode: item.patientTypeCode || null,
          patientTypeName: item.patientTypeName || null,
          tdlPatientId: convert(item.tdlPatientId),
          tdlTreatmentId: convert(item.tdlTreatmentId),
          tdlServiceReqId: convert(item.tdlServiceReqId),
          useTimeTo: convert(item.useTimeTo),
          tutorial: item.tutorial || null,
          tdlIntructionTime: convert(item.tdlIntructionTime),
          tdlIntructionDate: convert(item.tdlIntructionDate),
          htuText: item.htuText || null,
          morning: item.morning || null,
          evening: item.evening || null,
          expMestTypeId: convert(item.expMestTypeId),
          tdlAggrExpMestId: convert(item.tdlAggrExpMestId),
          aggrExpMestId: convert(item.aggrExpMestId),
          reqRoomId: convert(item.reqRoomId),
          reqDepartmentId: convert(item.reqDepartmentId),
          reqUserTitle: item.reqUserTitle || null,
          reqLoginname: item.reqLoginname || null,
          reqUsername: item.reqUsername || null,
          medicineUseFormId: convert(item.medicineUseFormId),
          medicineLineId: convert(item.medicineLineId),
          medicineGroupCode: item.medicineGroupCode || null,
          medicineGroupName: item.medicineGroupName || null,
          medicineGroupNumOrder: convert(item.medicineGroupNumOrder),
          manufacturerCode: item.manufacturerCode || null,
          manufacturerName: item.manufacturerName || null,
          mediStockCode: item.mediStockCode || null,
          mediStockName: item.mediStockName || null,
        };
        return converted;
      });
    }

    return result;
  }

  async getInpatientExpMestById(request: {
    expMestId: number;
    includeDeleted?: boolean;
    dataDomainFilter?: boolean;
    userId?: string;
  }): Promise<any> {
    this.logger.info('IntegrationService#getInpatientExpMestById.call', { request });

    // Map expMestId to id (proto field)
    const grpcRequest = {
      id: request.expMestId,
      userId: request.userId,
      includeDeleted: request.includeDeleted,
      dataDomainFilter: request.dataDomainFilter,
    };

    const result = await firstValueFrom(this.integrationGrpcService.getInpatientExpMestById(grpcRequest)) as any;
    this.logger.info('IntegrationService#getInpatientExpMestById.result', {
      success: result.success,
      hasData: !!result.data,
    });

    if (result.data) {
      // Convert Long objects to numbers
      const convert = (v: any) => {
        if (v === null || v === undefined) return null;
        if (typeof v === 'object' && 'low' in v && 'high' in v) {
          const lv = v as { low: number; high: number };
          return lv.low + lv.high * 0x100000000;
        }
        return typeof v === 'number' ? v : Number(v);
      };

      const converted: any = {
        ...result.data,
        id: convert(result.data.id),
        createTime: convert(result.data.createTime),
        modifyTime: convert(result.data.modifyTime),
        expMestTypeId: convert(result.data.expMestTypeId),
        expMestSttId: convert(result.data.expMestSttId),
        mediStockId: convert(result.data.mediStockId),
        reqRoomId: convert(result.data.reqRoomId),
        reqDepartmentId: convert(result.data.reqDepartmentId),
        createDate: convert(result.data.createDate),
        tdlPatientTypeId: convert(result.data.tdlPatientTypeId),
        virCreateMonth: convert(result.data.virCreateMonth),
        virCreateYear: convert(result.data.virCreateYear),
        numOrder: convert(result.data.numOrder),
        tdlIntructionDateMin: convert(result.data.tdlIntructionDateMin),
      };

      // Only convert optional fields if they exist
      if ('lastExpTime' in result.data) converted.lastExpTime = convert(result.data.lastExpTime);
      if ('finishTime' in result.data) converted.finishTime = convert(result.data.finishTime);
      if ('finishDate' in result.data) converted.finishDate = convert(result.data.finishDate);
      if ('isExportEqualApprove' in result.data) converted.isExportEqualApprove = convert(result.data.isExportEqualApprove);
      if ('lastApprovalTime' in result.data) converted.lastApprovalTime = convert(result.data.lastApprovalTime);
      if ('lastApprovalDate' in result.data) converted.lastApprovalDate = convert(result.data.lastApprovalDate);

      result.data = converted;
    }

    return result;
  }

  async getInpatientExpMestDetails(request: {
    aggrExpMestId: number;
    includeDeleted?: boolean;
    dataDomainFilter?: boolean;
    userId?: string;
  }): Promise<any> {
    this.logger.info('IntegrationService#getInpatientExpMestDetails.call', { request });

    // Map aggrExpMestId to id
    const grpcRequest = {
      id: request.aggrExpMestId,
      userId: request.userId,
      includeDeleted: request.includeDeleted,
      dataDomainFilter: request.dataDomainFilter,
    };

    const result = await firstValueFrom(this.integrationGrpcService.getInpatientExpMestDetails(grpcRequest)) as any;
    this.logger.info('IntegrationService#getInpatientExpMestDetails.result', {
      success: result.success,
      dataCount: result.data?.length || 0,
    });

    if (result.data && Array.isArray(result.data)) {
      // Convert Long objects to numbers
      const convert = (v: any) => {
        if (v === null || v === undefined) return null;
        if (typeof v === 'object' && 'low' in v && 'high' in v) {
          const lv = v as { low: number; high: number };
          return lv.low + lv.high * 0x100000000;
        }
        return typeof v === 'number' ? v : Number(v);
      };

      result.data = result.data.map((item: any) => {
        if (!item) return item;

        // Helper function to recursively convert Long objects
        const convertLongRecursive = (obj: any): any => {
          if (obj === null || obj === undefined) {
            return obj;
          }

          // Check if it's a Long object
          if (typeof obj === 'object' && 'low' in obj && 'high' in obj) {
            const lv = obj as { low: number; high: number };
            return lv.low + lv.high * 0x100000000;
          }

          // If it's an array, convert each element
          if (Array.isArray(obj)) {
            return obj.map(convertLongRecursive);
          }

          // If it's an object (but not Long), recursively convert its properties
          if (typeof obj === 'object' && obj.constructor === Object) {
            const converted: any = {};
            for (const key in obj) {
              if (obj.hasOwnProperty(key)) {
                converted[key] = convertLongRecursive(obj[key]);
              }
            }
            return converted;
          }

          // For primitive types, return as is
          return obj;
        };

        // Convert all Long objects recursively
        const converted = convertLongRecursive(item);

        // For tdlIntructionDateMin, ensure it's an integer (not decimal)
        if ('tdlIntructionDateMin' in converted && converted.tdlIntructionDateMin !== null && typeof converted.tdlIntructionDateMin === 'number') {
          converted.tdlIntructionDateMin = Math.floor(converted.tdlIntructionDateMin);
        }

        return converted;
      });
    }

    return result;
  }

  async getExpMestMedicines(expMestId: number, userId?: string): Promise<{
    success: boolean;
    message?: string;
    data?: Array<{
      id: number;
      createTime: number;
      modifyTime: number;
      creator: string;
      modifier: string;
      appCreator: string;
      appModifier: string;
      isActive: number;
      isDelete: number;
      expMestId: number;
      medicineId: number;
      tdlMediStockId: number;
      tdlMedicineTypeId: number;
      expMestMetyReqId: number;
      ckImpMestMedicineId: number;
      isExport: number;
      amount: number;
      approvalLoginname: string;
      approvalUsername: string;
      approvalTime: number;
      approvalDate: number;
      expLoginname: string;
      expUsername: string;
      expTime: number;
      expDate: number;
      expMestCode: string;
      mediStockId: number;
      expMestSttId: number;
      impPrice: number;
      impVatRatio: number;
      bidId: number;
      packageNumber: string;
      expiredDate: number;
      medicineTypeId: number;
      impTime: number;
      supplierId: number;
      medicineBytNumOrder: string;
      medicineRegisterNumber: string;
      activeIngrBhytCode: string;
      activeIngrBhytName: string;
      concentra: string;
      tdlBidGroupCode: string;
      tdlBidPackageCode: string;
      medicineTypeCode: string;
      medicineTypeName: string;
      serviceId: number;
      nationalName: string;
      manufacturerId: number;
      bytNumOrder: string;
      registerNumber: string;
      medicineGroupId: number;
      serviceUnitId: number;
      serviceUnitCode: string;
      serviceUnitName: string;
      medicineNumOrder: number;
      supplierCode: string;
      supplierName: string;
      bidNumber: string;
      bidName: string;
      medicineUseFormCode: string;
      medicineUseFormName: string;
      medicineUseFormNumOrder: number;
      sumInStock: number;
      sumByMedicineInStock: number;
      materialNumOrder?: number | null;
    }>;
  }> {
    this.logger.info('IntegrationService#getExpMestMedicines.call', { expMestId, userId });

    const result = await firstValueFrom(this.integrationGrpcService.getExpMestMedicines({ expMestId, userId })) as any;
    this.logger.info('IntegrationService#getExpMestMedicines.result', {
      success: result.success,
      dataCount: result.data?.length || 0,
    });

    // Convert Long objects to numbers for all numeric fields
    if (result.data && Array.isArray(result.data)) {
      result.data = result.data.map((item: any) => {
        if (!item) return item;
        const convert = (v: any) => {
          if (v === null || v === undefined) return null;
          if (typeof v === 'object' && 'low' in v && 'high' in v) {
            const lv = v as { low: number; high: number };
            return lv.low + lv.high * 0x100000000;
          }
          return typeof v === 'number' ? v : Number(v);
        };
        return {
          ...item,
          id: convert(item.id),
          createTime: convert(item.createTime),
          modifyTime: convert(item.modifyTime),
          expMestId: convert(item.expMestId),
          medicineId: convert(item.medicineId),
          tdlMediStockId: convert(item.tdlMediStockId),
          tdlMedicineTypeId: convert(item.tdlMedicineTypeId),
          expMestMetyReqId: convert(item.expMestMetyReqId),
          ckImpMestMedicineId: convert(item.ckImpMestMedicineId),
          isExport: convert(item.isExport),
          amount: typeof item.amount === 'number' ? item.amount : Number(item.amount || 0),
          approvalTime: convert(item.approvalTime),
          approvalDate: convert(item.approvalDate),
          expTime: convert(item.expTime),
          expDate: convert(item.expDate),
          mediStockId: convert(item.mediStockId),
          expMestSttId: convert(item.expMestSttId),
          impPrice: typeof item.impPrice === 'number' ? item.impPrice : Number(item.impPrice || 0),
          impVatRatio: typeof item.impVatRatio === 'number' ? item.impVatRatio : Number(item.impVatRatio || 0),
          bidId: convert(item.bidId),
          expiredDate: convert(item.expiredDate),
          medicineTypeId: convert(item.medicineTypeId),
          impTime: convert(item.impTime),
          supplierId: convert(item.supplierId),
          serviceId: convert(item.serviceId),
          manufacturerId: convert(item.manufacturerId),
          medicineGroupId: convert(item.medicineGroupId),
          serviceUnitId: convert(item.serviceUnitId),
          medicineNumOrder: convert(item.medicineNumOrder),
          medicineUseFormNumOrder: convert(item.medicineUseFormNumOrder),
          sumInStock: typeof item.sumInStock === 'number' ? item.sumInStock : Number(item.sumInStock || 0),
          sumByMedicineInStock: typeof item.sumByMedicineInStock === 'number' ? item.sumByMedicineInStock : Number(item.sumByMedicineInStock || 0),
          materialNumOrder: item.materialNumOrder !== undefined ? convert(item.materialNumOrder) : null,
        };
      });
    }

    return result;
  }

  async updateWorkInfo(body: {
    roomIds?: number[];
    rooms?: { roomId: number; deskId?: number | null }[];
    workingShiftId?: number | null;
    nurseLoginName?: string | null;
    nurseUserName?: string | null;
    userId?: string;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: any;
  }> {
    this.logger.info('IntegrationService#updateWorkInfo.call', {
      roomIdsLength: body.roomIds?.length || 0,
      roomsLength: body.rooms?.length || 0,
    });

    const payload: any = {
      roomIds: body.roomIds ?? [],
      rooms: (body.rooms || []).map(r => ({
        roomId: r.roomId,
        deskId: r.deskId ?? null,
      })),
      workingShiftId: body.workingShiftId ?? null,
      nurseLoginName: body.nurseLoginName ?? null,
      nurseUserName: body.nurseUserName ?? null,
      userId: body.userId ?? null,
    };

    const result = await firstValueFrom(this.integrationGrpcService.updateWorkInfo(payload)) as any;
    this.logger.info('IntegrationService#updateWorkInfo.result', {
      success: result.success,
      hasData: !!result.data,
    });

    // Normalize numbers from Long
    if (result.data && Array.isArray(result.data)) {
      result.data = result.data.map((item: any) => ({
        ...item,
        roomTypeId: this.convertToNumber(item.roomTypeId),
        bedRoomId: this.convertToNumber(item.bedRoomId),
        roomId: this.convertToNumber(item.roomId),
        branchId: this.convertToNumber(item.branchId),
        departmentId: this.convertToNumber(item.departmentId),
        mediStockId: this.convertToNumber(item.mediStockId),
      }));
    }

    return result;
  }

  async getExpMestCabinets(request: {
    expMestSttIds?: number[];
    chmsTypeIds?: number[];
    expMestTypeId?: number;
    mediStockIdOrImpMediStockId?: number;
    createDateFrom?: string;
    createDateTo?: string;
    isIncludeDeleted?: boolean;
    keyword?: string;
    dataDomainFilter?: boolean;
    start?: number;
    limit?: number;
    userId?: string;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: any[];
    start?: number;
    limit?: number;
    count?: number;
    total?: number;
  }> {
    this.logger.info('IntegrationService#getExpMestCabinets.call', { request });
    const result = await firstValueFrom(this.integrationGrpcService.getExpMestCabinets(request)) as any;
    this.logger.info('IntegrationService#getExpMestCabinets.result', {
      success: result.success,
      dataCount: result.data?.length || 0,
      start: result.start,
      limit: result.limit,
      count: result.count,
      total: result.total,
    });

    if (result.data && Array.isArray(result.data)) {
      result.data = result.data.map((item: any) => {
        if (!item) return item;
        const convert = (v: any) => {
          if (v === null || v === undefined) return null;
          if (typeof v === 'object' && 'low' in v && 'high' in v) {
            const lv = v as { low: number; high: number };
            return lv.low + lv.high * 0x100000000;
          }
          return typeof v === 'number' ? v : Number(v);
        };

        const converted: any = {
          ...item,
          expMestId: convert(item.expMestId),
          expMestTypeId: convert(item.expMestTypeId),
          expMestSttId: convert(item.expMestSttId),
          mediStockId: convert(item.mediStockId),
          reqRoomId: convert(item.reqRoomId),
          reqDepartmentId: convert(item.reqDepartmentId),
          createDate: convert(item.createDate),
          serviceReqId: convert(item.serviceReqId),
          tdlTotalPrice: typeof item.tdlTotalPrice === 'number' ? item.tdlTotalPrice : Number(item.tdlTotalPrice || 0),
          tdlIntructionTime: convert(item.tdlIntructionTime),
          tdlIntructionDate: convert(item.tdlIntructionDate),
          tdlTreatmentId: convert(item.tdlTreatmentId),
          tdlPatientId: convert(item.tdlPatientId),
          tdlPatientDob: convert(item.tdlPatientDob),
          tdlPatientIsHasNotDayDob: convert(item.tdlPatientIsHasNotDayDob),
          tdlPatientGenderId: convert(item.tdlPatientGenderId),
          tdlPatientTypeId: convert(item.tdlPatientTypeId),
          virCreateMonth: convert(item.virCreateMonth),
          virCreateYear: convert(item.virCreateYear),
          priority: convert(item.priority),
          treatmentIsActive: convert(item.treatmentIsActive),
          lastExpTime: convert(item.lastExpTime),
          finishTime: convert(item.finishTime),
          finishDate: convert(item.finishDate),
          isExportEqualApprove: convert(item.isExportEqualApprove),
          lastApprovalTime: convert(item.lastApprovalTime),
          lastApprovalDate: convert(item.lastApprovalDate),
          numOrder: convert(item.numOrder),
          tdlIntructionDateMin: convert(item.tdlIntructionDateMin),
        };
        return converted;
      });
    }

    if (result.start !== undefined) result.start = this.convertToNumber(result.start);
    if (result.limit !== undefined) result.limit = this.convertToNumber(result.limit);
    if (result.count !== undefined) result.count = this.convertToNumber(result.count);
    if (result.total !== undefined) result.total = this.convertToNumber(result.total);

    return result;
  }

  async syncInpatientExpMest(expMestId: number, userId: string): Promise<any> {
    this.logger.info('IntegrationService#syncInpatientExpMest.call', { expMestId, userId });
    try {
      const result = await firstValueFrom(this.integrationGrpcService.syncInpatientExpMest({ expMestId, userId })) as any;
      this.logger.info('IntegrationService#syncInpatientExpMest.result', { success: result.success });
      return result;
    } catch (error: any) {
      this.logger.error('IntegrationService#syncInpatientExpMest.error', { error: error.message });
      throw error;
    }
  }

  async syncExpMestOther(expMestId: number, userId: string): Promise<any> {
    this.logger.info('IntegrationService#syncExpMestOther.call', { expMestId, userId });
    try {
      const result = await firstValueFrom(this.integrationGrpcService.syncExpMestOther({ expMestId, userId })) as any;
      this.logger.info('IntegrationService#syncExpMestOther.result', { success: result.success });
      return result;
    } catch (error: any) {
      this.logger.error('IntegrationService#syncExpMestOther.error', { error: error.message });
      throw error;
    }
  }

  async getInpatientExpMestSummaryFromHis(expMestId: number, userId: string): Promise<any> {
    this.logger.info('IntegrationService#getInpatientExpMestSummaryFromHis.call', { expMestId, userId });
    try {
      const result = await firstValueFrom(this.integrationGrpcService.getInpatientExpMestSummaryFromHis({ expMestId, userId })) as any;
      this.logger.info('IntegrationService#getInpatientExpMestSummaryFromHis.result', { success: result.success });
      return result;
    } catch (error: any) {
      this.logger.error('IntegrationService#getInpatientExpMestSummaryFromHis.error', { error: error.message });
      throw error;
    }
  }

  async enrichExpMestsWithSyncStatus(expMestIds: number[], expMestType: string, userId?: string): Promise<any> {
    this.logger.info('IntegrationService#enrichExpMestsWithSyncStatus.call', { count: expMestIds.length, expMestType });
    try {
      const result = await firstValueFrom(this.integrationGrpcService.enrichExpMestsWithSyncStatus({ expMestIds, expMestType })) as any;
      return result;
    } catch (error: any) {
      this.logger.error('IntegrationService#enrichExpMestsWithSyncStatus.error', { error: error.message });
      throw error;
    }
  }

  async autoUpdateExpMestSttId(expMestIds: number[], expMestType: string, userId: string): Promise<any> {
    this.logger.info('IntegrationService#autoUpdateExpMestSttId.call', { count: expMestIds.length, expMestType });
    try {
      const result = await firstValueFrom(this.integrationGrpcService.autoUpdateExpMestSttId({ expMestIds, expMestType, userId })) as any;
      return result;
    } catch (error: any) {
      this.logger.error('IntegrationService#autoUpdateExpMestSttId.error', { error: error.message });
      throw error;
    }
  }

  /**
   * Convert value to number, handling Long objects from gRPC and null/undefined
   */
  private convertToNumber(value: any): number | null {
    if (value === null || value === undefined) {
      return null;
    }

    // Handle Long objects from gRPC (protobuf Long type)
    if (typeof value === 'object' && 'low' in value && 'high' in value) {
      const longValue = value as { low: number; high: number };
      return longValue.low + (longValue.high * 0x100000000);
    }

    // Handle regular numbers
    if (typeof value === 'number') {
      return value;
    }

    // Try to parse as number
    const num = Number(value);
    return isNaN(num) ? null : num;
  }
}

