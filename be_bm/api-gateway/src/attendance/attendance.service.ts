import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface AttendanceGrpcService {
    findAll(query: any): Observable<any>;
    findById(data: { id: string }): Observable<any>;
    count(query: any): Observable<any>;
}

@Injectable()
export class AttendanceService implements OnModuleInit {
    private grpcService: AttendanceGrpcService;

    constructor(@Inject('ATTENDANCE_PACKAGE') private client: ClientGrpc) { }

    onModuleInit() {
        this.grpcService = this.client.getService<AttendanceGrpcService>('AttendanceService');
    }

    findAll(query: {
        employeeCode?: string;
        deviceId?: string;
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
    }) {
        return this.grpcService.findAll(query);
    }

    findById(id: string) {
        return this.grpcService.findById({ id });
    }

    count(query: {
        employeeCode?: string;
        deviceId?: string;
        startDate?: string;
        endDate?: string;
    }) {
        return this.grpcService.count(query);
    }
}
