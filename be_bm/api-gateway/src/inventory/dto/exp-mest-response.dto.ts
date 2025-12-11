import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ExportStatusResponseDto } from '../../master-data/dto/export-status-response.dto';

export class ExpMestResponseDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 17966519 })
  expMestId: number;

  @ApiPropertyOptional({ example: '000017966014' })
  expMestCode?: string | null;

  @ApiPropertyOptional({ example: 9 })
  expMestTypeId?: number | null;

  @ApiPropertyOptional({ example: 2 })
  expMestSttId?: number | null;

  @ApiPropertyOptional({ example: 804 })
  mediStockId?: number | null;

  @ApiPropertyOptional({ example: 'vqn' })
  reqLoginname?: string | null;

  @ApiPropertyOptional({ example: 'VŨ QUANG NGỌC' })
  reqUsername?: string | null;

  @ApiPropertyOptional({ example: 5729 })
  reqRoomId?: number | null;

  @ApiPropertyOptional({ example: 105 })
  reqDepartmentId?: number | null;

  @ApiPropertyOptional({ example: 20251215000000 })
  createDate?: number | null;

  @ApiPropertyOptional({ example: 61358564 })
  serviceReqId?: number | null;

  @ApiPropertyOptional({ example: 4270.0 })
  tdlTotalPrice?: number | null;

  @ApiPropertyOptional({ example: '000061358390' })
  tdlServiceReqCode?: string | null;

  @ApiPropertyOptional({ example: 20251217080000 })
  tdlIntructionTime?: number | null;

  @ApiPropertyOptional({ example: 20251217000000 })
  tdlIntructionDate?: number | null;

  @ApiPropertyOptional({ example: 5518217 })
  tdlTreatmentId?: number | null;

  @ApiPropertyOptional({ example: '000005518141' })
  tdlTreatmentCode?: string | null;

  @ApiPropertyOptional({ example: 3283517 })
  tdlPatientId?: number | null;

  @ApiPropertyOptional({ example: '0003283390' })
  tdlPatientCode?: string | null;

  @ApiPropertyOptional({ example: 'NGUYỄN THỊ CHÊ' })
  tdlPatientName?: string | null;

  @ApiPropertyOptional({ example: 'CHÊ' })
  tdlPatientFirstName?: string | null;

  @ApiPropertyOptional({ example: 'NGUYỄN THỊ' })
  tdlPatientLastName?: string | null;

  @ApiPropertyOptional({ example: 19420101000000 })
  tdlPatientDob?: number | null;

  @ApiPropertyOptional({ example: 0 })
  tdlPatientIsHasNotDayDob?: number | null;

  @ApiPropertyOptional({ example: 'xóm 3 đồng nhân, Xã An Khánh, Thành phố Hà Nội' })
  tdlPatientAddress?: string | null;

  @ApiPropertyOptional({ example: 1 })
  tdlPatientGenderId?: number | null;

  @ApiPropertyOptional({ example: 'Nữ' })
  tdlPatientGenderName?: string | null;

  @ApiPropertyOptional({ example: 1 })
  tdlPatientTypeId?: number | null;

  @ApiPropertyOptional({ example: 'BT2010122750270' })
  tdlHeinCardNumber?: string | null;

  @ApiPropertyOptional({ example: '0787064443' })
  tdlPatientPhone?: string | null;

  @ApiPropertyOptional({ example: '01' })
  tdlPatientProvinceCode?: string | null;

  @ApiPropertyOptional({ example: '09877' })
  tdlPatientCommuneCode?: string | null;

  @ApiPropertyOptional({ example: 'Việt Nam' })
  tdlPatientNationalName?: string | null;

  @ApiPropertyOptional({ example: '0003049448;0003244715' })
  tdlAggrPatientCode?: string | null;

  @ApiPropertyOptional({ example: '000005008317;000005433225' })
  tdlAggrTreatmentCode?: string | null;

  @ApiPropertyOptional({ example: 20251200000000.0 })
  virCreateMonth?: number | null;

  @ApiPropertyOptional({ example: 2025.0 })
  virCreateYear?: number | null;

  @ApiPropertyOptional({ example: 'J18' })
  icdCode?: string | null;

  @ApiPropertyOptional({ example: 'Suy tim EF 48%...' })
  icdName?: string | null;

  @ApiPropertyOptional({ example: ';I50;E11' })
  icdSubCode?: string | null;

  @ApiPropertyOptional({ example: ';Suy tim;Bệnh đái tháo đường...' })
  icdText?: string | null;

  @ApiPropertyOptional({ example: 'Tiến sỹ y học' })
  reqUserTitle?: string | null;

  @ApiPropertyOptional({ example: 'tpl' })
  lastExpLoginname?: string | null;

  @ApiPropertyOptional({ example: 'TRẦN PHƯƠNG LINH' })
  lastExpUsername?: string | null;

  @ApiPropertyOptional({ example: 20251217164446 })
  lastExpTime?: number | null;

  @ApiPropertyOptional({ example: 20251217164446 })
  finishTime?: number | null;

  @ApiPropertyOptional({ example: 20251217000000 })
  finishDate?: number | null;

  @ApiPropertyOptional({ example: 1 })
  isExportEqualApprove?: number | null;

  @ApiPropertyOptional({ example: 'tpl' })
  lastApprovalLoginname?: string | null;

  @ApiPropertyOptional({ example: 'TRẦN PHƯƠNG LINH' })
  lastApprovalUsername?: string | null;

  @ApiPropertyOptional({ example: 20251217164336 })
  lastApprovalTime?: number | null;

  @ApiPropertyOptional({ example: 20251217000000 })
  lastApprovalDate?: number | null;

  @ApiPropertyOptional({ example: 114 })
  numOrder?: number | null;

  @ApiPropertyOptional({ example: 'KT_KD06.251215.BMKP39.4.09.0008' })
  expMestSubCode2?: string | null;

  @ApiPropertyOptional({ example: 'KT_KD060857619' })
  expMestSubCode?: string | null;

  @ApiPropertyOptional({ example: 'BT' })
  virHeinCardPrefix?: string | null;

  @ApiPropertyOptional({ example: 0 })
  priority?: number | null;

  @ApiPropertyOptional({ example: 20251217000000 })
  tdlIntructionDateMin?: number | null;

  @ApiPropertyOptional({ example: '09' })
  expMestTypeCode?: string | null;

  @ApiPropertyOptional({ example: 'Đơn điều trị' })
  expMestTypeName?: string | null;

  @ApiPropertyOptional({ example: '02' })
  expMestSttCode?: string | null;

  @ApiPropertyOptional({ example: 'Yêu cầu' })
  expMestSttName?: string | null;

  @ApiPropertyOptional({ example: 'KT_KD06' })
  mediStockCode?: string | null;

  @ApiPropertyOptional({ example: 'Kho Dịch truyền (2024)' })
  mediStockName?: string | null;

  @ApiPropertyOptional({ example: 'BMKP39.4' })
  reqDepartmentCode?: string | null;

  @ApiPropertyOptional({ example: 'C4 - Viện Tim Mạch' })
  reqDepartmentName?: string | null;

  @ApiPropertyOptional({ example: 'C4VTMBB03' })
  reqRoomCode?: string | null;

  @ApiPropertyOptional({ example: 'Phòng 3' })
  reqRoomName?: string | null;

  @ApiPropertyOptional({ example: 1 })
  treatmentIsActive?: number | null;

  @ApiPropertyOptional({ example: 'BHYT' })
  patientTypeName?: string | null;

  @ApiPropertyOptional({ example: '01' })
  patientTypeCode?: string | null;

  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000' })
  exportStatusId?: string | null;

  @ApiPropertyOptional({ 
    description: 'Nested Export Status from local DB',
    type: ExportStatusResponseDto 
  })
  exportStatus?: ExportStatusResponseDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  version: number;

  @ApiProperty()
  isActive: number;
}

