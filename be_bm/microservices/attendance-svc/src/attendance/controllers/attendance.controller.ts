import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AttendanceService } from '../services/attendance.service';

@Controller()
export class AttendanceController {
    private readonly logger = new Logger(AttendanceController.name);

    constructor(private readonly attendanceService: AttendanceService) { }

    @GrpcMethod('AttendanceService', 'FindAll')
    async findAll(query: any) {
        this.logger.log('gRPC FindAll called');
        const result = await this.attendanceService.findAll({
            employeeCode: query.employeeCode,
            deviceId: query.deviceId,
            startDate: query.startDate,
            endDate: query.endDate,
            page: query.page || 1,
            limit: query.limit || 20,
        });

        return {
            records: result.records.map((r: any) => ({ // Cast to any to access injected device property
                id: r.id,
                employeeCode: r.employeeCode,
                deviceId: r.deviceId,
                eventType: r.eventType,
                eventTimestamp: typeof r.eventTimestamp === 'string' ? r.eventTimestamp : r.eventTimestamp.toISOString(), // Handle potential string or Date
                imageUrl: r.imageUrl || '',
                verified: r.verified,
                rawData: r.rawData || '',
                createdAt: r.createdAt.toISOString(),
                updatedAt: r.updatedAt.toISOString(),
                device: r.device, // Map device info
            })),
            total: result.total,
        };
    }

    @GrpcMethod('AttendanceService', 'FindById')
    async findById(data: { id: string }) {
        this.logger.log(`gRPC FindById called: ${data.id}`);
        const record = await this.attendanceService.findById(data.id);

        if (!record) {
            throw new Error('Attendance record not found');
        }

        return {
            id: record.id,
            employeeCode: record.employeeCode,
            deviceId: record.deviceId,
            eventType: record.eventType,
            eventTimestamp: record.eventTimestamp.toISOString(), // Changed to ISO string
            imageUrl: record.imageUrl || '',
            verified: record.verified,
            rawData: record.rawData || '',
            createdAt: record.createdAt.toISOString(),
            updatedAt: record.updatedAt.toISOString(),
            device: record.device, // Map device info
        };

    }

    @GrpcMethod('AttendanceService', 'Count')
    async count(query: any) {
        this.logger.log('gRPC Count called');
        const count = await this.attendanceService.count({
            employeeCode: query.employeeCode,
            deviceId: query.deviceId,
            startDate: query.startDate,
            endDate: query.endDate,
        });

        return { count };
    }
}
