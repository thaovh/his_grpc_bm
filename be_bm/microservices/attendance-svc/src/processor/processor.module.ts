import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventProcessorService } from './event-processor.service';
import { RedisModule } from '../redis/redis.module';
import { AttendanceModule } from '../attendance/attendance.module';

@Module({
    imports: [EventEmitterModule, RedisModule, AttendanceModule],
    providers: [EventProcessorService],
    exports: [EventProcessorService],
})
export class ProcessorModule { }
