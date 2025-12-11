import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AttendanceRecord } from '../entities/attendance-record.entity';

@Injectable()
export class AttendanceRepository extends Repository<AttendanceRecord> {
    constructor(private dataSource: DataSource) {
        super(AttendanceRecord, dataSource.createEntityManager());
    }

    async findByEmployeeCode(employeeCode: string): Promise<AttendanceRecord[]> {
        return this.find({
            where: { employeeCode },
            order: { eventTimestamp: 'DESC' },
        });
    }

    async findByDateRange(startDate: Date, endDate: Date): Promise<AttendanceRecord[]> {
        return this.createQueryBuilder('attendance')
            .where('attendance.eventTimestamp >= :startDate', { startDate })
            .andWhere('attendance.eventTimestamp <= :endDate', { endDate })
            .orderBy('attendance.eventTimestamp', 'DESC')
            .getMany();
    }

    async findByEmployeeAndDateRange(
        employeeCode: string,
        startDate: Date,
        endDate: Date
    ): Promise<AttendanceRecord[]> {
        return this.createQueryBuilder('attendance')
            .where('attendance.employeeCode = :employeeCode', { employeeCode })
            .andWhere('attendance.eventTimestamp >= :startDate', { startDate })
            .andWhere('attendance.eventTimestamp <= :endDate', { endDate })
            .orderBy('attendance.eventTimestamp', 'DESC')
            .getMany();
    }
}
