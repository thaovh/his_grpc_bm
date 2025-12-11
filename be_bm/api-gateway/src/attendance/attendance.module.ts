import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { AuthModule } from '../auth/auth.module';  // Import AuthModule

@Module({
    imports: [
        AuthModule, // Add AuthModule to provide AUTH_PACKAGE for JwtAuthGuard
        ClientsModule.register([
            {
                name: 'ATTENDANCE_PACKAGE',
                transport: Transport.GRPC,
                options: {
                    package: 'attendance',
                    protoPath: join(__dirname, '../_proto/attendance.proto'),
                    url: `${process.env.ATTENDANCE_SVC_URL || 'localhost'}:${process.env.ATTENDANCE_SVC_PORT || 50057}`,
                    loader: {
                        keepCase: true,
                        longs: String,
                        enums: String,
                        defaults: true,
                        oneofs: true,
                        includeDirs: [join(__dirname, '../_proto')],
                    },
                },
            },
        ]),
    ],
    controllers: [AttendanceController],
    providers: [AttendanceService],
})
export class AttendanceModule { }
