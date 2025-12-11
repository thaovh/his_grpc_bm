import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { AttendanceRepository } from '../../repositories/attendance.repository';
import { GetAttendanceRecordByIdQuery } from '../../commands/attendance.cqrs';
import { AttendanceRecord } from '../../entities/attendance-record.entity';

@QueryHandler(GetAttendanceRecordByIdQuery)
export class GetAttendanceRecordByIdHandler implements IQueryHandler<GetAttendanceRecordByIdQuery> {
    private readonly logger = new Logger(GetAttendanceRecordByIdHandler.name);

    constructor(private readonly repository: AttendanceRepository) { }

    async execute(query: GetAttendanceRecordByIdQuery): Promise<AttendanceRecord | null> {
        this.logger.log(`Getting attendance record by ID: ${query.id}`);
        return await this.repository.findOne({ where: { id: query.id } });
    }
}
