import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { APP_GUARD } from '@nestjs/core';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UsersModule } from '../users/users.module';
import { AuthServiceClientOptions } from './auth-svc.options';

@Module({
  imports: [
    ClientsModule.register([{
      name: 'AUTH_PACKAGE',
      ...AuthServiceClientOptions,
    }]),
    UsersModule, // Import UsersModule để sử dụng UsersService
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // Global JWT guard - use @Public() to bypass
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
