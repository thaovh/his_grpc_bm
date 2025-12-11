import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import { AttendanceRecord } from './entities/attendance-record.entity';
import { AttendanceRepository } from './repositories/attendance.repository';
import { AttendanceService } from './services/attendance.service';
import { AttendanceController } from './controllers/attendance.controller';

// Command Handlers
import { CreateAttendanceRecordHandler } from './commands/handlers/create-attendance.handler';
import { UpdateAttendanceRecordHandler } from './commands/handlers/update-attendance.handler';

// Query Handlers
import { GetAttendanceRecordsHandler } from './queries/handlers/get-attendances.handler';
import { GetAttendanceRecordByIdHandler } from './queries/handlers/get-attendance-by-id.handler';
import { CountAttendanceRecordsHandler } from './queries/handlers/count-attendances.handler';

const CommandHandlers = [
    CreateAttendanceRecordHandler,
    UpdateAttendanceRecordHandler,
];

const QueryHandlers = [
    GetAttendanceRecordsHandler,
    GetAttendanceRecordByIdHandler,
    CountAttendanceRecordsHandler,
];

import { PollingConfig } from '../polling/entities/polling-config.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([AttendanceRecord, PollingConfig]),
        CqrsModule,
    ],
    controllers: [AttendanceController],
    providers: [
        AttendanceRepository,
        AttendanceService,
        ...CommandHandlers,
        ...QueryHandlers,
    ],
    exports: [AttendanceService],
})
export class AttendanceModule { }
