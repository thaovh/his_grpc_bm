import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppFeature } from './entities/app-feature.entity';
import { AppFeatureRole } from './entities/app-feature-role.entity';
import { AppFeaturesController } from './controllers/app-features.controller';
import { GetNavigationTreeHandler } from './handlers/get-navigation-tree.handler';
import { GetAppFeaturesHandler } from './handlers/get-app-features.handler';
import { CreateAppFeatureHandler } from './handlers/create-app-feature.handler';
import { UpdateAppFeatureHandler } from './handlers/update-app-feature.handler';
import { DeleteAppFeatureHandler } from './handlers/delete-app-feature.handler';

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([AppFeature, AppFeatureRole]),
    ],
    controllers: [AppFeaturesController],
    providers: [
        GetNavigationTreeHandler,
        GetAppFeaturesHandler,
        CreateAppFeatureHandler,
        UpdateAppFeatureHandler,
        DeleteAppFeatureHandler,
    ],
})
export class AppFeaturesModule { }
