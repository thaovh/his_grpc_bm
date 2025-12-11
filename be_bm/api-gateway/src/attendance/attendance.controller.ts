import { Controller, Get, Query, Param, Logger, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Resource } from '../common/decorators/resource.decorator';
import { AttendanceService } from './attendance.service';
import { lastValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('attendance')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
    private readonly logger = new Logger(AttendanceController.name);

    constructor(private readonly attendanceService: AttendanceService) { }

    private formatPaginatedResponse(result: { records: any[], total: number }, page: number, limit: number) {
        const totalItems = result.total;
        const totalPages = Math.ceil(totalItems / limit);

        return {
            data: result.records,
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

    @Get('me')
    @Resource('attendance')
    @ApiOperation({ summary: 'Find my attendance records (based on Token)' })
    @ApiQuery({ name: 'deviceId', required: false })
    @ApiQuery({ name: 'startDate', required: false })
    @ApiQuery({ name: 'endDate', required: false })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    async findMyAttendance(
        @Request() req,
        @Query('deviceId') deviceId?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const employeeCode = req.user?.employeeCode;
        this.logger.log(`GET /attendance/me - Finding attendance records for employee: ${employeeCode}`);

        if (!employeeCode) {
            this.logger.warn('Token missing employeeCode');
        }

        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 20;

        const query = {
            employeeCode,
            deviceId,
            startDate,
            endDate,
            page: pageNum,
            limit: limitNum,
        };

        const result = await lastValueFrom(this.attendanceService.findAll(query));
        return this.formatPaginatedResponse(result, pageNum, limitNum);
    }

    @Get()
    @Resource('attendance')
    @ApiOperation({ summary: 'Find all attendance records' })
    @ApiQuery({ name: 'employeeCode', required: false })
    @ApiQuery({ name: 'deviceId', required: false })
    @ApiQuery({ name: 'startDate', required: false })
    @ApiQuery({ name: 'endDate', required: false })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    async findAll(
        @Query('employeeCode') employeeCode?: string,
        @Query('deviceId') deviceId?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        this.logger.log('GET /attendance - Finding all attendance records');

        const pageNum = page ? parseInt(page, 10) : 1;
        const limitNum = limit ? parseInt(limit, 10) : 20;

        const query = {
            employeeCode,
            deviceId,
            startDate,
            endDate,
            page: pageNum,
            limit: limitNum,
        };

        const result = await lastValueFrom(this.attendanceService.findAll(query));
        return this.formatPaginatedResponse(result, pageNum, limitNum);
    }

    @Get('count')
    @Resource('attendance')
    @ApiOperation({ summary: 'Count attendance records' })
    @ApiQuery({ name: 'employeeCode', required: false })
    @ApiQuery({ name: 'deviceId', required: false })
    @ApiQuery({ name: 'startDate', required: false })
    @ApiQuery({ name: 'endDate', required: false })
    async count(
        @Query('employeeCode') employeeCode?: string,
        @Query('deviceId') deviceId?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        this.logger.log('GET /attendance/count - Counting attendance records');

        const query = {
            employeeCode,
            deviceId,
            startDate,
            endDate,
        };

        const result = await lastValueFrom(this.attendanceService.count(query));
        return result;
    }

    @Get(':id')
    @Resource('attendance')
    @ApiOperation({ summary: 'Find attendance record by ID' })
    @ApiParam({ name: 'id', description: 'Attendance Record ID (UUID)' })
    async findById(@Param('id') id: string) {
        this.logger.log(`GET /attendance/${id} - Finding attendance record by ID`);
        const result = await lastValueFrom(this.attendanceService.findById(id));
        return result;
    }
}
