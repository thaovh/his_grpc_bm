import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EventsController } from './events.controller';
import { AuthModule } from '../auth/auth.module';
import { RedisStreamService } from './redis-stream.service';

@Module({
  imports: [
    AuthModule,
  ],
  providers: [EventsGateway, RedisStreamService],
  controllers: [EventsController],
  exports: [EventsGateway],
})
export class EventsModule { }
