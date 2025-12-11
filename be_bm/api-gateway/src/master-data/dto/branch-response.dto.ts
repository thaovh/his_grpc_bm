import { ApiProperty } from '@nestjs/swagger';

export class BranchResponseDto {
    @ApiProperty({ description: 'ID chi nhánh' })
    id: string;

    @ApiProperty({ description: 'Mã chi nhánh' })
    code: string;

    @ApiProperty({ description: 'Tên chi nhánh' })
    name: string;

    @ApiProperty({ description: 'Địa chỉ', required: false })
    address?: string;

    @ApiProperty({ description: 'Ngày tạo' })
    createdAt: string;

    @ApiProperty({ description: 'Ngày cập nhật' })
    updatedAt: string;

    @ApiProperty({ description: 'Người tạo' })
    createdBy: string;

    @ApiProperty({ description: 'Người cập nhật' })
    updatedBy: string;

    @ApiProperty({ description: 'Phiên bản' })
    version: number;

    @ApiProperty({ description: 'Trạng thái hoạt động' })
    isActive: number;
}
