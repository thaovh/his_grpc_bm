import { Injectable, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
    CreateAttendanceRecordCommand,
    UpdateAttendanceRecordCommand,
    GetAttendanceRecordsQuery,
    GetAttendanceRecordByIdQuery,
    CountAttendanceRecordsQuery,
} from '../commands/attendance.cqrs';
import { AttendanceRecord } from '../entities/attendance-record.entity';
import { PollingConfig } from '../../polling/entities/polling-config.entity'; // Import PollingConfig
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AttendanceService {
    private readonly logger = new Logger(AttendanceService.name);

    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        @InjectRepository(PollingConfig)
        private readonly pollingFuncRepo: Repository<PollingConfig>,
    ) { }

    async create(data: {
        employeeCode: string;
        deviceId: string;
        eventType: string;
        eventTimestamp: Date;
        imageUrl?: string;
        rawData?: string;
    }): Promise<AttendanceRecord> {
        const command = new CreateAttendanceRecordCommand(
            data.employeeCode,
            data.deviceId,
            data.eventType,
            data.eventTimestamp,
            data.imageUrl,
            data.rawData,
        );
        return await this.commandBus.execute(command);
    }

    async update(id: string, verified: number): Promise<AttendanceRecord> {
        const command = new UpdateAttendanceRecordCommand(id, verified);
        return await this.commandBus.execute(command);
    }

    async findAll(query: {
        employeeCode?: string;
        deviceId?: string;
        startDate?: string;
        endDate?: string;
        page?: number;
        limit?: number;
    }): Promise<{ records: AttendanceRecord[]; total: number }> {
        const queryObj = new GetAttendanceRecordsQuery(
            query.employeeCode,
            query.deviceId,
            query.startDate,
            query.endDate,
            query.page || 1,
            query.limit || 20,
        );
        const result = await this.queryBus.execute(queryObj);

        if (result && result.records && result.records.length > 0) {
            try {
                // Collect unique device IDs
                const deviceIds = [...new Set(result.records.map(r => r.deviceId).filter(id => id))];

                if (deviceIds.length > 0) {
                    // Fetch all needed polling configs
                    // Note: deviceId in records stores ID of PollingConfig
                    const configs = await this.pollingFuncRepo.find({
                        where: {
                            // @ts-ignore - TypeORM might complain about In with string array if ID is defined number/string differently 
                            // but basically we want WHERE ID IN (...)
                            // Assuming base entity ID is string
                            id: require('typeorm').In(deviceIds)
                        }
                    });

                    // Create a map for faster lookup
                    const configMap = new Map(configs.map(c => [String(c.id), c]));

                    // Enrich records
                    result.records = result.records.map(record => {
                        const device = configMap.get(String(record.deviceId));
                        if (device) {
                            return {
                                ...record,
                                device: {
                                    id: String(device.id),
                                    name: device.name,
                                    ip: device.ipAddress,
                                    port: device.port,
                                    isActive: device.isActive,
                                }
                            };
                        }
                        return record;
                    });
                }
            } catch (error) {
                this.logger.error(`Error fetching device info for list: ${error.message}`);
            }
        }

        return result;
    }

    async findById(id: string): Promise<any> {
        this.logger.log(`AttendanceService.findById called with id: ${id}`);
        const query = new GetAttendanceRecordByIdQuery(id);
        const record = await this.queryBus.execute(query);

        if (record) {
            this.logger.log(`Found record: ${record.id}, deviceId: ${record.deviceId}`);
            if (record.deviceId) {
                // Fetch device info from PollingConfig
                try {
                    this.logger.log(`Looking up PollingConfig for deviceId: ${record.deviceId}`);
                    const device = await this.pollingFuncRepo.findOne({ where: { id: record.deviceId } });
                    this.logger.log(`PollingConfig result: ${device ? device.name : 'null'}`);

                    if (device) {
                        return {
                            ...record,
                            device: {
                                id: String(device.id),
                                name: device.name,
                                ip: device.ipAddress,
                                port: device.port,
                                isActive: device.isActive,
                            }
                        };
                    }
                } catch (error) {
                    this.logger.error(`Error fetching device info for record ${id}: ${error.message}`);
                }
            } else {
                this.logger.warn(`Record ${id} has no deviceId`);
            }
        } else {
            this.logger.warn(`Record not found for id: ${id}`);
        }

        return record;
    }

    async count(filters: {
        employeeCode?: string;
        deviceId?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<number> {
        const query = new CountAttendanceRecordsQuery(
            filters.employeeCode,
            filters.deviceId,
            filters.startDate,
            filters.endDate,
        );
        return await this.queryBus.execute(query);
    }
}
