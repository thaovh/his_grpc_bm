import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PROTO_PATH, PROTO_ROOT_DIR } from '@bmaibe/protos';
import * as path from 'path';
import { LoggerModule } from 'nestjs-pino';
import { AuthToken } from './entities/auth-token.entity';
import { AuthController } from './controllers/auth.controller';
import { AuthServiceImpl } from './services/auth.service';
import { AuthRepository } from './repositories/auth.repository';



@Module({ // Trigger reload for JWT fix
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([AuthToken]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-secret-key-change-in-production',
        signOptions: { expiresIn: '60m' },
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: 'USERS_PACKAGE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: `${configService.get('USERS_SVC_URL') || 'localhost'}:${configService.get('USERS_SVC_PORT') || '50052'}`,
            package: 'users',
            protoPath: PROTO_PATH.users,
            loader: {
              enums: String,
              objects: true,
              arrays: true,
              keepCase: true,
              defaults: true,
              oneofs: true,

              includeDirs: [PROTO_ROOT_DIR],
            },
          },
        }),
      },
      {
        name: 'INTEGRATION_PACKAGE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: `${configService.get('INTEGRATION_SVC_URL') || 'localhost'}:${configService.get('INTEGRATION_SVC_PORT') || '50053'}`,
            package: 'integration',
            protoPath: PROTO_PATH.integration,
            loader: {
              enums: String,
              objects: true,
              arrays: true,
              keepCase: true,
              defaults: true,
              oneofs: true,

              includeDirs: [PROTO_ROOT_DIR],
            },
          },
        }),
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
export class AuthModule { }

