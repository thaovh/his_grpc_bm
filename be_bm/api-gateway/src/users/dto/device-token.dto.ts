import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class SaveDeviceTokenDto {
    @ApiProperty({
        description: 'FCM device token',
        example: 'fcm_token_abc123xyz...',
    })
    @IsString()
    @IsNotEmpty()
    deviceToken: string;

    @ApiProperty({
        description: 'Device platform',
        example: 'ios',
        enum: ['ios', 'android', 'web'],
        required: false,
    })
    @IsOptional()
    @IsString()
    @IsEnum(['ios', 'android', 'web'])
    deviceType?: string;

    @ApiProperty({
        description: 'Device model name',
        example: 'iPhone 13',
        required: false,
    })
    @IsOptional()
    @IsString()
    deviceName?: string;

    @ApiProperty({
        description: 'Operating system version',
        example: 'iOS 16.0',
        required: false,
    })
    @IsOptional()
    @IsString()
    deviceOsVersion?: string;

    @ApiProperty({
        description: 'Mobile app version',
        example: '1.0.0',
        required: false,
    })
    @IsOptional()
    @IsString()
    appVersion?: string;
}

export class DeviceTokenResponseDto {
    @ApiProperty({
        description: 'Success status',
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: 'Response message',
        example: 'Device token saved successfully',
    })
    message: string;
}

export class DeviceTokensResponseDto {
    @ApiProperty({
        description: 'List of device tokens',
        example: ['token1', 'token2'],
        type: [String],
    })
    tokens: string[];
}
