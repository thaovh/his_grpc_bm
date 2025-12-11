import { Injectable, Inject } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { FindManyOptions, DataSource } from 'typeorm';
import { ExpMestOtherRepository } from '../repositories/exp-mest-other.repository';
import { ExpMestOther } from '../entities/exp-mest-other.entity';
import { CreateExpMestOtherDto } from '../dto/create-exp-mest-other.dto';
import { UpdateExpMestOtherDto } from '../dto/update-exp-mest-other.dto';
import { ExpMestOtherMedicineService } from './exp-mest-other-medicine.service';

@Injectable()
export class ExpMestOtherService {
  constructor(
    private readonly repository: ExpMestOtherRepository,
    private readonly medicineService: ExpMestOtherMedicineService,
    private readonly dataSource: DataSource,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ExpMestOtherService.name);
  }

  async findAll(options?: FindManyOptions<ExpMestOther>): Promise<ExpMestOther[]> {
    this.logger.info('ExpMestOtherService#findAll.call', options);
    return this.repository.findAll(options);
  }

  async findById(id: string): Promise<ExpMestOther | null> {
    this.logger.info('ExpMestOtherService#findById.call', { id });
    return this.repository.findById(id);
  }

  async findByHisExpMestId(hisExpMestId: number): Promise<ExpMestOther | null> {
    this.logger.info('ExpMestOtherService#findByHisExpMestId.call', { hisExpMestId });
    return this.repository.findByHisExpMestId(hisExpMestId);
  }

  async findByHisExpMestIds(hisExpMestIds: number[]): Promise<ExpMestOther[]> {
    this.logger.info('ExpMestOtherService#findByHisExpMestIds.call', { count: hisExpMestIds.length });
    return this.repository.findByHisExpMestIds(hisExpMestIds);
  }

  async create(dto: CreateExpMestOtherDto): Promise<ExpMestOther> {
    this.logger.info('ExpMestOtherService#create.call', { hisExpMestId: dto.hisExpMestId });
    return this.repository.create(dto);
  }

  async update(id: string, dto: UpdateExpMestOtherDto): Promise<ExpMestOther> {
    this.logger.info('ExpMestOtherService#update.call', { id });
    return this.repository.update(id, dto);
  }

  async count(options?: FindManyOptions<ExpMestOther>): Promise<number> {
    this.logger.info('ExpMestOtherService#count.call', options);
    return this.repository.count(options);
  }

  /**
   * Sync từ Integration API vào local inventory
   */
  async syncFromIntegrationApi(
    hisData: any,
    userId: string,
    workingStateId?: string | null,
  ): Promise<ExpMestOther> {
    this.logger.info('ExpMestOtherService#syncFromIntegrationApi.call', {
      hisExpMestId: hisData.id,
      userId,
      workingStateId,
    });

    try {
      // Check if exists
      const existing = await this.repository.findByHisExpMestId(hisData.id);

      const syncDto: CreateExpMestOtherDto = {
        hisExpMestId: hisData.id,
        expMestCode: hisData.expMestCode || null,
        expMestTypeId: hisData.expMestTypeId || null,
        expMestSttId: hisData.expMestSttId || null,
        mediStockId: hisData.mediStockId || null,
        reqLoginname: hisData.reqLoginname || null,
        reqUsername: hisData.reqUsername || null,
        reqRoomId: hisData.reqRoomId || null,
        reqDepartmentId: hisData.reqDepartmentId || null,
        createDate: hisData.createDate || null,
        reqUserTitle: hisData.reqUserTitle || null,
        serviceReqId: hisData.serviceReqId || null,
        tdlTotalPrice: hisData.tdlTotalPrice || null,
        tdlServiceReqCode: hisData.tdlServiceReqCode || null,
        tdlIntructionTime: hisData.tdlIntructionTime || null,
        tdlIntructionDate: hisData.tdlIntructionDate || null,
        tdlIntructionDateMin: (() => {
          const value = hisData.tdlIntructionDateMin;
          if (value === undefined || value === null) {
            return null;
          }
          const numValue = typeof value === 'number' ? value : Number(value);
          return Math.floor(numValue);
        })(),
        tdlTreatmentId: hisData.tdlTreatmentId || null,
        tdlTreatmentCode: hisData.tdlTreatmentCode || null,
        tdlPatientId: hisData.tdlPatientId || null,
        tdlPatientCode: hisData.tdlPatientCode || null,
        tdlPatientName: hisData.tdlPatientName || null,
        tdlPatientFirstName: hisData.tdlPatientFirstName || null,
        tdlPatientLastName: hisData.tdlPatientLastName || null,
        tdlPatientDob: hisData.tdlPatientDob || null,
        tdlPatientIsHasNotDayDob: hisData.tdlPatientIsHasNotDayDob || null,
        tdlPatientAddress: hisData.tdlPatientAddress || null,
        tdlPatientGenderId: hisData.tdlPatientGenderId || null,
        tdlPatientGenderName: hisData.tdlPatientGenderName || null,
        tdlPatientTypeId: hisData.tdlPatientTypeId || null,
        tdlHeinCardNumber: hisData.tdlHeinCardNumber || null,
        tdlPatientPhone: hisData.tdlPatientPhone || null,
        tdlPatientProvinceCode: hisData.tdlPatientProvinceCode || null,
        tdlPatientDistrictCode: hisData.tdlPatientDistrictCode || null,
        tdlPatientCommuneCode: hisData.tdlPatientCommuneCode || null,
        tdlPatientNationalName: hisData.tdlPatientNationalName || null,
        virCreateMonth: hisData.virCreateMonth || null,
        virCreateYear: hisData.virCreateYear || null,
        virHeinCardPrefix: hisData.virHeinCardPrefix || null,
        icdCode: hisData.icdCode || null,
        icdName: hisData.icdName || null,
        icdSubCode: hisData.icdSubCode || null,
        icdText: hisData.icdText || null,
        expMestTypeCode: hisData.expMestTypeCode || null,
        expMestTypeName: hisData.expMestTypeName || null,
        expMestSttCode: hisData.expMestSttCode || null,
        expMestSttName: hisData.expMestSttName || null,
        mediStockCode: hisData.mediStockCode || null,
        mediStockName: hisData.mediStockName || null,
        reqDepartmentCode: hisData.reqDepartmentCode || null,
        reqDepartmentName: hisData.reqDepartmentName || null,
        reqRoomCode: hisData.reqRoomCode || null,
        reqRoomName: hisData.reqRoomName || null,
        tdlAggrPatientCode: hisData.tdlAggrPatientCode || null,
        tdlAggrTreatmentCode: hisData.tdlAggrTreatmentCode || null,
        expMestSubCode: hisData.expMestSubCode || null,
        expMestSubCode2: hisData.expMestSubCode2 || null,
        numOrder: hisData.numOrder || null,
        priority: hisData.priority || null,
        groupCode: hisData.groupCode || null,
        patientTypeCode: hisData.patientTypeCode || null,
        patientTypeName: hisData.patientTypeName || null,
        treatmentIsActive: hisData.treatmentIsActive || null,
        lastExpLoginname: hisData.lastExpLoginname || null,
        lastExpUsername: hisData.lastExpUsername || null,
        lastExpTime: hisData.lastExpTime || null,
        finishTime: hisData.finishTime || null,
        finishDate: hisData.finishDate || null,
        isExportEqualApprove: hisData.isExportEqualApprove || null,
        lastApprovalLoginname: hisData.lastApprovalLoginname || null,
        lastApprovalUsername: hisData.lastApprovalUsername || null,
        lastApprovalTime: hisData.lastApprovalTime || null,
        lastApprovalDate: hisData.lastApprovalDate || null,
        workingStateId: workingStateId || null,
        hisCreateTime: hisData.createTime || null,
        hisModifyTime: hisData.modifyTime || null,
        hisCreator: hisData.creator || null,
        hisModifier: hisData.modifier || null,
        createdBy: userId,
      };

      if (existing) {
        const updateDto: UpdateExpMestOtherDto = {
          ...syncDto,
          updatedBy: userId,
        };
        return await this.repository.update(existing.id, updateDto);
      } else {
        return await this.repository.create(syncDto);
      }
    } catch (error: any) {
      this.logger.error('ExpMestOtherService#syncFromIntegrationApi.error', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  /**
   * Sync tất cả dữ liệu vào 2 bảng trong transaction:
   * 1. EXP_EXP_MEST_OTHER (phiếu cha)
   * 2. EXP_EXP_MEST_OTHER_MED (medicines)
   */
  async syncAllInTransaction(data: {
    parentData: any; // Phiếu cha từ HIS GetView2
    medicinesData?: any[]; // Danh sách medicines từ HIS GetView1 (optional)
    userId: string;
    workingStateId?: string | null;
  }): Promise<{
    parent: ExpMestOther;
    medicines: any[];
  }> {
    console.log('=== [DEBUG] ExpMestOtherService#syncAllInTransaction.start ===');
    console.log('parentData.id:', data.parentData?.id);
    console.log('medicinesCount:', data.medicinesData?.length || 0);
    console.log('userId:', data.userId);
    console.log('workingStateId:', data.workingStateId);
    this.logger.info('ExpMestOtherService#syncAllInTransaction.call', {
      hisExpMestId: data.parentData.id,
      medicinesCount: data.medicinesData?.length || 0,
      userId: data.userId,
    });

    // Use transaction to ensure all-or-nothing
    return await this.dataSource.transaction(async (manager) => {
      try {
        // 1. Sync phiếu cha
        console.log('=== [DEBUG] ExpMestOtherService#syncAllInTransaction.step1: Sync parent ===');
        const parent = await this.syncFromIntegrationApi(
          data.parentData,
          data.userId,
          data.workingStateId,
        );
        console.log('=== [DEBUG] ExpMestOtherService#syncAllInTransaction.step1.result ===');
        console.log('parent.id:', parent?.id);
        console.log('parent.hisExpMestId:', parent?.hisExpMestId);

        // 2. Sync medicines (nếu có)
        console.log('=== [DEBUG] ExpMestOtherService#syncAllInTransaction.step2: Sync medicines ===');
        const medicines: any[] = [];
        if (data.medicinesData && data.medicinesData.length > 0) {
          console.log('Processing', data.medicinesData.length, 'medicines');
          for (let i = 0; i < data.medicinesData.length; i++) {
            const medicineData = data.medicinesData[i];
            console.log(`=== [DEBUG] ExpMestOtherService#syncAllInTransaction.step2.medicine[${i}] ===`);
            console.log('medicineData.id:', medicineData?.id);
            console.log('medicineData keys:', medicineData ? Object.keys(medicineData).slice(0, 10) : 'null');
            try {
              const medicine = await this.medicineService.syncFromIntegrationApi(
                medicineData,
                data.parentData.id, // expMestId
                parent.id, // expMestLocalId
                data.userId,
                data.parentData, // Pass parentData for enrichment
              );
              console.log(`Medicine[${i}] synced successfully, id:`, medicine?.id);
              medicines.push(medicine);
            } catch (error: any) {
              console.error(`=== [DEBUG] ExpMestOtherService#syncAllInTransaction.step2.medicine[${i}].error ===`);
              console.error('Error syncing medicine:', error?.message);
              console.error('Error stack:', error?.stack);
              throw error;
            }
          }
        }
        console.log('=== [DEBUG] ExpMestOtherService#syncAllInTransaction.step2.result ===');
        console.log('medicines.length:', medicines.length);

        console.log('=== [DEBUG] ExpMestOtherService#syncAllInTransaction.success ===');
        return {
          parent,
          medicines,
        };
      } catch (error: any) {
        console.error('=== [DEBUG] ExpMestOtherService#syncAllInTransaction.error ===');
        console.error('Error type:', error?.constructor?.name);
        console.error('Error message:', error?.message);
        console.error('Error stack:', error?.stack);
        this.logger.error('ExpMestOtherService#syncAllInTransaction.error', {
          error: error.message,
          stack: error.stack,
        });
        throw error;
      }
    });
  }
}

