// Device Token Commands
export class SaveDeviceTokenCommand {
    constructor(
        public readonly userId: string,
        public readonly employeeCode: string,
        public readonly deviceToken: string,
        public readonly deviceType?: string,
        public readonly deviceName?: string,
        public readonly deviceOsVersion?: string,
        public readonly appVersion?: string,
    ) { }
}

export class RemoveDeviceTokenCommand {
    constructor(public readonly deviceToken: string) { }
}

export class UpdateDeviceLastUsedCommand {
    constructor(public readonly deviceToken: string) { }
}
