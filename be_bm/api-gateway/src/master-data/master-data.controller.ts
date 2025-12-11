import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
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

import { Resource } from '../common/decorators/resource.decorator';
import { MasterDataService } from './master-data.service';
import { CreateUnitOfMeasureDto } from './dto/create-unit-of-measure.dto';
import { UpdateUnitOfMeasureDto } from './dto/update-unit-of-measure.dto';
import { UnitOfMeasureResponseDto } from './dto/unit-of-measure-response.dto';
import { CreateExportStatusDto } from './dto/create-export-status.dto';
import { UpdateExportStatusDto } from './dto/update-export-status.dto';
import { ExportStatusResponseDto } from './dto/export-status-response.dto';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { BranchResponseDto } from './dto/branch-response.dto';
import { CreateDepartmentTypeDto } from './dto/create-department-type.dto';
import { UpdateDepartmentTypeDto } from './dto/update-department-type.dto';
import { DepartmentTypeResponseDto } from './dto/department-type-response.dto';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentResponseDto } from './dto/department-response.dto';
import { CreateMachineFundingSourceDto } from './dto/create-machine-funding-source.dto';
import { UpdateMachineFundingSourceDto } from './dto/update-machine-funding-source.dto';
import { MachineFundingSourceResponseDto } from './dto/machine-funding-source-response.dto';
import { CreateManufacturerDto, UpdateManufacturerDto, ManufacturerResponseDto } from './dto/manufacturer.dto';
import { CreateManufacturerCountryDto, UpdateManufacturerCountryDto, ManufacturerCountryResponseDto } from './dto/manufacturer-country.dto';
import { CreateMachineDocumentTypeDto, UpdateMachineDocumentTypeDto, MachineDocumentTypeResponseDto } from './dto/machine-document-type.dto';
import { CreateMachineCategoryDto, UpdateMachineCategoryDto, MachineCategoryResponseDto } from './dto/machine-category.dto';
import { CreateMachineStatusDto, UpdateMachineStatusDto, MachineStatusResponseDto } from './dto/machine-status.dto';
import { CreateMachineUnitDto, UpdateMachineUnitDto, MachineUnitResponseDto } from './dto/machine-unit.dto';
import { CreateVendorDto, UpdateVendorDto, VendorResponseDto } from './dto/vendor.dto';
import { CreateMaintenanceTypeDto, UpdateMaintenanceTypeDto, MaintenanceTypeResponseDto } from './dto/maintenance-type.dto';
import { CreateTransferStatusDto, UpdateTransferStatusDto, TransferStatusResponseDto } from './dto/transfer-status.dto';
import { CreateTransferTypeDto, UpdateTransferTypeDto, TransferTypeResponseDto } from './dto/transfer-type.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../common/dto/pagination-response.dto';
import { CreateNotificationTypeDto } from './dto/create-notification-type.dto';
import { UpdateNotificationTypeDto } from './dto/update-notification-type.dto';
import { NotificationTypeResponseDto } from './dto/notification-type-response.dto';

// Extend Express Request to include user property set by JwtAuthGuard
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

@ApiTags('master-data')
@Controller('master-data')
export class MasterDataController {
  constructor(
    private readonly masterDataService: MasterDataService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(MasterDataController.name);
  }

  // Helper for pagination
  private async getPaginated<T>(
    method: string,
    query: PaginationQueryDto,
    countMethod: string,
  ): Promise<PaginatedResponseDto<T>> {
    const grpcQuery: any = {
      offset: ((query.page || 1) - 1) * (query.limit || 25),
      limit: query.limit || 25,
    };

    if (query.where) {
      grpcQuery.where = query.where;
    } else if (query.q) {
      grpcQuery.where = JSON.stringify({
        $or: [
          { code: { $like: `%${query.q}%` } },
          { name: { $like: `%${query.q}%` } },
        ],
      });
    }

    if (query.select) {
      grpcQuery.attributes = query.select.split(',').map(s => s.trim());
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

    const data = await this.masterDataService[method](grpcQuery);
    const totalItems = await this.masterDataService[countMethod](grpcQuery);
    const page = query.page || 1;
    const limit = query.limit || 25;
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
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

  // Unit of Measure endpoints
  @Get('unit-of-measures')
  @Resource('master-data.unit-of-measures')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all unit of measures' })
  @ApiResponse({ status: 200, type: [UnitOfMeasureResponseDto] })
  async findAllUnitOfMeasures(@Query() query: PaginationQueryDto) {
    return this.getPaginated<UnitOfMeasureResponseDto>('findAllUnitOfMeasures', query, 'countUnitOfMeasures');
  }

  @Get('unit-of-measures/:id')
  @Resource('master-data.unit-of-measures')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get unit of measure by ID' })
  async findUnitOfMeasureById(@Param('id') id: string) {
    return this.masterDataService.findUnitOfMeasureById(id);
  }

  @Post('unit-of-measures')
  @Resource('master-data.unit-of-measures')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create unit of measure' })
  @HttpCode(HttpStatus.CREATED)
  async createUnitOfMeasure(@Body() createDto: CreateUnitOfMeasureDto, @Req() req: AuthenticatedRequest) {
    return this.masterDataService.createUnitOfMeasure({ ...createDto, createdBy: req.user?.id });
  }

  @Put('unit-of-measures/:id')
  @Resource('master-data.unit-of-measures')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update unit of measure' })
  async updateUnitOfMeasure(@Param('id') id: string, @Body() updateDto: UpdateUnitOfMeasureDto, @Req() req: AuthenticatedRequest) {
    return this.masterDataService.updateUnitOfMeasure(id, { ...updateDto, updatedBy: req.user?.id });
  }

  @Delete('unit-of-measures/:id')
  @Resource('master-data.unit-of-measures')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete unit of measure' })
  async deleteUnitOfMeasure(@Param('id') id: string) {
    return this.masterDataService.deleteUnitOfMeasure(id);
  }

  // Export Status endpoints
  @Get('export-statuses')
  @Resource('master-data.export-statuses')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all export statuses' })
  @ApiResponse({ status: 200, type: [ExportStatusResponseDto] })
  async findAllExportStatuses(@Query() query: PaginationQueryDto) {
    return this.getPaginated<ExportStatusResponseDto>('findAllExportStatuses', query, 'countExportStatuses');
  }

  @Get('export-statuses/:id')
  @Resource('master-data.export-statuses')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get export status by ID' })
  async findExportStatusById(@Param('id') id: string) {
    return this.masterDataService.findExportStatusById(id);
  }

  @Post('export-statuses')
  @Resource('master-data.export-statuses')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create export status' })
  @HttpCode(HttpStatus.CREATED)
  async createExportStatus(@Body() createDto: CreateExportStatusDto, @Req() req: AuthenticatedRequest) {
    return this.masterDataService.createExportStatus({ ...createDto, createdBy: req.user?.id });
  }

  @Put('export-statuses/:id')
  @Resource('master-data.export-statuses')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update export status' })
  async updateExportStatus(@Param('id') id: string, @Body() updateDto: UpdateExportStatusDto, @Req() req: AuthenticatedRequest) {
    return this.masterDataService.updateExportStatus(id, { ...updateDto, updatedBy: req.user?.id });
  }

  @Delete('export-statuses/:id')
  @Resource('master-data.export-statuses')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete export status' })
  async deleteExportStatus(@Param('id') id: string) {
    return this.masterDataService.deleteExportStatus(id);
  }

  // Branch endpoints
  @Get('branches')
  @Resource('master-data.branches')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all branches' })
  @ApiResponse({ status: 200, type: [BranchResponseDto] })
  async findAllBranches(@Query() query: PaginationQueryDto) {
    return this.getPaginated<BranchResponseDto>('findAllBranches', query, 'countBranches');
  }

  @Get('branches/:id')
  @Resource('master-data.branches')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get branch by ID' })
  async findBranchById(@Param('id') id: string) {
    return this.masterDataService.findBranchById(id);
  }

  @Post('branches')
  @Resource('master-data.branches')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create branch' })
  @HttpCode(HttpStatus.CREATED)
  async createBranch(@Body() createDto: CreateBranchDto, @Req() req: AuthenticatedRequest) {
    return this.masterDataService.createBranch({ ...createDto, createdBy: req.user?.id });
  }

  @Put('branches/:id')
  @Resource('master-data.branches')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update branch' })
  async updateBranch(@Param('id') id: string, @Body() updateDto: UpdateBranchDto, @Req() req: AuthenticatedRequest) {
    return this.masterDataService.updateBranch(id, { ...updateDto, updatedBy: req.user?.id });
  }

  @Delete('branches/:id')
  @Resource('master-data.branches')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete branch' })
  async deleteBranch(@Param('id') id: string) {
    return this.masterDataService.deleteBranch(id);
  }

  // Department Type endpoints
  @Get('department-types')
  @Resource('master-data.department-types')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all department types' })
  @ApiResponse({ status: 200, type: [DepartmentTypeResponseDto] })
  async findAllDepartmentTypes(@Query() query: PaginationQueryDto) {
    return this.getPaginated<DepartmentTypeResponseDto>('findAllDepartmentTypes', query, 'countDepartmentTypes');
  }

  @Get('department-types/:id')
  @Resource('master-data.department-types')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get department type by ID' })
  async findDepartmentTypeById(@Param('id') id: string) {
    return this.masterDataService.findDepartmentTypeById(id);
  }

  @Post('department-types')
  @Resource('master-data.department-types')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create department type' })
  @HttpCode(HttpStatus.CREATED)
  async createDepartmentType(@Body() createDto: CreateDepartmentTypeDto, @Req() req: AuthenticatedRequest) {
    return this.masterDataService.createDepartmentType({ ...createDto, createdBy: req.user?.id });
  }

  @Put('department-types/:id')
  @Resource('master-data.department-types')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update department type' })
  async updateDepartmentType(@Param('id') id: string, @Body() updateDto: UpdateDepartmentTypeDto, @Req() req: AuthenticatedRequest) {
    return this.masterDataService.updateDepartmentType(id, { ...updateDto, updatedBy: req.user?.id });
  }

  @Delete('department-types/:id')
  @Resource('master-data.department-types')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete department type' })
  async deleteDepartmentType(@Param('id') id: string) {
    return this.masterDataService.deleteDepartmentType(id);
  }

  // Department endpoints
  @Get('departments')
  @Resource('master-data.departments')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all departments' })
  @ApiResponse({ status: 200, type: [DepartmentResponseDto] })
  async findAllDepartments(@Query() query: PaginationQueryDto) {
    return this.getPaginated<DepartmentResponseDto>('findAllDepartments', query, 'countDepartments');
  }

  @Get('departments/:id')
  @Resource('master-data.departments')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get department by ID' })
  async findDepartmentById(@Param('id') id: string) {
    return this.masterDataService.findDepartmentById(id);
  }

  @Post('departments')
  @Resource('master-data.departments')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create department' })
  @HttpCode(HttpStatus.CREATED)
  async createDepartment(@Body() createDto: CreateDepartmentDto, @Req() req: AuthenticatedRequest) {
    return this.masterDataService.createDepartment({ ...createDto, createdBy: req.user?.id });
  }

  @Put('departments/:id')
  @Resource('master-data.departments')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update department' })
  async updateDepartment(@Param('id') id: string, @Body() updateDto: UpdateDepartmentDto, @Req() req: AuthenticatedRequest) {
    return this.masterDataService.updateDepartment(id, { ...updateDto, updatedBy: req.user?.id });
  }

  @Delete('departments/:id')
  @Resource('master-data.departments')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete department' })
  async deleteDepartment(@Param('id') id: string) {
    return this.masterDataService.deleteDepartment(id);
  }

  // Machine Funding Source endpoints
  @Get('machine-funding-sources')
  @Resource('master-data.machine-funding-sources')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all machine funding sources' })
  @ApiResponse({ status: 200, type: [MachineFundingSourceResponseDto] })
  async findAllMachineFundingSources(@Query() query: PaginationQueryDto) {
    return this.getPaginated<MachineFundingSourceResponseDto>('findAllMachineFundingSources', query, 'countMachineFundingSources');
  }

  @Get('machine-funding-sources/:id')
  @Resource('master-data.machine-funding-sources')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get machine funding source by ID' })
  async findMachineFundingSourceById(@Param('id') id: string) {
    return this.masterDataService.findMachineFundingSourceById(id);
  }

  @Post('machine-funding-sources')
  @Resource('master-data.machine-funding-sources')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create machine funding source' })
  @HttpCode(HttpStatus.CREATED)
  async createMachineFundingSource(@Body() createDto: CreateMachineFundingSourceDto, @Req() req: AuthenticatedRequest) {
    return this.masterDataService.createMachineFundingSource({ ...createDto, createdBy: req.user?.id });
  }

  @Put('machine-funding-sources/:id')
  @Resource('master-data.machine-funding-sources')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update machine funding source' })
  async updateMachineFundingSource(@Param('id') id: string, @Body() updateDto: UpdateMachineFundingSourceDto, @Req() req: AuthenticatedRequest) {
    return this.masterDataService.updateMachineFundingSource(id, { ...updateDto, updatedBy: req.user?.id });
  }

  @Delete('machine-funding-sources/:id')
  @Resource('master-data.machine-funding-sources')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete machine funding source' })
  async deleteMachineFundingSource(@Param('id') id: string) {
    return this.masterDataService.deleteMachineFundingSource(id);
  }

  // Manufacturer endpoints
  @Get('manufacturers')
  @Resource('master-data.manufacturers')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all manufacturers' })
  @ApiResponse({ status: 200, type: [ManufacturerResponseDto] })
  async findAllManufacturers(@Query() query: PaginationQueryDto) {
    return this.getPaginated<ManufacturerResponseDto>('findAllManufacturers', query, 'countManufacturers');
  }

  @Get('manufacturers/:id')
  @Resource('master-data.manufacturers')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get manufacturer by ID' })
  @ApiResponse({ status: 200, type: ManufacturerResponseDto })
  async findManufacturerById(@Param('id') id: string) {
    return this.masterDataService.findManufacturerById(id);
  }

  @Post('manufacturers')
  @Resource('master-data.manufacturers')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create manufacturer' })
  @HttpCode(HttpStatus.CREATED)
  async createManufacturer(@Body() createDto: CreateManufacturerDto, @Req() req: AuthenticatedRequest) {
    return this.masterDataService.createManufacturer({ ...createDto, createdBy: req.user?.id });
  }

  @Put('manufacturers/:id')
  @Resource('master-data.manufacturers')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update manufacturer' })
  async updateManufacturer(@Param('id') id: string, @Body() updateDto: UpdateManufacturerDto, @Req() req: AuthenticatedRequest) {
    return this.masterDataService.updateManufacturer(id, { ...updateDto, updatedBy: req.user?.id });
  }

  @Delete('manufacturers/:id')
  @Resource('master-data.manufacturers')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete manufacturer' })
  async deleteManufacturer(@Param('id') id: string) {
    return this.masterDataService.deleteManufacturer(id);
  }

  // Manufacturer Country endpoints
  @Get('manufacturer-countries')
  @Resource('master-data.manufacturer-countries')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all manufacturer countries' })
  @ApiResponse({ status: 200, type: [ManufacturerCountryResponseDto] })
  async findAllManufacturerCountries(@Query() query: PaginationQueryDto) {
    return this.getPaginated<ManufacturerCountryResponseDto>('findAllManufacturerCountries', query, 'countManufacturerCountries');
  }

  @Get('manufacturer-countries/:id')
  @Resource('master-data.manufacturer-countries')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get manufacturer country by ID' })
  @ApiResponse({ status: 200, type: ManufacturerCountryResponseDto })
  async findManufacturerCountryById(@Param('id') id: string) {
    return this.masterDataService.findManufacturerCountryById(id);
  }

  @Post('manufacturer-countries')
  @Resource('master-data.manufacturer-countries')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create manufacturer country' })
  @HttpCode(HttpStatus.CREATED)
  async createManufacturerCountry(@Body() createDto: CreateManufacturerCountryDto, @Req() req: AuthenticatedRequest) {
    return this.masterDataService.createManufacturerCountry({ ...createDto, createdBy: req.user?.id });
  }

  @Patch('manufacturer-countries/:id')
  @Resource('master-data.manufacturer-countries')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update manufacturer country' })
  async updateManufacturerCountry(@Param('id') id: string, @Body() updateDto: UpdateManufacturerCountryDto, @Req() req: AuthenticatedRequest) {
    return this.masterDataService.updateManufacturerCountry(id, { ...updateDto, updatedBy: req.user?.id });
  }

  @Delete('manufacturer-countries/:id')
  @Resource('master-data.manufacturer-countries')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete manufacturer country' })
  async deleteManufacturerCountry(@Param('id') id: string) {
    return this.masterDataService.deleteManufacturerCountry(id);
  }

  // Machine Document Type endpoints
  @Get('machine-document-types')
  @Resource('master-data.machine-document-types')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all machine document types' })
  @ApiResponse({ status: 200, type: [MachineDocumentTypeResponseDto] })
  async findAllMachineDocumentTypes(@Query() query: PaginationQueryDto) {
    return this.getPaginated<MachineDocumentTypeResponseDto>('findAllMachineDocumentTypes', query, 'countMachineDocumentTypes');
  }

  @Get('machine-document-types/:id')
  @Resource('master-data.machine-document-types')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get machine document type by ID' })
  @ApiResponse({ status: 200, type: MachineDocumentTypeResponseDto })
  async findMachineDocumentTypeById(@Param('id') id: string) {
    return this.masterDataService.findMachineDocumentTypeById(id);
  }

  @Post('machine-document-types')
  @Resource('master-data.machine-document-types')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create machine document type' })
  @HttpCode(HttpStatus.CREATED)
  async createMachineDocumentType(@Body() createDto: CreateMachineDocumentTypeDto, @Req() req: AuthenticatedRequest) {
    return this.masterDataService.createMachineDocumentType({ ...createDto, createdBy: req.user?.id });
  }

  @Patch('machine-document-types/:id')
  @Resource('master-data.machine-document-types')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update machine document type' })
  async updateMachineDocumentType(@Param('id') id: string, @Body() updateDto: UpdateMachineDocumentTypeDto, @Req() req: AuthenticatedRequest) {
    return this.masterDataService.updateMachineDocumentType(id, { ...updateDto, updatedBy: req.user?.id });
  }

  @Delete('machine-document-types/:id')
  @Resource('master-data.machine-document-types')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete machine document type' })
  async deleteMachineDocumentType(@Param('id') id: string) {
    return this.masterDataService.deleteMachineDocumentType(id);
  }

  // Machine Category endpoints
  @Get('machine-categories')
  @Resource('master-data.machine-categories')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all machine categories' })
  @ApiResponse({ status: 200, type: [MachineCategoryResponseDto] })
  async findAllMachineCategories(@Query() query: PaginationQueryDto) {
    return this.getPaginated<MachineCategoryResponseDto>('findAllMachineCategories', query, 'countMachineCategories');
  }

  @Get('machine-categories/:id')
  @Resource('master-data.machine-categories')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get machine category by ID' })
  @ApiResponse({ status: 200, type: MachineCategoryResponseDto })
  async findMachineCategoryById(@Param('id') id: string) {
    return this.masterDataService.findMachineCategoryById(id);
  }

  @Post('machine-categories')
  @Resource('master-data.machine-categories')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create machine category' })
  @HttpCode(HttpStatus.CREATED)
  async createMachineCategory(@Body() createDto: CreateMachineCategoryDto, @Req() req: AuthenticatedRequest) {
    return this.masterDataService.createMachineCategory({ ...createDto, createdBy: req.user?.id });
  }

  @Patch('machine-categories/:id')
  @Resource('master-data.machine-categories')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update machine category' })
  async updateMachineCategory(@Param('id') id: string, @Body() updateDto: UpdateMachineCategoryDto, @Req() req: AuthenticatedRequest) {
    return this.masterDataService.updateMachineCategory(id, { ...updateDto, updatedBy: req.user?.id });
  }

  @Delete('machine-categories/:id')
  @Resource('master-data.machine-categories')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete machine category' })
  async deleteMachineCategory(@Param('id') id: string) {
    return this.masterDataService.deleteMachineCategory(id);
  }

  // Machine Status endpoints
  @Get('machine-statuses')
  @Resource('master-data.machine-statuses')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all machine statuses' })
  @ApiResponse({ status: 200, type: [MachineStatusResponseDto] })
  async findAllMachineStatuses(@Query() query: PaginationQueryDto) {
    return this.getPaginated<MachineStatusResponseDto>('findAllMachineStatuses', query, 'countMachineStatuses');
  }

  @Get('machine-statuses/:id')
  @Resource('master-data.machine-statuses')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get machine status by ID' })
  @ApiResponse({ status: 200, type: MachineStatusResponseDto })
  async findMachineStatusById(@Param('id') id: string) {
    return this.masterDataService.findMachineStatusById(id);
  }

  @Post('machine-statuses')
  @Resource('master-data.machine-statuses')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create machine status' })
  @HttpCode(HttpStatus.CREATED)
  async createMachineStatus(@Body() createDto: CreateMachineStatusDto, @Req() req: AuthenticatedRequest) {
    return this.masterDataService.createMachineStatus({ ...createDto, createdBy: req.user?.id });
  }

  @Patch('machine-statuses/:id')
  @Resource('master-data.machine-statuses')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update machine status' })
  async updateMachineStatus(@Param('id') id: string, @Body() updateDto: UpdateMachineStatusDto, @Req() req: AuthenticatedRequest) {
    return this.masterDataService.updateMachineStatus(id, { ...updateDto, updatedBy: req.user?.id });
  }

  @Delete('machine-statuses/:id')
  @Resource('master-data.machine-statuses')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete machine status' })
  async deleteMachineStatus(@Param('id') id: string) {
    return this.masterDataService.deleteMachineStatus(id);
  }

  // Machine Unit endpoints
  @Get('machine-units')
  @Resource('master-data.machine-units')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all machine units' })
  @ApiResponse({ status: 200, type: [MachineUnitResponseDto] })
  async findAllMachineUnits(@Query() query: PaginationQueryDto) {
    return this.getPaginated<MachineUnitResponseDto>('findAllMachineUnits', query, 'countMachineUnits');
  }

  @Get('machine-units/:id')
  @Resource('master-data.machine-units')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get machine unit by ID' })
  @ApiResponse({ status: 200, type: MachineUnitResponseDto })
  async findMachineUnitById(@Param('id') id: string) {
    return this.masterDataService.findMachineUnitById(id);
  }

  @Post('machine-units')
  @Resource('master-data.machine-units')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create machine unit' })
  @HttpCode(HttpStatus.CREATED)
  async createMachineUnit(@Body() createDto: CreateMachineUnitDto, @Req() req: AuthenticatedRequest) {
    return this.masterDataService.createMachineUnit({ ...createDto, createdBy: req.user?.id });
  }

  @Patch('machine-units/:id')
  @Resource('master-data.machine-units')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update machine unit' })
  async updateMachineUnit(@Param('id') id: string, @Body() updateDto: UpdateMachineUnitDto, @Req() req: AuthenticatedRequest) {
    return this.masterDataService.updateMachineUnit(id, { ...updateDto, updatedBy: req.user?.id });
  }

  @Delete('machine-units/:id')
  @Resource('master-data.machine-units')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete machine unit' })
  async deleteMachineUnit(@Param('id') id: string) {
    return this.masterDataService.deleteMachineUnit(id);
  }

  // Vendor endpoints
  @Get('vendors')
  @Resource('master-data.vendors')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all vendors' })
  @ApiResponse({ status: 200, type: [VendorResponseDto] })
  async findAllVendors(@Query() query: PaginationQueryDto) {
    return this.getPaginated<VendorResponseDto>('findAllVendors', query, 'countVendors');
  }

  @Get('vendors/:id')
  @Resource('master-data.vendors')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get vendor by ID' })
  @ApiResponse({ status: 200, type: VendorResponseDto })
  async findVendorById(@Param('id') id: string) {
    return this.masterDataService.findVendorById(id);
  }

  @Post('vendors')
  @Resource('master-data.vendors')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create vendor' })
  @HttpCode(HttpStatus.CREATED)
  async createVendor(@Body() createDto: CreateVendorDto, @Req() req: AuthenticatedRequest) {
    return this.masterDataService.createVendor({ ...createDto, createdBy: req.user?.id });
  }

  @Patch('vendors/:id')
  @Resource('master-data.vendors')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update vendor' })
  async updateVendor(@Param('id') id: string, @Body() updateDto: UpdateVendorDto, @Req() req: AuthenticatedRequest) {
    return this.masterDataService.updateVendor(id, { ...updateDto, updatedBy: req.user?.id });
  }

  @Delete('vendors/:id')
  @Resource('master-data.vendors')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete vendor' })
  async deleteVendor(@Param('id') id: string) {
    return this.masterDataService.deleteVendor(id);
  }

  // Maintenance Type endpoints
  @Get('maintenance-types')
  @Resource('master-data.maintenance-types')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all maintenance types' })
  @ApiResponse({ status: 200, type: [MaintenanceTypeResponseDto] })
  async findAllMaintenanceTypes(@Query() query: PaginationQueryDto) {
    return this.getPaginated<MaintenanceTypeResponseDto>('findAllMaintenanceTypes', query, 'countMaintenanceTypes');
  }

  @Get('maintenance-types/:id')
  @Resource('master-data.maintenance-types')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get maintenance type by ID' })
  @ApiResponse({ status: 200, type: MaintenanceTypeResponseDto })
  async findMaintenanceTypeById(@Param('id') id: string) {
    return this.masterDataService.findMaintenanceTypeById(id);
  }

  @Post('maintenance-types')
  @Resource('master-data.maintenance-types')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create maintenance type' })
  @HttpCode(HttpStatus.CREATED)
  async createMaintenanceType(@Body() createDto: CreateMaintenanceTypeDto, @Req() req: AuthenticatedRequest) {
    return this.masterDataService.createMaintenanceType({ ...createDto, createdBy: req.user?.id });
  }

  @Patch('maintenance-types/:id')
  @Resource('master-data.maintenance-types')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update maintenance type' })
  async updateMaintenanceType(@Param('id') id: string, @Body() updateDto: UpdateMaintenanceTypeDto, @Req() req: AuthenticatedRequest) {
    return this.masterDataService.updateMaintenanceType(id, { ...updateDto, updatedBy: req.user?.id });
  }

  @Delete('maintenance-types/:id')
  @Resource('master-data.maintenance-types')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete maintenance type' })
  async deleteMaintenanceType(@Param('id') id: string) {
    return this.masterDataService.deleteMaintenanceType(id);
  }

  // Transfer Status endpoints
  @Get('transfer-statuses')
  @Resource('master-data.transfer-statuses')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all transfer statuses' })
  @ApiResponse({ status: 200, type: [TransferStatusResponseDto] })
  async findAllTransferStatuses(@Query() query: PaginationQueryDto) {
    return this.getPaginated<TransferStatusResponseDto>('findAllTransferStatuses', query, 'countTransferStatuses');
  }

  @Get('transfer-statuses/:id')
  @Resource('master-data.transfer-statuses')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get transfer status by ID' })
  async findTransferStatusById(@Param('id') id: string) {
    return this.masterDataService.findTransferStatusById(id);
  }

  @Post('transfer-statuses')
  @Resource('master-data.transfer-statuses')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create transfer status' })
  @HttpCode(HttpStatus.CREATED)
  async createTransferStatus(@Body() createDto: CreateTransferStatusDto, @Req() req: AuthenticatedRequest) {
    return this.masterDataService.createTransferStatus({ ...createDto, createdBy: req.user?.id });
  }

  @Patch('transfer-statuses/:id')
  @Resource('master-data.transfer-statuses')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update transfer status' })
  async updateTransferStatus(@Param('id') id: string, @Body() updateDto: UpdateTransferStatusDto, @Req() req: AuthenticatedRequest) {
    return this.masterDataService.updateTransferStatus(id, { ...updateDto, updatedBy: req.user?.id });
  }

  @Delete('transfer-statuses/:id')
  @Resource('master-data.transfer-statuses')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete transfer status' })
  async deleteTransferStatus(@Param('id') id: string) {
    return this.masterDataService.deleteTransferStatus(id);
  }

  // Transfer Type endpoints
  @Get('transfer-types')
  @Resource('master-data.transfer-types')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all transfer types' })
  @ApiResponse({ status: 200, type: [TransferTypeResponseDto] })
  async findAllTransferTypes(@Query() query: PaginationQueryDto) {
    return this.getPaginated<TransferTypeResponseDto>('findAllTransferTypes', query, 'countTransferTypes');
  }

  @Get('transfer-types/:id')
  @Resource('master-data.transfer-types')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get transfer type by ID' })
  async findTransferTypeById(@Param('id') id: string) {
    return this.masterDataService.findTransferTypeById(id);
  }

  @Post('transfer-types')
  @Resource('master-data.transfer-types')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create transfer type' })
  @HttpCode(HttpStatus.CREATED)
  async createTransferType(@Body() createDto: CreateTransferTypeDto, @Req() req: AuthenticatedRequest) {
    return this.masterDataService.createTransferType({ ...createDto, createdBy: req.user?.id });
  }

  @Patch('transfer-types/:id')
  @Resource('master-data.transfer-types')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update transfer type' })
  async updateTransferType(@Param('id') id: string, @Body() updateDto: UpdateTransferTypeDto, @Req() req: AuthenticatedRequest) {
    return this.masterDataService.updateTransferType(id, { ...updateDto, updatedBy: req.user?.id });
  }

  @Delete('transfer-types/:id')
  @Resource('master-data.transfer-types')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete transfer type' })
  async deleteTransferType(@Param('id') id: string) {
    return this.masterDataService.deleteTransferType(id);
  }
  // Notification Type endpoints
  @Get('notification-types')
  @Resource('master-data.notification-types')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all notification types' })
  @ApiResponse({ status: 200, type: [NotificationTypeResponseDto] })
  async findAllNotificationTypes(@Query() query: PaginationQueryDto) {
    return this.getPaginated<NotificationTypeResponseDto>('findAllNotificationTypes', query, 'countNotificationTypes');
  }

  @Get('notification-types/:id')
  @Resource('master-data.notification-types')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get notification type by ID' })
  @ApiResponse({ status: 200, type: NotificationTypeResponseDto })
  async findNotificationTypeById(@Param('id') id: string) {
    return this.masterDataService.findNotificationTypeById(id);
  }

  @Post('notification-types')
  @Resource('master-data.notification-types')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create notification type' })
  @HttpCode(HttpStatus.CREATED)
  async createNotificationType(@Body() createDto: CreateNotificationTypeDto, @Req() req: AuthenticatedRequest) {
    return this.masterDataService.createNotificationType({ ...createDto, createdBy: req.user?.id });
  }

  @Patch('notification-types/:id')
  @Resource('master-data.notification-types')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update notification type' })
  async updateNotificationType(@Param('id') id: string, @Body() updateDto: UpdateNotificationTypeDto, @Req() req: AuthenticatedRequest) {
    return this.masterDataService.updateNotificationType(id, { ...updateDto, updatedBy: req.user?.id });
  }

  @Delete('notification-types/:id')
  @Resource('master-data.notification-types')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete notification type' })
  async deleteNotificationType(@Param('id') id: string) {
    return this.masterDataService.deleteNotificationType(id);
  }
}
