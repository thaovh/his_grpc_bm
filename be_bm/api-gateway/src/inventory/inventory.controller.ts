import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Req,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';

import { Resource } from '../common/decorators/resource.decorator';
import { InventoryService } from './inventory.service';
import { IntegrationService } from '../auth/integration.service';
import { UsersService } from '../users/users.service';
import { MasterDataService } from '../master-data/master-data.service';
import { CreateExpMestDto } from './dto/create-exp-mest.dto';
import { UpdateExpMestDto } from './dto/update-exp-mest.dto';
import { ExpMestResponseDto } from './dto/exp-mest-response.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../common/dto/pagination-response.dto';
import { BatchUpdateActualExportFieldsDto } from './dto/batch-update-actual-export-fields.dto';
import { BatchUpdateExportFieldsDto } from './dto/batch-update-export-fields.dto';

// Extend Express Request to include user property set by JwtAuthGuard
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    @Inject(forwardRef(() => IntegrationService))
    private readonly integrationService: IntegrationService,
    private readonly usersService: UsersService,
    private readonly masterDataService: MasterDataService,
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
    private readonly eventEmitter: EventEmitter2, // Inject EventEmitter2
  ) {
    this.logger.setContext(InventoryController.name);
  }

  @Get('exp-mests')
  @Resource('inventory.exp-mests')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all export medicine records' })
  @ApiResponse({ status: 200, description: 'List of export medicine records', type: [ExpMestResponseDto] })
  async findAll(@Query() query: PaginationQueryDto): Promise<PaginatedResponseDto<ExpMestResponseDto>> {
    this.logger.info('InventoryController#findAll.call', query);

    const grpcQuery: any = {
      offset: ((query.page || 1) - 1) * (query.limit || 25),
      limit: query.limit || 25,
    };

    if (query.q) {
      grpcQuery.where = JSON.stringify({
        $or: [
          { expMestCode: { $like: `%${query.q}%` } },
          { tdlPatientName: { $like: `%${query.q}%` } },
          { tdlTreatmentCode: { $like: `%${query.q}%` } },
        ],
      });
    }

    const expMests = await this.inventoryService.findAll(grpcQuery);
    const totalItems = await this.inventoryService.count(grpcQuery);
    const page = query.page || 1;
    const limit = query.limit || 25;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: expMests,
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
        hasPrevious: page > 1,
        hasNext: page < totalPages,
      },
    };
  }

  @Get('exp-mests/:id')
  @Resource('inventory.exp-mests')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get export medicine record by ID' })
  @ApiParam({ name: 'id', description: 'ExpMest ID' })
  @ApiResponse({ status: 200, description: 'Export medicine record', type: ExpMestResponseDto })
  @ApiResponse({ status: 404, description: 'ExpMest not found' })
  async findById(@Param('id') id: string): Promise<ExpMestResponseDto> {
    this.logger.info('InventoryController#findById.call', { id });
    return this.inventoryService.findById(id);
  }

  @Get('exp-mests/by-exp-mest-id/:expMestId')
  @Resource('inventory.exp-mests')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get export medicine record by ExpMest ID (from HIS)' })
  @ApiParam({ name: 'expMestId', description: 'ExpMest ID from HIS system' })
  @ApiResponse({ status: 200, description: 'Export medicine record', type: ExpMestResponseDto })
  @ApiResponse({ status: 404, description: 'ExpMest not found' })
  async findByExpMestId(@Param('expMestId') expMestId: string): Promise<ExpMestResponseDto> {
    this.logger.info('InventoryController#findByExpMestId.call', { expMestId });
    const id = parseInt(expMestId, 10);
    if (isNaN(id)) {
      throw new Error('Invalid ExpMest ID');
    }
    return this.inventoryService.findByExpMestId(id);
  }

  @Post('exp-mests')
  @Resource('inventory.exp-mests')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create export medicine record' })
  @ApiResponse({ status: 201, description: 'Export medicine record created', type: ExpMestResponseDto })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDto: CreateExpMestDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<ExpMestResponseDto> {
    this.logger.info('InventoryController#create.call', { expMestId: createDto.expMestId, userId: request.user?.id, user: request.user });
    // Pass userId from JWT token to service
    const userId = request.user?.id;
    if (!userId) {
      this.logger.warn('InventoryController#create: userId is missing from request.user');
    }
    return this.inventoryService.create({ ...createDto, createdBy: userId || null });
  }

  @Put('exp-mests/:id')
  @Resource('inventory.exp-mests')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update export medicine record by ID' })
  @ApiParam({ name: 'id', description: 'ExpMest ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Export medicine record updated', type: ExpMestResponseDto })
  @ApiResponse({ status: 404, description: 'ExpMest not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateExpMestDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<ExpMestResponseDto> {
    this.logger.info('InventoryController#update.call', { id, userId: request.user?.id, user: request.user });
    // Pass userId from JWT token to service
    const userId = request.user?.id;
    if (!userId) {
      this.logger.warn('InventoryController#update: userId is missing from request.user');
    }
    return this.inventoryService.update(id, { ...updateDto, updatedBy: userId || null });
  }

  @Put('exp-mests/by-exp-mest-id/:expMestId')
  @Resource('inventory.exp-mests')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update export medicine record by ExpMest ID (from HIS)' })
  @ApiParam({ name: 'expMestId', description: 'ExpMest ID from HIS system' })
  @ApiResponse({ status: 200, description: 'Export medicine record updated', type: ExpMestResponseDto })
  @ApiResponse({ status: 404, description: 'ExpMest not found' })
  async updateByExpMestId(
    @Param('expMestId') expMestId: string,
    @Body() updateDto: UpdateExpMestDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<ExpMestResponseDto> {
    this.logger.info('InventoryController#updateByExpMestId.call', { expMestId, userId: request.user?.id });

    // Parse expMestId from string to number
    const expMestIdNum = parseInt(expMestId, 10);
    if (isNaN(expMestIdNum)) {
      throw new Error('Invalid ExpMest ID');
    }

    // Find the record by expMestId to get the UUID
    const expMest = await this.inventoryService.findByExpMestId(expMestIdNum);
    if (!expMest) {
      throw new Error('ExpMest not found');
    }

    // Pass userId from JWT token to service
    const userId = request.user?.id;
    if (!userId) {
      this.logger.warn('InventoryController#updateByExpMestId: userId is missing from request.user');
    }

    // Update using the UUID
    return this.inventoryService.update(expMest.id, { ...updateDto, updatedBy: userId || null });
  }

  @Delete('exp-mests/:id')
  @Resource('inventory.exp-mests')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete export medicine record' })
  @ApiParam({ name: 'id', description: 'ExpMest ID' })
  @ApiResponse({ status: 200, description: 'Export medicine record deleted' })
  @ApiResponse({ status: 404, description: 'ExpMest not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    this.logger.info('InventoryController#delete.call', { id });
    await this.inventoryService.delete(id);
  }

  // ========== Inpatient ExpMest APIs ==========

  @Get('inpatient-exp-mests')
  @Resource('inventory.inpatient-exp-mests')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all inpatient export medicine records' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 25)' })
  @ApiQuery({ name: 'workingStateId', required: false, type: String, description: 'Filter by working state ID' })
  @ApiQuery({ name: 'q', required: false, type: String, description: 'Search keyword' })
  @ApiQuery({ name: 'orderBy', required: false, type: String, description: 'Sort field (e.g., "-createDate" for DESC)' })
  @ApiResponse({ status: 200, description: 'List of inpatient export medicine records' })
  async findAllInpatientExpMests(
    @Query() query: PaginationQueryDto & { workingStateId?: string },
  ): Promise<PaginatedResponseDto<any>> {
    this.logger.info('InventoryController#findAllInpatientExpMests.call', query);

    const grpcQuery: any = {
      offset: ((query.page || 1) - 1) * (query.limit || 25),
      limit: query.limit || 25,
    };

    // Build where condition
    const whereConditions: any = {};
    if (query.workingStateId) {
      whereConditions.workingStateId = query.workingStateId;
    }
    if (query.q) {
      // For search, use $or with multiple fields
      whereConditions.$or = [
        { expMestCode: { $like: `%${query.q}%` } },
        { reqUsername: { $like: `%${query.q}%` } },
      ];
    }

    if (Object.keys(whereConditions).length > 0) {
      grpcQuery.where = JSON.stringify(whereConditions);
    }

    if (query.orderBy) {
      const orderParts = query.orderBy.split(',');
      const order: any = {};
      orderParts.forEach((part) => {
        const trimmed = part.trim();
        if (trimmed.startsWith('-')) {
          order[trimmed.substring(1)] = 'DESC';
        } else {
          order[trimmed] = 'ASC';
        }
      });
      grpcQuery.order = JSON.stringify(order);
    }

    const items = await this.inventoryService.findAllInpatientExpMests(grpcQuery);
    const totalItems = await this.inventoryService.countInpatientExpMests(grpcQuery);
    const page = query.page || 1;
    const limit = query.limit || 25;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: items,
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
        hasPrevious: page > 1,
        hasNext: page < totalPages,
      },
    };
  }

  @Get('inpatient-exp-mests/:id')
  @Resource('inventory.inpatient-exp-mests')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get inpatient export medicine record by ID (local UUID)' })
  @ApiParam({ name: 'id', description: 'Inpatient ExpMest ID (local UUID)' })
  @ApiResponse({ status: 200, description: 'Inpatient export medicine record found' })
  @ApiResponse({ status: 404, description: 'Inpatient ExpMest not found' })
  async findInpatientExpMestById(@Param('id') id: string): Promise<any> {
    this.logger.info('InventoryController#findInpatientExpMestById.call', { id });
    const item = await this.inventoryService.findInpatientExpMestById(id);
    if (!item) {
      throw new NotFoundException(`Inpatient ExpMest with ID ${id} not found`);
    }
    return item;
  }

  @Get('inpatient-exp-mests/by-his-id/:hisExpMestId')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get inpatient export medicine record by HIS ExpMest ID' })
  @ApiParam({ name: 'hisExpMestId', description: 'ExpMest ID from HIS system', type: Number })
  @ApiResponse({ status: 200, description: 'Inpatient export medicine record found' })
  @ApiResponse({ status: 404, description: 'Inpatient ExpMest not found' })
  async findInpatientExpMestByHisId(@Param('hisExpMestId') hisExpMestId: string): Promise<any> {
    this.logger.info('InventoryController#findInpatientExpMestByHisId.call', { hisExpMestId });
    const hisExpMestIdNumber = Number(hisExpMestId);
    if (isNaN(hisExpMestIdNumber)) {
      throw new NotFoundException('Invalid hisExpMestId: must be a valid number');
    }
    const item = await this.inventoryService.findInpatientExpMestByHisId(hisExpMestIdNumber);
    if (!item) {
      throw new NotFoundException(`Inpatient ExpMest with HIS ID ${hisExpMestId} not found`);
    }
    return item;
  }

  @Post('inpatient-exp-mests/:expMestId/sync')
  @Resource('inventory.inpatient-exp-mests')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Sync inpatient exp mest from Integration API to local inventory',
    description: 'Lấy dữ liệu từ GET /api/integration/exp-mests/inpatient/:expMestId và lưu vào local với working_state'
  })
  @ApiParam({ name: 'expMestId', description: 'ExpMest ID from HIS', type: Number })
  @ApiResponse({ status: 201, description: 'Inpatient exp mest synced successfully' })
  @ApiResponse({ status: 404, description: 'ExpMest not found in HIS' })
  async syncInpatientExpMest(
    @Param('expMestId') expMestId: string,
    @Body() body: { workingStateId?: string },
    @Req() req: AuthenticatedRequest,
  ): Promise<any> {
    // Get workingStateId from body or use default from env
    // Try to get from app config first, then fallback to direct env variable
    const defaultExportStatusId = this.configService.get<string>('app.defaultExportStatusId')
      || this.configService.get<string>('DEFAULT_EXPORT_STATUS_ID');
    const workingStateId = body?.workingStateId || defaultExportStatusId;

    this.logger.info('InventoryController#syncInpatientExpMest.call', { expMestId, workingStateId });
    console.log('=== [DEBUG] InventoryController#syncInpatientExpMest.start ===');
    console.log('expMestId:', expMestId);
    console.log('userId:', req.user?.id);

    try {
      const expMestIdNumber = Number(expMestId);
      if (isNaN(expMestIdNumber)) {
        throw new NotFoundException('Invalid expMestId: must be a valid number');
      }

      // 1. Lấy dữ liệu từ Integration API
      if (!this.integrationService) {
        throw new Error('IntegrationService is not available');
      }

      console.log('=== [DEBUG] step1: getInpatientExpMestById ===');
      const hisData = await this.integrationService.getInpatientExpMestById({
        expMestId: expMestIdNumber,
        userId: req.user?.id, // Added userId
      }).catch((error: any) => {
        console.error('getInpatientExpMestById error:', error);
        throw error;
      });

      if (!hisData.success || !hisData.data) {
        console.warn('ExpMest not found in HIS or error:', hisData.message);
        throw new NotFoundException(hisData.message || 'ExpMest not found in HIS');
      }
      console.log('hisData.data.id:', hisData.data.id);

      const parentData = hisData.data;
      const aggrExpMestId = parentData.id; // Use parent ID as aggrExpMestId

      // 2. Lấy danh sách phiếu con từ HIS (details)
      console.log('=== [DEBUG] step2: getInpatientExpMestDetails ===');
      let childrenData: any[] = [];
      try {
        const childrenResult = await this.integrationService.getInpatientExpMestDetails({
          aggrExpMestId: aggrExpMestId,
          userId: req.user?.id, // Added userId
        }).catch((error: any) => {
          console.error('getInpatientExpMestDetails error:', error);
          return { success: false, data: [] };
        });

        if (childrenResult.success && childrenResult.data && Array.isArray(childrenResult.data)) {
          childrenData = childrenResult.data;
        }
        console.log('childrenData count:', childrenData.length);
      } catch (error: any) {
        console.error('step2 error:', error);
      }

      // 3. Lấy danh sách medicines từ HIS (details/medicines)
      console.log('=== [DEBUG] step3: getExpMestMedicinesByIds ===');
      let medicinesData: any[] = [];
      try {
        /*
          Logic cũ: chỉ lấy expMestIds từ childrenData.
          TUY NHIÊN: Nếu là phiếu tổng hợp (aggr) thì mới có children.
          Nếu phiếu đơn lẻ (ko phải aggr) thì chính nó là phiếu để lấy thuốc?
          Cần check xem phiếu cha có thuốc ko.
          Nếu childrenData rỗng, thử lấy thuốc của chính expMestIdNumber.
        */
        let expMestIds: number[] = [];
        if (childrenData.length > 0) {
          expMestIds = childrenData.map((child: any) => Number(child.id)).filter((id: number) => !isNaN(id));
        }

        // Fallback: nếu không có children thì lấy chính nó
        if (expMestIds.length === 0) {
          expMestIds = [expMestIdNumber];
        }

        console.log('expMestIds for medicines:', expMestIds);

        const medicinesResult = await this.integrationService.getExpMestMedicinesByIds(
          expMestIds,
          false, // includeDeleted
          false, // dataDomainFilter
          req.user?.id // Pass userId here
        ).catch((error: any) => {
          console.error('getExpMestMedicinesByIds error:', error);
          return { success: false, data: [] };
        });

        console.log('medicinesResult success:', medicinesResult.success);
        console.log('medicinesResult message:', (medicinesResult as any).message);
        if (medicinesResult.success && medicinesResult.data && Array.isArray(medicinesResult.data)) {
          medicinesData = medicinesResult.data;
        }
        console.log('medicinesData count:', medicinesData.length);
      } catch (error: any) {
        console.error('step3 error:', error);
      }

      // 4. Sync tất cả vào local inventory (3 bảng) trong transaction
      const userId = req.user?.id || 'system';
      console.log('=== [DEBUG] step4: syncAllInpatientExpMest ===');
      console.log('userId for sync:', userId);
      console.log('workingStateId:', workingStateId);

      const result = await this.inventoryService.syncAllInpatientExpMest({
        parentData,
        childrenData: childrenData.length > 0 ? childrenData : undefined,
        medicinesData: medicinesData.length > 0 ? medicinesData : undefined,
        userId,
        workingStateId: workingStateId || null,
      });
      console.log('=== [DEBUG] step4: completed ===');

      // Emit event khi sync thành công với đầy đủ thông tin như API GET /api/integration/exp-mests/inpatient
      // Fetch lại dữ liệu từ HIS và enrich với is_sync, workingStateId, working_state
      try {
        console.log('=== [SSE DEBUG] InventoryController#syncInpatientExpMest.fetchingForEvent ===');
        const hisResult = await this.integrationService.getInpatientExpMestById({
          expMestId: expMestIdNumber,
          userId: req.user?.id, // Added userId
        }).catch((err) => {
          console.error('=== [SSE DEBUG] getInpatientExpMestById.error ===', err?.message);
          return null;
        });

        console.log('=== [SSE DEBUG] hisResult.success:', hisResult?.success);
        console.log('=== [SSE DEBUG] hisResult.hasData:', !!hisResult?.data);

        if (hisResult?.success && hisResult.data) {
          // Enrich với thông tin từ local DB
          const localRecord = await this.inventoryService.findInpatientExpMestByHisId(expMestIdNumber).catch(() => null);

          // Get working state info
          let workingStateId: string | null = null;
          let working_state: any = null;

          if (localRecord?.workingStateId) {
            workingStateId = localRecord.workingStateId;
            // Get working_state from masterDataService
            try {
              working_state = await this.masterDataService.findExportStatusById(workingStateId).catch(() => null);
            } catch (e) {
              // Ignore
            }
          } else {
            // Use default if not synced
            const defaultWorkingStateId = this.configService.get<string>('DEFAULT_NOT_SYNC_EXPORT_STATUS_ID') || null;
            if (defaultWorkingStateId) {
              workingStateId = defaultWorkingStateId;
              try {
                working_state = await this.masterDataService.findExportStatusById(defaultWorkingStateId).catch(() => null);
              } catch (e) {
                // Ignore
              }
            }
          }

          // Format data giống như API GET /api/integration/exp-mests/inpatient
          const enrichedData = {
            ...hisResult.data,
            is_sync: !!localRecord,
            workingStateId: workingStateId,
            working_state: working_state,
          };

          const syncEventPayload = {
            expMestId: expMestIdNumber,
            expMestCode: parentData.expMestCode || '',
            userId: userId,
            timestamp: Date.now(),
            data: enrichedData, // Thêm đầy đủ thông tin
          };

          console.log('=== [SSE DEBUG] InventoryController#syncInpatientExpMest.emittingSyncEvent ===');
          console.log('eventType: inpatient.exp-mest.synced');
          console.log('payload:', JSON.stringify({
            expMestId: syncEventPayload.expMestId,
            expMestCode: syncEventPayload.expMestCode,
            userId: syncEventPayload.userId,
            timestamp: syncEventPayload.timestamp,
            hasData: !!syncEventPayload.data,
          }, null, 2));

          this.eventEmitter.emit('inpatient.exp-mest.synced', syncEventPayload);

          console.log('=== [SSE DEBUG] InventoryController#syncInpatientExpMest.syncEventEmitted ===');
        } else {
          // Fallback nếu không fetch được từ HIS
          console.log('=== [SSE DEBUG] Using fallback - HIS fetch failed ===');
          const fallbackPayload = {
            expMestId: expMestIdNumber,
            expMestCode: parentData.expMestCode || '',
            userId: userId,
            timestamp: Date.now(),
          };

          console.log('=== [SSE DEBUG] InventoryController#syncInpatientExpMest.emittingSyncEvent.FALLBACK_NO_HIS ===');
          console.log('eventType: inpatient.exp-mest.synced');
          console.log('reason: Cannot fetch from HIS');
          console.log('payload:', JSON.stringify(fallbackPayload, null, 2));

          this.eventEmitter.emit('inpatient.exp-mest.synced', fallbackPayload);

          console.log('=== [SSE DEBUG] InventoryController#syncInpatientExpMest.syncEventEmitted.FALLBACK ===');
        }
      } catch (error: any) {
        // Fallback nếu có lỗi khi enrich
        console.error('=== [SSE DEBUG] Event emission error ===', error?.message);
        console.error('=== [SSE DEBUG] Error stack ===', error?.stack);
        this.logger.warn('InventoryController#syncInpatientExpMest.eventEnrichError', {
          error: error?.message,
        });

        const errorFallbackPayload = {
          expMestId: expMestIdNumber,
          expMestCode: parentData.expMestCode || '',
          userId: userId,
          timestamp: Date.now(),
        };

        console.log('=== [SSE DEBUG] InventoryController#syncInpatientExpMest.emittingSyncEvent.FALLBACK_ERROR ===');
        console.log('eventType: inpatient.exp-mest.synced');
        console.log('reason: Error during enrich');
        console.log('error:', error?.message);
        console.log('payload:', JSON.stringify(errorFallbackPayload, null, 2));

        this.eventEmitter.emit('inpatient.exp-mest.synced', errorFallbackPayload);

        console.log('=== [SSE DEBUG] InventoryController#syncInpatientExpMest.syncEventEmitted.FALLBACK_ERROR ===');
      }

      const response = {
        success: true,
        data: {
          parent: {
            ...result.parent,
            working_state: result.parent.working_state, // Join với export-statuses
          },
          children: result.children || [],
          medicines: result.medicines || [],
        },
      };
      return response;
    } catch (error: any) {
      console.error('=== [DEBUG] InventoryController#syncInpatientExpMest.error ===');
      console.error('Full Error Object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));

      this.logger.error('InventoryController#syncInpatientExpMest.error', {
        error: error?.message,
        stack: error?.stack,
        code: error?.code,
        status: error?.status,
        details: error?.details, // Log gRPC error details if available
      });

      // Re-throw specific HTTP exceptions directly
      if (error instanceof NotFoundException || error.status === 404) {
        throw new NotFoundException(error.message);
      }

      throw new Error(`Sync failed: ${error?.message || 'Unknown error'}`);
    }
  }

  @Post('exp-mests-other/:expMestId/sync')
  @Resource('inventory.exp-mests-other')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Sync other exp mest from Integration API to local inventory',
    description: 'Lấy dữ liệu từ GET /api/integration/exp-mests/other/:expMestId và lưu vào local với working_state'
  })
  @ApiParam({ name: 'expMestId', description: 'ExpMest ID from HIS', type: Number })
  @ApiResponse({ status: 201, description: 'Other exp mest synced successfully' })
  @ApiResponse({ status: 404, description: 'ExpMest not found in HIS' })
  async syncExpMestOther(
    @Param('expMestId') expMestId: string,
    @Body() body: { workingStateId?: string },
    @Req() req: AuthenticatedRequest,
  ): Promise<any> {
    // Get workingStateId from body or use default from env
    const defaultExportStatusId = this.configService.get<string>('app.defaultExportStatusId')
      || this.configService.get<string>('DEFAULT_EXPORT_STATUS_ID');
    const workingStateId = body?.workingStateId || defaultExportStatusId;

    this.logger.info('InventoryController#syncExpMestOther.call', { expMestId, workingStateId });

    try {
      const expMestIdNumber = Number(expMestId);
      if (isNaN(expMestIdNumber)) {
        throw new NotFoundException('Invalid expMestId: must be a valid number');
      }

      // 1. Lấy dữ liệu từ Integration API (getExpMests và filter theo ID)
      if (!this.integrationService) {
        throw new Error('IntegrationService is not available');
      }

      // Get OTHER_EXP_MEST_TYPE_ID from env
      const configValue =
        this.configService.get<string>('app.otherExpMestTypeId') ||
        this.configService.get<string>('OTHER_EXP_MEST_TYPE_ID') ||
        process.env.OTHER_EXP_MEST_TYPE_ID ||
        '';

      if (!configValue) {
        throw new BadRequestException('OTHER_EXP_MEST_TYPE_ID is not configured in .env file');
      }

      const configIds: number[] = configValue
        .split(',')
        .map(id => id.trim())
        .filter(id => id.length > 0)
        .map(id => Number(id))
        .filter(id => !isNaN(id));

      if (configIds.length === 0) {
        throw new BadRequestException('Invalid OTHER_EXP_MEST_TYPE_ID configuration');
      }

      // Use getExpMestById directly
      const userId = req.user?.id; // Allow undefined, same as Inpatient

      const hisResult = await this.integrationService.getExpMestById({
        expMestId: expMestIdNumber,
        includeDeleted: false,
        dataDomainFilter: false,
        userId,
      }).catch((error: any) => {
        console.error('Error calling getExpMestById:', error?.message);
        throw error;
      });

      if (!hisResult.success || !hisResult.data) {
        throw new NotFoundException(hisResult.message || `ExpMest with ID ${expMestIdNumber} not found in HIS`);
      }

      const parentData = hisResult.data;

      // Validate expMestTypeId
      if (!configIds.includes(parentData.expMestTypeId)) {
        throw new BadRequestException(
          `ExpMest type ${parentData.expMestTypeId} is not valid for "Other" sync (Expected: ${configIds.join(', ')})`
        );
      }

      // 2. Lấy danh sách medicines từ HIS (GetView1)
      let medicinesData: any[] = [];
      try {
        const medicinesResult = await this.integrationService.getExpMestMedicines(
          expMestIdNumber,
          userId // userId
        ).catch((error: any) => {
          console.warn('Error getting medicines:', error?.message);
          return { success: false, data: [] };
        });

        if (medicinesResult.success && medicinesResult.data && Array.isArray(medicinesResult.data)) {
          medicinesData = medicinesResult.data;
        }
      } catch (error: any) {
        console.warn('Exception getting medicines:', error?.message);
        // Ignore
      }
      const result = await this.inventoryService.syncAllExpMestOther({
        parentData,
        medicinesData: medicinesData.length > 0 ? medicinesData : undefined,
        userId,
        workingStateId: workingStateId || null,
      });
      const response = {
        success: true,
        data: {
          parent: {
            ...result.parent,
            working_state: result.parent.working_state, // Join với export-statuses
          },
          medicines: result.medicines || [],
        },
      };

      // Emit event khi sync thành công (REUSE SAME TOPIC as Inpatient)
      try {
        // Enrich với thông tin từ local DB (vừa sync xong)
        // Get working state info
        let workingStateId: string | null = null;
        let working_state: any = null;

        if (result.parent?.workingStateId) {
          workingStateId = result.parent.workingStateId;
          try {
            working_state = await this.masterDataService.findExportStatusById(workingStateId).catch(() => null);
          } catch (e) {
            // Ignore
          }
        } else {
          // Use default if not synced (should not happen here as we just synced, but for safety)
          const defaultWorkingStateId = this.configService.get<string>('DEFAULT_NOT_SYNC_EXPORT_STATUS_ID') || null;
          if (defaultWorkingStateId) {
            workingStateId = defaultWorkingStateId;
            try {
              working_state = await this.masterDataService.findExportStatusById(defaultWorkingStateId).catch(() => null);
            } catch (e) {
              // Ignore
            }
          }
        }

        const enrichedData = {
          ...parentData, // HIS data
          is_sync: true,
          workingStateId: workingStateId,
          working_state: working_state,
        };

        const syncEventPayload = {
          expMestId: expMestIdNumber,
          expMestCode: parentData.expMestCode || '',
          userId: userId,
          timestamp: Date.now(),
          data: enrichedData,
        };

        this.logger.info('InventoryController#syncExpMestOther.emittingSyncEvent', {
          eventType: 'inpatient.exp-mest.synced',
          expMestId: expMestIdNumber
        });

        this.eventEmitter.emit('inpatient.exp-mest.synced', syncEventPayload);

      } catch (eventError: any) {
        this.logger.error('InventoryController#syncExpMestOther.eventError', {
          error: eventError?.message
        });
        // Fallback event
        this.eventEmitter.emit('inpatient.exp-mest.synced', {
          expMestId: expMestIdNumber,
          expMestCode: parentData.expMestCode || '',
          userId: userId,
          timestamp: Date.now(),
        });
      }

      return response;
    } catch (error: any) {
      this.logger.error('InventoryController#syncExpMestOther.error', {
        error: error?.message,
        stack: error?.stack,
        code: error?.code,
        status: error?.status,
      });

      // Re-throw with more context
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Sync failed: ${error?.message || 'Unknown error'}`);
    }
  }

  @Post('cabinet-exp-mests/:expMestId/sync')
  @Resource('inventory.cabinet-exp-mests')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Sync cabinet exp mest from HIS to local inventory',
    description: 'Fetches cabinet exp mest from HIS GetView4 and medicines from GetView1, saves to local DB with working_state'
  })
  @ApiParam({ name: 'expMestId', description: 'HIS Exp Mest ID', type: Number })
  @ApiBody({
    required: false,
    schema: {
      type: 'object',
      properties: {
        workingStateId: { type: 'string', description: 'Working state ID (optional, uses default if not provided)' }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Cabinet exp mest synced successfully' })
  @ApiResponse({ status: 404, description: 'ExpMest not found in HIS' })
  async syncCabinetExpMest(
    @Param('expMestId') expMestId: string,
    @Req() req: AuthenticatedRequest,
    @Body() body?: { workingStateId?: string },
  ): Promise<any> {
    const defaultExportStatusId = this.configService.get<string>('app.defaultExportStatusId')
      || this.configService.get<string>('DEFAULT_EXPORT_STATUS_ID');
    const workingStateId = body?.workingStateId || defaultExportStatusId;
    const userId = req?.user?.id;

    this.logger.info('InventoryController#syncCabinetExpMest.call', { expMestId, workingStateId });

    try {
      const expMestIdNumber = Number(expMestId);
      if (isNaN(expMestIdNumber)) {
        throw new NotFoundException('Invalid expMestId: must be a valid number');
      }

      // 1. Get cabinet exp mest from HIS GetView4
      this.logger.info('InventoryController#syncCabinetExpMest.fetchingFromHIS', {
        expMestId: expMestIdNumber,
        userId,
      });

      // Use getExpMestById (same as exp-mests-other sync)
      const hisResult = await this.integrationService.getExpMestById({
        expMestId: expMestIdNumber,
        includeDeleted: false,
        dataDomainFilter: false,
        userId,
      }).catch((error: any) => {
        this.logger.error('InventoryController#syncCabinetExpMest.getExpMestByIdError', {
          error: error?.message,
          stack: error?.stack,
        });
        throw error;
      });

      this.logger.info('InventoryController#syncCabinetExpMest.hisResult', {
        success: hisResult.success,
        hasData: !!hisResult.data,
        message: hisResult.message,
      });

      // Get parent data directly from result (getExpMestById returns single record)
      const parentData = hisResult.data;

      if (!parentData) {
        this.logger.warn('InventoryController#syncCabinetExpMest.notFound', {
          expMestId: expMestIdNumber,
          hisSuccess: hisResult.success,
          hisMessage: hisResult.message,
        });
        throw new NotFoundException(hisResult.message || `Cabinet exp mest ${expMestId} not found in HIS`);
      }

      this.logger.info('InventoryController#syncCabinetExpMest.parentData', {
        expMestId: parentData.id,
        expMestCode: parentData.expMestCode,
        expMestTypeId: parentData.expMestTypeId,
      });

      // 2. Get medicines from HIS GetView1
      let medicinesData = [];
      try {
        // 2. Get medicines from HIS (View 1 only)
        const medicinesResult = await this.integrationService.getExpMestMedicines(
          expMestIdNumber,
          userId
        );

        this.logger.info('InventoryController#syncCabinetExpMest.integrationResult', {
          success: medicinesResult.success,
          dataLength: medicinesResult.data?.length,
        });

        if (medicinesResult.success && medicinesResult.data && Array.isArray(medicinesResult.data)) {
          medicinesData = medicinesResult.data;
        }
      } catch (error: any) {
        this.logger.warn('InventoryController#syncCabinetExpMest.medicinesWarning', { error: error.message });
      }

      this.logger.info('InventoryController#syncCabinetExpMest.medicinesData', {
        count: medicinesData.length,
        hasData: medicinesData.length > 0,
        sample: medicinesData.length > 0 ? medicinesData[0] : null
      });

      // 3. Sync to local DB
      const result = await this.inventoryService.syncAllExpMestCabinet({
        parentData,
        medicinesData: medicinesData.length > 0 ? medicinesData : undefined,
        userId,
        workingStateId,
      });

      // 4. Emit SSE event
      try {
        this.eventEmitter.emit('cabinet.exp-mest.synced', {
          expMestId: parentData.ID,
          expMestCode: parentData.EXP_MEST_CODE,
          workingStateId,
        });
      } catch (error: any) {
        this.logger.error('InventoryController#syncCabinetExpMest.eventError', { error: error.message });
      }

      return {
        success: true,
        message: 'Cabinet exp mest synced successfully',
        data: {
          parent: {
            ...result.parent,
            working_state: result.parent.working_state,
          },
          medicines: result.medicines || [],
        },
      };
    } catch (error: any) {
      this.logger.error('InventoryController#syncCabinetExpMest.error', {
        expMestId,
        error: error?.message,
        stack: error?.stack,
        code: error?.code,
        status: error?.status,
        name: error?.name,
        details: error?.response?.message || error?.details,
      });

      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Sync failed: ${error?.message || 'Unknown error'}`);
    }
  }

  @Get('inpatient-exp-mests/:expMestId/summary')
  @Resource('inventory.inpatient-exp-mests')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get inpatient exp mest summary with nested medicines (grouped by medicine)',
    description: 'Lấy thông tin phiếu xuất và danh sách thuốc đã gom nhóm theo medicineTypeCode từ local DB'
  })
  @ApiParam({ name: 'expMestId', description: 'ExpMest ID from HIS (parent aggrExpMestId)', type: Number })
  @ApiQuery({ name: 'orderBy', required: false, type: String, description: 'Sort medicines by field (default: "medicineName", e.g., "medicineCode", "-amount" for DESC)' })
  @ApiResponse({
    status: 200,
    description: 'Inpatient exp mest summary with medicines',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            expMestId: { type: 'number' },
            expMestCode: { type: 'string' },
            mediStockCode: { type: 'string' },
            mediStockName: { type: 'string' },
            reqDepartmentCode: { type: 'string' },
            reqDepartmentName: { type: 'string' },
            medicines: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  medicineCode: { type: 'string' },
                  medicineName: { type: 'string' },
                  serviceUnitCode: { type: 'string' },
                  serviceUnitName: { type: 'string' },
                  amount: { type: 'number' },
                  hisIds: {
                    type: 'array',
                    items: { type: 'number' }
                  },
                  is_exported: {
                    type: 'boolean',
                    description: 'True if all records in hisIds are exported (exportByUser != null OR exportTime != null)'
                  },
                  exportedByUser: {
                    type: 'string',
                    nullable: true,
                    description: 'User ID who exported (only when is_exported = true)'
                  },
                  exportedTime: {
                    type: 'number',
                    nullable: true,
                    description: 'Export time timestamp (only when is_exported = true)'
                  },
                  exportedByUserInfo: {
                    type: 'object',
                    nullable: true,
                    description: 'User information who exported (only when is_exported = true)',
                    properties: {
                      id: { type: 'string' },
                      username: { type: 'string' },
                      email: { type: 'string' },
                      firstName: { type: 'string' },
                      lastName: { type: 'string' }
                    }
                  },
                  is_actual_exported: {
                    type: 'boolean',
                    description: 'True if all records in hisIds are actually exported (actualExportByUser != null OR actualExportTime != null)'
                  },
                  actualExportedByUser: {
                    type: 'string',
                    nullable: true,
                    description: 'User ID who actually exported (only when is_actual_exported = true)'
                  },
                  actualExportedTime: {
                    type: 'number',
                    nullable: true,
                    description: 'Actual export time timestamp (only when is_actual_exported = true)'
                  },
                  actualExportedByUserInfo: {
                    type: 'object',
                    nullable: true,
                    description: 'User information who actually exported (only when is_actual_exported = true)',
                    properties: {
                      id: { type: 'string' },
                      username: { type: 'string' },
                      email: { type: 'string' },
                      firstName: { type: 'string' },
                      lastName: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  })
  async getInpatientExpMestSummary(
    @Param('expMestId') expMestId: string,
    @Query('orderBy') orderBy?: string,
  ): Promise<any> {
    this.logger.info('InventoryController#getInpatientExpMestSummary.call', { expMestId });
    console.log('=== [DEBUG] getInpatientExpMestSummary.START ===');
    console.log('expMestId param:', expMestId);

    try {
      const expMestIdNumber = Number(expMestId);
      if (isNaN(expMestIdNumber)) {
        throw new BadRequestException('Invalid expMestId: must be a valid number');
      }

      // Call gRPC method (Phase 1 Refactor)
      const summaryData = await this.inventoryService.getInpatientExpMestSummary(expMestIdNumber, orderBy);

      // Return data directly - TransformInterceptor will wrap it with statusCode, message, timestamp
      return summaryData;
    } catch (error: any) {
      this.logger.error('InventoryController#getInpatientExpMestSummary.error', {
        error: error?.message,
        stack: error?.stack,
      });

      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to get summary: ${error?.message || 'Unknown error'}`);
    }
  }

  @Get('cabinet-exp-mests/:expMestId/summary')
  @Resource('inventory.cabinet-exp-mests')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get cabinet exp mest summary with nested medicines (grouped by medicineTypeCode)',
    description: 'Lấy thông tin phiếu xuất tủ trực và danh sách thuốc đã gom nhóm theo medicineTypeCode từ local DB'
  })
  @ApiParam({ name: 'expMestId', description: 'ExpMest ID from HIS', type: Number })
  @ApiQuery({ name: 'orderBy', required: false, type: String, description: 'Sort medicines by field (default: "medicineName")' })
  async getExpMestCabinetSummary(
    @Param('expMestId') expMestId: string,
    @Query('orderBy') orderBy?: string,
  ): Promise<any> {
    this.logger.info('InventoryController#getExpMestCabinetSummary.call', { expMestId });

    try {
      const expMestIdNumber = Number(expMestId);
      if (isNaN(expMestIdNumber)) {
        throw new BadRequestException('Invalid expMestId: must be a valid number');
      }

      // Call gRPC method (Phase 1 Refactor)
      const summaryData = await this.inventoryService.getExpMestCabinetSummary(expMestIdNumber, orderBy);

      // Return data directly - TransformInterceptor will wrap it with statusCode, message, timestamp
      return summaryData;

    } catch (error: any) {
      this.logger.error('InventoryController#getExpMestCabinetSummary.error', { error: error.message });
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      if (error?.message?.includes('not found')) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(error.message || 'Failed to get summary');
    }
  }

  @Get('/exp-mests-other/:expMestId/summary')
  @Resource('inventory.exp-mests-other')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get other exp mest summary with nested medicines (grouped by medicineTypeCode)',
    description: 'Lấy thông tin phiếu xuất "Other" và danh sách thuốc đã gom nhóm theo medicineTypeCode từ Local DB (KHÔNG sync, chỉ view)'
  })
  @ApiParam({ name: 'expMestId', description: 'ExpMest ID from HIS', type: Number })
  @ApiQuery({ name: 'orderBy', required: false, type: String, description: 'Sort medicines by field (default: "medicineName")' })
  async getExpMestOtherSummary(
    @Param('expMestId') expMestId: string,
    @Query('orderBy') orderBy?: string,
  ): Promise<any> {
    this.logger.info('InventoryController#getExpMestOtherSummary.call', { expMestId });
    console.log('=== [DEBUG] getExpMestOtherSummary.START ===');
    console.log('expMestId param:', expMestId);

    try {
      const expMestIdNumber = Number(expMestId);
      if (isNaN(expMestIdNumber)) {
        throw new BadRequestException('Invalid expMestId: must be a valid number');
      }

      // Call gRPC method (Phase 1 Refactor)
      const summaryData = await this.inventoryService.getExpMestOtherSummary(expMestIdNumber, orderBy);

      // Return data directly - TransformInterceptor will wrap it with statusCode, message, timestamp
      return summaryData;

    } catch (error: any) {
      this.logger.error('InventoryController#getExpMestOtherSummary.error', { error: error.message });
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Failed to get summary');
    }
  }

  @Put('inpatient-exp-mests/medicines/export')
  @Resource('inventory.inpatient-exp-mests')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update export fields for multiple medicines by HIS IDs',
    description: 'Cập nhật EXPORT_AMOUNT (tự động = AMOUNT), EXPORT_BY_USER (từ token), và EXPORT_TIME cho các medicine records'
  })
  @ApiResponse({
    status: 200,
    description: 'Export fields updated successfully',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            updatedCount: { type: 'number' },
            hisIds: {
              type: 'array',
              items: { type: 'number' }
            }
          }
        }
      }
    }
  })
  async updateExportFields(
    @Body() body: {
      hisIds: number[];
      exportTime?: number | null;
    },
    @Req() req: AuthenticatedRequest,
  ): Promise<any> {
    console.log('=== [SSE DEBUG] updateExportFields.START ===');
    console.log('hisIds:', JSON.stringify(body.hisIds, null, 2));
    console.log('hisIdsCount:', body.hisIds?.length || 0);
    console.log('exportTime:', body.exportTime);
    console.log('userId:', req.user?.id);

    this.logger.info('InventoryController#updateExportFields.call', {
      hisIdsCount: body.hisIds?.length || 0,
      exportTime: body.exportTime,
      userId: req.user?.id,
    });

    try {
      if (!req.user?.id) {
        throw new BadRequestException('User ID not found in token');
      }

      if (!body.hisIds || body.hisIds.length === 0) {
        throw new BadRequestException('hisIds is required and must not be empty');
      }

      console.log('=== [SSE DEBUG] updateExportFields: Calling updateExportFieldsByHisIds ===');
      const result = await this.inventoryService.updateExportFieldsByHisIds(
        body.hisIds,
        body.exportTime ?? null,
        req.user.id,
      );
      console.log('=== [SSE DEBUG] updateExportFields: updateExportFieldsByHisIds completed ===');
      console.log('result:', JSON.stringify(result, null, 2));

      // Emit SSE event với đầy đủ thông tin summary sau khi update thành công
      console.log('=== [SSE DEBUG] InventoryController#updateExportFields.startEmitEvent ===');
      console.log('hisIds:', JSON.stringify(body.hisIds, null, 2));
      console.log('hisIdsCount:', body.hisIds?.length || 0);
      console.log('userId:', req.user.id);

      try {
        if (body.hisIds && body.hisIds.length > 0) {
          // Cách hiệu quả hơn: Query trực tiếp medicine by hisId
          const firstHisId = body.hisIds[0];
          console.log('=== [SSE DEBUG] Querying medicine by hisId ===');
          console.log('firstHisId:', firstHisId);

          try {
            // Query medicine trực tiếp bằng hisId
            const medicine = await this.inventoryService.findInpatientExpMestMedicineByHisId(firstHisId).catch((error: any) => {
              console.error('=== [SSE DEBUG] findMedicineByHisIdError ===');
              console.error('hisId:', firstHisId);
              console.error('error:', error?.message);
              return null;
            });

            if (medicine) {
              console.log('=== [SSE DEBUG] Medicine found ===');
              console.log('medicine object keys:', Object.keys(medicine));
              console.log('medicine full object:', JSON.stringify(medicine, null, 2));
              console.log('medicine.inpatientExpMestId:', medicine.inpatientExpMestId);
              console.log('medicine.inpatientExpMestId type:', typeof medicine.inpatientExpMestId);
              console.log('medicine.inpatientExpMestId === undefined:', medicine.inpatientExpMestId === undefined);
              console.log('medicine.inpatientExpMestId === null:', medicine.inpatientExpMestId === null);

              if (medicine.inpatientExpMestId) {
                console.log('=== [SSE DEBUG] Querying child by hisExpMestId ===');
                console.log('inpatientExpMestId:', medicine.inpatientExpMestId);

                // Query child record để lấy aggrExpMestId
                const child = await this.inventoryService.findInpatientExpMestChildByHisId(medicine.inpatientExpMestId).catch((error: any) => {
                  console.error('=== [SSE DEBUG] findChildByHisIdError ===');
                  console.error('inpatientExpMestId:', medicine.inpatientExpMestId);
                  console.error('error:', error?.message);
                  return null;
                });

                if (child && child.aggrExpMestId) {
                  const aggrExpMestId = child.aggrExpMestId;
                  console.log('=== [SSE DEBUG] Child found ===');
                  console.log('child:', JSON.stringify({
                    hisExpMestId: child.hisExpMestId,
                    aggrExpMestId: child.aggrExpMestId,
                    expMestCode: child.expMestCode,
                  }, null, 2));
                  console.log('=== [SSE DEBUG] aggrExpMestId FOUND ===');
                  console.log('aggrExpMestId:', aggrExpMestId);

                  // Fetch summary data giống như API GET /api/inventory/inpatient-exp-mests/{expMestId}/summary
                  try {
                    console.log('=== [SSE DEBUG] Fetching summary ===');
                    console.log('aggrExpMestId:', aggrExpMestId);

                    const summaryResponse = await this.getInpatientExpMestSummary(
                      aggrExpMestId.toString(),
                      undefined, // orderBy - use default
                    );

                    console.log('=== [SSE DEBUG] Summary fetched ===');
                    console.log('hasData:', !!summaryResponse?.data);
                    console.log('expMestCode:', summaryResponse?.data?.expMestCode);
                    console.log('medicinesCount:', summaryResponse?.data?.medicines?.length || 0);

                    if (summaryResponse?.data) {
                      const eventPayload = {
                        expMestId: aggrExpMestId,
                        expMestCode: summaryResponse.data.expMestCode || '',
                        userId: req.user.id,
                        timestamp: Date.now(),
                        data: summaryResponse.data, // Đầy đủ thông tin summary
                      };

                      console.log('=== [SSE DEBUG] Emitting event ===');
                      console.log('eventType: inpatient.exp-mest.medicines.exported');
                      console.log('payload:', JSON.stringify({
                        expMestId: eventPayload.expMestId,
                        expMestCode: eventPayload.expMestCode,
                        userId: eventPayload.userId,
                        timestamp: eventPayload.timestamp,
                        hasData: !!eventPayload.data,
                        medicinesCount: eventPayload.data?.medicines?.length || 0,
                      }, null, 2));

                      this.eventEmitter.emit('inpatient.exp-mest.medicines.exported', eventPayload);

                      console.log('=== [SSE DEBUG] Event EMITTED successfully ===');

                      // Check if WORKING_STATE_ID has changed and emit stt-updated event if needed
                      console.log('=== [SSE DEBUG] updateExportFields: Calling checkAndEmitWorkingStateUpdate ===');
                      console.log('aggrExpMestId:', aggrExpMestId);
                      await this.checkAndEmitWorkingStateUpdate(aggrExpMestId);
                      console.log('=== [SSE DEBUG] updateExportFields: checkAndEmitWorkingStateUpdate completed ===');
                    } else {
                      console.warn('=== [SSE DEBUG] No summary data ===');
                      console.log('summaryResponse:', JSON.stringify(summaryResponse, null, 2));
                    }
                  } catch (error: any) {
                    console.error('=== [SSE DEBUG] Summary error ===');
                    console.error('aggrExpMestId:', aggrExpMestId);
                    console.error('error:', error?.message);
                    console.error('stack:', error?.stack);
                  }
                } else {
                  console.warn('=== [SSE DEBUG] Child not found or no aggrExpMestId ===');
                  console.log('child:', child ? JSON.stringify({
                    hisExpMestId: child.hisExpMestId,
                    aggrExpMestId: child.aggrExpMestId,
                  }, null, 2) : 'null');
                }
              } else {
                console.warn('=== [SSE DEBUG] Medicine has no inpatientExpMestId ===');
                console.log('medicine:', JSON.stringify({
                  hisId: medicine.hisId,
                  inpatientExpMestId: medicine.inpatientExpMestId,
                }, null, 2));
              }
            } else {
              console.warn('=== [SSE DEBUG] Medicine not found ===');
              console.log('hisId:', firstHisId);
            }
          } catch (error: any) {
            console.error('=== [SSE DEBUG] Medicine query error ===');
            console.error('error:', error?.message);
            console.error('stack:', error?.stack);
          }
        } else {
          console.warn('=== [SSE DEBUG] No hisIds ===');
          console.log('body:', JSON.stringify(body, null, 2));
        }
      } catch (error: any) {
        // Log error nhưng không fail request
        console.error('=== [SSE DEBUG] eventEnrichError ===');
        console.error('error:', error?.message);
        console.error('stack:', error?.stack);
      }

      console.log('=== [SSE DEBUG] InventoryController#updateExportFields.endEmitEvent ===');

      return {
        statusCode: 200,
        message: 'Export fields updated successfully',
        data: result,
      };
    } catch (error: any) {
      this.logger.error('InventoryController#updateExportFields.error', {
        error: error?.message,
        errorDetails: error?.details,
        errorCode: error?.code,
        stack: error?.stack,
      });

      if (error instanceof BadRequestException) {
        throw error;
      }

      // Extract error message from gRPC error
      // gRPC errors can have message in different places:
      // - error.message (standard Error)
      // - error.details (gRPC error details)
      // - error (string message)
      let errorMessage = '';
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.details) {
        errorMessage = error.details;
      } else if (error?.message) {
        errorMessage = error.message;
      } else {
        errorMessage = 'Unknown error';
      }

      // Check if error is about validation (already exported, not found, etc.)
      if (
        errorMessage.includes('already been exported') ||
        errorMessage.includes('Cannot update') ||
        errorMessage.includes('not found') ||
        error?.code === 3 // INVALID_ARGUMENT from gRPC
      ) {
        // Try to parse error details if it's a JSON string
        let errorDetails: any = null;
        try {
          errorDetails = JSON.parse(errorMessage);
        } catch (e) {
          // Not JSON, use plain message
        }

        // If we have structured error details, return them
        if (errorDetails && errorDetails.exportedDetails) {
          // Get user info (all records are exported by the same user)
          const exportedByUserInfo = await this.getUserInfoFromExportedDetails(
            errorDetails.exportedDetails
          );

          throw new BadRequestException({
            message: errorDetails.message || errorMessage,
            exportedCount: errorDetails.exportedCount,
            exportedHisIds: errorDetails.exportedHisIds,
            exportedByUser: errorDetails.exportedDetails[0]?.exportByUser || null,
            exportedByUserInfo: exportedByUserInfo,
            exportTime: errorDetails.exportedDetails[0]?.exportTime || null,
          });
        }

        // Fallback to plain message
        throw new BadRequestException(errorMessage);
      }

      throw new InternalServerErrorException(`Failed to update export fields: ${errorMessage}`);
    }
  }

  /**
   * Get user information from exported details (all records are exported by the same user)
   * @param exportedDetails Array of exported detail objects with exportByUser UUID
   * @returns User info object or null
   */
  private async getUserInfoFromExportedDetails(
    exportedDetails: Array<{ hisId: number; exportByUser: string | null; exportTime: number | null }>
  ): Promise<{
    id: string;
    username: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
  } | null> {
    // Get the first user ID (all records are exported by the same user)
    const userId = exportedDetails[0]?.exportByUser;

    if (!userId) {
      return null;
    }

    try {
      const userResult = await this.usersService.findByIdWithProfile(userId);

      if (userResult && userResult.user) {
        return {
          id: userResult.user.id,
          username: userResult.user.username,
          email: userResult.user.email,
          firstName: userResult.profile?.firstName || null,
          lastName: userResult.profile?.lastName || null,
        };
      }
    } catch (error: any) {
      this.logger.warn('InventoryController#getUserInfoFromExportedDetails.userNotFound', {
        userId,
        error: error?.message,
      });
    }

    return null;
  }

  @Put('inpatient-exp-mests/medicines/actual-export')
  @Resource('inventory.inpatient-exp-mests')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update actual export fields for multiple medicines by HIS IDs',
    description: 'Cập nhật ACTUAL_EXP_AMOUNT (tự động = AMOUNT), ACTUAL_EXP_BY_USER (từ token), và ACTUAL_EXP_TIME cho các medicine records'
  })
  @ApiResponse({
    status: 200,
    description: 'Actual export fields updated successfully',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number' },
        message: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            updatedCount: { type: 'number' },
            hisIds: {
              type: 'array',
              items: { type: 'number' }
            }
          }
        }
      }
    }
  })
  async updateActualExportFields(
    @Body() body: BatchUpdateActualExportFieldsDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<any> {
    console.log('=== [SSE DEBUG] updateActualExportFields.START ===');
    console.log('hisIds:', JSON.stringify(body.hisIds, null, 2));
    console.log('hisIdsCount:', body.hisIds?.length || 0);
    console.log('actualExportTime:', body.actualExportTime);
    console.log('userId:', req.user?.id);

    this.logger.info('InventoryController#updateActualExportFields.call', {
      hisIdsCount: body.hisIds?.length || 0,
      actualExportTime: body.actualExportTime,
      userId: req.user?.id,
    });

    try {
      if (!req.user?.id) {
        throw new BadRequestException('User ID not found in token');
      }

      if (!body.hisIds || body.hisIds.length === 0) {
        throw new BadRequestException('hisIds is required and must not be empty');
      }

      console.log('=== [SSE DEBUG] updateActualExportFields: Calling updateActualExportFieldsByHisIds ===');
      const result = await this.inventoryService.updateActualExportFieldsByHisIds(
        body.hisIds,
        body.actualExportTime ?? null,
        req.user.id,
      );
      console.log('=== [SSE DEBUG] updateActualExportFields: updateActualExportFieldsByHisIds completed ===');
      console.log('result:', JSON.stringify(result, null, 2));

      // Emit SSE event với summary data (giống như updateExportFields)
      // Frontend sẽ nhận cùng event để update cả export và actual export status
      if (body.hisIds && body.hisIds.length > 0) {
        try {
          const firstHisId = body.hisIds[0];
          const medicine = await this.inventoryService.findInpatientExpMestMedicineByHisId(firstHisId).catch((error: any) => {
            this.logger.warn('InventoryController#updateActualExportFields.findMedicineError', {
              hisId: firstHisId,
              error: error?.message,
            });
            return null;
          });

          if (medicine && medicine.inpatientExpMestId) {
            // Query child record để lấy aggrExpMestId
            const child = await this.inventoryService.findInpatientExpMestChildByHisId(medicine.inpatientExpMestId).catch((error: any) => {
              this.logger.warn('InventoryController#updateActualExportFields.findChildError', {
                inpatientExpMestId: medicine.inpatientExpMestId,
                error: error?.message,
              });
              return null;
            });

            if (child && child.aggrExpMestId) {
              const aggrExpMestId = child.aggrExpMestId;

              // Fetch summary data giống như API GET /api/inventory/inpatient-exp-mests/{expMestId}/summary
              try {
                const summaryResponse = await this.getInpatientExpMestSummary(
                  aggrExpMestId.toString(),
                  undefined, // orderBy - use default
                );

                if (summaryResponse?.data) {
                  const eventPayload = {
                    expMestId: aggrExpMestId,
                    expMestCode: summaryResponse.data.expMestCode || '',
                    userId: req.user.id,
                    timestamp: Date.now(),
                    data: summaryResponse.data, // Đầy đủ thông tin summary (có cả export và actual export)
                  };

                  this.logger.info('InventoryController#updateActualExportFields.emittingSSE', {
                    eventType: 'inpatient.exp-mest.medicines.exported',
                    expMestId: aggrExpMestId,
                    expMestCode: eventPayload.expMestCode,
                    medicinesCount: summaryResponse.data.medicines?.length || 0,
                  });

                  // Emit cùng event như updateExportFields
                  this.eventEmitter.emit('inpatient.exp-mest.medicines.exported', eventPayload);

                  // Check if WORKING_STATE_ID has changed and emit stt-updated event if needed
                  console.log('=== [SSE DEBUG] updateActualExportFields: Calling checkAndEmitWorkingStateUpdate ===');
                  console.log('aggrExpMestId:', aggrExpMestId);
                  await this.checkAndEmitWorkingStateUpdate(aggrExpMestId);
                  console.log('=== [SSE DEBUG] updateActualExportFields: checkAndEmitWorkingStateUpdate completed ===');
                }
              } catch (error: any) {
                this.logger.error('InventoryController#updateActualExportFields.summaryError', {
                  aggrExpMestId,
                  error: error?.message,
                  stack: error?.stack,
                });
                // Không throw error, chỉ log vì update đã thành công
              }
            }
          }
        } catch (error: any) {
          this.logger.error('InventoryController#updateActualExportFields.sseError', {
            error: error?.message,
            stack: error?.stack,
          });
          // Không throw error, chỉ log vì update đã thành công
        }
      }

      return {
        statusCode: 200,
        message: 'Actual export fields updated successfully',
        data: result,
      };
    } catch (error: any) {
      this.logger.error('InventoryController#updateActualExportFields.error', {
        error: error?.message,
        errorDetails: error?.details,
        errorCode: error?.code,
        stack: error?.stack,
      });

      if (error instanceof BadRequestException) {
        throw error;
      }

      // Extract error message from gRPC error
      let errorMessage = '';
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.details) {
        errorMessage = error.details;
      } else if (error?.message) {
        errorMessage = error.message;
      } else {
        errorMessage = 'Unknown error';
      }

      // Check if error is about validation (already actually exported, not found, etc.)
      if (
        errorMessage.includes('already been actually exported') ||
        errorMessage.includes('Cannot update') ||
        errorMessage.includes('not found') ||
        error?.code === 3 // INVALID_ARGUMENT from gRPC
      ) {
        // Try to parse error details if it's a JSON string
        let errorDetails: any = null;
        try {
          errorDetails = JSON.parse(errorMessage);
        } catch (e) {
          // Not JSON, use plain message
        }

        // If we have structured error details, return them
        if (errorDetails && errorDetails.exportedDetails) {
          // Get user info (all records are exported by the same user)
          const exportedByUserInfo = await this.getUserInfoFromActualExportedDetails(
            errorDetails.exportedDetails
          );

          throw new BadRequestException({
            message: errorDetails.message || errorMessage,
            exportedCount: errorDetails.exportedCount,
            exportedHisIds: errorDetails.exportedHisIds,
            exportedByUser: errorDetails.exportedDetails[0]?.actualExportByUser || null,
            exportedByUserInfo: exportedByUserInfo,
            exportTime: errorDetails.exportedDetails[0]?.actualExportTime || null,
          });
        }

        // Fallback to plain message
        throw new BadRequestException(errorMessage);
      }

      throw new InternalServerErrorException(`Failed to update actual export fields: ${errorMessage}`);
    }
  }

  /**
   * Get user information from actual exported details (all records are exported by the same user)
   * @param exportedDetails Array of exported detail objects with actualExportByUser UUID
   * @returns User info object or null
   */
  private async getUserInfoFromActualExportedDetails(
    exportedDetails: Array<{ hisId: number; actualExportByUser: string | null; actualExportTime: number | null }>
  ): Promise<{
    id: string;
    username: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
  } | null> {
    // Get the first user ID (all records are exported by the same user)
    const userId = exportedDetails[0]?.actualExportByUser;

    if (!userId) {
      return null;
    }

    try {
      const userResult = await this.usersService.findByIdWithProfile(userId);

      if (userResult && userResult.user) {
        return {
          id: userResult.user.id,
          username: userResult.user.username,
          email: userResult.user.email,
          firstName: userResult.profile?.firstName || null,
          lastName: userResult.profile?.lastName || null,
        };
      }
    } catch (error: any) {
      this.logger.warn('InventoryController#getUserInfoFromActualExportedDetails.userNotFound', {
        userId,
        error: error?.message,
      });
    }

    return null;
  }

  /**
   * Check if WORKING_STATE_ID has changed and emit SSE event if needed
   * This is called after medicines are exported/actual exported and WORKING_STATE_ID may have been updated
   * @param aggrExpMestId Aggregated exp mest ID (parent)
   */
  private async checkAndEmitWorkingStateUpdate(aggrExpMestId: number): Promise<void> {
    console.log('=== [SSE DEBUG] checkAndEmitWorkingStateUpdate.START ===');
    console.log('aggrExpMestId:', aggrExpMestId);

    try {
      // 1. Fetch parent record from local DB to get current workingStateId
      console.log('=== [SSE DEBUG] checkAndEmitWorkingStateUpdate.step1: Fetching local record ===');
      const localRecord = await this.inventoryService.findInpatientExpMestByHisId(aggrExpMestId).catch((error: any) => {
        console.error('=== [SSE DEBUG] checkAndEmitWorkingStateUpdate.step1.error ===');
        console.error('aggrExpMestId:', aggrExpMestId);
        console.error('error:', error?.message);
        return null;
      });

      if (!localRecord) {
        console.warn('=== [SSE DEBUG] checkAndEmitWorkingStateUpdate.step1.localRecordNotFound ===');
        console.warn('aggrExpMestId:', aggrExpMestId);
        this.logger.debug('InventoryController#checkAndEmitWorkingStateUpdate.localRecordNotFound', {
          aggrExpMestId,
        });
        return;
      }

      const localWorkingStateId = localRecord.workingStateId || null;
      console.log('=== [SSE DEBUG] checkAndEmitWorkingStateUpdate.step1.localRecordFound ===');
      console.log('localWorkingStateId:', localWorkingStateId);
      console.log('localRecord keys:', Object.keys(localRecord));

      // 2. Get default WORKING_STATE_ID values from config
      console.log('=== [SSE DEBUG] checkAndEmitWorkingStateUpdate.step2: Getting config values ===');
      const defaultAllExportedWorkingStateId = this.configService.get<string>('DEFAULT_ALL_EXPORTED_WORKING_STATE_ID') || null;
      const defaultAllActualStatusId = this.configService.get<string>('DEFAULT_ALL_ACTUAL_STATUS_ID') || null;
      console.log('defaultAllExportedWorkingStateId:', defaultAllExportedWorkingStateId);
      console.log('defaultAllActualStatusId:', defaultAllActualStatusId);

      // 3. Only emit event if workingStateId matches one of the default values
      // This indicates that WORKING_STATE_ID was updated due to all medicines being exported/actual exported
      const isUpdatedDueToExport = localWorkingStateId === defaultAllExportedWorkingStateId;
      const isUpdatedDueToActualExport = localWorkingStateId === defaultAllActualStatusId;
      console.log('=== [SSE DEBUG] checkAndEmitWorkingStateUpdate.step3: Checking conditions ===');
      console.log('isUpdatedDueToExport:', isUpdatedDueToExport);
      console.log('isUpdatedDueToActualExport:', isUpdatedDueToActualExport);
      console.log('localWorkingStateId === defaultAllExportedWorkingStateId:', localWorkingStateId === defaultAllExportedWorkingStateId);
      console.log('localWorkingStateId === defaultAllActualStatusId:', localWorkingStateId === defaultAllActualStatusId);

      if (!isUpdatedDueToExport && !isUpdatedDueToActualExport) {
        // WORKING_STATE_ID was not updated due to export/actual export
        console.warn('=== [SSE DEBUG] checkAndEmitWorkingStateUpdate.step3.skip ===');
        console.warn('WORKING_STATE_ID was not updated due to export/actual export');
        console.warn('localWorkingStateId:', localWorkingStateId);
        console.warn('defaultAllExportedWorkingStateId:', defaultAllExportedWorkingStateId);
        console.warn('defaultAllActualStatusId:', defaultAllActualStatusId);
        return;
      }

      // 4. Fetch data from HIS to get EXP_MEST_STT_ID (old status from HIS)
      console.log('=== [SSE DEBUG] checkAndEmitWorkingStateUpdate.step4: Fetching HIS data ===');
      const hisResult = await this.integrationService.getInpatientExpMestById({
        expMestId: aggrExpMestId,
      }).catch((error: any) => {
        console.error('=== [SSE DEBUG] checkAndEmitWorkingStateUpdate.step4.error ===');
        console.error('aggrExpMestId:', aggrExpMestId);
        console.error('error:', error?.message);
        return null;
      });

      if (!hisResult?.success || !hisResult.data) {
        console.warn('=== [SSE DEBUG] checkAndEmitWorkingStateUpdate.step4.hisDataNotFound ===');
        console.warn('aggrExpMestId:', aggrExpMestId);
        console.warn('hisResult:', hisResult);
        this.logger.debug('InventoryController#checkAndEmitWorkingStateUpdate.hisDataNotFound', {
          aggrExpMestId,
        });
        return;
      }

      const hisExpMestSttId = hisResult.data.expMestSttId || null;
      console.log('=== [SSE DEBUG] checkAndEmitWorkingStateUpdate.step4.hisDataFound ===');
      console.log('hisExpMestSttId:', hisExpMestSttId);
      console.log('hisResult.data.expMestCode:', hisResult.data.expMestCode);

      // 5. Get working_state from masterDataService
      console.log('=== [SSE DEBUG] checkAndEmitWorkingStateUpdate.step5: Fetching working_state ===');
      let working_state: any = null;
      try {
        working_state = await this.masterDataService.findExportStatusById(localWorkingStateId).catch((error: any) => {
          console.error('=== [SSE DEBUG] checkAndEmitWorkingStateUpdate.step5.error ===');
          console.error('localWorkingStateId:', localWorkingStateId);
          console.error('error:', error?.message);
          return null;
        });
        console.log('=== [SSE DEBUG] checkAndEmitWorkingStateUpdate.step5.working_stateFound ===');
        console.log('working_state:', working_state ? JSON.stringify(working_state, null, 2) : 'null');
      } catch (e) {
        console.error('=== [SSE DEBUG] checkAndEmitWorkingStateUpdate.step5.exception ===');
        console.error('error:', e);
        // Ignore
      }

      // 6. Format data giống như API GET /api/integration/exp-mests/inpatient
      const enrichedData = {
        ...hisResult.data,
        is_sync: true,
        workingStateId: localWorkingStateId,
        working_state: working_state,
      };

      console.log('=== [SSE DEBUG] checkAndEmitWorkingStateUpdate.step6: Preparing event payload ===');
      console.log('expMestId:', aggrExpMestId);
      console.log('expMestCode:', hisResult.data.expMestCode || '');
      console.log('oldSttId:', hisExpMestSttId);
      console.log('newSttId:', localWorkingStateId);
      console.log('reason:', isUpdatedDueToExport ? 'all_exported' : 'all_actual_exported');

      this.logger.info('InventoryController#checkAndEmitWorkingStateUpdate.emittingEvent', {
        expMestId: aggrExpMestId,
        expMestCode: hisResult.data.expMestCode || '',
        oldSttId: hisExpMestSttId,
        newSttId: localWorkingStateId,
        reason: isUpdatedDueToExport ? 'all_exported' : 'all_actual_exported',
      });

      // 7. Emit SSE event
      const eventPayload = {
        expMestId: aggrExpMestId,
        expMestCode: hisResult.data.expMestCode || '',
        oldSttId: hisExpMestSttId,
        newSttId: localWorkingStateId,
        timestamp: Date.now(),
        data: enrichedData, // Đầy đủ thông tin như API GET /api/integration/exp-mests/inpatient
      };

      console.log('=== [SSE DEBUG] checkAndEmitWorkingStateUpdate.step7: Emitting SSE event ===');
      console.log('eventType: inpatient.exp-mest.stt-updated');
      console.log('eventPayload:', JSON.stringify({
        expMestId: eventPayload.expMestId,
        expMestCode: eventPayload.expMestCode,
        oldSttId: eventPayload.oldSttId,
        newSttId: eventPayload.newSttId,
        timestamp: eventPayload.timestamp,
        hasData: !!eventPayload.data,
      }, null, 2));

      this.eventEmitter.emit('inpatient.exp-mest.stt-updated', eventPayload);

      console.log('=== [SSE DEBUG] checkAndEmitWorkingStateUpdate.step7.eventEmitted ===');
      console.log('=== [SSE DEBUG] checkAndEmitWorkingStateUpdate.END ===');
    } catch (error: any) {
      console.error('=== [SSE DEBUG] checkAndEmitWorkingStateUpdate.EXCEPTION ===');
      console.error('aggrExpMestId:', aggrExpMestId);
      console.error('error:', error?.message);
      console.error('stack:', error?.stack);
      this.logger.error('InventoryController#checkAndEmitWorkingStateUpdate.error', {
        aggrExpMestId,
        error: error?.message,
        stack: error?.stack,
      });
      // Không throw error, chỉ log vì đây là non-critical operation
    }
  }

  @Put('exp-mests-other/medicines/export')
  @Resource('inventory.exp-mests-other')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update export fields for multiple Other Export Medicine records' })
  @ApiResponse({ status: 200, description: 'Updated count' })
  async updateExpMestOtherMedicineExportFields(
    @Body() dto: BatchUpdateExportFieldsDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<{ updatedCount: number; hisIds: number[] }> {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User ID not found in request');
    }

    this.logger.info('InventoryController#updateExpMestOtherMedicineExportFields.call', {
      hisIdsCount: dto.hisIds.length,
      exportTime: dto.exportTime,
      userId,
    });

    try {
      // 1. Update export fields
      const result = await this.inventoryService.updateExpMestOtherMedicineExportFieldsByHisIds(
        dto.hisIds,
        dto.exportTime,
        userId,
      );

      // 2. Fetch expMestId from one of the updated medicines to allow SSE update
      console.log('=== [SSE DEBUG] OTHER Export: hisIds.length:', dto.hisIds.length);
      if (dto.hisIds.length > 0) {
        // Fetch one medicine to get expMestId. We can fetch using findExpMestOtherMedicinesByHisIds
        // We only need one to identify the parent.
        const medicines = await this.inventoryService.findExpMestOtherMedicinesByHisIds([dto.hisIds[0]]);
        console.log('=== [SSE DEBUG] OTHER Export: medicines found:', medicines.length);
        if (medicines.length > 0) {
          const expMestId = medicines[0].expMestId;
          console.log('=== [SSE DEBUG] OTHER Export: expMestId identified:', expMestId);

          // 3. Emit summary update event (reuses existing summary logic but for "Other")
          // Get updated summary data
          const summary = await this.getExpMestOtherSummary(expMestId);
          console.log('=== [SSE DEBUG] OTHER Export: summary fetched, expMestCode:', summary.data?.expMestCode);

          console.log('=== [SSE DEBUG] OTHER Export: Emitting exp-mest-other.medicines.exported');
          this.eventEmitter.emit('exp-mest-other.medicines.exported', {
            expMestId,
            expMestCode: summary.data?.expMestCode || '',
            userId,
            data: summary.data,
            timestamp: Date.now(),
          });

          // 4. Check and emit working state update if all medicines are exported
          console.log('=== [SSE DEBUG] OTHER Export: Calling checkAndEmitExpMestOtherWorkingStateUpdate');
          await this.checkAndEmitExpMestOtherWorkingStateUpdate(expMestId);
          console.log('=== [SSE DEBUG] OTHER Export: checkAndEmitExpMestOtherWorkingStateUpdate completed');
        }
      }

      return result;
    } catch (error: any) {
      this.logger.error('InventoryController#updateExpMestOtherMedicineExportFields.error', {
        error: error.message,
        stack: error.stack,
      });
      throw new InternalServerErrorException(error.message);
    }
  }

  @Put('exp-mests-other/medicines/actual-export')
  @Resource('inventory.exp-mests-other')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update actual export fields for multiple Other Export Medicine records' })
  @ApiResponse({ status: 200, description: 'Updated count' })
  async updateExpMestOtherMedicineActualExportFields(
    @Body() dto: BatchUpdateActualExportFieldsDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<{ updatedCount: number; hisIds: number[] }> {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User ID not found in request');
    }

    this.logger.info('InventoryController#updateExpMestOtherMedicineActualExportFields.call', {
      hisIdsCount: dto.hisIds.length,
      actualExportTime: dto.actualExportTime,
      userId,
    });

    try {
      // 1. Update actual export fields
      const result = await this.inventoryService.updateExpMestOtherMedicineActualExportFieldsByHisIds(
        dto.hisIds,
        dto.actualExportTime,
        userId,
      );

      // 2. Fetch expMestId and emit events
      console.log('=== [SSE DEBUG] OTHER Actual Export: hisIds.length:', dto.hisIds.length);
      if (dto.hisIds.length > 0) {
        const medicines = await this.inventoryService.findExpMestOtherMedicinesByHisIds([dto.hisIds[0]]);
        console.log('=== [SSE DEBUG] OTHER Actual Export: medicines found:', medicines.length);
        if (medicines.length > 0) {
          const expMestId = medicines[0].expMestId;
          console.log('=== [SSE DEBUG] OTHER Actual Export: expMestId identified:', expMestId);

          const summary = await this.getExpMestOtherSummary(expMestId);
          console.log('=== [SSE DEBUG] OTHER Actual Export: summary fetched, expMestCode:', summary.data?.expMestCode);

          console.log('=== [SSE DEBUG] OTHER Actual Export: Emitting exp-mest-other.medicines.exported');
          this.eventEmitter.emit('exp-mest-other.medicines.exported', {
            expMestId,
            expMestCode: summary.data?.expMestCode || '',
            userId,
            data: summary.data,
            timestamp: Date.now(),
          });

          await this.checkAndEmitExpMestOtherWorkingStateUpdate(expMestId);
        }
      }

      return result;
    } catch (error: any) {
      this.logger.error('InventoryController#updateExpMestOtherMedicineActualExportFields.error', {
        error: error.message,
        stack: error.stack,
      });
      throw new InternalServerErrorException(error.message);
    }
  }

  @Put('cabinet-exp-mests/medicines/export')
  @Resource('inventory.cabinet-exp-mests')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update export fields for multiple Cabinet Export Medicine records' })
  @ApiResponse({ status: 200, description: 'Updated count' })
  async updateExpMestCabinetMedicineExportFields(
    @Body() dto: BatchUpdateExportFieldsDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<{ updatedCount: number; hisIds: number[] }> {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User ID not found in request');
    }

    this.logger.info('InventoryController#updateExpMestCabinetMedicineExportFields.call', {
      hisIdsCount: dto.hisIds.length,
      exportTime: dto.exportTime,
      userId,
    });

    try {
      // 1. Update export fields
      const result = await this.inventoryService.updateExpMestCabinetMedicineExportFieldsByHisIds(
        dto.hisIds,
        dto.exportTime,
        userId,
      );

      // 2. Fetch expMestId from one of the updated medicines to allow SSE update
      console.log('=== [SSE DEBUG] CABINET Export: hisIds.length:', dto.hisIds.length);
      if (dto.hisIds.length > 0) {
        // Fetch one medicine to get expMestId
        const medicines = await this.inventoryService.findExpMestCabinetMedicinesByHisIds([dto.hisIds[0]]);
        console.log('=== [SSE DEBUG] CABINET Export: medicines found:', medicines.length);
        if (medicines.length > 0) {
          const expMestId = medicines[0].expMestId;
          console.log('=== [SSE DEBUG] CABINET Export: expMestId identified:', expMestId);

          // 3. Emit summary update event
          const summary = await this.getExpMestCabinetSummary(expMestId.toString());
          console.log('=== [SSE DEBUG] CABINET Export: summary fetched, expMestCode:', summary.data?.expMestCode);

          console.log('=== [SSE DEBUG] CABINET Export: Emitting exp-mest-cabinet.medicines.exported');
          this.eventEmitter.emit('exp-mest-cabinet.medicines.exported', {
            expMestId,
            expMestCode: summary.data?.expMestCode || '',
            userId,
            data: summary.data,
            timestamp: Date.now(),
          });

          // 4. Check and emit working state update if all medicines are exported
          console.log('=== [SSE DEBUG] CABINET Export: Calling checkAndEmitExpMestCabinetWorkingStateUpdate');
          await this.checkAndEmitExpMestCabinetWorkingStateUpdate(expMestId);
          console.log('=== [SSE DEBUG] CABINET Export: checkAndEmitExpMestCabinetWorkingStateUpdate completed');
        }
      }

      return result;
    } catch (error: any) {
      this.logger.error('InventoryController#updateExpMestCabinetMedicineExportFields.error', {
        error: error.message,
        stack: error.stack,
      });
      throw new InternalServerErrorException(error.message);
    }
  }

  @Put('cabinet-exp-mests/medicines/actual-export')
  @Resource('inventory.cabinet-exp-mests')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update actual export fields for multiple Cabinet Export Medicine records' })
  @ApiResponse({ status: 200, description: 'Updated count' })
  async updateExpMestCabinetMedicineActualExportFields(
    @Body() dto: BatchUpdateActualExportFieldsDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<{ updatedCount: number; hisIds: number[] }> {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User ID not found in request');
    }

    this.logger.info('InventoryController#updateExpMestCabinetMedicineActualExportFields.call', {
      hisIdsCount: dto.hisIds.length,
      actualExportTime: dto.actualExportTime,
      userId,
    });

    try {
      // 1. Update actual export fields
      const result = await this.inventoryService.updateExpMestCabinetMedicineActualExportFieldsByHisIds(
        dto.hisIds,
        dto.actualExportTime,
        userId,
      );

      // 2. Fetch expMestId and emit events
      console.log('=== [SSE DEBUG] CABINET Actual Export: hisIds.length:', dto.hisIds.length);
      if (dto.hisIds.length > 0) {
        const medicines = await this.inventoryService.findExpMestCabinetMedicinesByHisIds([dto.hisIds[0]]);
        console.log('=== [SSE DEBUG] CABINET Actual Export: medicines found:', medicines.length);
        if (medicines.length > 0) {
          const expMestId = medicines[0].expMestId;
          console.log('=== [SSE DEBUG] CABINET Actual Export: expMestId identified:', expMestId);

          const summary = await this.getExpMestCabinetSummary(expMestId.toString());
          console.log('=== [SSE DEBUG] CABINET Actual Export: summary fetched, expMestCode:', summary.data?.expMestCode);

          console.log('=== [SSE DEBUG] CABINET Actual Export: Emitting exp-mest-cabinet.medicines.exported');
          this.eventEmitter.emit('exp-mest-cabinet.medicines.exported', {
            expMestId,
            expMestCode: summary.data?.expMestCode || '',
            userId,
            data: summary.data,
            timestamp: Date.now(),
          });

          await this.checkAndEmitExpMestCabinetWorkingStateUpdate(expMestId);
        }
      }

      return result;
    } catch (error: any) {
      this.logger.error('InventoryController#updateExpMestCabinetMedicineActualExportFields.error', {
        error: error.message,
        stack: error.stack,
      });
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Check if all medicines of ExpMestCabinet are exported/actual exported and update WORKING_STATE_ID parent
   * (Phase 1 Refactor: Call gRPC method instead of local logic)
   */
  private async checkAndEmitExpMestCabinetWorkingStateUpdate(expMestId: number): Promise<void> {
    this.logger.info('InventoryController#checkAndEmitExpMestCabinetWorkingStateUpdate.call', { expMestId });

    try {
      // Call gRPC method (Phase 1 Refactor)
      await this.inventoryService.checkAndUpdateExpMestCabinetWorkingState(expMestId);
    } catch (error: any) {
      this.logger.error('InventoryController#checkAndEmitExpMestCabinetWorkingStateUpdate.error', {
        expMestId,
        error: error.message
      });
      // Don't throw - this is a background operation
    }
  }

  /**
   * Check if all medicines of ExpMestOther are exported/actual exported and update WORKING_STATE_ID parent
   * (Phase 1 Refactor: Call gRPC method instead of local logic)
   */
  private async checkAndEmitExpMestOtherWorkingStateUpdate(expMestId: number): Promise<void> {
    this.logger.info('InventoryController#checkAndEmitExpMestOtherWorkingStateUpdate.call', { expMestId });

    try {
      // Call gRPC method (Phase 1 Refactor)
      await this.inventoryService.checkAndUpdateExpMestOtherWorkingState(expMestId);
    } catch (error: any) {
      this.logger.error('InventoryController#checkAndEmitExpMestOtherWorkingStateUpdate.error', {
        expMestId,
        error: error.message
      });
      // Don't throw - this is a background operation
    }
  }


}
