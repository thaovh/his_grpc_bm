import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, ValidateNested, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO for expMest in sync body
 * Note: expMestId will be ignored (taken from URL param)
 * All fields are optional to match CreateExpMestDto structure
 */
export class SyncExpMestExpMestDto {
  @ApiPropertyOptional({
    description: 'ExpMest ID (will be ignored, taken from URL param instead)',
    example: 17966655,
  })
  @IsOptional()
  @IsNumber()
  expMestId?: number;

  @ApiPropertyOptional({ example: '000017966014' })
  @IsOptional()
  @IsString()
  expMestCode?: string | null;

  @ApiPropertyOptional({ example: 9 })
  @IsOptional()
  @IsNumber()
  expMestTypeId?: number | null;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsNumber()
  expMestSttId?: number | null;

  @ApiPropertyOptional({ example: 804 })
  @IsOptional()
  @IsNumber()
  mediStockId?: number | null;

  @ApiPropertyOptional({ example: 'vqn' })
  @IsOptional()
  @IsString()
  reqLoginname?: string | null;

  @ApiPropertyOptional({ example: 'VŨ QUANG NGỌC' })
  @IsOptional()
  @IsString()
  reqUsername?: string | null;

  @ApiPropertyOptional({ example: 5729 })
  @IsOptional()
  @IsNumber()
  reqRoomId?: number | null;

  @ApiPropertyOptional({ example: 105 })
  @IsOptional()
  @IsNumber()
  reqDepartmentId?: number | null;

  @ApiPropertyOptional({ example: 20251215000000 })
  @IsOptional()
  @IsNumber()
  createDate?: number | null;

  @ApiPropertyOptional({ example: 61358564 })
  @IsOptional()
  @IsNumber()
  serviceReqId?: number | null;

  @ApiPropertyOptional({ example: 4270.0 })
  @IsOptional()
  @IsNumber()
  tdlTotalPrice?: number | null;

  @ApiPropertyOptional({ example: '000061358390' })
  @IsOptional()
  @IsString()
  tdlServiceReqCode?: string | null;

  @ApiPropertyOptional({ example: 20251217080000 })
  @IsOptional()
  @IsNumber()
  tdlIntructionTime?: number | null;

  @ApiPropertyOptional({ example: 20251217000000 })
  @IsOptional()
  @IsNumber()
  tdlIntructionDate?: number | null;

  @ApiPropertyOptional({ example: 5518217 })
  @IsOptional()
  @IsNumber()
  tdlTreatmentId?: number | null;

  @ApiPropertyOptional({ example: '000005518141' })
  @IsOptional()
  @IsString()
  tdlTreatmentCode?: string | null;

  @ApiPropertyOptional({ example: 3283517 })
  @IsOptional()
  @IsNumber()
  tdlPatientId?: number | null;

  @ApiPropertyOptional({ example: '0003283390' })
  @IsOptional()
  @IsString()
  tdlPatientCode?: string | null;

  @ApiPropertyOptional({ example: 'NGUYỄN THỊ CHÊ' })
  @IsOptional()
  @IsString()
  tdlPatientName?: string | null;

  @ApiPropertyOptional({ example: 'CHÊ' })
  @IsOptional()
  @IsString()
  tdlPatientFirstName?: string | null;

  @ApiPropertyOptional({ example: 'NGUYỄN THỊ' })
  @IsOptional()
  @IsString()
  tdlPatientLastName?: string | null;

  @ApiPropertyOptional({ example: 19420101000000 })
  @IsOptional()
  @IsNumber()
  tdlPatientDob?: number | null;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  tdlPatientIsHasNotDayDob?: number | null;

  @ApiPropertyOptional({ example: 'xóm 3 đồng nhân, Xã An Khánh, Thành phố Hà Nội' })
  @IsOptional()
  @IsString()
  tdlPatientAddress?: string | null;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  tdlPatientGenderId?: number | null;

  @ApiPropertyOptional({ example: 'Nữ' })
  @IsOptional()
  @IsString()
  tdlPatientGenderName?: string | null;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  tdlPatientTypeId?: number | null;

  @ApiPropertyOptional({ example: 'BT2010122750270' })
  @IsOptional()
  @IsString()
  tdlHeinCardNumber?: string | null;

  @ApiPropertyOptional({ example: '0787064443' })
  @IsOptional()
  @IsString()
  tdlPatientPhone?: string | null;

  @ApiPropertyOptional({ example: '01' })
  @IsOptional()
  @IsString()
  tdlPatientProvinceCode?: string | null;

  @ApiPropertyOptional({ example: '09877' })
  @IsOptional()
  @IsString()
  tdlPatientCommuneCode?: string | null;

  @ApiPropertyOptional({ example: 'Việt Nam' })
  @IsOptional()
  @IsString()
  tdlPatientNationalName?: string | null;

  @ApiPropertyOptional({ example: 20251200000000.0 })
  @IsOptional()
  @IsNumber()
  virCreateMonth?: number | null;

  @ApiPropertyOptional({ example: 2025.0 })
  @IsOptional()
  @IsNumber()
  virCreateYear?: number | null;

  @ApiPropertyOptional({ example: 'J18' })
  @IsOptional()
  @IsString()
  icdCode?: string | null;

  @ApiPropertyOptional({ example: 'Suy tim EF 48%...' })
  @IsOptional()
  @IsString()
  icdName?: string | null;

  @ApiPropertyOptional({ example: ';I50;E11' })
  @IsOptional()
  @IsString()
  icdSubCode?: string | null;

  @ApiPropertyOptional({ example: ';Suy tim;Bệnh đái tháo đường...' })
  @IsOptional()
  @IsString()
  icdText?: string | null;

  @ApiPropertyOptional({ example: 'Tiến sỹ y học' })
  @IsOptional()
  @IsString()
  reqUserTitle?: string | null;

  @ApiPropertyOptional({ example: 'KT_KD06.251215.BMKP39.4.09.0008' })
  @IsOptional()
  @IsString()
  expMestSubCode2?: string | null;

  @ApiPropertyOptional({ example: 'BT' })
  @IsOptional()
  @IsString()
  virHeinCardPrefix?: string | null;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  priority?: number | null;

  @ApiPropertyOptional({ example: '09' })
  @IsOptional()
  @IsString()
  expMestTypeCode?: string | null;

  @ApiPropertyOptional({ example: 'Đơn điều trị' })
  @IsOptional()
  @IsString()
  expMestTypeName?: string | null;

  @ApiPropertyOptional({ example: '02' })
  @IsOptional()
  @IsString()
  expMestSttCode?: string | null;

  @ApiPropertyOptional({ example: 'Yêu cầu' })
  @IsOptional()
  @IsString()
  expMestSttName?: string | null;

  @ApiPropertyOptional({ example: 'KT_KD06' })
  @IsOptional()
  @IsString()
  mediStockCode?: string | null;

  @ApiPropertyOptional({ example: 'Kho Dịch truyền (2024)' })
  @IsOptional()
  @IsString()
  mediStockName?: string | null;

  @ApiPropertyOptional({ example: 'BMKP39.4' })
  @IsOptional()
  @IsString()
  reqDepartmentCode?: string | null;

  @ApiPropertyOptional({ example: 'C4 - Viện Tim Mạch' })
  @IsOptional()
  @IsString()
  reqDepartmentName?: string | null;

  @ApiPropertyOptional({ example: 'C4VTMBB03' })
  @IsOptional()
  @IsString()
  reqRoomCode?: string | null;

  @ApiPropertyOptional({ example: 'Phòng 3' })
  @IsOptional()
  @IsString()
  reqRoomName?: string | null;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  treatmentIsActive?: number | null;

  @ApiPropertyOptional({ example: 'BHYT' })
  @IsOptional()
  @IsString()
  patientTypeName?: string | null;

  @ApiPropertyOptional({ example: '01' })
  @IsOptional()
  @IsString()
  patientTypeCode?: string | null;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Reference to MST_EXPORT_STATUS.id (local DB)'
  })
  @IsOptional()
  @IsString()
  exportStatusId?: string | null;

  @ApiPropertyOptional({ example: '09877' })
  @IsOptional()
  @IsString()
  tdlPatientDistrictCode?: string | null;
}

export class SyncExpMestBodyDto {
  @ApiPropertyOptional({
    description: 'ExpMest data from backend (optional). If provided, will be used instead of fetching from HIS API. Note: expMestId in this object will be ignored (taken from URL param).',
    type: SyncExpMestExpMestDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => SyncExpMestExpMestDto)
  expMest?: SyncExpMestExpMestDto;
}

export class SyncExpMestRequestDto {
  @ApiPropertyOptional({ example: 123456 })
  @IsNumber()
  expMestId: number;
}

export class AutoUpdateExpMestSttIdDto {
  @ApiPropertyOptional({ example: [123, 456] })
  @IsNumber({}, { each: true })
  expMestIds: number[];

  @ApiPropertyOptional({ example: 'inpatient' })
  @IsString()
  expMestType: string;
}

