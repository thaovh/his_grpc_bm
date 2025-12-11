// Commands
export class CreateAttendanceRecordCommand {
    constructor(
        public readonly employeeCode: string,
        public readonly deviceId: string,
        public readonly eventType: string,
        public readonly eventTimestamp: Date,
        public readonly imageUrl?: string,
        public readonly rawData?: string,
    ) { }
}

export class UpdateAttendanceRecordCommand {
    constructor(
        public readonly id: string,
        public readonly verified: number,
    ) { }
}

// Queries
export class GetAttendanceRecordsQuery {
    constructor(
        public readonly employeeCode?: string,
        public readonly deviceId?: string,
        public readonly startDate?: string,
        public readonly endDate?: string,
        public readonly page: number = 1,
        public readonly limit: number = 20,
    ) { }
}

export class GetAttendanceRecordByIdQuery {
    constructor(public readonly id: string) { }
}

export class CountAttendanceRecordsQuery {
    constructor(
        public readonly employeeCode?: string,
        public readonly deviceId?: string,
        public readonly startDate?: string,
        public readonly endDate?: string,
    ) { }
}
