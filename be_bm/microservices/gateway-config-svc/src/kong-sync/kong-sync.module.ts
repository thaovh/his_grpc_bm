import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ApiEndpointsModule } from '../api-endpoints/api-endpoints.module';
import { KongSyncService } from './services/kong-sync.service';

@Module({
    imports: [
        HttpModule,
        forwardRef(() => ApiEndpointsModule),
    ],
    providers: [KongSyncService],
    exports: [KongSyncService],
})
export class KongSyncModule { }
