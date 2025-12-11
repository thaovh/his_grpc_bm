import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { PollingService } from './polling.service';
import { PollingConfig } from './entities/polling-config.entity';
import { IsapiClientService } from './isapi-client.service';
import { RedisModule } from '../redis/redis.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([PollingConfig]),
        ScheduleModule.forRoot(),
        HttpModule,
        RedisModule,
    ],
    providers: [PollingService, IsapiClientService],
    exports: [PollingService],
})
export class PollingModule { }
