import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { AttendanceRepository } from '../../repositories/attendance.repository';
import { CountAttendanceRecordsQuery } from '../../commands/attendance.cqrs';

@QueryHandler(CountAttendanceRecordsQuery)
export class CountAttendanceRecordsHandler implements IQueryHandler<CountAttendanceRecordsQuery> {
    private readonly logger = new Logger(CountAttendanceRecordsHandler.name);

    constructor(private readonly repository: AttendanceRepository) { }

    async execute(query: CountAttendanceRecordsQuery): Promise<number> {
        this.logger.log(`Counting attendance records with filters`);

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

        return await queryBuilder.getCount();
    }
}
