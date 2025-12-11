import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ExpMestMedicineResponseDto {
  @ApiProperty({ example: 'uuid-here' })
  id: string;

  @ApiProperty({ example: 30495754 })
  hisId: number;

  @ApiProperty({ example: 17966655 })
  expMestId: number;

  @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'UUID local của ExpMest (optional, for faster joins)' })
  expMestLocalId?: string | null;

  @ApiPropertyOptional({ example: 95622 })
  medicineId?: number | null;

  @ApiPropertyOptional({ example: 804 })
  tdlMediStockId?: number | null;

  @ApiPropertyOptional({ example: 15179 })
  tdlMedicineTypeId?: number | null;

  @ApiPropertyOptional({ example: 1583037 })
  expMestMetyReqId?: number | null;

  @ApiPropertyOptional({ example: 3168599 })
  ckImpMestMedicineId?: number | null;

  @ApiPropertyOptional({ example: 1 })
  isExport?: number | null;

  @ApiPropertyOptional({ example: 141.0 })
  amount?: number | null;

  @ApiPropertyOptional({ example: 141.0 })
  exportAmount?: number | null;

  @ApiPropertyOptional({ example: '1df04ac0-4e64-4b70-8fdc-1594a15051a7' })
  exportByUser?: string | null;

  @ApiPropertyOptional({ example: 20251215084633 })
  exportTime?: number | null;

  @ApiPropertyOptional({ example: 'npt' })
  approvalLoginname?: string | null;

  @ApiPropertyOptional({ example: 'NGUYỄN PHƯƠNG THẢO' })
  approvalUsername?: string | null;

  @ApiPropertyOptional({ example: 20251215074618 })
  approvalTime?: number | null;

  @ApiPropertyOptional({ example: 20251215000000 })
  approvalDate?: number | null;

  @ApiPropertyOptional({ example: 'nth27' })
  expLoginname?: string | null;

  @ApiPropertyOptional({ example: 'NGUYỄN THỊ HUẾ' })
  expUsername?: string | null;

  @ApiPropertyOptional({ example: 20251215084633 })
  expTime?: number | null;

  @ApiPropertyOptional({ example: 20251215000000 })
  expDate?: number | null;

  @ApiPropertyOptional({ example: '000017966150' })
  expMestCode?: string | null;

  @ApiPropertyOptional({ example: 804 })
  mediStockId?: number | null;

  @ApiPropertyOptional({ example: 5 })
  expMestSttId?: number | null;

  @ApiPropertyOptional({ example: 4270.0 })
  impPrice?: number | null;

  @ApiPropertyOptional({ example: 0.0 })
  impVatRatio?: number | null;

  @ApiPropertyOptional({ example: 9267 })
  bidId?: number | null;

  @ApiPropertyOptional({ example: 'SA17461125' })
  packageNumber?: string | null;

  @ApiPropertyOptional({ example: 20271111235959 })
  expiredDate?: number | null;

  @ApiPropertyOptional({ example: 15179 })
  medicineTypeId?: number | null;

  @ApiPropertyOptional({ example: 'TH.NATR005' })
  medicineTypeCode?: string | null;

  @ApiPropertyOptional({ example: 'Natri clorid 0,9% - 100ml (Allomed)' })
  medicineTypeName?: string | null;

  @ApiPropertyOptional({ example: 20251208134648 })
  impTime?: number | null;

  @ApiPropertyOptional({ example: 4976 })
  supplierId?: number | null;

  @ApiPropertyOptional({ example: '40.1021' })
  medicineBytNumOrder?: string | null;

  @ApiPropertyOptional({ example: 'VD-32457-19' })
  medicineRegisterNumber?: string | null;

  @ApiPropertyOptional({ example: '40.1021' })
  activeIngrBhytCode?: string | null;

  @ApiPropertyOptional({ example: 'Natri clorid' })
  activeIngrBhytName?: string | null;

  @ApiPropertyOptional({ example: '0,9% 100ml' })
  concentra?: string | null;

  @ApiPropertyOptional({ example: 'N4' })
  tdlBidGroupCode?: string | null;

  @ApiPropertyOptional({ example: 'G1' })
  tdlBidPackageCode?: string | null;

  @ApiPropertyOptional({ example: 28933 })
  serviceId?: number | null;

  @ApiPropertyOptional({ example: 'Việt Nam' })
  nationalName?: string | null;

  @ApiPropertyOptional({ example: 1634 })
  manufacturerId?: number | null;

  @ApiPropertyOptional({ example: '40.1021' })
  bytNumOrder?: string | null;

  @ApiPropertyOptional({ example: 'VD-32457-19' })
  registerNumber?: string | null;

  @ApiPropertyOptional({ example: 8 })
  medicineGroupId?: number | null;

  @ApiPropertyOptional({ example: 47 })
  serviceUnitId?: number | null;

  @ApiPropertyOptional({ example: '47' })
  serviceUnitCode?: string | null;

  @ApiPropertyOptional({ example: 'Túi' })
  serviceUnitName?: string | null;

  @ApiPropertyOptional({ example: 30 })
  medicineNumOrder?: number | null;

  @ApiPropertyOptional({ example: 'NCC4613' })
  supplierCode?: string | null;

  @ApiPropertyOptional({ example: 'Công ty CPTM Dược phẩm Việt Đức' })
  supplierName?: string | null;

  @ApiPropertyOptional({ example: '5283/QĐ-BM' })
  bidNumber?: string | null;

  @ApiPropertyOptional({ example: 'Dược nội trú_5283/QĐ-BM (ĐTRR.GEN.01.2025.2026)' })
  bidName?: string | null;

  @ApiPropertyOptional({ example: '2.15' })
  medicineUseFormCode?: string | null;

  @ApiPropertyOptional({ example: 'Tiêm truyền' })
  medicineUseFormName?: string | null;

  @ApiPropertyOptional({ example: 98 })
  medicineUseFormNumOrder?: number | null;

  @ApiPropertyOptional({ example: 18962.0 })
  sumInStock?: number | null;

  @ApiPropertyOptional({ example: 1340.0 })
  sumByMedicineInStock?: number | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  version: number;

  @ApiProperty()
  isActive: number;
}

