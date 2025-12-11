export class SaveDeviceTokenDto {
    deviceToken: string;
    deviceType?: string;
    deviceName?: string;
    deviceOsVersion?: string;
    appVersion?: string;
}

export class DeviceTokenResponseDto {
    id: string;
    deviceToken: string;
    deviceType: string;
    deviceName: string;
    lastUsedAt: Date;
    createdAt: Date;
}
