import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { AttendanceRepository } from '../../repositories/attendance.repository';
import { GetAttendanceRecordsQuery } from '../../commands/attendance.cqrs';
import { AttendanceRecord } from '../../entities/attendance-record.entity';

@QueryHandler(GetAttendanceRecordsQuery)
export class GetAttendanceRecordsHandler implements IQueryHandler<GetAttendanceRecordsQuery> {
    private readonly logger = new Logger(GetAttendanceRecordsHandler.name);

    constructor(private readonly repository: AttendanceRepository) { }

    async execute(query: GetAttendanceRecordsQuery): Promise<{ records: AttendanceRecord[]; total: number }> {
        this.logger.log(`Getting attendance records with filters`);

        const queryBuilder = this.repository.createQueryBuilder('attendance');

        if (query.employeeCode) {
            queryBuilder.andWhere('attendance.employeeCode = :employeeCode', { employeeCode: query.employeeCode });
        }

        if (query.deviceId) {
            queryBuilder.andWhere('attendance.deviceId = :deviceId', { deviceId: query.deviceId });
        }

        if (query.startDate) {
            queryBuilder.andWhere('attendance.eventTimestamp >= :startDate', { startDate: new Date(query.startDate) });
        }

        if (query.endDate) {
            queryBuilder.andWhere('attendance.eventTimestamp <= :endDate', { endDate: new Date(query.endDate) });
        }

        const total = await queryBuilder.getCount();

        const records = await queryBuilder
            .orderBy('attendance.eventTimestamp', 'DESC')
            .skip((query.page - 1) * query.limit)
            .take(query.limit)
            .getMany();

        return { records, total };
    }
}
