import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateExpMestMedicineDto {
  @ApiProperty({ example: 30495754 })
  @IsNumber()
  hisId: number;

  @ApiProperty({ example: 17966655 })
  @IsNumber()
  expMestId: number;

  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'UUID local của ExpMest (optional, for faster joins)' })
  @IsOptional()
  @IsString()
  expMestLocalId?: string | null;

  @ApiPropertyOptional({ example: 95622 })
  @IsOptional()
  @IsNumber()
  medicineId?: number | null;

  @ApiPropertyOptional({ example: 804 })
  @IsOptional()
  @IsNumber()
  tdlMediStockId?: number | null;

  @ApiPropertyOptional({ example: 15179 })
  @IsOptional()
  @IsNumber()
  tdlMedicineTypeId?: number | null;

  @ApiPropertyOptional({ example: 1583037 })
  @IsOptional()
  @IsNumber()
  expMestMetyReqId?: number | null;

  @ApiPropertyOptional({ example: 3168599 })
  @IsOptional()
  @IsNumber()
  ckImpMestMedicineId?: number | null;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  isExport?: number | null;

  @ApiPropertyOptional({ example: 141.0 })
  @IsOptional()
  @IsNumber()
  amount?: number | null;

  @ApiPropertyOptional({ example: 141.0 })
  @IsOptional()
  @IsNumber()
  exportAmount?: number | null;

  @ApiPropertyOptional({ example: '1df04ac0-4e64-4b70-8fdc-1594a15051a7' })
  @IsOptional()
  @IsString()
  exportByUser?: string | null;

  @ApiPropertyOptional({ example: 20251215084633 })
  @IsOptional()
  @IsNumber()
  exportTime?: number | null;

  @ApiPropertyOptional({ example: 'npt' })
  @IsOptional()
  @IsString()
  approvalLoginname?: string | null;

  @ApiPropertyOptional({ example: 'NGUYỄN PHƯƠNG THẢO' })
  @IsOptional()
  @IsString()
  approvalUsername?: string | null;

  @ApiPropertyOptional({ example: 20251215074618 })
  @IsOptional()
  @IsNumber()
  approvalTime?: number | null;

  @ApiPropertyOptional({ example: 20251215000000 })
  @IsOptional()
  @IsNumber()
  approvalDate?: number | null;

  @ApiPropertyOptional({ example: 'nth27' })
  @IsOptional()
  @IsString()
  expLoginname?: string | null;

  @ApiPropertyOptional({ example: 'NGUYỄN THỊ HUẾ' })
  @IsOptional()
  @IsString()
  expUsername?: string | null;

  @ApiPropertyOptional({ example: 20251215084633 })
  @IsOptional()
  @IsNumber()
  expTime?: number | null;

  @ApiPropertyOptional({ example: 20251215000000 })
  @IsOptional()
  @IsNumber()
  expDate?: number | null;

  @ApiPropertyOptional({ example: '000017966150' })
  @IsOptional()
  @IsString()
  expMestCode?: string | null;

  @ApiPropertyOptional({ example: 804 })
  @IsOptional()
  @IsNumber()
  mediStockId?: number | null;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber()
  expMestSttId?: number | null;

  @ApiPropertyOptional({ example: 4270.0 })
  @IsOptional()
  @IsNumber()
  impPrice?: number | null;

  @ApiPropertyOptional({ example: 0.0 })
  @IsOptional()
  @IsNumber()
  impVatRatio?: number | null;

  @ApiPropertyOptional({ example: 9267 })
  @IsOptional()
  @IsNumber()
  bidId?: number | null;

  @ApiPropertyOptional({ example: 'SA17461125' })
  @IsOptional()
  @IsString()
  packageNumber?: string | null;

  @ApiPropertyOptional({ example: 20271111235959 })
  @IsOptional()
  @IsNumber()
  expiredDate?: number | null;

  @ApiPropertyOptional({ example: 15179 })
  @IsOptional()
  @IsNumber()
  medicineTypeId?: number | null;

  @ApiPropertyOptional({ example: 'TH.NATR005' })
  @IsOptional()
  @IsString()
  medicineTypeCode?: string | null;

  @ApiPropertyOptional({ example: 'Natri clorid 0,9% - 100ml (Allomed)' })
  @IsOptional()
  @IsString()
  medicineTypeName?: string | null;

  @ApiPropertyOptional({ example: 20251208134648 })
  @IsOptional()
  @IsNumber()
  impTime?: number | null;

  @ApiPropertyOptional({ example: 4976 })
  @IsOptional()
  @IsNumber()
  supplierId?: number | null;

  @ApiPropertyOptional({ example: '40.1021' })
  @IsOptional()
  @IsString()
  medicineBytNumOrder?: string | null;

  @ApiPropertyOptional({ example: 'VD-32457-19' })
  @IsOptional()
  @IsString()
  medicineRegisterNumber?: string | null;

  @ApiPropertyOptional({ example: '40.1021' })
  @IsOptional()
  @IsString()
  activeIngrBhytCode?: string | null;

  @ApiPropertyOptional({ example: 'Natri clorid' })
  @IsOptional()
  @IsString()
  activeIngrBhytName?: string | null;

  @ApiPropertyOptional({ example: '0,9% 100ml' })
  @IsOptional()
  @IsString()
  concentra?: string | null;

  @ApiPropertyOptional({ example: 'N4' })
  @IsOptional()
  @IsString()
  tdlBidGroupCode?: string | null;

  @ApiPropertyOptional({ example: 'G1' })
  @IsOptional()
  @IsString()
  tdlBidPackageCode?: string | null;

  @ApiPropertyOptional({ example: 28933 })
  @IsOptional()
  @IsNumber()
  serviceId?: number | null;

  @ApiPropertyOptional({ example: 'Việt Nam' })
  @IsOptional()
  @IsString()
  nationalName?: string | null;

  @ApiPropertyOptional({ example: 1634 })
  @IsOptional()
  @IsNumber()
  manufacturerId?: number | null;

  @ApiPropertyOptional({ example: '40.1021' })
  @IsOptional()
  @IsString()
  bytNumOrder?: string | null;

  @ApiPropertyOptional({ example: 'VD-32457-19' })
  @IsOptional()
  @IsString()
  registerNumber?: string | null;

  @ApiPropertyOptional({ example: 8 })
  @IsOptional()
  @IsNumber()
  medicineGroupId?: number | null;

  @ApiPropertyOptional({ example: 47 })
  @IsOptional()
  @IsNumber()
  serviceUnitId?: number | null;

  @ApiPropertyOptional({ example: '47' })
  @IsOptional()
  @IsString()
  serviceUnitCode?: string | null;

  @ApiPropertyOptional({ example: 'Túi' })
  @IsOptional()
  @IsString()
  serviceUnitName?: string | null;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsNumber()
  medicineNumOrder?: number | null;

  @ApiPropertyOptional({ example: 'NCC4613' })
  @IsOptional()
  @IsString()
  supplierCode?: string | null;

  @ApiPropertyOptional({ example: 'Công ty CPTM Dược phẩm Việt Đức' })
  @IsOptional()
  @IsString()
  supplierName?: string | null;

  @ApiPropertyOptional({ example: '5283/QĐ-BM' })
  @IsOptional()
  @IsString()
  bidNumber?: string | null;

  @ApiPropertyOptional({ example: 'Dược nội trú_5283/QĐ-BM (ĐTRR.GEN.01.2025.2026)' })
  @IsOptional()
  @IsString()
  bidName?: string | null;

  @ApiPropertyOptional({ example: '2.15' })
  @IsOptional()
  @IsString()
  medicineUseFormCode?: string | null;

  @ApiPropertyOptional({ example: 'Tiêm truyền' })
  @IsOptional()
  @IsString()
  medicineUseFormName?: string | null;

  @ApiPropertyOptional({ example: 98 })
  @IsOptional()
  @IsNumber()
  medicineUseFormNumOrder?: number | null;

  @ApiPropertyOptional({ example: 18962.0 })
  @IsOptional()
  @IsNumber()
  sumInStock?: number | null;

  @ApiPropertyOptional({ example: 1340.0 })
  @IsOptional()
  @IsNumber()
  sumByMedicineInStock?: number | null;
}

