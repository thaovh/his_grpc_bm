import { ApiProperty } from '@nestjs/swagger';

export class DepartmentTypeResponseDto {
    @ApiProperty({ description: 'ID loại khoa phòng' })
    id: string;

    @ApiProperty({ description: 'Mã loại khoa phòng' })
    code: string;

    @ApiProperty({ description: 'Tên loại khoa phòng' })
    name: string;

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
