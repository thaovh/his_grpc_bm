
import { ApiProperty } from '@nestjs/swagger';

export class NotificationTypeResponseDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    id: string;

    @ApiProperty({ example: 'NOTIFY_001' })
    code: string;

    @ApiProperty({ example: 'Thông báo chấm công' })
    name: string;

    @ApiProperty({ required: false })
    description?: string;

    @ApiProperty({ example: 1 })
    sortOrder: number;

    @ApiProperty()
    createdAt: string;

    @ApiProperty()
    updatedAt: string;

    @ApiProperty({ required: false })
    createdBy?: string;

    @ApiProperty({ required: false })
    updatedBy?: string;

    @ApiProperty()
    version: number;

    @ApiProperty()
    isActive: number;
}
