import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { AttendanceRepository } from '../../repositories/attendance.repository';
import { CreateAttendanceRecordCommand } from '../attendance.cqrs';
import { AttendanceRecord } from '../../entities/attendance-record.entity';

@CommandHandler(CreateAttendanceRecordCommand)
export class CreateAttendanceRecordHandler implements ICommandHandler<CreateAttendanceRecordCommand> {
    private readonly logger = new Logger(CreateAttendanceRecordHandler.name);

    constructor(private readonly repository: AttendanceRepository) { }

    async execute(command: CreateAttendanceRecordCommand): Promise<AttendanceRecord> {
        this.logger.log(`Creating attendance record for employee: ${command.employeeCode}`);

        const record = new AttendanceRecord();
        record.id = uuidv4();
        record.employeeCode = command.employeeCode;
        record.deviceId = command.deviceId;
        record.eventType = command.eventType;
        record.eventTimestamp = command.eventTimestamp;
        record.imageUrl = command.imageUrl;
        record.rawData = command.rawData;
        record.verified = 0;
        record.version = 1;

        return await this.repository.save(record);
    }
}
