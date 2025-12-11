import { ApiProperty } from '@nestjs/swagger';
import { BranchResponseDto } from './branch-response.dto';
import { DepartmentTypeResponseDto } from './department-type-response.dto';

export class DepartmentResponseDto {
    @ApiProperty({ description: 'ID khoa phòng' })
    id: string;

    @ApiProperty({ description: 'Mã khoa phòng' })
    code: string;

    @ApiProperty({ description: 'Tên khoa phòng' })
    name: string;

    @ApiProperty({ description: 'ID khoa phòng cha', required: false })
    parentId?: string;

    @ApiProperty({ description: 'ID chi nhánh' })
    branchId: string;

    @ApiProperty({ description: 'ID loại khoa phòng' })
    departmentTypeId: string;

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

    @ApiProperty({ type: () => BranchResponseDto, required: false })
    branch?: BranchResponseDto;

    @ApiProperty({ type: () => DepartmentTypeResponseDto, required: false })
    departmentType?: DepartmentTypeResponseDto;

    @ApiProperty({ type: () => DepartmentResponseDto, required: false })
    parent?: DepartmentResponseDto;

    @ApiProperty({ type: [DepartmentResponseDto], required: false })
    children?: DepartmentResponseDto[];
}
