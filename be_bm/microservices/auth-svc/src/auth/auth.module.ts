import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { LoggerModule } from 'nestjs-pino';
import { AuthToken } from './entities/auth-token.entity';
import { AuthController } from './controllers/auth.controller';
import { AuthServiceImpl } from './services/auth.service';
import { AuthRepository } from './repositories/auth.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthToken]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      signOptions: { 
        expiresIn: process.env.JWT_EXPIRES_IN || '15m' 
      },
    }),
    ClientsModule.register([
      {
        name: 'USERS_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: `${process.env.USERS_SVC_URL || 'localhost'}:${process.env.USERS_SVC_PORT || '50051'}`,
          package: 'users',
          protoPath: join(__dirname, '../_proto/users.proto'),
          loader: {
            enums: String,
            objects: true,
            arrays: true,
          },
        },
      },
      {
        name: 'INTEGRATION_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: `${process.env.INTEGRATION_SVC_URL || 'localhost'}:${process.env.INTEGRATION_SVC_PORT || '50053'}`,
          package: 'integration',
          protoPath: join(__dirname, '../_proto/integration.proto'),
          loader: {
            enums: String,
            objects: true,
            arrays: true,
          },
        },
      },
    ]),
    LoggerModule.forRoot({
      pinoHttp: {
        safe: true,
        ...(process.env.NODE_ENV === 'development' && {
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
            },
          },
        }),
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthRepository,
    {
      provide: 'AuthService',
      useClass: AuthServiceImpl,
    },
  ],
  exports: ['AuthService'],
})
export class AuthModule {}

