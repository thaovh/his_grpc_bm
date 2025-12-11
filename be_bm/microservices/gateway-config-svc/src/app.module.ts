import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ApiEndpointsModule } from './api-endpoints/api-endpoints.module';
import { KongSyncModule } from './kong-sync/kong-sync.module';
import { AppFeaturesModule } from './app-features/app-features.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    ApiEndpointsModule,
    KongSyncModule,
    AppFeaturesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
