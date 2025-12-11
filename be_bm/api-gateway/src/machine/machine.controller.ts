import { Controller, Get, Post, Patch, Delete, Body, Param, Query, HttpCode, HttpStatus, OnModuleInit } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Resource } from '../common/decorators/resource.decorator';
import { firstValueFrom } from 'rxjs';
import { MachineService } from './machine.service';
import { MasterDataService } from '../master-data/master-data.service';
import { CreateMachineDto, UpdateMachineDto, MachineResponseDto, MachineListResponseDto } from './dto/machine.dto';
import { CreateMaintenanceRecordDto, UpdateMaintenanceRecordDto, MaintenanceRecordResponseDto, MaintenanceRecordListResponseDto } from './dto/maintenance.dto';
import { CreateMachineDocumentDto, UpdateMachineDocumentDto, MachineDocumentResponseDto, MachineDocumentListResponseDto } from './dto/document.dto';
import { CreateTransferDto, UpdateTransferDto, TransferResponseDto, TransferListResponseDto } from './dto/transfer.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../common/dto/pagination-response.dto';

@ApiTags('Machines')
@ApiBearerAuth('JWT-auth')
@Controller('machines')
export class MachineController {
    constructor(
        private readonly service: MachineService,
        private readonly masterDataService: MasterDataService,
    ) { }

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

        if (query.q) {
            grpcQuery.where = JSON.stringify({
                $or: [
                    { code: { $like: `%${query.q}%` } },
                    { name: { $like: `%${query.q}%` } },
                ],
            });
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

        if (query.where) {
            grpcQuery.where = query.where;
        }

        const data = await firstValueFrom(this.service[method](grpcQuery)) as any;
        const countResult = await firstValueFrom(this.service[countMethod](grpcQuery)) as any;
        let items = data.data || [];

        // Data Enrichment
        if (items.length > 0 && method === 'findAllMachines') {
            items = await this.enrichMachines(items);
        }

        const totalItems = countResult.count || 0;
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

    private async enrichMachines(machines: any[]) {
        const [
            categories,
            statuses,
            units,
            vendors,
            countries,
            fundingSources,
            branches,
            departments,
            manufacturers,
        ] = await Promise.all([
            this.masterDataService.findAllMachineCategories(),
            this.masterDataService.findAllMachineStatuses(),
            this.masterDataService.findAllMachineUnits(),
            this.masterDataService.findAllVendors(),
            this.masterDataService.findAllManufacturerCountries(),
            this.masterDataService.findAllMachineFundingSources(),
            this.masterDataService.findAllBranches(),
            this.masterDataService.findAllDepartments(),
            this.masterDataService.findAllManufacturers(),
        ]);

        const mapById = (list: any[]) => new Map(list.map((item) => [item.id, item]));
        const catMap = mapById(categories);
        const statusMap = mapById(statuses);
        const unitMap = mapById(units);
        const vendorMap = mapById(vendors);
        const countryMap = mapById(countries);
        const fundingMap = mapById(fundingSources);
        const branchMap = mapById(branches);
        const deptMap = mapById(departments);
        const manufacturerMap = mapById(manufacturers);

        if (machines.length > 0) {
            console.log('Enrichment Debug:', {
                firstMachineCode: machines[0].code,
                firstMachineBranchId: machines[0].branchId,
                firstMachineDeptId: machines[0].departmentId,
                firstMachineManufacturerId: machines[0].manufacturerId,
                manufacturerMapSize: manufacturerMap.size,
                manufacturerMapKeys: Array.from(manufacturerMap.keys()),
                branchMapSize: branchMap.size,
                deptMapSize: deptMap.size,
                branchExists: branchMap.has(machines[0].branchId),
                deptExists: deptMap.has(machines[0].departmentId),
                manufacturerExists: manufacturerMap.has(machines[0].manufacturerId),
            });
        }

        return machines.map((m) => ({
            ...m,
            category: m.categoryId ? catMap.get(m.categoryId) : null,
            status: m.statusId ? statusMap.get(m.statusId) : null,
            unit: m.unitId ? unitMap.get(m.unitId) : null,
            vendor: m.vendorId ? vendorMap.get(m.vendorId) : null,
            manufacturerCountry: m.manufacturerCountryId ? countryMap.get(m.manufacturerCountryId) : null,
            fundingSource: m.fundingSourceId ? fundingMap.get(m.fundingSourceId) : null,
            branch: m.branchId ? branchMap.get(m.branchId) : null,
            department: m.departmentId ? deptMap.get(m.departmentId) : null,
            manufacturer: m.manufacturerId ? manufacturerMap.get(m.manufacturerId) : null,
        }));
    }

    @Get()
    @Resource('machines')
    @ApiOperation({ summary: 'Get all machines' })
    @ApiResponse({ status: 200, type: MachineListResponseDto })
    async findAllMachines(@Query() query: PaginationQueryDto) {
        return this.getPaginated<MachineResponseDto>('findAllMachines', query, 'countMachines');
    }

    @Get(':id')
    @Resource('machines')
    @ApiOperation({ summary: 'Get machine by ID' })
    @ApiResponse({ status: 200, type: MachineResponseDto })
    async findMachineById(@Param('id') id: string) {
        const machine = await firstValueFrom(this.service.findMachineById(id));
        if (machine) {
            const enriched = await this.enrichMachines([machine]);
            return enriched[0];
        }
        return machine;
    }

    @Post()
    @Resource('machines')
    @ApiOperation({ summary: 'Create new machine' })
    @ApiResponse({ status: 201, type: MachineResponseDto })
    async createMachine(@Body() dto: CreateMachineDto) {
        // Automatically infer branchId from departmentId if provided but branchId is missing
        if (dto.departmentId && !dto.branchId) {
            console.log('Inferring branchId for department:', dto.departmentId);
            const departments = await this.masterDataService.findAllDepartments();
            console.log(`Found ${departments.length} departments for inference`);
            const dept = departments.find(d => d.id === dto.departmentId);
            if (dept) {
                console.log('Found department:', dept.name, 'with branchId:', dept.branchId);
                dto.branchId = dept.branchId;
            } else {
                console.warn('Department not found for inference:', dto.departmentId);
            }
        }
        return this.service.createMachine(dto);
    }

    @Patch(':id')
    @Resource('machines')
    @ApiOperation({ summary: 'Update machine' })
    @ApiResponse({ status: 200, type: MachineResponseDto })
    async updateMachine(@Param('id') id: string, @Body() dto: UpdateMachineDto) {
        return this.service.updateMachine({ ...dto, id });
    }

    @Delete(':id')
    @Resource('machines')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete machine' })
    async destroyMachine(@Param('id') id: string) {
        return this.service.destroyMachine({ where: JSON.stringify({ id }) });
    }

    // Maintenance Endpoints
    @Get(':id/maintenance')
    @Resource('machines')
    @ApiOperation({ summary: 'Get maintenance records for a machine' })
    @ApiResponse({ status: 200, type: MaintenanceRecordListResponseDto })
    async findAllMaintenanceRecords(@Param('id') id: string, @Query() query: PaginationQueryDto) {
        query.where = JSON.stringify({ machineId: id });
        return this.getPaginated<MaintenanceRecordResponseDto>('findAllMaintenanceRecords', query, 'countMaintenanceRecords');
    }

    @Post('maintenance')
    @Resource('machines')
    @ApiOperation({ summary: 'Create maintenance record' })
    @ApiResponse({ status: 201, type: MaintenanceRecordResponseDto })
    async createMaintenanceRecord(@Body() dto: CreateMaintenanceRecordDto) {
        return this.service.createMaintenanceRecord(dto);
    }

    // Document Endpoints
    @Get(':id/documents')
    @Resource('machines')
    @ApiOperation({ summary: 'Get documents for a machine' })
    @ApiResponse({ status: 200, type: MachineDocumentListResponseDto })
    async findAllMachineDocuments(@Param('id') id: string, @Query() query: PaginationQueryDto) {
        query.where = JSON.stringify({ machineId: id });
        return this.getPaginated<MachineDocumentResponseDto>('findAllMachineDocuments', query, 'countMachineDocuments');
    }

    @Post('documents')
    @Resource('machines')
    @ApiOperation({ summary: 'Add document/photo to machine' })
    @ApiResponse({ status: 201, type: MachineDocumentResponseDto })
    async createMachineDocument(@Body() dto: CreateMachineDocumentDto) {
        return this.service.createMachineDocument(dto);
    }

    // Transfer Endpoints
    @Get(':id/transfers')
    @Resource('machines')
    @ApiOperation({ summary: 'Get transfer history for a machine' })
    @ApiResponse({ status: 200, type: TransferListResponseDto })
    async findAllTransfers(@Param('id') id: string, @Query() query: PaginationQueryDto) {
        query.where = JSON.stringify({ machineId: id });
        return this.getPaginated<TransferResponseDto>('findAllTransfers', query, 'countTransfers');
    }

    @Post('transfers')
    @Resource('machines')
    @ApiOperation({ summary: 'Create machine transfer' })
    @ApiResponse({ status: 201, type: TransferResponseDto })
    async createTransfer(@Body() dto: CreateTransferDto) {
        return this.service.createTransfer(dto);
    }

    @Patch('transfers/:id')
    @Resource('machines')
    @ApiOperation({ summary: 'Update machine transfer' })
    @ApiResponse({ status: 200, type: TransferResponseDto })
    async updateTransfer(@Param('id') id: string, @Body() dto: UpdateTransferDto) {
        return this.service.updateTransfer({ ...dto, id });
    }

    @Delete('transfers/:id')
    @Resource('machines')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete machine transfer' })
    async destroyTransfer(@Param('id') id: string) {
        return this.service.destroyTransfer({ where: JSON.stringify({ id }) });
    }
}
