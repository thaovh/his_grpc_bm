import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';
import { Request } from 'express';
import { Resource } from '../common/decorators/resource.decorator';
import { IntegrationService } from '../auth/integration.service';
import { InventoryService } from '../inventory/inventory.service';
import { ExpMestMedicineService } from '../inventory/exp-mest-medicine.service';
import { MasterDataService } from '../master-data/master-data.service';
import { SyncExpMestBodyDto, SyncExpMestRequestDto, AutoUpdateExpMestSttIdDto } from './dto/sync-exp-mest.dto';
import { IntegrationBaseController } from './controllers/integration-base.controller';

// Extend Express Request to include user property set by JwtAuthGuard
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

@ApiTags('integration')
@Controller('integration')
export class IntegrationController extends IntegrationBaseController {
  constructor(
    integrationService: IntegrationService,
    inventoryService: InventoryService,
    expMestMedicineService: ExpMestMedicineService,
    masterDataService: MasterDataService,
    configService: ConfigService,
    logger: PinoLogger,
    eventEmitter: EventEmitter2,
  ) {
    super(
      integrationService,
      inventoryService,
      expMestMedicineService,
      masterDataService,
      configService,
      logger,
      eventEmitter,
    );
    this.logger.setContext(IntegrationController.name);
  }

  @Get('user-rooms')
  @Resource('integration.user-rooms.list')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user rooms from HIS system' })
  @ApiResponse({
    status: 200,
    description: 'User rooms retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'array',
          items: { type: 'object' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserRooms(@Req() request: AuthenticatedRequest): Promise<{
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
    this.logger.info('IntegrationController#getUserRooms.call', { userId: request.user?.id });

    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User not found in request');
    }

    const result = await this.integrationService.getUserRooms(userId);

    this.logger.info('IntegrationController#getUserRooms.result', {
      userId,
      success: result.success,
      roomCount: result.data?.length || 0,
    });

    return result;
  }

  @Post('user-rooms/reload')
  @Resource('integration.user-rooms.reload')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Reload user rooms from HIS system (bypass cache)' })
  @ApiResponse({
    status: 200,
    description: 'User rooms reloaded successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'array',
          items: { type: 'object' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async reloadUserRooms(@Req() request: AuthenticatedRequest): Promise<{
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
    this.logger.info('IntegrationController#reloadUserRooms.call', { userId: request.user?.id });

    const userId = request.user?.id;

    if (!userId) {
      throw new UnauthorizedException('User not found in request');
    }

    try {
      const result = await this.integrationService.reloadUserRooms(userId);

      this.logger.info('IntegrationController#reloadUserRooms.result', {
        userId,
        success: result.success,
        roomCount: result.data?.length || 0,
      });

      return result;
    } catch (error: any) {
      this.logger.error('IntegrationController#reloadUserRooms.error', {
        userId,
        error: error.message,
        errorType: error.constructor?.name,
        stack: error.stack?.substring(0, 500),
        code: error.code,
        details: error.details,
      });
      throw error;
    }
  }

  @Get('medi-stock/by-room-id/:roomId')
  @Resource('integration.medi-stock.read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get medi stock ID by roomId (cached)' })
  @ApiResponse({
    status: 200,
    description: 'Medi stock retrieved',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        id: { type: 'number' },
        data: { type: 'object' },
      },
    },
  })
  async getMediStockByRoomId(
    @Param('roomId') roomIdParam: string,
  ): Promise<{
    success: boolean;
    message?: string;
    id?: number | null;
    data?: any;
  }> {
    const roomId = Number(roomIdParam);
    this.logger.info('IntegrationController#getMediStockByRoomId.call', { roomId });
    const result = await this.integrationService.getMediStockByRoomId(roomId);
    this.logger.info('IntegrationController#getMediStockByRoomId.result', { success: result.success, id: result.id });
    return result;
  }

  @Post('medi-stock/reload')
  @Resource('integration.medi-stock.reload')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Reload medi stock cache from HIS' })
  @ApiResponse({
    status: 200,
    description: 'Reloaded medi stock cache',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        count: { type: 'number' },
      },
    },
  })
  async reloadMediStock(): Promise<{
    success: boolean;
    message?: string;
    count?: number;
  }> {
    this.logger.info('IntegrationController#reloadMediStock.call');
    const result = await this.integrationService.reloadMediStock();
    this.logger.info('IntegrationController#reloadMediStock.result', { success: result.success, count: result.count });
    return result;
  }

  @Get('exp-mest-stt')
  @Resource('integration.exp-mest-stt.list')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get exp mest status list (cached, auto-reload if empty)' })
  @ApiResponse({
    status: 200,
    description: 'Exp mest status list',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: { type: 'array', items: { type: 'object' } },
      },
    },
  })
  async getExpMestStt(): Promise<{
    success: boolean;
    message?: string;
    data?: any[];
  }> {
    this.logger.info('IntegrationController#getExpMestStt.call');
    const result = await this.integrationService.getExpMestStt();
    this.logger.info('IntegrationController#getExpMestStt.result', { success: result.success, count: result.data?.length || 0 });
    return result;
  }

  @Post('exp-mest-stt/reload')
  @Resource('integration.exp-mest-stt.reload')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Reload exp mest status cache from HIS' })
  @ApiResponse({
    status: 200,
    description: 'Reloaded exp mest status cache',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        count: { type: 'number' },
      },
    },
  })
  async reloadExpMestStt(): Promise<{
    success: boolean;
    message?: string;
    count?: number;
  }> {
    this.logger.info('IntegrationController#reloadExpMestStt.call');
    const result = await this.integrationService.reloadExpMestStt();
    this.logger.info('IntegrationController#reloadExpMestStt.result', { success: result.success, count: result.count });
    return result;
  }

  @Get('exp-mest-type')
  @Resource('integration.exp-mest-type.list')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get exp mest type list (cached, auto-reload if empty)' })
  @ApiResponse({
    status: 200,
    description: 'Exp mest type list',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: { type: 'array', items: { type: 'object' } },
      },
    },
  })
  async getExpMestType(): Promise<{
    success: boolean;
    message?: string;
    data?: any[];
  }> {
    this.logger.info('IntegrationController#getExpMestType.call');
    const result = await this.integrationService.getExpMestType();
    this.logger.info('IntegrationController#getExpMestType.result', { success: result.success, count: result.data?.length || 0 });
    return result;
  }

  @Get('exp-mest-type/other-ids')
  @Resource('integration.exp-mest-type.list')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get list of other exp mest types from configuration (with full details)' })
  @ApiResponse({
    status: 200,
    description: 'List of other exp mest types with full details',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              createTime: { type: 'number' },
              modifyTime: { type: 'number' },
              isActive: { type: 'number' },
              isDelete: { type: 'number' },
              expMestTypeCode: { type: 'string' },
              expMestTypeName: { type: 'string' },
            }
          }
        }
      }
    }
  })
  async getOtherExpMestTypeIds(): Promise<{
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
    this.logger.info('IntegrationController#getOtherExpMestTypeIds.call');

    try {
      // Get configuration from .env (try both ConfigService and process.env)
      const configValue =
        this.configService.get<string>('app.otherExpMestTypeId') ||
        this.configService.get<string>('OTHER_EXP_MEST_TYPE_ID') ||
        process.env.OTHER_EXP_MEST_TYPE_ID ||
        '';

      this.logger.info('IntegrationController#getOtherExpMestTypeIds.config', {
        configValue,
        fromAppConfig: this.configService.get<string>('app.otherExpMestTypeId'),
        fromConfigService: this.configService.get<string>('OTHER_EXP_MEST_TYPE_ID'),
        fromProcessEnv: process.env.OTHER_EXP_MEST_TYPE_ID,
      });

      // Parse comma-separated string to array of numbers
      const configIds: number[] = configValue
        .split(',')
        .map(id => id.trim())
        .filter(id => id.length > 0)
        .map(id => Number(id))
        .filter(id => !isNaN(id));

      if (configIds.length === 0) {
        this.logger.warn('IntegrationController#getOtherExpMestTypeIds.noConfigIds');
        return {
          data: [],
          success: true,
        };
      }

      // Get all exp mest types from cache
      const allExpMestTypesResult = await this.integrationService.getExpMestType();
      if (!allExpMestTypesResult.success || !allExpMestTypesResult.data) {
        this.logger.error('IntegrationController#getOtherExpMestTypeIds.failedToGetExpMestTypes', {
          success: allExpMestTypesResult.success,
          message: allExpMestTypesResult.message,
        });
        return {
          data: [],
          success: false,
        };
      }

      // Filter exp mest types by config IDs
      const filteredExpMestTypes = allExpMestTypesResult.data.filter(
        (type: any) => configIds.includes(type.id)
      );

      this.logger.info('IntegrationController#getOtherExpMestTypeIds.result', {
        configIds,
        configIdsCount: configIds.length,
        allExpMestTypesCount: allExpMestTypesResult.data.length,
        filteredCount: filteredExpMestTypes.length,
      });

      return {
        data: filteredExpMestTypes,
        success: true,
      };
    } catch (error: any) {
      this.logger.error('IntegrationController#getOtherExpMestTypeIds.error', {
        error: error?.message,
        stack: error?.stack,
      });

      return {
        data: [],
        success: false,
      };
    }
  }

  @Post('exp-mest-type/reload')
  @Resource('integration.exp-mest-type.reload')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Reload exp mest type cache from HIS' })
  @ApiResponse({
    status: 200,
    description: 'Reloaded exp mest type cache',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        count: { type: 'number' },
      },
    },
  })
  async reloadExpMestType(): Promise<{
    success: boolean;
    message?: string;
    count?: number;
  }> {
    this.logger.info('IntegrationController#reloadExpMestType.call');
    const result = await this.integrationService.reloadExpMestType();
    this.logger.info('IntegrationController#reloadExpMestType.result', { success: result.success, count: result.count });
    return result;
  }

  @Get('exp-mests')
  @Resource('integration.exp-mests.list')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get exp mest list with filters and pagination' })
  @ApiQuery({ name: 'expMestSttIds', required: false, description: 'Comma-separated list of exp mest status IDs (e.g., "1,2,3")', type: String })
  @ApiQuery({ name: 'expMestTypeIds', required: false, description: 'Comma-separated list of exp mest type IDs (e.g., "15,17")', type: String })
  @ApiQuery({ name: 'impOrExpMediStockId', required: false, description: 'Medical stock ID', type: Number })
  @ApiQuery({ name: 'createTimeFrom', required: false, description: 'Start timestamp (format: 20251215000000)', type: Number })
  @ApiQuery({ name: 'createTimeTo', required: false, description: 'End timestamp (format: 20251215235959)', type: Number })
  @ApiQuery({ name: 'start', required: false, description: 'Pagination start index (default: 0)', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Pagination limit (default: 100)', type: Number })
  @ApiQuery({ name: 'keyWord', required: false, description: 'Search keyword', type: String })
  @ApiResponse({
    status: 200,
    description: 'Exp mest list retrieved',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: { type: 'array', items: { type: 'object' } },
        start: { type: 'number', description: 'Pagination start index (0-based)' },
        limit: { type: 'number', description: 'Number of items per page' },
        count: { type: 'number', description: 'Number of items in current response' },
        total: { type: 'number', description: 'Total number of items available' },
        hasMore: { type: 'boolean', description: 'Whether there are more items to load' },
      },
    },
  })
  async getExpMests(
    @Query('expMestSttIds') expMestSttIds?: string,
    @Query('expMestTypeIds') expMestTypeIds?: string,
    @Query('impOrExpMediStockId') impOrExpMediStockId?: string,
    @Query('createTimeFrom') createTimeFrom?: string,
    @Query('createTimeTo') createTimeTo?: string,
    @Query('start') start?: string,
    @Query('limit') limit?: string,
    @Query('keyWord') keyWord?: string, // Bind from URL 'keyWord'
    @Req() req?: AuthenticatedRequest,
  ): Promise<{
    success: boolean;
    message?: string;
    data?: any[];
    start?: number;
    limit?: number;
    count?: number;
    total?: number;
    hasMore?: boolean;
  }> {
    this.logger.info('IntegrationController#getExpMests.call', {
      expMestSttIds,
      expMestTypeIds,
      impOrExpMediStockId,
      createTimeFrom,
      createTimeTo,
      start,
      limit,
      keyword: keyWord, // Log mapped value
      userId: req?.user?.id,
    });

    // Parse query parameters
    const request: {
      expMestSttIds?: number[];
      expMestTypeIds?: number[];
      impOrExpMediStockId?: number;
      createTimeFrom?: number;
      createTimeTo?: number;
      start?: number;
      limit?: number;
      keyword?: string; // Request uses keyword
      userId?: string;
    } = {};

    if (req?.user?.id) {
      request.userId = req.user.id;
    }

    if (expMestSttIds) {
      request.expMestSttIds = expMestSttIds.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
    }
    if (expMestTypeIds) {
      request.expMestTypeIds = expMestTypeIds.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
    }
    if (impOrExpMediStockId) {
      const id = Number(impOrExpMediStockId);
      if (!isNaN(id)) request.impOrExpMediStockId = id;
    }
    if (createTimeFrom) {
      const time = Number(createTimeFrom);
      if (!isNaN(time)) request.createTimeFrom = time;
    }
    if (createTimeTo) {
      const time = Number(createTimeTo);
      if (!isNaN(time)) request.createTimeTo = time;
    }
    if (start) {
      const s = Number(start);
      if (!isNaN(s)) request.start = s;
    }
    if (limit) {
      const l = Number(limit);
      if (!isNaN(l)) request.limit = l;
    }
    if (keyWord) {
      request.keyword = keyWord;
      console.log('🔍 [Gateway Controller] keyWord received from URL:', keyWord);
      console.log('🔍 [Gateway Controller] request.keyword set to:', request.keyword);
    } else {
      console.log('⚠️ [Gateway Controller] keyWord is empty/undefined');
    }
    console.log('🔍 [Gateway Controller] Full request object:', JSON.stringify(request));


    try {
      const start = request.start ?? 0;
      const limit = request.limit ?? 100;

      // 1) Lấy danh sách từ HIS theo start/limit do FE truyền
      const hisResult = await this.integrationService.getExpMests(request).catch(err => {
        this.logger.warn('IntegrationController#getExpMests.hisError', { error: err.message });
        return { success: false, data: [], count: 0, total: 0 };
      });

      if (!hisResult.success) {
        const hisMessage = (hisResult as any).message;
        return {
          success: false,
          message: hisMessage || 'Failed to get exp mests from HIS',
        };
      }

      const hisData = hisResult.data || [];

      // 2) Lấy danh sách expMestId đã tồn tại trong Inventory để gắn cờ is_sync
      const hisIds = hisData
        .map((item: any) => Number(item.id))
        .filter((id: number) => !isNaN(id));

      let inventoryExistingMap = new Map<number, boolean>();
      if (hisIds.length > 0) {
        const existing = await this.getInventoryExpMestsByIds(hisIds).catch(err => {
          this.logger.warn('IntegrationController#getExpMests.inventoryByIdsError', { error: err.message });
          return [];
        });
        inventoryExistingMap = new Map(
          existing
            .map((item: any) => Number(item.expMestId))
            .filter((id: number) => !isNaN(id))
            .map((id: number) => [id, true]),
        );
      }

      // 3) Không trộn dữ liệu Inventory, chỉ gắn cờ is_sync
      const dataWithSync = hisData.map((item: any) => {
        const expMestId = Number(item.id);
        const isSync = !isNaN(expMestId) && inventoryExistingMap.has(expMestId);
        return { ...item, is_sync: isSync };
      });

      // 4) Thông tin phân trang dựa trên HIS
      const count = dataWithSync.length;
      const total = hisResult.total ?? hisResult.count ?? count;
      const hasMore = count === limit; // HIS không trả total, nên nếu trả đủ limit thì giả định còn

      this.logger.info('IntegrationController#getExpMests.result', {
        success: true,
        dataCount: count,
        start,
        limit,
        total,
        hasMore,
      });

      return {
        success: true,
        data: dataWithSync,
        start,
        limit,
        count,
        total,
        hasMore,
      };
    } catch (error: any) {
      this.logger.error('IntegrationController#getExpMests.error', {
        error: error.message,
        stack: error.stack,
      });
      return {
        success: false,
        message: error.message || 'Failed to get exp mests',
      };
    }
  }

  @Get('exp-mests/other')
  @Resource('integration.exp-mests.list')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get exp mest get view2 list using OTHER_EXP_MEST_TYPE_ID from .env',
    description: 'Gọi GetView2 với expMestTypeIds tự động lấy từ OTHER_EXP_MEST_TYPE_ID trong .env. Không nhận expMestTypeIds từ query param để tránh nhầm.'
  })
  @ApiQuery({ name: 'expMestSttIds', required: false, description: 'Comma-separated list of exp mest status IDs', type: String })
  @ApiQuery({ name: 'impOrExpMediStockId', required: false, description: 'Medical stock ID', type: Number })
  @ApiQuery({ name: 'createTimeFrom', required: false, description: 'Start timestamp (format: 20251215000000)', type: Number })
  @ApiQuery({ name: 'createTimeTo', required: false, description: 'End timestamp (format: 20251215235959)', type: Number })
  @ApiQuery({ name: 'start', required: false, description: 'Pagination start index (default: 0)', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Pagination limit (default: 100)', type: Number })
  @ApiQuery({ name: 'keyWord', required: false, description: 'Search keyword', type: String })
  @ApiResponse({
    status: 200,
    description: 'Exp mest list retrieved',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: { type: 'array', items: { type: 'object' } },
        start: { type: 'number' },
        limit: { type: 'number' },
        count: { type: 'number' },
        total: { type: 'number' },
        hasMore: { type: 'boolean' },
        expMestTypeIds: {
          type: 'array',
          items: { type: 'number' },
          description: 'expMestTypeIds used (from OTHER_EXP_MEST_TYPE_ID in .env)'
        },
      },
    },
  })
  async getExpMestsOther(
    @Query('expMestSttIds') expMestSttIds?: string,
    @Query('impOrExpMediStockId') impOrExpMediStockId?: string,
    @Query('createTimeFrom') createTimeFrom?: string,
    @Query('createTimeTo') createTimeTo?: string,
    @Query('start') start?: string,
    @Query('limit') limit?: string,
    @Query('keyWord') keyWord?: string,
    @Req() req?: AuthenticatedRequest,
  ): Promise<{
    success: boolean;
    message?: string;
    data?: any[];
    start?: number;
    limit?: number;
    count?: number;
    total?: number;
    hasMore?: boolean;
    expMestTypeIds?: number[];
  }> {
    this.logger.info('IntegrationController#getExpMestsOther.call', {
      expMestSttIds,
      impOrExpMediStockId,
      createTimeFrom,
      createTimeTo,
      start,
      limit,
      keyWord,
    });

    // Parse query parameters
    const request: {
      expMestSttIds?: number[];
      expMestTypeIds?: number[];
      impOrExpMediStockId?: number;
      createTimeFrom?: number;
      createTimeTo?: number;
      start?: number;
      limit?: number;
      keyword?: string;
      userId?: string;
    } = {};

    if (req?.user?.id) {
      request.userId = req.user.id;
    }

    // Parse expMestSttIds
    if (expMestSttIds) {
      request.expMestSttIds = expMestSttIds.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));
    }

    // Lấy expMestTypeIds từ .env (KHÔNG nhận từ query param)
    const configValue =
      this.configService.get<string>('app.otherExpMestTypeId') ||
      this.configService.get<string>('OTHER_EXP_MEST_TYPE_ID') ||
      process.env.OTHER_EXP_MEST_TYPE_ID ||
      '';

    if (!configValue) {
      return {
        success: false,
        message: 'OTHER_EXP_MEST_TYPE_ID is not configured in .env file',
      };
    }

    const configIds: number[] = configValue
      .split(',')
      .map(id => id.trim())
      .filter(id => id.length > 0)
      .map(id => Number(id))
      .filter(id => !isNaN(id));

    if (configIds.length === 0) {
      return {
        success: false,
        message: 'OTHER_EXP_MEST_TYPE_ID in .env is invalid or empty',
      };
    }

    request.expMestTypeIds = configIds;

    this.logger.info('IntegrationController#getExpMestsOther.usingExpMestTypeIds', {
      expMestTypeIds: request.expMestTypeIds,
      source: 'OTHER_EXP_MEST_TYPE_ID from .env',
      configValue,
    });

    // Parse other params
    if (impOrExpMediStockId) {
      const id = Number(impOrExpMediStockId);
      if (!isNaN(id)) request.impOrExpMediStockId = id;
    }
    if (createTimeFrom) {
      const time = Number(createTimeFrom);
      if (!isNaN(time)) request.createTimeFrom = time;
    }
    if (createTimeTo) {
      const time = Number(createTimeTo);
      if (!isNaN(time)) request.createTimeTo = time;
    }
    if (start) {
      const s = Number(start);
      if (!isNaN(s)) request.start = s;
    }
    if (limit) {
      const l = Number(limit);
      if (!isNaN(l)) request.limit = l;
    }

    if (keyWord) {
      request.keyword = keyWord;
    }

    try {
      const start = request.start ?? 0;
      const limit = request.limit ?? 100;

      // 1) Lấy danh sách từ HIS theo start/limit do FE truyền
      const hisResult = await this.integrationService.getExpMests(request).catch(err => {
        this.logger.warn('IntegrationController#getExpMestsOther.hisError', { error: err.message });
        return { success: false, data: [], count: 0, total: 0 };
      });

      if (!hisResult.success) {
        const hisMessage = (hisResult as any).message;
        return {
          success: false,
          message: hisMessage || 'Failed to get exp mests from HIS',
        };
      }

      const hisData = hisResult.data || [];

      // 2) Enrich with is_sync and working_state using common helper
      const enrichedData = await this.enrichWithSyncStatus(hisData, 'other');

      // 3) Auto-sync EXP_MEST_STT_ID if needed
      // Note: enrichWithSyncStatus does NOT perform auto-update, so we keep that logic if desired
      // OR we can move auto-update logic to a separate helper or service.
      // For now, let's keep the auto-update logic but adapt it to work with enrichedData.

      // We can use autoUpdateExpMestSttId helper if available, but for now let's implement minimal check
      // based on enrichedData if we want to preserve the exact behavior.
      // However, the user request is specifically to use enrichWithSyncStatus.
      // Let's rely on the enrichment service to handle basic status.
      // If we need write-back (auto-update), we should call autoUpdateExpMestSttId separately.

      const hisIds = hisData
        .map((item: any) => Number(item.id))
        .filter((id: number) => !isNaN(id));

      if (hisIds.length > 0) {
        // Call auto-update service async
        this.integrationService.autoUpdateExpMestSttId(
          hisIds,
          'other',
          request.userId || 'SYSTEM'
        ).catch(err => {
          this.logger.warn('IntegrationController#getExpMestsOther.autoUpdateStatus.error', { error: err.message });
        });
      }

      // 4) Thông tin phân trang dựa trên HIS
      const count = enrichedData.length;
      const total = hisResult.total ?? hisResult.count ?? count;
      const hasMore = count === limit;

      this.logger.info('IntegrationController#getExpMestsOther.result', {
        success: true,
        dataCount: count,
        start,
        limit,
        total,
        hasMore,
        expMestTypeIds: request.expMestTypeIds,
      });

      return {
        success: true,
        data: enrichedData,
        start,
        limit,
        count,
        total,
        hasMore,
        expMestTypeIds: request.expMestTypeIds,
      };
    } catch (error: any) {
      this.logger.error('IntegrationController#getExpMestsOther.error', {
        error: error.message,
        stack: error.stack,
      });
      return {
        success: false,
        message: error.message || 'Failed to get exp mests',
      };
    }
  }

  @Get('exp-mests/other/:expMestId')
  @Resource('integration.exp-mests.read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get other exp mest details from HIS, with is_sync flag' })
  @ApiResponse({ status: 200, description: 'Exp mest details retrieved' })
  async getExpMestOtherById(
    @Param('expMestId') expMestId: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<{
    success: boolean;
    message?: string;
    data?: any;
  }> {
    this.logger.info('IntegrationController#getExpMestOtherById.call', { expMestId });

    try {
      const id = Number(expMestId);
      if (isNaN(id)) {
        return {
          success: false,
          message: 'Invalid expMestId',
        };
      }

      // 1. Get from HIS
      const hisResult = await this.integrationService.getExpMestById({
        expMestId: id,
        includeDeleted: false,
        dataDomainFilter: false,
        userId: req?.user?.id,
      }).catch(err => {
        this.logger.warn('IntegrationController#getExpMestOtherById.hisError', { error: err.message });
        return { success: false, data: null, message: err.message };
      });

      if (!hisResult.success) {
        return {
          success: false,
          message: hisResult.message || 'Failed to get exp mest from HIS',
        };
      }

      if (!hisResult.data) {
        return {
          success: true,
          data: null,
          message: 'Exp mest not found in HIS',
        };
      }

      // 2. Check sync status and Auto-sync EXP_MEST_STT_ID
      const existingList = await this.getInventoryExpMestOthersByHisIds([id]).catch(err => {
        this.logger.warn('IntegrationController#getExpMestOtherById.inventoryError', { error: err.message });
        return [];
      });

      let existing: any = null;
      if (existingList.length > 0) {
        existing = existingList[0];
      }

      const isSync = !!existing;
      let workingStateId = null;
      let working_state = null;

      // Lấy default workingStateId từ .env
      const defaultWorkingStateId =
        this.configService.get<string>('DEFAULT_NOT_SYNC_EXPORT_STATUS_ID') ||
        null;

      if (isSync && existing) {
        workingStateId = existing.workingStateId;

        // Auto-sync status logic...
        const hisExpMestSttId = Number(hisResult.data.expMestSttId);
        const localExpMestSttId = Number(existing.expMestSttId);

        if (!isNaN(hisExpMestSttId) && localExpMestSttId !== hisExpMestSttId) {
          this.logger.info('IntegrationController#getExpMestOtherById.expMestSttIdMismatch', {
            expMestId: id,
            /* ... log details ... */
          });

          this.inventoryService.updateExpMestOther({
            id: existing.id,
            dto: { expMestSttId: hisExpMestSttId }
          }).then(async () => {
            // Fetch working_state for event
            let eventWorkingState = null;
            if (workingStateId) {
              eventWorkingState = await this.masterDataService.findExportStatusById(workingStateId).catch(() => null);
            }

            // Emit event
            this.eventEmitter.emit('inpatient.exp-mest.stt-updated', {
              expMestId: id,
              expMestCode: hisResult.data.expMestCode || '',
              oldSttId: localExpMestSttId,
              newSttId: hisExpMestSttId,
              timestamp: Date.now(),
              data: {
                ...hisResult.data,
                is_sync: true,
                workingStateId,
                working_state: eventWorkingState
              },
            });
          }).catch((err: any) => { /* log error */ });
        }
      } else {
        // Not sync, use default working state
        if (defaultWorkingStateId) {
          workingStateId = defaultWorkingStateId;
        }
      }

      // Enrich working_state
      if (workingStateId) {
        try {
          working_state = await this.masterDataService.findExportStatusById(workingStateId);
        } catch (e) {
          this.logger.warn('IntegrationController#getExpMestOtherById.failedToFetchExportStatus', { workingStateId });
        }
      }

      return {
        success: true,
        data: {
          ...hisResult.data,
          is_sync: isSync,
          workingStateId,
          working_state,
        },
      };

    } catch (error: any) {
      this.logger.error('IntegrationController#getExpMestOtherById.error', {
        error: error.message,
        stack: error.stack,
      });
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get('exp-mests/cabinets')
  @Resource('integration.exp-mests.list')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get cabinet replenishment exp mest records from HIS (GetView4), with is_sync flag' })
  @ApiQuery({ name: 'expMestSttIds', required: false, description: 'Comma-separated EXP_MEST_STT_IDs', type: String })
  @ApiQuery({ name: 'chmsTypeIds', required: false, description: 'Comma-separated CHMS_TYPE_IDs', type: String })
  @ApiQuery({ name: 'expMestTypeId', required: false, description: 'EXP_MEST_TYPE_ID (default 3)', type: Number })
  @ApiQuery({ name: 'mediStockIdOrImpMediStockId', required: false, description: 'MEDI_STOCK_ID or IMP_MEDI_STOCK_ID filter', type: Number })
  @ApiQuery({ name: 'createDateFrom', required: false, description: 'From Date (YYYYMMDDHHMMSS)', type: String })
  @ApiQuery({ name: 'createDateTo', required: false, description: 'To Date (YYYYMMDDHHMMSS)', type: String })
  @ApiQuery({ name: 'isIncludeDeleted', required: false, description: 'Include deleted records', type: Boolean })
  @ApiQuery({ name: 'keyword', required: false, description: 'Search keyword', type: String })
  @ApiQuery({ name: 'dataDomainFilter', required: false, description: 'Enable data domain filter', type: Boolean })
  @ApiQuery({ name: 'start', required: false, description: 'Pagination start (0-based)', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Pagination limit (default 100)', type: Number })
  async getExpMestCabinets(
    @Query('expMestSttIds') expMestSttIds?: string,
    @Query('chmsTypeIds') chmsTypeIds?: string,
    @Query('expMestTypeId') expMestTypeId?: string,
    @Query('mediStockIdOrImpMediStockId') mediStockIdOrImpMediStockId?: string,
    @Query('createDateFrom') createDateFrom?: string,
    @Query('createDateTo') createDateTo?: string,
    @Query('isIncludeDeleted') isIncludeDeleted?: string,
    @Query('keyword') keyword?: string,
    @Query('dataDomainFilter') dataDomainFilter?: string,
    @Query('start') start?: string,
    @Query('limit') limit?: string,
    @Req() req?: AuthenticatedRequest,
  ): Promise<{
    success: boolean;
    message?: string;
    data?: any[];
    start?: number;
    limit?: number;
    count?: number;
    total?: number;
  }> {
    const userId = req?.user?.id;
    this.logger.info('IntegrationController#getExpMestCabinets.call', { userId });

    const request: any = {
      userId, // Pass userId for data domain filtering if needed
    };

    if (expMestSttIds) {
      request.expMestSttIds = expMestSttIds.split(',').map(Number).filter(n => !isNaN(n));
    }
    if (chmsTypeIds) {
      request.chmsTypeIds = chmsTypeIds.split(',').map(Number).filter(n => !isNaN(n));
    }
    if (expMestTypeId) {
      const v = Number(expMestTypeId);
      if (!isNaN(v)) request.expMestTypeId = v;
    }
    if (mediStockIdOrImpMediStockId) {
      const v = Number(mediStockIdOrImpMediStockId);
      if (!isNaN(v)) request.mediStockIdOrImpMediStockId = v;
    }
    if (createDateFrom) request.createDateFrom = createDateFrom;
    if (createDateTo) request.createDateTo = createDateTo;

    if (start) {
      const v = Number(start);
      if (!isNaN(v)) request.start = v;
    }
    if (limit) {
      const v = Number(limit);
      if (!isNaN(v)) request.limit = v;
    }

    // Default params
    if (isIncludeDeleted !== undefined) {
      request.isIncludeDeleted = isIncludeDeleted === 'true';
    }
    if (dataDomainFilter !== undefined) {
      request.dataDomainFilter = dataDomainFilter === 'true';
    }
    if (keyword) {
      request.keyword = keyword;
    }

    try {
      // 1. Get from HIS
      const hisResult = await this.integrationService.getExpMestCabinets(request).catch(err => {
        this.logger.warn('IntegrationController#getExpMestCabinets.hisError', { error: err.message });
        return { success: false, data: [], count: 0, total: 0, message: err.message };
      });

      if (!hisResult.success) {
        return {
          success: false,
          message: hisResult.message || 'Failed to get cabinet replenishment list from HIS',
        };
      }

      const hisData = hisResult.data || [];
      const hisIds = hisData.map((item: any) => {
        // Handle Long object from gRPC/Proto
        if (item.id && typeof item.id === 'object' && 'low' in item.id) {
          return Number(item.id.low); // Assuming simple int32 fit for now, or use generic long to number
        }
        return Number(item.id);
      }).filter((id: number) => !isNaN(id) && id > 0);

      // 2. Check Sync Status with Inventory Service
      let inventoryExistingMap = new Map<number, boolean>();
      let workingStateMap = new Map<number, string | null>(); // Map hisId -> workingStateId (local)

      if (hisIds.length > 0) {
        const existing = await this.inventoryService.findExpMestCabinetsByHisIds(hisIds).catch(err => {
          this.logger.warn('IntegrationController#getExpMestCabinets.inventoryError', { error: err.message });
          return [];
        });

        existing.forEach((item: any) => {
          // expMestId in inventory proto corresponds to HIS ID
          const hisId = Number(item.expMestId);
          if (!isNaN(hisId)) {
            inventoryExistingMap.set(hisId, true);
            if (item.workingStateId) {
              workingStateMap.set(hisId, item.workingStateId);
            }
          }
        });
      }

      // 3. Enrich with ExportStatus (working_state)
      // Collect unique workingStateIds
      const defaultWorkingStateId = this.configService.get<string>('DEFAULT_NOT_SYNC_EXPORT_STATUS_ID') || null;
      const workingStateIds = new Set<string>();

      // Add default if needed
      if (defaultWorkingStateId) workingStateIds.add(defaultWorkingStateId);

      // Add from existing records
      workingStateMap.forEach(id => {
        if (id) workingStateIds.add(id);
      });

      const masterStatusMap = new Map<string, any>();
      if (workingStateIds.size > 0) {
        try {
          for (const statusId of workingStateIds) {
            const status = await this.masterDataService.findExportStatusById(statusId).catch(() => null);
            if (status) masterStatusMap.set(statusId, status);
          }
        } catch (e) {
          this.logger.warn('IntegrationController#getExpMestCabinets.masterDataError', { error: e.message });
        }
      }

      // 4. Merge Data
      const dataWithSync = hisData.map((item: any) => {
        let hisId = 0;
        if (item.id && typeof item.id === 'object' && 'low' in item.id) {
          hisId = Number(item.id.low);
        } else {
          hisId = Number(item.id);
        }

        const isSync = !isNaN(hisId) && hisId > 0 && inventoryExistingMap.has(hisId);

        // Determine workingStateId
        let workingStateId = null;
        if (isSync) {
          workingStateId = workingStateMap.get(hisId) || null;
        } else {
          workingStateId = defaultWorkingStateId;
        }

        const working_state = workingStateId ? masterStatusMap.get(workingStateId) : null;

        return {
          ...item,
          is_sync: isSync,
          workingStateId,
          working_state,
        };
      });

      // Helper to cleanup Long objects recursively
      const cleanLongs = (obj: any): any => {
        if (obj === null || obj === undefined) return obj;
        if (typeof obj === 'number') return obj;
        if (typeof obj === 'string') return obj;
        if (typeof obj === 'boolean') return obj;

        // Check for Long object (low, high, unsigned)
        if (typeof obj === 'object' && 'low' in obj && 'high' in obj) {
          return Number(obj.low); // Simplification for IDs that fit in JS number
        }

        if (Array.isArray(obj)) {
          return obj.map(v => cleanLongs(v));
        }

        if (typeof obj === 'object') {
          const newObj: any = {};
          for (const key in obj) {
            newObj[key] = cleanLongs(obj[key]);
          }
          return newObj;
        }
        return obj;
      };

      const finalData = cleanLongs(dataWithSync);

      // Handle pagination result from properties
      const count = hisResult.count ?? finalData.length;
      const total = hisResult.total ?? count;

      return {
        success: true,
        data: finalData,
        start: request.start || 0,
        limit: request.limit || 100,
        count,
        total,
      };

    } catch (error: any) {
      this.logger.error('IntegrationController#getExpMestCabinets.error', {
        error: error.message,
        stack: error.stack,
      });
      return {
        success: false,
        message: error.message || 'Internal Server Error',
      };
    }
  }

  @Get('exp-mests/inpatient')
  @Resource('integration.exp-mests.list')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get inpatient aggregated export medicine records from HIS (GetView3), with is_sync flag' })
  @ApiQuery({ name: 'expMestSttIds', required: false, description: 'Comma-separated EXP_MEST_STT_IDs', type: String })
  @ApiQuery({ name: 'expMestTypeId', required: false, description: 'EXP_MEST_TYPE_ID (e.g., 7)', type: Number })
  @ApiQuery({ name: 'mediStockId', required: false, description: 'MEDI_STOCK_ID filter', type: Number })
  @ApiQuery({ name: 'createTimeFrom', required: false, description: 'CREATE_TIME_FROM (YYYYMMDDHHMMSS)', type: Number })
  @ApiQuery({ name: 'createTimeTo', required: false, description: 'CREATE_TIME_TO (YYYYMMDDHHMMSS)', type: Number })
  @ApiQuery({ name: 'start', required: false, description: 'Offset (default 0)', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Page size (default 100)', type: Number })
  @ApiQuery({ name: 'orderField', required: false, description: 'ORDER_FIELD (e.g., MODIFY_TIME)', type: String })
  @ApiQuery({ name: 'orderDirection', required: false, description: 'ORDER_DIRECTION DESC/ASC', type: String })
  @ApiQuery({ name: 'includeDeleted', required: false, description: 'IS_INCLUDE_DELETED', type: Boolean })
  @ApiQuery({ name: 'keyWord', required: false, description: 'KEY_WORD filter', type: String })
  @ApiQuery({ name: 'dataDomainFilter', required: false, description: 'DATA_DOMAIN_FILTER', type: Boolean })
  async getInpatientExpMests(
    @Query('expMestSttIds') expMestSttIds?: string,
    @Query('expMestTypeId') expMestTypeId?: string,
    @Query('mediStockId') mediStockId?: string,
    @Query('createTimeFrom') createTimeFrom?: string,
    @Query('createTimeTo') createTimeTo?: string,
    @Query('start') start?: string,
    @Query('limit') limit?: string,
    @Query('orderField') orderField?: string,
    @Query('orderDirection') orderDirection?: string,
    @Query('includeDeleted') includeDeleted?: string,
    @Query('keyWord') keyWord?: string,
    @Query('dataDomainFilter') dataDomainFilter?: string,
    @Req() req?: AuthenticatedRequest,
  ): Promise<any> {
    const request: any = {};
    if (req?.user?.id) {
      request.userId = req.user.id;
    }

    // Get default values from .env
    const defaultExpMestTypeId = this.configService.get<number>('INPATIENT_EXP_MEST_TYPE_ID', 7);
    const defaultOrderField = this.configService.get<string>('INPATIENT_ORDER_FIELD', 'MODIFY_TIME');
    const defaultOrderDirection = this.configService.get<string>('INPATIENT_ORDER_DIRECTION', 'DESC');
    const defaultIncludeDeleted = this.configService.get<string>('INPATIENT_IS_INCLUDE_DELETED', 'false') === 'true';
    const defaultDataDomainFilter = this.configService.get<string>('INPATIENT_DATA_DOMAIN_FILTER', 'false') === 'true';

    if (expMestSttIds) request.expMestSttIds = expMestSttIds.split(',').map(id => Number(id.trim())).filter(id => !isNaN(id));

    // expMestTypeId: use query param if provided, otherwise use default from .env
    if (expMestTypeId) {
      const v = Number(expMestTypeId);
      if (!isNaN(v)) request.expMestTypeId = v;
    } else {
      request.expMestTypeId = defaultExpMestTypeId;
    }

    if (mediStockId) {
      const v = Number(mediStockId);
      if (!isNaN(v)) request.mediStockId = v;
    }
    if (createTimeFrom) {
      const v = Number(createTimeFrom);
      if (!isNaN(v)) request.createTimeFrom = v;
    }
    if (createTimeTo) {
      const v = Number(createTimeTo);
      if (!isNaN(v)) request.createTimeTo = v;
    }
    if (start) {
      const v = Number(start);
      if (!isNaN(v)) request.start = v;
    }
    if (limit) {
      const v = Number(limit);
      if (!isNaN(v)) request.limit = v;
    }

    // orderField: use query param if provided, otherwise use default from .env
    request.orderField = orderField || defaultOrderField;

    // orderDirection: use query param if provided, otherwise use default from .env
    request.orderDirection = orderDirection || defaultOrderDirection;

    // includeDeleted: use query param if provided, otherwise use default from .env
    if (includeDeleted !== undefined) {
      request.includeDeleted = includeDeleted === 'true';
    } else {
      request.includeDeleted = defaultIncludeDeleted;
    }

    if (keyWord) {
      request.keyword = keyWord;
      console.log('🔍 [Gateway Inpatient] keyWord received:', keyWord);
    }

    // dataDomainFilter: use query param if provided, otherwise use default from .env
    if (dataDomainFilter !== undefined) {
      request.dataDomainFilter = dataDomainFilter === 'true';
    } else {
      request.dataDomainFilter = defaultDataDomainFilter;
    }

    try {
      const startVal = request.start ?? 0;
      const limitVal = request.limit ?? 100;

      const hisResult = await this.integrationService.getInpatientExpMests(request).catch(err => {
        this.logger.warn('IntegrationController#getInpatientExpMests.hisError', { error: err.message });
        return { success: false, data: [], count: 0, total: 0 };
      });
      console.log('🔍 [Gateway Inpatient] Calling Service with request:', JSON.stringify(request));

      if (!hisResult.success) {
        return {
          success: false,
          message: hisResult.message || 'Failed to get inpatient exp mests from HIS',
        };
      }

      const hisData = hisResult.data || [];
      const hisIds = hisData.map((item: any) => Number(item.id)).filter((id: number) => !isNaN(id));

      // Check in EXP_INPATIENT_EXP_MEST table (not EXP_EXP_MEST)
      let inventoryExistingMap = new Map<number, boolean>();
      let workingStateMap = new Map<number, { workingStateId: string | null; working_state: any }>();
      const existingRecordsMap = new Map<number, { id: string; expMestSttId: number | null }>();

      // Lấy default workingStateId từ .env (cho records chưa sync)
      const defaultWorkingStateId =
        this.configService.get<string>('DEFAULT_NOT_SYNC_EXPORT_STATUS_ID') ||
        null;

      if (hisIds.length > 0) {
        // Query from InpatientExpMest table using hisExpMestId array
        const existing = await this.inventoryService.findInpatientExpMestsByHisIds(hisIds).catch(err => {
          this.logger.warn('IntegrationController#getInpatientExpMests.inpatientExpMestsError', { error: err.message });
          return [];
        });

        const foundHisIds = existing
          .map((item: any) => Number(item.hisExpMestId))
          .filter((id: number) => !isNaN(id));

        inventoryExistingMap = new Map(foundHisIds.map((id: number) => [id, true]));

        // Tạo map cho workingStateId và expMestSttId từ existing records
        existing.forEach((item: any) => {
          if (item.hisExpMestId) {
            const hisExpMestId = Number(item.hisExpMestId);
            existingRecordsMap.set(hisExpMestId, {
              id: item.id,
              expMestSttId: item.expMestSttId || null,
            });

            workingStateMap.set(hisExpMestId, {
              workingStateId: item.workingStateId || null,
              working_state: item.working_state || null, // Đã được enrich từ InventoryService
            });
          }
        });

        this.logger.info('IntegrationController#getInpatientExpMests.syncCheck', {
          hisIdsCount: hisIds.length,
          foundCount: foundHisIds.length,
          foundHisIds: foundHisIds.slice(0, 10), // Log first 10 for debugging
          sampleHisIds: hisIds.slice(0, 10), // Log first 10 for debugging
        });
      }

      // Collect unique workingStateIds để enrich (bao gồm cả default nếu có)
      const uniqueWorkingStateIds = Array.from(
        new Set(
          [
            ...Array.from(workingStateMap.values())
              .map((info) => info.workingStateId)
              .filter((id): id is string => id !== null && id !== undefined),
            ...(defaultWorkingStateId ? [defaultWorkingStateId] : []), // Thêm default vào để enrich
          ]
        )
      );

      // Enrich với ExportStatus
      const exportStatusMap = new Map<string, any>();
      if (uniqueWorkingStateIds.length > 0) {
        for (const workingStateId of uniqueWorkingStateIds) {
          try {
            const exportStatus = await this.masterDataService.findExportStatusById(workingStateId);
            if (exportStatus) {
              exportStatusMap.set(workingStateId, exportStatus);
            }
          } catch (error: any) {
            this.logger.warn('IntegrationController#getInpatientExpMests.failedToFetchExportStatus', {
              workingStateId,
              error: error?.message,
            });
          }
        }
      }

      // Update workingStateMap với exportStatus từ MasterDataService
      workingStateMap.forEach((stateInfo, hisExpMestId) => {
        if (stateInfo.workingStateId && exportStatusMap.has(stateInfo.workingStateId)) {
          stateInfo.working_state = exportStatusMap.get(stateInfo.workingStateId);
        }
      });

      // Check and update expMestSttId if different from HIS
      const updatePromises: Promise<any>[] = [];

      const dataWithSync = hisData.map((item: any) => {
        const expMestId = Number(item.id);
        const isSync = !isNaN(expMestId) && inventoryExistingMap.has(expMestId);

        // Check and update expMestSttId if different from HIS
        if (isSync && !isNaN(expMestId)) {
          const hisExpMestSttId = Number(item.expMestSttId);
          if (!isNaN(hisExpMestSttId)) {
            const existingRecord = existingRecordsMap.get(expMestId);
            if (existingRecord) {
              const localExpMestSttId = existingRecord.expMestSttId;

              // So sánh expMestSttId từ HIS với local DB
              if (localExpMestSttId !== hisExpMestSttId) {
                this.logger.info('IntegrationController#getInpatientExpMests.expMestSttIdMismatch', {
                  expMestId,
                  expMestCode: item.expMestCode,
                  hisExpMestSttId,
                  localExpMestSttId,
                });

                // Update expMestSttId trong local DB (async, non-blocking)
                const updatePromise = this.inventoryService.updateInpatientExpMest({
                  id: existingRecord.id,
                  expMestSttId: hisExpMestSttId,
                  updatedBy: null, // System update, không có user context
                }).then(async () => {
                  // Emit event sau khi update thành công với đầy đủ thông tin như API GET /api/integration/exp-mests/inpatient
                  // item đã có đầy đủ thông tin từ HIS, chỉ cần enrich với workingStateId và working_state
                  const stateInfo = workingStateMap.get(expMestId);
                  const enrichedData = {
                    ...item,
                    is_sync: true,
                    workingStateId: stateInfo?.workingStateId || null,
                    working_state: stateInfo?.working_state || null,
                  };

                  this.eventEmitter.emit('inpatient.exp-mest.stt-updated', {
                    expMestId: expMestId,
                    expMestCode: item.expMestCode || '',
                    oldSttId: localExpMestSttId,
                    newSttId: hisExpMestSttId,
                    timestamp: Date.now(),
                    data: enrichedData, // Thêm đầy đủ thông tin
                  });
                }).catch((error: any) => {
                  this.logger.error('IntegrationController#getInpatientExpMests.updateExpMestSttIdError', {
                    expMestId,
                    error: error?.message,
                    stack: error?.stack,
                  });
                  // Không throw error để không làm fail toàn bộ request
                });

                updatePromises.push(updatePromise);
              }
            }
          }
        }

        // Lấy workingStateId và working_state
        const stateInfo = workingStateMap.get(expMestId);

        // Nếu chưa sync, dùng default từ .env
        const workingStateId = stateInfo?.workingStateId ||
          (!isSync && defaultWorkingStateId ? defaultWorkingStateId : null);
        const working_state = stateInfo?.working_state ||
          (!isSync && defaultWorkingStateId && exportStatusMap.has(defaultWorkingStateId)
            ? exportStatusMap.get(defaultWorkingStateId)
            : null);

        if (!isSync && expMestId) {
          // Log missing sync for debugging
          this.logger.debug('IntegrationController#getInpatientExpMests.missingSync', {
            expMestId,
            expMestCode: item.expMestCode,
            inMap: inventoryExistingMap.has(expMestId),
          });
        }

        return {
          ...item,
          is_sync: isSync,
          workingStateId: workingStateId,
          working_state: working_state, // Nested object
        };
      });

      // Wait for all updates to complete (non-blocking, don't fail if update fails)
      if (updatePromises.length > 0) {
        Promise.all(updatePromises).then(() => {
          this.logger.info('IntegrationController#getInpatientExpMests.expMestSttIdUpdatesCompleted', {
            updatedCount: updatePromises.length,
          });
        }).catch((error: any) => {
          this.logger.error('IntegrationController#getInpatientExpMests.expMestSttIdUpdatesError', {
            error: error?.message,
          });
        });
      }

      const count = this.integrationService['convertToNumber']?.(hisResult.count) ?? hisResult.count ?? dataWithSync.length;
      const total = this.integrationService['convertToNumber']?.(hisResult.total) ?? hisResult.total ?? count;
      const hasMore = total !== undefined && total !== null
        ? startVal + dataWithSync.length < total
        : dataWithSync.length === limitVal;

      return {
        success: true,
        data: dataWithSync,
        start: startVal,
        limit: limitVal,
        count,
        total,
        hasMore,
      };
    } catch (error: any) {
      this.logger.error('IntegrationController#getInpatientExpMests.error', {
        error: error.message,
        stack: error.stack,
      });
      return {
        success: false,
        message: error.message || 'Failed to get inpatient exp mests',
      };
    }
  }

  @Get('exp-mests/inpatient/:expMestId')
  @Resource('integration.exp-mests.read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get inpatient export medicine record by ID from HIS (GetView), with is_sync flag' })
  @ApiParam({ name: 'expMestId', description: 'ExpMest ID from HIS', type: Number })
  @ApiQuery({ name: 'includeDeleted', required: false, description: 'IS_INCLUDE_DELETED', type: Boolean })
  @ApiQuery({ name: 'dataDomainFilter', required: false, description: 'DATA_DOMAIN_FILTER', type: Boolean })
  async getInpatientExpMestById(
    @Param('expMestId') expMestId: string,
    @Query('includeDeleted') includeDeleted?: string,
    @Query('dataDomainFilter') dataDomainFilter?: string,
    @Req() req?: AuthenticatedRequest,
  ): Promise<any> {
    const expMestIdNumber = Number(expMestId);
    if (isNaN(expMestIdNumber)) {
      return {
        success: false,
        message: 'Invalid expMestId: must be a valid number',
      };
    }

    const request: any = {
      expMestId: expMestIdNumber,
      userId: req?.user?.id,
    };

    if (includeDeleted !== undefined) {
      request.includeDeleted = includeDeleted === 'true';
    }
    if (dataDomainFilter !== undefined) {
      request.dataDomainFilter = dataDomainFilter === 'true';
    }

    try {
      const hisResult = await this.integrationService.getInpatientExpMestById(request).catch(err => {
        this.logger.warn('IntegrationController#getInpatientExpMestById.hisError', { error: err.message });
        return { success: false, data: null };
      });

      if (!hisResult.success) {
        return {
          success: false,
          message: hisResult.message || 'Failed to get inpatient exp mest by ID from HIS',
        };
      }

      if (!hisResult.data) {
        return {
          success: true,
          data: null,
          is_sync: false,
        };
      }

      // Check if record exists in EXP_INPATIENT_EXP_MEST table (not EXP_EXP_MEST)
      const expMestId = Number(hisResult.data.id);
      let isSync = false;
      if (!isNaN(expMestId)) {
        const existing = await this.inventoryService.findInpatientExpMestByHisId(expMestId).catch(err => {
          this.logger.warn('IntegrationController#getInpatientExpMestById.inpatientExpMestError', { error: err.message });
          return null;
        });
        isSync = !!existing;
      }

      return {
        success: true,
        data: {
          ...hisResult.data,
          is_sync: isSync,
        },
      };
    } catch (error: any) {
      this.logger.error('IntegrationController#getInpatientExpMestById.error', {
        error: error.message,
        stack: error.stack,
      });
      return {
        success: false,
        message: error.message || 'Failed to get inpatient exp mest by ID',
      };
    }
  }

  @Get('exp-mests/inpatient/:aggrExpMestId/details')
  @Resource('integration.exp-mests.list')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get inpatient export medicine details (chi tiết các phiếu con) by AGGR_EXP_MEST_ID from HIS (GetView), with is_sync flag' })
  @ApiParam({ name: 'aggrExpMestId', description: 'Aggregated ExpMest ID from HIS', type: Number })
  @ApiQuery({ name: 'includeDeleted', required: false, description: 'IS_INCLUDE_DELETED', type: Boolean })
  @ApiQuery({ name: 'dataDomainFilter', required: false, description: 'DATA_DOMAIN_FILTER', type: Boolean })
  async getInpatientExpMestDetails(
    @Param('aggrExpMestId') aggrExpMestId: string,
    @Query('includeDeleted') includeDeleted?: string,
    @Query('dataDomainFilter') dataDomainFilter?: string,
    @Req() req?: AuthenticatedRequest,
  ): Promise<any> {
    const aggrExpMestIdNumber = Number(aggrExpMestId);
    if (isNaN(aggrExpMestIdNumber)) {
      return {
        success: false,
        message: 'Invalid aggrExpMestId: must be a valid number',
      };
    }

    const request: any = {
      aggrExpMestId: aggrExpMestIdNumber,
      userId: req?.user?.id,
    };

    if (includeDeleted !== undefined) {
      request.includeDeleted = includeDeleted === 'true';
    }
    if (dataDomainFilter !== undefined) {
      request.dataDomainFilter = dataDomainFilter === 'true';
    }

    try {
      const hisResult = await this.integrationService.getInpatientExpMestDetails(request).catch(err => {
        this.logger.warn('IntegrationController#getInpatientExpMestDetails.hisError', { error: err.message });
        return { success: false, data: [] };
      });

      if (!hisResult.success) {
        return {
          success: false,
          message: hisResult.message || 'Failed to get inpatient exp mest details from HIS',
        };
      }

      if (!hisResult.data || hisResult.data.length === 0) {
        return {
          success: true,
          data: [],
        };
      }

      // Check which records exist in EXP_INPATIENT_EXP_MEST table (not EXP_EXP_MEST)
      const expMestIds = hisResult.data.map((item: any) => Number(item.id)).filter((id: number) => !isNaN(id));
      let inventoryExistingMap = new Map<number, boolean>();
      if (expMestIds.length > 0) {
        // Query from InpatientExpMest table using hisExpMestId
        const grpcQuery: any = {
          where: JSON.stringify({
            hisExpMestId: { $in: expMestIds },
          }),
          offset: 0,
          limit: expMestIds.length,
        };
        const existing = await this.inventoryService.findAllInpatientExpMests(grpcQuery).catch(err => {
          this.logger.warn('IntegrationController#getInpatientExpMestDetails.inpatientExpMestsError', { error: err.message });
          return [];
        });
        existing.forEach((item: any) => {
          const id = Number(item.hisExpMestId);
          if (!isNaN(id)) {
            inventoryExistingMap.set(id, true);
          }
        });
      }

      const dataWithSync = hisResult.data.map((item: any) => {
        const expMestId = Number(item.id);
        const isSync = !isNaN(expMestId) && inventoryExistingMap.has(expMestId);
        return { ...item, is_sync: isSync };
      });

      return {
        success: true,
        data: dataWithSync,
      };
    } catch (error: any) {
      this.logger.error('IntegrationController#getInpatientExpMestDetails.error', {
        error: error.message,
        stack: error.stack,
      });
      return {
        success: false,
        message: error.message || 'Failed to get inpatient exp mest details',
      };
    }
  }

  @Get('exp-mests/inpatient/:aggrExpMestId/details/medicines')
  @Resource('integration.exp-mests.list')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get medicines for all child exp mests by AGGR_EXP_MEST_ID',
    description: 'Lấy danh sách các phiếu con từ details, sau đó lấy chi tiết thuốc của tất cả các phiếu con'
  })
  @ApiParam({ name: 'aggrExpMestId', description: 'Aggregated ExpMest ID from HIS', type: Number })
  @ApiQuery({ name: 'includeDeleted', required: false, description: 'IS_INCLUDE_DELETED', type: Boolean })
  @ApiQuery({ name: 'dataDomainFilter', required: false, description: 'DATA_DOMAIN_FILTER', type: Boolean })
  async getInpatientExpMestMedicines(
    @Param('aggrExpMestId') aggrExpMestId: string,
    @Query('includeDeleted') includeDeleted?: string,
    @Query('dataDomainFilter') dataDomainFilter?: string,
    @Req() req?: AuthenticatedRequest,
  ): Promise<any> {
    const aggrExpMestIdNumber = Number(aggrExpMestId);
    if (isNaN(aggrExpMestIdNumber)) {
      return {
        success: false,
        message: 'Invalid aggrExpMestId: must be a valid number',
      };
    }

    const userId = req?.user?.id;

    try {
      // Step 1: Get list of child exp mests
      const detailsResult = await this.integrationService.getInpatientExpMestDetails({
        aggrExpMestId: aggrExpMestIdNumber,
        includeDeleted: includeDeleted === 'true',
        dataDomainFilter: dataDomainFilter === 'true',
        userId,
      });

      if (!detailsResult.success || !detailsResult.data || detailsResult.data.length === 0) {
        return {
          success: true,
          data: [],
          message: 'No child exp mests found',
        };
      }

      // Step 2: Extract EXP_MEST_IDs from child exp mests
      const expMestIds = detailsResult.data
        .map((item: any) => Number(item.id))
        .filter((id: number) => !isNaN(id));

      if (expMestIds.length === 0) {
        return {
          success: true,
          data: [],
          message: 'No valid exp mest IDs found',
        };
      }

      // Step 3: Get medicines for all exp mests
      const medicinesResult = await this.integrationService.getExpMestMedicinesByIds({
        expMestIds,
        includeDeleted: includeDeleted === 'true',
        dataDomainFilter: dataDomainFilter === 'true',
        userId,
      });

      if (!medicinesResult.success) {
        return {
          success: false,
          message: medicinesResult.message || 'Failed to get medicines',
        };
      }

      return {
        success: true,
        data: medicinesResult.data || [],
        meta: {
          aggrExpMestId: aggrExpMestIdNumber,
          expMestCount: expMestIds.length,
          medicineCount: medicinesResult.data?.length || 0,
        },
      };
    } catch (error: any) {
      this.logger.error('IntegrationController#getInpatientExpMestMedicines.error', {
        error: error.message,
        stack: error.stack,
      });
      return {
        success: false,
        message: error.message || 'Failed to get inpatient exp mest medicines',
      };
    }
  }



  @Post('work-info')
  @Resource('integration.work-info.create')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Register working rooms to HIS (UpdateWorkInfo)' })
  @ApiBody({
    description: 'Payload to register working rooms. You can use either roomIds or rooms.',
    schema: {
      type: 'object',
      properties: {
        roomIds: {
          type: 'array',
          items: { type: 'number' },
          example: [123, 345, 3435],
        },
        rooms: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              roomId: { type: 'number', example: 123 },
              deskId: { type: 'number', nullable: true, example: null },
            },
          },
        },
        workingShiftId: { type: 'number', nullable: true, example: null },
        nurseLoginName: { type: 'string', nullable: true, example: null },
        nurseUserName: { type: 'string', nullable: true, example: null },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Work info updated',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: { type: 'array', items: { type: 'object' } },
      },
    },
  })
  async updateWorkInfo(
    @Body() body: {
      roomIds?: number[];
      rooms?: { roomId: number; deskId?: number | null }[];
      workingShiftId?: number | null;
      nurseLoginName?: string | null;
      nurseUserName?: string | null;
    },
    @Req() request: AuthenticatedRequest,
  ): Promise<{
    success: boolean;
    message?: string;
    data?: any;
  }> {
    const userId = request?.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User not found');
    }

    this.logger.info('IntegrationController#updateWorkInfo.call', {
      roomIdsLength: body?.roomIds?.length || 0,
      roomsLength: body?.rooms?.length || 0,
      userId,
    });

    const result = await this.integrationService.updateWorkInfo({ ...body, userId });
    this.logger.info('IntegrationController#updateWorkInfo.result', { success: result.success });
    return result;
  }

  @Get('exp-mests/by-code')
  @Resource('integration.exp-mests.read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get exp mest by exact expMestCode (HIS), with is_sync flag' })
  @ApiQuery({ name: 'expMestCode', required: true, description: 'Exact EXP_MEST_CODE', type: String })
  @ApiQuery({ name: 'workingRoomId', required: false, description: 'WORKING_ROOM_ID for data domain filter', type: Number })
  @ApiQuery({ name: 'start', required: false, description: 'Pagination start index (default: 0)', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Pagination limit (default: 100)', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Exp mest list retrieved by code',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: { type: 'array', items: { type: 'object' } },
        start: { type: 'number' },
        limit: { type: 'number' },
        count: { type: 'number' },
        total: { type: 'number' },
        hasMore: { type: 'boolean' },
      },
    },
  })
  async getExpMestsByCode(
    @Query('expMestCode') expMestCode?: string,
    @Query('workingRoomId') workingRoomId?: string,
    @Query('start') start?: string,
    @Query('limit') limit?: string,
  ): Promise<{
    success: boolean;
    message?: string;
    data?: any[];
    start?: number;
    limit?: number;
    count?: number;
    total?: number;
    hasMore?: boolean;
  }> {
    if (!expMestCode) {
      return { success: false, message: 'expMestCode is required' };
    }

    const reqStart = Number(start);
    const reqLimit = Number(limit);
    const request: any = {
      expMestCodeExact: expMestCode,
      workingRoomId: workingRoomId ? Number(workingRoomId) : undefined,
      dataDomainFilter: workingRoomId ? true : undefined,
      start: isNaN(reqStart) ? 0 : reqStart,
      limit: isNaN(reqLimit) ? 100 : reqLimit,
    };

    this.logger.info('IntegrationController#getExpMestsByCode.call', request);

    const hisResult = await this.integrationService.getExpMests(request).catch(err => {
      this.logger.warn('IntegrationController#getExpMestsByCode.hisError', { error: err.message });
      return { success: false, data: [], count: 0, total: 0, message: err.message };
    });

    if (!hisResult.success) {
      return {
        success: false,
        message: hisResult.message || 'Failed to get exp mests from HIS',
      };
    }

    const hisData = hisResult.data || [];

    // Check Inventory to set is_sync
    const hisIds = hisData.map((item: any) => Number(item.id)).filter((id: number) => !isNaN(id));
    let inventoryExistingMap = new Map<number, boolean>();
    if (hisIds.length > 0) {
      const existing = await this.getInventoryExpMestsByIds(hisIds).catch(err => {
        this.logger.warn('IntegrationController#getExpMestsByCode.inventoryByIdsError', { error: err.message });
        return [];
      });
      inventoryExistingMap = new Map(
        existing
          .map((item: any) => Number(item.expMestId))
          .filter((id: number) => !isNaN(id))
          .map((id: number) => [id, true]),
      );
    }

    const dataWithSync = hisData.map((item: any) => {
      const expMestId = Number(item.id);
      const isSync = !isNaN(expMestId) && inventoryExistingMap.has(expMestId);
      return { ...item, is_sync: isSync };
    });

    const count = dataWithSync.length;
    const total = hisResult.total ?? hisResult.count ?? count;
    const hasMore = count === request.limit;

    this.logger.info('IntegrationController#getExpMestsByCode.result', {
      success: true,
      dataCount: count,
      start: request.start,
      limit: request.limit,
      total,
      hasMore,
    });

    return {
      success: true,
      data: dataWithSync,
      start: request.start,
      limit: request.limit,
      count,
      total,
      hasMore,
    };
  }

  @Get('exp-mests/other/:expMestId/medicines')
  @Resource('integration.exp-mests.list')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get exp mest medicines (chi tiết thuốc trong phiếu xuất) from HIS for "other" exp mests',
    description: 'Gọi HisExpMestMedicine/GetView1 với EXP_MEST_ID để lấy danh sách thuốc của phiếu xuất "other". Gọi trực tiếp theo ID phiếu, không cần qua aggrExpMestId.'
  })
  @ApiParam({ name: 'expMestId', description: 'ExpMest ID from HIS system', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Exp mest medicines retrieved',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: { type: 'array', items: { type: 'object' } },
      },
    },
  })
  async getExpMestOtherMedicines(
    @Param('expMestId') expMestIdParam: string,
    @Req() req?: AuthenticatedRequest,
  ): Promise<{
    success: boolean;
    message?: string;
    data?: any[];
  }> {
    const expMestId = Number(expMestIdParam);
    if (isNaN(expMestId)) {
      throw new Error('Invalid ExpMest ID');
    }

    this.logger.info('IntegrationController#getExpMestOtherMedicines.call', { expMestId });
    const result = await this.integrationService.getExpMestMedicines(expMestId, req?.user?.id);
    this.logger.info('IntegrationController#getExpMestOtherMedicines.result', {
      success: result.success,
      dataCount: result.data?.length || 0,
    });
    return result;
  }

  @Get('exp-mests/:expMestId/medicines')
  @Resource('integration.exp-mests.list')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get exp mest medicines (chi tiết thuốc trong phiếu xuất) from HIS' })
  @ApiParam({ name: 'expMestId', description: 'ExpMest ID from HIS system', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Exp mest medicines retrieved',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        data: { type: 'array', items: { type: 'object' } },
      },
    },
  })
  async getExpMestMedicines(
    @Param('expMestId') expMestIdParam: string,
    @Req() req?: AuthenticatedRequest,
  ): Promise<{
    success: boolean;
    message?: string;
    data?: any[];
  }> {
    const expMestId = Number(expMestIdParam);
    if (isNaN(expMestId)) {
      throw new Error('Invalid ExpMest ID');
    }

    this.logger.info('IntegrationController#getExpMestMedicines.call', { expMestId });
    const result = await this.integrationService.getExpMestMedicines(expMestId, req?.user?.id);
    this.logger.info('IntegrationController#getExpMestMedicines.result', {
      success: result.success,
      dataCount: result.data?.length || 0,
    });
    return result;
  }

  @Post('exp-mests/:expMestId/sync')
  @Resource('integration.exp-mests.sync')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Sync exp mest data from HIS to Inventory (upsert). If expMest not found in HIS, use data from request body.' })
  @ApiParam({ name: 'expMestId', description: 'ExpMest ID from HIS system', type: Number })
  @ApiBody({
    type: SyncExpMestBodyDto,
    description: 'Optional: ExpMest data from backend. If provided, will be used instead of fetching from HIS API.',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Exp mest synced successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        expMest: { type: 'object' },
        medicinesCount: { type: 'number' },
      },
    },
  })
  async syncExpMestFromHis(
    @Param('expMestId') expMestIdParam: string,
    @Body() body?: SyncExpMestBodyDto,
    @Req() request?: AuthenticatedRequest,
  ): Promise<{
    success: boolean;
    message?: string;
    expMest?: any;
    medicinesCount?: number;
  }> {
    const expMestId = Number(expMestIdParam);
    if (isNaN(expMestId)) {
      return {
        success: false,
        message: 'Invalid ExpMest ID',
      };
    }

    const userId = request?.user?.id || null;

    this.logger.info('IntegrationController#syncExpMestFromHis.call', {
      expMestId,
      userId,
      hasBodyData: !!body?.expMest,
    });
    console.log('=== IntegrationController#syncExpMestFromHis START ===');
    console.log('ExpMestId:', expMestId);
    console.log('UserId:', userId);
    console.log('Has Body Data:', !!body?.expMest);
    console.log('Body Data:', JSON.stringify(body, null, 2));

    try {
      // 1. Kiểm tra xem đã có trong Inventory chưa
      // Catch error nếu không tìm thấy (inventory-svc throw error khi not found)
      let existingExpMest: any = null;
      console.log('=== Step 1: Check existing ExpMest in Inventory ===');
      try {
        existingExpMest = await this.inventoryService.findByExpMestId(expMestId);
        console.log('Existing ExpMest found:', !!existingExpMest);
        console.log('Existing ExpMest ID:', existingExpMest?.id);
        console.log('Existing ExpMest Data:', JSON.stringify(existingExpMest, null, 2));
      } catch (error: any) {
        // Nếu không tìm thấy, existingExpMest sẽ là null (đây là expected behavior)
        if (error.message && error.message.includes('not found')) {
          this.logger.info('IntegrationController#syncExpMestFromHis.expMestNotFoundInInventory', { expMestId });
          console.log('ExpMest not found in Inventory (expected if new)');
          existingExpMest = null;
        } else {
          // Nếu là error khác (Internal server error, etc.), log warning và tiếp tục với body data
          // Không throw error để có thể tiếp tục sync với body data
          this.logger.warn('IntegrationController#syncExpMestFromHis.findByExpMestId.error', {
            expMestId,
            error: error.message,
            note: 'Continuing with body data if available'
          });
          console.warn('Error finding ExpMest (will continue with body data if available):', error.message);
          console.warn('Error code:', error.code);
          console.warn('Error details:', error.details);
          existingExpMest = null; // Set to null để tiếp tục với body data
        }
      }

      // 2. Lấy medicines từ HIS (luôn cần để sync)
      console.log('=== Step 2: Get medicines from HIS ===');
      const hisMedicinesResult = await this.integrationService.getExpMestMedicines(expMestId, userId).catch(err => {
        this.logger.warn('IntegrationController#syncExpMestFromHis.getExpMestMedicines.error', { error: err.message });
        console.error('Error getting medicines from HIS:', err.message);
        console.error('Error stack:', err.stack);
        return { success: false, data: [] };
      });

      const hisMedicines = hisMedicinesResult.data || [];
      console.log('HIS Medicines Result Success:', hisMedicinesResult.success);
      console.log('HIS Medicines Count:', hisMedicines.length);
      console.log('HIS Medicines Data:', JSON.stringify(hisMedicines.slice(0, 2), null, 2)); // Log first 2 only

      // 3. Xử lý ExpMest: Ưu tiên từ HIS, nếu không có thì dùng từ body, nếu không có cả 2 thì dùng existing
      console.log('=== Step 3: Determine ExpMest data source ===');
      let expMestData: any = null;
      let expMestSource = 'none';

      if (existingExpMest) {
        // Đã có trong Inventory, sẽ update
        expMestData = existingExpMest;
        expMestSource = 'inventory';
      }

      // Thử lấy từ HIS (chỉ nếu chưa có trong Inventory hoặc muốn update)
      // Note: Bỏ qua việc gọi getExpMests() vì có thể timeout và không cần thiết
      // Nếu có body.expMest thì dùng luôn, không cần gọi HIS

      if (body?.expMest) {
        // Có data từ backend, dùng luôn
        this.logger.info('IntegrationController#syncExpMestFromHis.usingBodyData', { expMestId });
        console.log('Using body data for ExpMest');
        expMestData = body.expMest;
        expMestSource = 'body';
        console.log('ExpMest Data from body:', JSON.stringify(expMestData, null, 2));
      } else if (!existingExpMest) {
        // Không có trong Inventory và không có body data; HIS không có API lấy chi tiết theo ID
        this.logger.warn('IntegrationController#syncExpMestFromHis.noExpMestData', {
          expMestId,
          message: 'ExpMest not found in Inventory and no body data provided. HIS does not support detail by ID.',
          hint: 'Use /api/integration/exp-mests/by-code to get expMestId and provide body, or use sync-by-code endpoint.',
        });
        console.log('Returning error: ExpMest not found and no data provided (HIS has no detail-by-ID API)');
        return {
          success: false,
          message: `ExpMest with ID ${expMestId} not found in Inventory. HIS does not expose detail-by-ID; please provide expMest data in body or use sync-by-code.`,
        };
      } else {
        console.log('Using existing ExpMest from Inventory');
        expMestSource = 'inventory';
      }

      console.log('ExpMest Source:', expMestSource);
      console.log('Has ExpMest Data:', !!expMestData);

      // 4. Upsert ExpMest (nếu có data)
      console.log('=== Step 4: Upsert ExpMest ===');
      let savedExpMest: any = existingExpMest;

      if (expMestData && expMestSource !== 'inventory') {
        // Có data mới từ body hoặc HIS, cần upsert
        console.log('Mapping ExpMest data to DTO...');
        const expMestDto = this.mapExpMestDataToCreateDto(expMestData, expMestId, userId);
        console.log('ExpMest DTO:', JSON.stringify(expMestDto, null, 2));

        if (existingExpMest) {
          // UPDATE
          this.logger.info('IntegrationController#syncExpMestFromHis.updateExpMest', {
            id: existingExpMest.id,
            expMestId,
            source: expMestSource,
          });
          console.log('Updating existing ExpMest, ID:', existingExpMest.id);
          const updateDto = this.mapExpMestDataToUpdateDto(expMestData, userId);
          console.log('Update DTO:', JSON.stringify(updateDto, null, 2));
          savedExpMest = await this.inventoryService.update(existingExpMest.id, updateDto);
          console.log('ExpMest updated successfully, ID:', savedExpMest?.id);
        } else {
          // CREATE
          this.logger.info('IntegrationController#syncExpMestFromHis.createExpMest', {
            expMestId,
            source: expMestSource,
          });
          console.log('Creating new ExpMest...');
          console.log('Create DTO:', JSON.stringify(expMestDto, null, 2));
          savedExpMest = await this.inventoryService.create(expMestDto);
          console.log('ExpMest created successfully, ID:', savedExpMest?.id);
          console.log('Created ExpMest:', JSON.stringify(savedExpMest, null, 2));
        }
      } else if (existingExpMest) {
        // Chỉ có existing, không cần update
        console.log('Using existing ExpMest, no update needed');
        savedExpMest = existingExpMest;
      } else {
        // Không có ExpMest data và không có existing
        console.log('Error: No ExpMest data and no existing ExpMest');
        return {
          success: false,
          message: `Cannot sync: ExpMest ${expMestId} not found and no data provided`,
        };
      }

      // 5. Upsert ExpMestMedicine
      console.log('=== Step 5: Upsert ExpMestMedicine ===');
      let savedMedicinesCount = 0;
      console.log('Getting existing medicines from Inventory...');
      const existingMedicines = await this.expMestMedicineService.findByExpMestId(expMestId);
      console.log('Existing medicines count:', existingMedicines?.length || 0);
      const existingMedicinesMap = new Map<number, any>();
      existingMedicines.forEach((med: any) => {
        if (med.hisId) {
          existingMedicinesMap.set(Number(med.hisId), med);
        }
      });
      console.log('Existing medicines map size:', existingMedicinesMap.size);

      console.log('Processing', hisMedicines.length, 'medicines from HIS...');
      for (let i = 0; i < hisMedicines.length; i++) {
        const hisMedicine = hisMedicines[i];
        console.log(`Processing medicine ${i + 1}/${hisMedicines.length}`);
        const hisId = Number(hisMedicine.id);
        if (isNaN(hisId)) {
          this.logger.warn('IntegrationController#syncExpMestFromHis.invalidMedicineId', { hisMedicine });
          console.warn('Invalid medicine ID:', hisMedicine.id);
          continue;
        }

        console.log('Medicine HIS ID:', hisId);
        const medicineDto = this.mapHisMedicineToCreateDto(hisMedicine, expMestId, savedExpMest.id, userId);
        const existingMedicine = existingMedicinesMap.get(hisId);

        if (existingMedicine) {
          // UPDATE
          console.log('Updating existing medicine, ID:', existingMedicine.id);
          const updateDto = this.mapHisMedicineToUpdateDto(hisMedicine, userId);
          await this.expMestMedicineService.update(existingMedicine.id, updateDto);
          savedMedicinesCount++;
          console.log('Medicine updated successfully');
        } else {
          // CREATE
          console.log('Creating new medicine...');
          console.log('Medicine DTO:', JSON.stringify(medicineDto, null, 2));
          await this.expMestMedicineService.create(medicineDto);
          savedMedicinesCount++;
          console.log('Medicine created successfully');
        }
      }
      console.log('Total medicines saved:', savedMedicinesCount);

      this.logger.info('IntegrationController#syncExpMestFromHis.success', {
        expMestId,
        savedMedicinesCount,
        totalMedicinesFromHis: hisMedicines.length,
        expMestSource,
      });

      console.log('=== IntegrationController#syncExpMestFromHis SUCCESS ===');
      console.log('ExpMestId:', expMestId);
      console.log('Saved Medicines Count:', savedMedicinesCount);
      console.log('Total Medicines from HIS:', hisMedicines.length);
      console.log('ExpMest Source:', expMestSource);
      console.log('Saved ExpMest ID:', savedExpMest?.id);

      return {
        success: true,
        message: `Synced exp mest ${expMestId} with ${savedMedicinesCount} medicines`,
        expMest: savedExpMest,
        medicinesCount: savedMedicinesCount,
      };
    } catch (error: any) {
      this.logger.error('IntegrationController#syncExpMestFromHis.error', {
        expMestId,
        error: error.message,
        stack: error.stack?.substring(0, 500),
      });
      console.error('=== IntegrationController#syncExpMestFromHis ERROR ===');
      console.error('ExpMestId:', expMestId);
      console.error('Error Message:', error.message);
      console.error('Error Stack:', error.stack);
      console.error('Error Details:', JSON.stringify(error, null, 2));
      return {
        success: false,
        message: error.message || 'Failed to sync exp mest from HIS',
      };
    }
  }

  /**
   * Sync ExpMest by code (expMestCode) without requiring body.
   * Steps:
   * 1) Lookup HIS by expMestCode (exact) and workingRoomId to get expMestId + data.
   * 2) Call syncExpMestFromHis with expMestId and HIS data as body (unless body overrides).
   */
  @Post('exp-mests/sync-by-code')
  @Resource('integration.exp-mests.sync')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Sync ExpMest from HIS to Inventory by expMestCode' })
  @ApiQuery({ name: 'expMestCode', type: String, required: true })
  @ApiQuery({ name: 'workingRoomId', type: Number, required: true })
  @ApiBody({ type: SyncExpMestBodyDto, required: false })
  async syncExpMestByCode(
    @Query('expMestCode') expMestCode: string,
    @Query('workingRoomId') workingRoomIdParam: string,
    @Body() body?: SyncExpMestBodyDto,
    @Req() request?: AuthenticatedRequest,
  ): Promise<{
    success: boolean;
    message?: string;
    expMest?: any;
    medicinesCount?: number;
  }> {
    const workingRoomId = Number(workingRoomIdParam);
    if (!expMestCode || !expMestCode.trim()) {
      return { success: false, message: 'expMestCode is required' };
    }
    if (isNaN(workingRoomId)) {
      return { success: false, message: 'workingRoomId is invalid' };
    }

    this.logger.info('IntegrationController#syncExpMestByCode.call', {
      expMestCode,
      workingRoomId,
      hasBody: !!body?.expMest,
    });

    // 1) Lookup HIS by code
    const hisResult = await this.integrationService.getExpMests({
      expMestCodeExact: expMestCode,
      workingRoomId,
      start: 0,
      limit: 1,
    });

    if (!hisResult?.success || !hisResult?.data || hisResult.data.length === 0) {
      return {
        success: false,
        message: `ExpMest with code ${expMestCode} not found in HIS`,
      };
    }

    const hisExpMest = hisResult.data[0];
    const expMestId = Number(hisExpMest?.id);
    if (isNaN(expMestId)) {
      return {
        success: false,
        message: 'Invalid expMestId returned from HIS',
      };
    }

    // Merge: body.expMest (if provided) overrides HIS fields, but enforce ID/code from HIS to avoid wrong record
    let mergedExpMest = hisExpMest;
    if (body?.expMest) {
      const bodyData = body.expMest;
      // If body contains mismatched code or id, reject to prevent wrong mapping
      if (
        (bodyData.expMestId && Number(bodyData.expMestId) !== expMestId) ||
        (bodyData.expMestCode && String(bodyData.expMestCode) !== String(expMestCode))
      ) {
        return {
          success: false,
          message: 'expMestId/expMestCode in body does not match HIS result',
        };
      }
      mergedExpMest = {
        ...hisExpMest,
        ...bodyData,
        // enforce primary identifiers from HIS
        id: expMestId,
        expMestCode: hisExpMest.expMestCode,
      };
    }

    // Reuse existing sync logic by ID, passing merged body
    return this.syncExpMestFromHis(String(expMestId), { expMest: mergedExpMest }, request);
  }

  /**
   * Get a single ExpMest from HIS by ID
   * Note: HIS API doesn't support direct ID filter, so we fetch with pagination and search
   */
  private async getExpMestFromHisById(expMestId: number): Promise<any | null> {
    // Try to get from HIS with pagination
    // Since HIS doesn't have direct ID filter, we'll fetch in batches
    let start = 0;
    const limit = 100;
    let found = null;
    let attempts = 0;
    const maxAttempts = 10; // Limit to 1000 records max

    while (!found && attempts < maxAttempts) {
      const result = await this.integrationService.getExpMests({
        start,
        limit,
      });

      if (!result.success || !result.data || result.data.length === 0) {
        break;
      }

      found = result.data.find((item: any) => Number(item.id) === expMestId);

      if (found) {
        this.logger.info('IntegrationController#getExpMestFromHisById.found', {
          expMestId,
          start,
          attempts: attempts + 1,
        });
        return found;
      }

      // If we got less than limit, we've reached the end
      if (result.data.length < limit) {
        break;
      }

      start += limit;
      attempts++;
    }

    this.logger.warn('IntegrationController#getExpMestFromHisById.notFound', {
      expMestId,
      attempts,
      maxRecordsSearched: start,
    });
    return null;
  }

  /**
   * Get ExpMests from Inventory service with filters
   */
  private async getInventoryExpMests(request: {
    expMestSttIds?: number[];
    expMestTypeIds?: number[];
    impOrExpMediStockId?: number;
    createTimeFrom?: number;
    createTimeTo?: number;
    start?: number;
    limit?: number;
  }): Promise<any[]> {
    const whereConditions: any = {};

    if (request.expMestSttIds && request.expMestSttIds.length > 0) {
      if (request.expMestSttIds.length === 1) {
        whereConditions.expMestSttId = request.expMestSttIds[0];
      } else {
        whereConditions.expMestSttId = { $in: request.expMestSttIds };
      }
    }

    if (request.expMestTypeIds && request.expMestTypeIds.length > 0) {
      if (request.expMestTypeIds.length === 1) {
        whereConditions.expMestTypeId = request.expMestTypeIds[0];
      } else {
        whereConditions.expMestTypeId = { $in: request.expMestTypeIds };
      }
    }

    if (request.impOrExpMediStockId) {
      whereConditions.mediStockId = request.impOrExpMediStockId;
    }

    if (request.createTimeFrom || request.createTimeTo) {
      if (request.createTimeFrom && request.createTimeTo) {
        whereConditions.createDate = { $between: [request.createTimeFrom, request.createTimeTo] };
      } else if (request.createTimeFrom) {
        whereConditions.createDate = { $gte: request.createTimeFrom };
      } else if (request.createTimeTo) {
        whereConditions.createDate = { $lte: request.createTimeTo };
      }
    }

    const grpcQuery: any = {
      offset: request.start ?? 0,
      limit: request.limit ?? 100,
    };

    if (Object.keys(whereConditions).length > 0) {
      grpcQuery.where = JSON.stringify(whereConditions);
    }

    return await this.inventoryService.findAll(grpcQuery);
  }

  /**
   * Get total count of ExpMests from Inventory service with filters
   */
  private async getInventoryExpMestsCount(request: {
    expMestSttIds?: number[];
    expMestTypeIds?: number[];
    impOrExpMediStockId?: number;
    createTimeFrom?: number;
    createTimeTo?: number;
  }): Promise<number> {
    const whereConditions: any = {};

    if (request.expMestSttIds && request.expMestSttIds.length > 0) {
      if (request.expMestSttIds.length === 1) {
        whereConditions.expMestSttId = request.expMestSttIds[0];
      } else {
        whereConditions.expMestSttId = { $in: request.expMestSttIds };
      }
    }

    if (request.expMestTypeIds && request.expMestTypeIds.length > 0) {
      if (request.expMestTypeIds.length === 1) {
        whereConditions.expMestTypeId = request.expMestTypeIds[0];
      } else {
        whereConditions.expMestTypeId = { $in: request.expMestTypeIds };
      }
    }

    if (request.impOrExpMediStockId) {
      whereConditions.mediStockId = request.impOrExpMediStockId;
    }

    if (request.createTimeFrom || request.createTimeTo) {
      if (request.createTimeFrom && request.createTimeTo) {
        whereConditions.createDate = { $between: [request.createTimeFrom, request.createTimeTo] };
      } else if (request.createTimeFrom) {
        whereConditions.createDate = { $gte: request.createTimeFrom };
      } else if (request.createTimeTo) {
        whereConditions.createDate = { $lte: request.createTimeTo };
      }
    }

    const grpcQuery: any = {};

    if (Object.keys(whereConditions).length > 0) {
      grpcQuery.where = JSON.stringify(whereConditions);
    }

    return await this.inventoryService.count(grpcQuery);
  }

  /**
   * Merge HIS ExpMest format to Inventory ExpMest format
   */
  private mergeHisToInventoryFormat(hisItem: any): any {
    return {
      id: null,
      createdAt: null,
      updatedAt: null,
      deletedAt: null,
      version: null,
      createdBy: null,
      updatedBy: null,
      isActive: null,
      expMestId: hisItem.id || null,
      expMestCode: hisItem.expMestCode || null,
      expMestTypeId: hisItem.expMestTypeId || null,
      expMestSttId: hisItem.expMestSttId || null,
      mediStockId: hisItem.mediStockId || null,
      reqLoginname: hisItem.reqLoginname || null,
      reqUsername: hisItem.reqUsername || null,
      reqRoomId: hisItem.reqRoomId || null,
      reqDepartmentId: hisItem.reqDepartmentId || null,
      createDate: hisItem.createDate || null,
      serviceReqId: hisItem.serviceReqId || null,
      tdlTotalPrice: hisItem.tdlTotalPrice || null,
      tdlServiceReqCode: hisItem.tdlServiceReqCode || null,
      tdlIntructionTime: hisItem.tdlIntructionTime || null,
      tdlIntructionDate: hisItem.tdlIntructionDate || null,
      tdlTreatmentId: hisItem.tdlTreatmentId || null,
      tdlTreatmentCode: hisItem.tdlTreatmentCode || null,
      tdlPatientId: hisItem.tdlPatientId || null,
      tdlPatientCode: hisItem.tdlPatientCode || null,
      tdlPatientName: hisItem.tdlPatientName || null,
      tdlPatientFirstName: hisItem.tdlPatientFirstName || null,
      tdlPatientLastName: hisItem.tdlPatientLastName || null,
      tdlPatientDob: hisItem.tdlPatientDob || null,
      tdlPatientIsHasNotDayDob: hisItem.tdlPatientIsHasNotDayDob || null,
      tdlPatientAddress: hisItem.tdlPatientAddress || null,
      tdlPatientGenderId: hisItem.tdlPatientGenderId || null,
      tdlPatientGenderName: hisItem.tdlPatientGenderName || null,
      tdlPatientTypeId: hisItem.tdlPatientTypeId || null,
      tdlHeinCardNumber: hisItem.tdlHeinCardNumber || null,
      tdlPatientPhone: hisItem.tdlPatientPhone || null,
      tdlPatientProvinceCode: hisItem.tdlPatientProvinceCode || null,
      tdlPatientCommuneCode: hisItem.tdlPatientCommuneCode || null,
      tdlPatientNationalName: hisItem.tdlPatientNationalName || null,
      tdlPatientDistrictCode: hisItem.tdlPatientDistrictCode || null,
      virCreateMonth: hisItem.virCreateMonth || null,
      virCreateYear: hisItem.virCreateYear || null,
      virHeinCardPrefix: hisItem.virHeinCardPrefix || null,
      priority: hisItem.priority || null,
      icdCode: hisItem.icdCode || null,
      icdName: hisItem.icdName || null,
      icdSubCode: hisItem.icdSubCode || null,
      icdText: hisItem.icdText || null,
      reqUserTitle: hisItem.reqUserTitle || null,
      expMestSubCode2: hisItem.expMestSubCode2 || null,
      expMestTypeCode: hisItem.expMestTypeCode || null,
      expMestTypeName: hisItem.expMestTypeName || null,
      expMestSttCode: hisItem.expMestSttCode || null,
      expMestSttName: hisItem.expMestSttName || null,
      mediStockCode: hisItem.mediStockCode || null,
      mediStockName: hisItem.mediStockName || null,
      reqDepartmentCode: hisItem.reqDepartmentCode || null,
      reqDepartmentName: hisItem.reqDepartmentName || null,
      reqRoomCode: hisItem.reqRoomCode || null,
      reqRoomName: hisItem.reqRoomName || null,
      treatmentIsActive: hisItem.treatmentIsActive || null,
      patientTypeName: hisItem.patientTypeName || null,
      patientTypeCode: hisItem.patientTypeCode || null,
      exportStatusId: null,
      exportStatus: null,
      createTime: hisItem.createTime || null,
      modifyTime: hisItem.modifyTime || null,
    };
  }

  /**
   * Map ExpMest data (from body or HIS) to CreateExpMestDto
   * Supports both camelCase (from body) and UPPERCASE (from HIS) formats
   */
  private mapExpMestDataToCreateDto(data: any, expMestId: number, createdBy: string | null): any {
    // Normalize field names (handle both camelCase and UPPERCASE)
    const getField = (camelKey: string, upperKey: string) => {
      return data[camelKey] ?? data[upperKey] ?? null;
    };

    return {
      expMestId: expMestId, // Always use from param
      expMestCode: getField('expMestCode', 'EXP_MEST_CODE'),
      expMestTypeId: getField('expMestTypeId', 'EXP_MEST_TYPE_ID'),
      expMestSttId: getField('expMestSttId', 'EXP_MEST_STT_ID'),
      mediStockId: getField('mediStockId', 'MEDI_STOCK_ID'),
      reqLoginname: getField('reqLoginname', 'REQ_LOGINNAME'),
      reqUsername: getField('reqUsername', 'REQ_USERNAME'),
      reqRoomId: getField('reqRoomId', 'REQ_ROOM_ID'),
      reqDepartmentId: getField('reqDepartmentId', 'REQ_DEPARTMENT_ID'),
      createDate: getField('createDate', 'CREATE_DATE'),
      serviceReqId: getField('serviceReqId', 'SERVICE_REQ_ID'),
      tdlTotalPrice: getField('tdlTotalPrice', 'TDL_TOTAL_PRICE'),
      tdlServiceReqCode: getField('tdlServiceReqCode', 'TDL_SERVICE_REQ_CODE'),
      tdlIntructionTime: getField('tdlIntructionTime', 'TDL_INTRUCTION_TIME'),
      tdlIntructionDate: getField('tdlIntructionDate', 'TDL_INTRUCTION_DATE'),
      tdlTreatmentId: getField('tdlTreatmentId', 'TDL_TREATMENT_ID'),
      tdlTreatmentCode: getField('tdlTreatmentCode', 'TDL_TREATMENT_CODE'),
      tdlPatientId: getField('tdlPatientId', 'TDL_PATIENT_ID'),
      tdlPatientCode: getField('tdlPatientCode', 'TDL_PATIENT_CODE'),
      tdlPatientName: getField('tdlPatientName', 'TDL_PATIENT_NAME'),
      tdlPatientFirstName: getField('tdlPatientFirstName', 'TDL_PATIENT_FIRST_NAME'),
      tdlPatientLastName: getField('tdlPatientLastName', 'TDL_PATIENT_LAST_NAME'),
      tdlPatientDob: getField('tdlPatientDob', 'TDL_PATIENT_DOB'),
      tdlPatientIsHasNotDayDob: getField('tdlPatientIsHasNotDayDob', 'TDL_PATIENT_IS_HAS_NOT_DAY_DOB'),
      tdlPatientAddress: getField('tdlPatientAddress', 'TDL_PATIENT_ADDRESS'),
      tdlPatientGenderId: getField('tdlPatientGenderId', 'TDL_PATIENT_GENDER_ID'),
      tdlPatientGenderName: getField('tdlPatientGenderName', 'TDL_PATIENT_GENDER_NAME'),
      tdlPatientTypeId: getField('tdlPatientTypeId', 'TDL_PATIENT_TYPE_ID'),
      tdlHeinCardNumber: getField('tdlHeinCardNumber', 'TDL_HEIN_CARD_NUMBER'),
      tdlPatientPhone: getField('tdlPatientPhone', 'TDL_PATIENT_PHONE'),
      tdlPatientProvinceCode: getField('tdlPatientProvinceCode', 'TDL_PATIENT_PROVINCE_CODE'),
      tdlPatientCommuneCode: getField('tdlPatientCommuneCode', 'TDL_PATIENT_COMMUNE_CODE'),
      tdlPatientNationalName: getField('tdlPatientNationalName', 'TDL_PATIENT_NATIONAL_NAME'),
      tdlAggrPatientCode: getField('tdlAggrPatientCode', 'TDL_AGGR_PATIENT_CODE'),
      tdlAggrTreatmentCode: getField('tdlAggrTreatmentCode', 'TDL_AGGR_TREATMENT_CODE'),
      virCreateMonth: getField('virCreateMonth', 'VIR_CREATE_MONTH'),
      virCreateYear: getField('virCreateYear', 'VIR_CREATE_YEAR'),
      icdCode: getField('icdCode', 'ICD_CODE'),
      icdName: getField('icdName', 'ICD_NAME'),
      icdSubCode: getField('icdSubCode', 'ICD_SUB_CODE'),
      icdText: getField('icdText', 'ICD_TEXT'),
      reqUserTitle: getField('reqUserTitle', 'REQ_USER_TITLE'),
      expMestSubCode: getField('expMestSubCode', 'EXP_MEST_SUB_CODE'),
      expMestSubCode2: getField('expMestSubCode2', 'EXP_MEST_SUB_CODE2'),
      virHeinCardPrefix: getField('virHeinCardPrefix', 'VIR_HEIN_CARD_PREFIX'),
      priority: getField('priority', 'PRIORITY'),
      numOrder: getField('numOrder', 'NUM_ORDER'),
      expMestTypeCode: getField('expMestTypeCode', 'EXP_MEST_TYPE_CODE'),
      expMestTypeName: getField('expMestTypeName', 'EXP_MEST_TYPE_NAME'),
      expMestSttCode: getField('expMestSttCode', 'EXP_MEST_STT_CODE'),
      expMestSttName: getField('expMestSttName', 'EXP_MEST_STT_NAME'),
      mediStockCode: getField('mediStockCode', 'MEDI_STOCK_CODE'),
      mediStockName: getField('mediStockName', 'MEDI_STOCK_NAME'),
      reqDepartmentCode: getField('reqDepartmentCode', 'REQ_DEPARTMENT_CODE'),
      reqDepartmentName: getField('reqDepartmentName', 'REQ_DEPARTMENT_NAME'),
      reqRoomCode: getField('reqRoomCode', 'REQ_ROOM_CODE'),
      reqRoomName: getField('reqRoomName', 'REQ_ROOM_NAME'),
      lastExpLoginname: getField('lastExpLoginname', 'LAST_EXP_LOGINNAME'),
      lastExpUsername: getField('lastExpUsername', 'LAST_EXP_USERNAME'),
      lastExpTime: getField('lastExpTime', 'LAST_EXP_TIME'),
      finishTime: getField('finishTime', 'FINISH_TIME'),
      finishDate: getField('finishDate', 'FINISH_DATE'),
      isExportEqualApprove: getField('isExportEqualApprove', 'IS_EXPORT_EQUAL_APPROVE'),
      lastApprovalLoginname: getField('lastApprovalLoginname', 'LAST_APPROVAL_LOGINNAME'),
      lastApprovalUsername: getField('lastApprovalUsername', 'LAST_APPROVAL_USERNAME'),
      lastApprovalTime: getField('lastApprovalTime', 'LAST_APPROVAL_TIME'),
      lastApprovalDate: getField('lastApprovalDate', 'LAST_APPROVAL_DATE'),
      treatmentIsActive: getField('treatmentIsActive', 'TREATMENT_IS_ACTIVE'),
      patientTypeName: getField('patientTypeName', 'PATIENT_TYPE_NAME'),
      patientTypeCode: getField('patientTypeCode', 'PATIENT_TYPE_CODE'),
      tdlIntructionDateMin: getField('tdlIntructionDateMin', 'TDL_INTRUCTION_DATE_MIN'),
      tdlPatientDistrictCode: getField('tdlPatientDistrictCode', 'TDL_PATIENT_DISTRICT_CODE'),
      // Only set exportStatusId if it has a value (not null/undefined)
      // If null/undefined, don't set it to let database use default value
      ...(getField('exportStatusId', 'EXPORT_STATUS_ID') ? { exportStatusId: getField('exportStatusId', 'EXPORT_STATUS_ID') } : {}),
      createdBy,
    };
  }

  /**
   * Map ExpMest data (from body or HIS) to UpdateExpMestDto
   */
  private mapExpMestDataToUpdateDto(data: any, updatedBy: string | null): any {
    // Same as CreateDto but without expMestId (immutable) and createdBy
    const dto = this.mapExpMestDataToCreateDto(data, 0, null);
    delete dto.expMestId;
    delete dto.createdBy;
    dto.updatedBy = updatedBy;
    return dto;
  }

  /**
   * Map HIS ExpMest to CreateExpMestDto (legacy method, kept for backward compatibility)
   */
  private mapHisExpMestToCreateDto(hisItem: any, createdBy: string | null): any {
    return {
      expMestId: hisItem.id || null,
      expMestCode: hisItem.expMestCode || null,
      expMestTypeId: hisItem.expMestTypeId || null,
      expMestSttId: hisItem.expMestSttId || null,
      mediStockId: hisItem.mediStockId || null,
      reqLoginname: hisItem.reqLoginname || null,
      reqUsername: hisItem.reqUsername || null,
      reqRoomId: hisItem.reqRoomId || null,
      reqDepartmentId: hisItem.reqDepartmentId || null,
      createDate: hisItem.createDate || null,
      serviceReqId: hisItem.serviceReqId || null,
      tdlTotalPrice: hisItem.tdlTotalPrice || null,
      tdlServiceReqCode: hisItem.tdlServiceReqCode || null,
      tdlIntructionTime: hisItem.tdlIntructionTime || null,
      tdlIntructionDate: hisItem.tdlIntructionDate || null,
      tdlTreatmentId: hisItem.tdlTreatmentId || null,
      tdlTreatmentCode: hisItem.tdlTreatmentCode || null,
      tdlPatientId: hisItem.tdlPatientId || null,
      tdlPatientCode: hisItem.tdlPatientCode || null,
      tdlPatientName: hisItem.tdlPatientName || null,
      tdlPatientFirstName: hisItem.tdlPatientFirstName || null,
      tdlPatientLastName: hisItem.tdlPatientLastName || null,
      tdlPatientDob: hisItem.tdlPatientDob || null,
      tdlPatientIsHasNotDayDob: hisItem.tdlPatientIsHasNotDayDob || null,
      tdlPatientAddress: hisItem.tdlPatientAddress || null,
      tdlPatientGenderId: hisItem.tdlPatientGenderId || null,
      tdlPatientGenderName: hisItem.tdlPatientGenderName || null,
      tdlPatientTypeId: hisItem.tdlPatientTypeId || null,
      tdlHeinCardNumber: hisItem.tdlHeinCardNumber || null,
      tdlPatientPhone: hisItem.tdlPatientPhone || null,
      tdlPatientProvinceCode: hisItem.tdlPatientProvinceCode || null,
      tdlPatientCommuneCode: hisItem.tdlPatientCommuneCode || null,
      tdlPatientNationalName: hisItem.tdlPatientNationalName || null,
      tdlAggrPatientCode: hisItem.tdlAggrPatientCode || null,
      tdlAggrTreatmentCode: hisItem.tdlAggrTreatmentCode || null,
      virCreateMonth: hisItem.virCreateMonth || null,
      virCreateYear: hisItem.virCreateYear || null,
      icdCode: hisItem.icdCode || null,
      icdName: hisItem.icdName || null,
      icdSubCode: hisItem.icdSubCode || null,
      icdText: hisItem.icdText || null,
      reqUserTitle: hisItem.reqUserTitle || null,
      expMestSubCode: hisItem.expMestSubCode || null,
      expMestSubCode2: hisItem.expMestSubCode2 || null,
      virHeinCardPrefix: hisItem.virHeinCardPrefix || null,
      priority: hisItem.priority || null,
      numOrder: hisItem.numOrder || null,
      expMestTypeCode: hisItem.expMestTypeCode || null,
      expMestTypeName: hisItem.expMestTypeName || null,
      expMestSttCode: hisItem.expMestSttCode || null,
      expMestSttName: hisItem.expMestSttName || null,
      mediStockCode: hisItem.mediStockCode || null,
      mediStockName: hisItem.mediStockName || null,
      reqDepartmentCode: hisItem.reqDepartmentCode || null,
      reqDepartmentName: hisItem.reqDepartmentName || null,
      reqRoomCode: hisItem.reqRoomCode || null,
      reqRoomName: hisItem.reqRoomName || null,
      lastExpLoginname: hisItem.lastExpLoginname || null,
      lastExpUsername: hisItem.lastExpUsername || null,
      lastExpTime: hisItem.lastExpTime || null,
      finishTime: hisItem.finishTime || null,
      finishDate: hisItem.finishDate || null,
      isExportEqualApprove: hisItem.isExportEqualApprove || null,
      lastApprovalLoginname: hisItem.lastApprovalLoginname || null,
      lastApprovalUsername: hisItem.lastApprovalUsername || null,
      lastApprovalTime: hisItem.lastApprovalTime || null,
      lastApprovalDate: hisItem.lastApprovalDate || null,
      treatmentIsActive: hisItem.treatmentIsActive || null,
      patientTypeName: hisItem.patientTypeName || null,
      patientTypeCode: hisItem.patientTypeCode || null,
      tdlIntructionDateMin: hisItem.tdlIntructionDateMin || null,
      tdlPatientDistrictCode: hisItem.tdlPatientDistrictCode || null,
      createdBy,
    };
  }

  /**
   * Map HIS ExpMest to UpdateExpMestDto
   */
  private mapHisExpMestToUpdateDto(hisItem: any, updatedBy: string | null): any {
    // Same as CreateDto but without expMestId (immutable) and createdBy
    const dto = this.mapHisExpMestToCreateDto(hisItem, null);
    delete dto.expMestId;
    delete dto.createdBy;
    dto.updatedBy = updatedBy;
    return dto;
  }

  /**
   * Map HIS ExpMestMedicine to CreateExpMestMedicineDto
   */
  private mapHisMedicineToCreateDto(hisMedicine: any, expMestId: number, expMestLocalId: string | null, createdBy: string | null): any {
    return {
      hisId: hisMedicine.id || null,
      expMestId: expMestId,
      expMestLocalId: expMestLocalId,
      medicineId: hisMedicine.medicineId || null,
      tdlMediStockId: hisMedicine.tdlMediStockId || null,
      tdlMedicineTypeId: hisMedicine.tdlMedicineTypeId || null,
      expMestMetyReqId: hisMedicine.expMestMetyReqId || null,
      ckImpMestMedicineId: hisMedicine.ckImpMestMedicineId || null,
      isExport: hisMedicine.isExport || null,
      amount: hisMedicine.amount || null,
      approvalLoginname: hisMedicine.approvalLoginname || null,
      approvalUsername: hisMedicine.approvalUsername || null,
      approvalTime: hisMedicine.approvalTime || null,
      approvalDate: hisMedicine.approvalDate || null,
      expLoginname: hisMedicine.expLoginname || null,
      expUsername: hisMedicine.expUsername || null,
      expTime: hisMedicine.expTime || null,
      expDate: hisMedicine.expDate || null,
      expMestCode: hisMedicine.expMestCode || null,
      mediStockId: hisMedicine.mediStockId || null,
      expMestSttId: hisMedicine.expMestSttId || null,
      impPrice: hisMedicine.impPrice || null,
      impVatRatio: hisMedicine.impVatRatio || null,
      bidId: hisMedicine.bidId || null,
      packageNumber: hisMedicine.packageNumber || null,
      expiredDate: hisMedicine.expiredDate || null,
      medicineTypeId: hisMedicine.medicineTypeId || null,
      impTime: hisMedicine.impTime || null,
      supplierId: hisMedicine.supplierId || null,
      medicineBytNumOrder: hisMedicine.medicineBytNumOrder || null,
      medicineRegisterNumber: hisMedicine.medicineRegisterNumber || null,
      activeIngrBhytCode: hisMedicine.activeIngrBhytCode || null,
      activeIngrBhytName: hisMedicine.activeIngrBhytName || null,
      concentra: hisMedicine.concentra || null,
      tdlBidGroupCode: hisMedicine.tdlBidGroupCode || null,
      tdlBidPackageCode: hisMedicine.tdlBidPackageCode || null,
      medicineTypeCode: hisMedicine.medicineTypeCode || null,
      medicineTypeName: hisMedicine.medicineTypeName || null,
      serviceId: hisMedicine.serviceId || null,
      nationalName: hisMedicine.nationalName || null,
      manufacturerId: hisMedicine.manufacturerId || null,
      bytNumOrder: hisMedicine.bytNumOrder || null,
      registerNumber: hisMedicine.registerNumber || null,
      medicineGroupId: hisMedicine.medicineGroupId || null,
      serviceUnitId: hisMedicine.serviceUnitId || null,
      serviceUnitCode: hisMedicine.serviceUnitCode || null,
      serviceUnitName: hisMedicine.serviceUnitName || null,
      medicineNumOrder: hisMedicine.medicineNumOrder || null,
      supplierCode: hisMedicine.supplierCode || null,
      supplierName: hisMedicine.supplierName || null,
      bidNumber: hisMedicine.bidNumber || null,
      bidName: hisMedicine.bidName || null,
      medicineUseFormCode: hisMedicine.medicineUseFormCode || null,
      medicineUseFormName: hisMedicine.medicineUseFormName || null,
      medicineUseFormNumOrder: hisMedicine.medicineUseFormNumOrder || null,
      sumInStock: hisMedicine.sumInStock || null,
      sumByMedicineInStock: hisMedicine.sumByMedicineInStock || null,
      materialNumOrder: hisMedicine.materialNumOrder || null,
      createdBy,
    };
  }

  /**
   * Map HIS ExpMestMedicine to UpdateExpMestMedicineDto
   */
  private mapHisMedicineToUpdateDto(hisMedicine: any, updatedBy: string | null): any {
    // Same as CreateDto but without hisId, expMestId, expMestLocalId (immutable) and createdBy
    const dto: any = {
      medicineId: hisMedicine.medicineId || null,
      tdlMediStockId: hisMedicine.tdlMediStockId || null,
      tdlMedicineTypeId: hisMedicine.tdlMedicineTypeId || null,
      expMestMetyReqId: hisMedicine.expMestMetyReqId || null,
      ckImpMestMedicineId: hisMedicine.ckImpMestMedicineId || null,
      isExport: hisMedicine.isExport || null,
      amount: hisMedicine.amount || null,
      approvalLoginname: hisMedicine.approvalLoginname || null,
      approvalUsername: hisMedicine.approvalUsername || null,
      approvalTime: hisMedicine.approvalTime || null,
      approvalDate: hisMedicine.approvalDate || null,
      expLoginname: hisMedicine.expLoginname || null,
      expUsername: hisMedicine.expUsername || null,
      expTime: hisMedicine.expTime || null,
      expDate: hisMedicine.expDate || null,
      expMestCode: hisMedicine.expMestCode || null,
      mediStockId: hisMedicine.mediStockId || null,
      expMestSttId: hisMedicine.expMestSttId || null,
      impPrice: hisMedicine.impPrice || null,
      impVatRatio: hisMedicine.impVatRatio || null,
      bidId: hisMedicine.bidId || null,
      packageNumber: hisMedicine.packageNumber || null,
      expiredDate: hisMedicine.expiredDate || null,
      medicineTypeId: hisMedicine.medicineTypeId || null,
      impTime: hisMedicine.impTime || null,
      supplierId: hisMedicine.supplierId || null,
      medicineBytNumOrder: hisMedicine.medicineBytNumOrder || null,
      medicineRegisterNumber: hisMedicine.medicineRegisterNumber || null,
      activeIngrBhytCode: hisMedicine.activeIngrBhytCode || null,
      activeIngrBhytName: hisMedicine.activeIngrBhytName || null,
      concentra: hisMedicine.concentra || null,
      tdlBidGroupCode: hisMedicine.tdlBidGroupCode || null,
      tdlBidPackageCode: hisMedicine.tdlBidPackageCode || null,
      medicineTypeCode: hisMedicine.medicineTypeCode || null,
      medicineTypeName: hisMedicine.medicineTypeName || null,
      serviceId: hisMedicine.serviceId || null,
      nationalName: hisMedicine.nationalName || null,
      manufacturerId: hisMedicine.manufacturerId || null,
      bytNumOrder: hisMedicine.bytNumOrder || null,
      registerNumber: hisMedicine.registerNumber || null,
      medicineGroupId: hisMedicine.medicineGroupId || null,
      serviceUnitId: hisMedicine.serviceUnitId || null,
      serviceUnitCode: hisMedicine.serviceUnitCode || null,
      serviceUnitName: hisMedicine.serviceUnitName || null,
      medicineNumOrder: hisMedicine.medicineNumOrder || null,
      supplierCode: hisMedicine.supplierCode || null,
      supplierName: hisMedicine.supplierName || null,
      bidNumber: hisMedicine.bidNumber || null,
      bidName: hisMedicine.bidName || null,
      medicineUseFormCode: hisMedicine.medicineUseFormCode || null,
      medicineUseFormName: hisMedicine.medicineUseFormName || null,
      medicineUseFormNumOrder: hisMedicine.medicineUseFormNumOrder || null,
      sumInStock: hisMedicine.sumInStock || null,
      sumByMedicineInStock: hisMedicine.sumByMedicineInStock || null,
      materialNumOrder: hisMedicine.materialNumOrder || null,
      updatedBy,
    };
    return dto;
  }
  @Post('inpatient-exp-mest/sync')
  @Resource('integration.exp-mests.sync')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Sync inpatient exp mest from HIS' })
  @ApiBody({ type: SyncExpMestRequestDto })
  @ApiResponse({ status: 200, description: 'Synced successfully' })
  async syncInpatientExpMest(
    @Body() body: SyncExpMestRequestDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<any> {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException('User not found');
    this.logger.info('IntegrationController#syncInpatientExpMest.call', { body, userId });
    return this.integrationService.syncInpatientExpMest(body.expMestId, userId);
  }

  @Post('exp-mest-other/sync')
  @Resource('integration.exp-mests.sync')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Sync other exp mest from HIS' })
  @ApiBody({ type: SyncExpMestRequestDto })
  @ApiResponse({ status: 200, description: 'Synced successfully' })
  async syncExpMestOther(
    @Body() body: SyncExpMestRequestDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<any> {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException('User not found');
    this.logger.info('IntegrationController#syncExpMestOther.call', { body, userId });
    return this.integrationService.syncExpMestOther(body.expMestId, userId);
  }

  @Get('inpatient-exp-mest/:expMestId/summary')
  @Resource('integration.exp-mests.read')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get inpatient exp mest summary from HIS' })
  @ApiResponse({ status: 200, description: 'Summary retrieved' })
  async getInpatientExpMestSummaryFromHis(
    @Param('expMestId') expMestId: number,
    @Req() req: AuthenticatedRequest,
  ): Promise<any> {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException('User not found');
    this.logger.info('IntegrationController#getInpatientExpMestSummaryFromHis.call', { expMestId, userId });
    return this.integrationService.getInpatientExpMestSummaryFromHis(Number(expMestId), userId);
  }

  @Post('exp-mest-stt/auto-update')
  @Resource('integration.exp-mests.update')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Auto update exp mest status IDs' })
  @ApiBody({ type: AutoUpdateExpMestSttIdDto })
  @ApiResponse({ status: 200, description: 'Updated successfully' })
  async autoUpdateExpMestSttId(
    @Body() body: AutoUpdateExpMestSttIdDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<any> {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException('User not found');
    this.logger.info('IntegrationController#autoUpdateExpMestSttId.call', { body, userId });
    return this.integrationService.autoUpdateExpMestSttId(body.expMestIds, body.expMestType, userId);
  }
}

