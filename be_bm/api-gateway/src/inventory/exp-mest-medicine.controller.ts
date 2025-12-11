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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';
import { Request } from 'express';

import { ExpMestMedicineService } from './exp-mest-medicine.service';
import { CreateExpMestMedicineDto } from './dto/create-exp-mest-medicine.dto';
import { UpdateExpMestMedicineDto } from './dto/update-exp-mest-medicine.dto';
import { ExpMestMedicineResponseDto } from './dto/exp-mest-medicine-response.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../common/dto/pagination-response.dto';

// Extend Express Request to include user property set by JwtAuthGuard
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

@ApiTags('inventory')
@Controller('inventory')
export class ExpMestMedicineController {
  constructor(
    private readonly expMestMedicineService: ExpMestMedicineService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ExpMestMedicineController.name);
  }

  @Get('exp-mest-medicines')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all export medicine detail records' })
  @ApiResponse({ status: 200, description: 'List of export medicine detail records', type: [ExpMestMedicineResponseDto] })
  async findAll(@Query() query: PaginationQueryDto): Promise<PaginatedResponseDto<ExpMestMedicineResponseDto>> {
    this.logger.info('ExpMestMedicineController#findAll.call', query);

    const grpcQuery: any = {
      offset: ((query.page || 1) - 1) * (query.limit || 25),
      limit: query.limit || 25,
    };

    if (query.q) {
      grpcQuery.where = JSON.stringify({
        $or: [
          { expMestCode: { $like: `%${query.q}%` } },
          { medicineTypeName: { $like: `%${query.q}%` } },
          { supplierName: { $like: `%${query.q}%` } },
        ],
      });
    }

    const medicines = await this.expMestMedicineService.findAll(grpcQuery);
    const totalItems = await this.expMestMedicineService.count(grpcQuery);
    const page = query.page || 1;
    const limit = query.limit || 25;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: medicines,
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

  @Get('exp-mest-medicines/:id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get export medicine detail record by ID' })
  @ApiParam({ name: 'id', description: 'ExpMestMedicine ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Export medicine detail record', type: ExpMestMedicineResponseDto })
  @ApiResponse({ status: 404, description: 'ExpMestMedicine not found' })
  async findById(@Param('id') id: string): Promise<ExpMestMedicineResponseDto> {
    this.logger.info('ExpMestMedicineController#findById.call', { id });
    return this.expMestMedicineService.findById(id);
  }

  @Get('exp-mest-medicines/by-his-id/:hisId')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get export medicine detail record by HIS ID' })
  @ApiParam({ name: 'hisId', description: 'HIS ID' })
  @ApiResponse({ status: 200, description: 'Export medicine detail record', type: ExpMestMedicineResponseDto })
  @ApiResponse({ status: 404, description: 'ExpMestMedicine not found' })
  async findByHisId(@Param('hisId') hisId: string): Promise<ExpMestMedicineResponseDto> {
    this.logger.info('ExpMestMedicineController#findByHisId.call', { hisId });
    const id = parseInt(hisId, 10);
    if (isNaN(id)) {
      throw new Error('Invalid HIS ID');
    }
    return this.expMestMedicineService.findByHisId(id);
  }

  @Get('exp-mests/:expMestId/medicines')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get export medicine detail records by ExpMest ID' })
  @ApiParam({ name: 'expMestId', description: 'ExpMest ID from HIS system' })
  @ApiResponse({ status: 200, description: 'List of export medicine detail records', type: [ExpMestMedicineResponseDto] })
  async findByExpMestId(@Param('expMestId') expMestId: string): Promise<ExpMestMedicineResponseDto[]> {
    this.logger.info('ExpMestMedicineController#findByExpMestId.call', { expMestId });
    const id = parseInt(expMestId, 10);
    if (isNaN(id)) {
      throw new Error('Invalid ExpMest ID');
    }
    return this.expMestMedicineService.findByExpMestId(id);
  }

  @Post('exp-mest-medicines')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create export medicine detail record' })
  @ApiResponse({ status: 201, description: 'Export medicine detail record created', type: ExpMestMedicineResponseDto })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDto: CreateExpMestMedicineDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<ExpMestMedicineResponseDto> {
    this.logger.info('ExpMestMedicineController#create.call', { hisId: createDto.hisId, expMestId: createDto.expMestId, userId: request.user?.id });
    const userId = request.user?.id;
    if (!userId) {
      this.logger.warn('ExpMestMedicineController#create: userId is missing from request.user');
    }
    return this.expMestMedicineService.create({ ...createDto, createdBy: userId || null });
  }

  @Put('exp-mest-medicines/:id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update export medicine detail record by ID' })
  @ApiParam({ name: 'id', description: 'ExpMestMedicine ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Export medicine detail record updated', type: ExpMestMedicineResponseDto })
  @ApiResponse({ status: 404, description: 'ExpMestMedicine not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateExpMestMedicineDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<ExpMestMedicineResponseDto> {
    this.logger.info('ExpMestMedicineController#update.call', { id, userId: request.user?.id });
    const userId = request.user?.id;
    if (!userId) {
      this.logger.warn('ExpMestMedicineController#update: userId is missing from request.user');
    }
    return this.expMestMedicineService.update(id, { ...updateDto, updatedBy: userId || null });
  }

  @Put('exp-mest-medicines/by-his-id/:hisId')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update export medicine detail record by HIS ID' })
  @ApiParam({ name: 'hisId', description: 'HIS ID' })
  @ApiResponse({ status: 200, description: 'Export medicine detail record updated', type: ExpMestMedicineResponseDto })
  @ApiResponse({ status: 404, description: 'ExpMestMedicine not found' })
  async updateByHisId(
    @Param('hisId') hisId: string,
    @Body() updateDto: UpdateExpMestMedicineDto,
    @Req() request: AuthenticatedRequest,
  ): Promise<ExpMestMedicineResponseDto> {
    this.logger.info('ExpMestMedicineController#updateByHisId.call', { hisId, userId: request.user?.id });
    
    const hisIdNum = parseInt(hisId, 10);
    if (isNaN(hisIdNum)) {
      throw new Error('Invalid HIS ID');
    }
    
    // Find the record by hisId to get the UUID
    const medicine = await this.expMestMedicineService.findByHisId(hisIdNum);
    if (!medicine) {
      throw new Error('ExpMestMedicine not found');
    }
    
    const userId = request.user?.id;
    if (!userId) {
      this.logger.warn('ExpMestMedicineController#updateByHisId: userId is missing from request.user');
    }
    
    // Update using the UUID
    return this.expMestMedicineService.update(medicine.id, { ...updateDto, updatedBy: userId || null });
  }

  @Delete('exp-mest-medicines/:id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete export medicine detail record' })
  @ApiParam({ name: 'id', description: 'ExpMestMedicine ID' })
  @ApiResponse({ status: 200, description: 'Export medicine detail record deleted' })
  @ApiResponse({ status: 404, description: 'ExpMestMedicine not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    this.logger.info('ExpMestMedicineController#delete.call', { id });
    await this.expMestMedicineService.delete(id);
  }
}

