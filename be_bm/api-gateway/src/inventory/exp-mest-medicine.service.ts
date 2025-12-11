import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { firstValueFrom } from 'rxjs';

interface ExpMestMedicineGrpcService {
  findAll(data: any): any;
  findById(data: { id: string }): any;
  findByHisId(data: { id: string }): any;
  findByExpMestId(data: { id: string }): any;
  count(data: any): any;
  create(data: any): any;
  update(data: any): any;
  destroy(data: any): any;
}

@Injectable()
export class ExpMestMedicineService implements OnModuleInit {
  private expMestMedicineGrpcService: ExpMestMedicineGrpcService;

  constructor(
    @Inject('INVENTORY_PACKAGE') private readonly client: ClientGrpc,
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ExpMestMedicineService.name);
  }

  onModuleInit() {
    this.expMestMedicineGrpcService = this.client.getService<ExpMestMedicineGrpcService>('ExpMestMedicineService');
  }

  async findAll(query?: any) {
    this.logger.info('ExpMestMedicineService#findAll.call', query);
    const result = await firstValueFrom(this.expMestMedicineGrpcService.findAll(query || {})) as any;
    this.logger.info('ExpMestMedicineService#findAll.result', result);
    const medicines = result.data || [];
    // Convert Long objects to numbers for Oracle compatibility
    medicines.forEach((medicine: any) => this.convertLongToNumber(medicine));
    return medicines;
  }

  async findById(id: string) {
    this.logger.info('ExpMestMedicineService#findById.call', { id });
    const result = await firstValueFrom(this.expMestMedicineGrpcService.findById({ id })) as any;
    this.logger.info('ExpMestMedicineService#findById.result', result);
    // Convert Long objects to numbers for Oracle compatibility
    this.convertLongToNumber(result);
    return result;
  }

  async findByHisId(hisId: number) {
    this.logger.info('ExpMestMedicineService#findByHisId.call', { hisId });
    const result = await firstValueFrom(this.expMestMedicineGrpcService.findByHisId({ id: hisId.toString() })) as any;
    this.logger.info('ExpMestMedicineService#findByHisId.result', result);
    // Convert Long objects to numbers for Oracle compatibility
    this.convertLongToNumber(result);
    return result;
  }

  async findByExpMestId(expMestId: number) {
    this.logger.info('ExpMestMedicineService#findByExpMestId.call', { expMestId });
    const result = await firstValueFrom(this.expMestMedicineGrpcService.findByExpMestId({ id: expMestId.toString() })) as any;
    this.logger.info('ExpMestMedicineService#findByExpMestId.result', result);
    const medicines = result.data || [];
    // Convert Long objects to numbers for Oracle compatibility
    medicines.forEach((medicine: any) => this.convertLongToNumber(medicine));
    return medicines;
  }

  async count(query?: any) {
    this.logger.info('ExpMestMedicineService#count.call', query);
    const result = await firstValueFrom(this.expMestMedicineGrpcService.count(query || {})) as any;
    this.logger.info('ExpMestMedicineService#count.result', result);
    return result.count || 0;
  }

  async create(data: any) {
    this.logger.info('ExpMestMedicineService#create.call', { hisId: data.hisId, expMestId: data.expMestId, createdBy: data.createdBy });
    const result = await firstValueFrom(this.expMestMedicineGrpcService.create(data)) as any;
    this.logger.info('ExpMestMedicineService#create.result', result);
    // Convert Long objects to numbers for Oracle compatibility
    this.convertLongToNumber(result);
    return result;
  }

  async update(id: string, data: any) {
    this.logger.info('ExpMestMedicineService#update.call', { id, updatedBy: data.updatedBy });
    const result = await firstValueFrom(this.expMestMedicineGrpcService.update({ id, ...data })) as any;
    this.logger.info('ExpMestMedicineService#update.result', result);
    // Convert Long objects to numbers for Oracle compatibility
    this.convertLongToNumber(result);
    return result;
  }

  async delete(id: string) {
    this.logger.info('ExpMestMedicineService#delete.call', { id });
    const result = await firstValueFrom(this.expMestMedicineGrpcService.destroy({ where: JSON.stringify({ id }) })) as any;
    this.logger.info('ExpMestMedicineService#delete.result', result);
    return result;
  }

  /**
   * Convert Long objects to numbers for Oracle compatibility
   */
  private convertLongToNumber(medicine: any): void {
    if (!medicine) return;
    
    const numberFields = [
      'hisId', 'expMestId', 'medicineId', 'tdlMediStockId', 'tdlMedicineTypeId',
      'expMestMetyReqId', 'ckImpMestMedicineId', 'isExport', 'amount', 'exportAmount',
      'exportTime', 'approvalTime', 'approvalDate', 'expTime', 'expDate',
      'mediStockId', 'expMestSttId', 'impPrice', 'impVatRatio', 'bidId',
      'expiredDate', 'medicineTypeId', 'impTime', 'supplierId', 'medicineGroupId',
      'serviceUnitId', 'medicineNumOrder', 'serviceId', 'manufacturerId',
      'medicineUseFormNumOrder', 'sumInStock', 'sumByMedicineInStock',
    ];
    
    numberFields.forEach(field => {
      const value = medicine[field];
      if (value !== null && value !== undefined && typeof value === 'object' && 'low' in value) {
        const longValue = value as { low: number; high: number };
        medicine[field] = longValue.low + (longValue.high * 0x100000000);
      }
    });
  }
}

