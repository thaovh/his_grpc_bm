import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { AttendanceRepository } from '../../repositories/attendance.repository';
import { UpdateAttendanceRecordCommand } from '../attendance.cqrs';
import { AttendanceRecord } from '../../entities/attendance-record.entity';

@CommandHandler(UpdateAttendanceRecordCommand)
export class UpdateAttendanceRecordHandler implements ICommandHandler<UpdateAttendanceRecordCommand> {
    private readonly logger = new Logger(UpdateAttendanceRecordHandler.name);

    constructor(private readonly repository: AttendanceRepository) { }

    async execute(command: UpdateAttendanceRecordCommand): Promise<AttendanceRecord> {
        this.logger.log(`Updating attendance record: ${command.id}`);

        const record = await this.repository.findOne({ where: { id: command.id } });
        if (!record) {
            throw new Error(`Attendance record not found: ${command.id}`);
        }

        record.verified = command.verified;
        record.version += 1;

        return await this.repository.save(record);
    }
}
