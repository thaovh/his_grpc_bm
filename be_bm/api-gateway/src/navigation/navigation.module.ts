import { Module } from '@nestjs/common';
import { NavigationController } from './navigation.controller';
import { GatewayConfigModule } from '../gateway-config/gateway-config.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [AuthModule, GatewayConfigModule],
    controllers: [NavigationController],
})
export class NavigationModule { }
