import { Injectable, Inject } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { FindManyOptions, DataSource, EntityManager } from 'typeorm';
import { InpatientExpMestRepository } from '../repositories/inpatient-exp-mest.repository';
import { InpatientExpMest } from '../entities/inpatient-exp-mest.entity';
import { CreateInpatientExpMestDto } from '../dto/create-inpatient-exp-mest.dto';
import { UpdateInpatientExpMestDto } from '../dto/update-inpatient-exp-mest.dto';
import { InpatientExpMestChildService } from './inpatient-exp-mest-child.service';
import { InpatientExpMestMedicineService } from './inpatient-exp-mest-medicine.service';

@Injectable()
export class InpatientExpMestService {
  constructor(
    private readonly repository: InpatientExpMestRepository,
    private readonly childService: InpatientExpMestChildService,
    private readonly medicineService: InpatientExpMestMedicineService,
    private readonly dataSource: DataSource,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(InpatientExpMestService.name);
  }

  async findAll(options?: FindManyOptions<InpatientExpMest>): Promise<InpatientExpMest[]> {
    this.logger.info('InpatientExpMestService#findAll.call', options);
    return this.repository.findAll(options);
  }

  async findById(id: string): Promise<InpatientExpMest | null> {
    this.logger.info('InpatientExpMestService#findById.call', { id });
    return this.repository.findById(id);
  }

  async findByHisExpMestId(hisExpMestId: number): Promise<InpatientExpMest | null> {
    this.logger.info('InpatientExpMestService#findByHisExpMestId.call', { hisExpMestId });
    return this.repository.findByHisExpMestId(hisExpMestId);
  }

  async findByHisExpMestIds(hisExpMestIds: number[]): Promise<InpatientExpMest[]> {
    this.logger.info('InpatientExpMestService#findByHisExpMestIds.call', { count: hisExpMestIds.length });
    return this.repository.findByHisExpMestIds(hisExpMestIds);
  }

  async create(dto: CreateInpatientExpMestDto): Promise<InpatientExpMest> {
    this.logger.info('InpatientExpMestService#create.call', { hisExpMestId: dto.hisExpMestId });
    return this.repository.create(dto);
  }

  async update(id: string, dto: UpdateInpatientExpMestDto): Promise<InpatientExpMest> {
    this.logger.info('InpatientExpMestService#update.call', { id });
    return this.repository.update(id, dto);
  }

  async count(options?: FindManyOptions<InpatientExpMest>): Promise<number> {
    this.logger.info('InpatientExpMestService#count.call', options);
    return this.repository.count(options);
  }

  /**
   * Sync từ Integration API vào local inventory
   */
  async syncFromIntegrationApi(
    hisData: any,
    userId: string,
    workingStateId?: string | null,

    entityManager?: EntityManager,
  ): Promise<InpatientExpMest> {
    this.logger.info('InpatientExpMestService#syncFromIntegrationApi.call', {
      hisExpMestId: hisData.id,
      userId,
      workingStateId,
    });

    try {
      // Check if exists
      const existing = await this.repository.findByHisExpMestId(hisData.id, entityManager);

      const syncDto: CreateInpatientExpMestDto = {
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
        tdlPatientTypeId: hisData.tdlPatientTypeId || null,
        virCreateMonth: hisData.virCreateMonth || null,
        virCreateYear: hisData.virCreateYear || null,
        reqUserTitle: hisData.reqUserTitle || null,
        expMestSubCode: hisData.expMestSubCode || null,
        expMestSubCode2: hisData.expMestSubCode2 || null,
        numOrder: hisData.numOrder || null,
        tdlAggrPatientCode: hisData.tdlAggrPatientCode || null,
        tdlAggrTreatmentCode: hisData.tdlAggrTreatmentCode || null,
        expMestTypeCode: hisData.expMestTypeCode || null,
        expMestTypeName: hisData.expMestTypeName || null,
        expMestSttCode: hisData.expMestSttCode || null,
        expMestSttName: hisData.expMestSttName || null,
        mediStockCode: hisData.mediStockCode || null,
        mediStockName: hisData.mediStockName || null,
        reqDepartmentCode: hisData.reqDepartmentCode || null,
        reqDepartmentName: hisData.reqDepartmentName || null,
        tdlIntructionDateMin: (() => {
          const value = hisData.tdlIntructionDateMin;
          if (value === undefined || value === null) {
            return null;
          }
          const numValue = typeof value === 'number' ? value : Number(value);
          return Math.floor(numValue);
        })(),
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
        reqRoomCode: hisData.reqRoomCode || null,
        reqRoomName: hisData.reqRoomName || null,
        groupCode: hisData.groupCode || null,
        workingStateId: workingStateId || null,
        hisCreateTime: hisData.createTime || null,
        hisModifyTime: hisData.modifyTime || null,
        hisCreator: hisData.creator || null,
        hisModifier: hisData.modifier || null,
        createdBy: userId,
      };

      if (existing) {
        console.log(`[InpatientExpMest] Updating existing record: ID=${existing.id}, HIS_ID=${hisData.id}`);
        const updateDto: UpdateInpatientExpMestDto = {
          ...syncDto,
          updatedBy: userId,
        };
        return await this.repository.update(existing.id, updateDto, entityManager);
      } else {
        console.log(`[InpatientExpMest] Creating new record: HIS_ID=${hisData.id}`);
        return await this.repository.create(syncDto, entityManager);
      }
    } catch (error: any) {
      this.logger.error('InpatientExpMestService#syncFromIntegrationApi.error', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  /**
   * Sync tất cả dữ liệu vào 3 bảng trong transaction:
   * 1. EXP_INPATIENT_EXP_MEST (phiếu cha)
   * 2. EXP_INP_EXP_MEST_CHILD (phiếu con)
   * 3. EXP_INP_EXP_MEST_MED (medicines)
   */
  async syncAllInTransaction(data: {
    parentData: any; // Phiếu cha từ HIS
    childrenData?: any[]; // Danh sách phiếu con từ HIS (optional)
    medicinesData?: any[]; // Danh sách medicines từ HIS (optional)
    userId: string;
    workingStateId?: string | null;
  }): Promise<{
    parent: InpatientExpMest;
    children: any[];
    medicines: any[];
  }> {

    this.logger.info('InpatientExpMestService#syncAllInTransaction.call', {
      hisExpMestId: data.parentData.id,
      childrenCount: data.childrenData?.length || 0,
      medicinesCount: data.medicinesData?.length || 0,
      userId: data.userId,
    });

    // Use transaction to ensure all-or-nothing
    return await this.dataSource.transaction(async (manager) => {
      try {
        console.log('=== [SyncAllInTransaction] STARTED ===');
        console.log(`Transaction Data: ParentID=${data.parentData.id}, Children=${data.childrenData?.length}, Medicines=${data.medicinesData?.length}`);

        // 1. Sync phiếu cha
        const parent = await this.syncFromIntegrationApi(
          data.parentData,
          data.userId,
          data.workingStateId,
          manager, // Pass transaction manager
        );

        // 2. Sync các phiếu con (nếu có) và lưu cả hisData để dùng cho medicines
        const children: any[] = [];
        const childrenDataMap = new Map<number, any>(); // Map để lưu hisData của child
        if (data.childrenData && data.childrenData.length > 0) {
          // Reset flag để log bản ghi đầu tiên
          InpatientExpMestChildService.resetLogFlag();
          for (const childData of data.childrenData) {
            const child = await this.childService.syncFromIntegrationApi(
              childData,
              data.parentData.id, // aggrExpMestId
              parent.id, // aggrExpMestLocalId
              data.userId,
              manager, // Pass transaction manager
            );
            children.push(child);
            // Lưu hisData của child để dùng cho medicines
            childrenDataMap.set(child.hisExpMestId, childData);
          }
        } else {
          // Case: Single ExpMest (No children). Generate a default Child from Parent Data.
          // This ensures that medicines (which link to Child ID) can be saved and retrieved.
          console.log('[SyncAllInTransaction] No childrenData. Creating default child from ParentData for Single ExpMest.');
          try {
            const child = await this.childService.syncFromIntegrationApi(
              data.parentData,
              data.parentData.id, // aggrExpMestId (Self)
              parent.id, // aggrExpMestLocalId
              data.userId,
              manager,
            );
            children.push(child);
            childrenDataMap.set(child.hisExpMestId, data.parentData);
          } catch (err) {
            console.error('[SyncAllInTransaction] Failed to create default child:', err);
            // Don't throw? Or throw? check if strictly required.
            // If we don't create child, medicines won't be saved. So logging is enough, code below handles empty children.
          }
        }

        // 3. Sync medicines (nếu có)
        const medicines: any[] = [];
        if (data.medicinesData && data.medicinesData.length > 0) {
          for (const medicineData of data.medicinesData) {
            // Tìm child tương ứng với medicine này
            const childExpMestId = medicineData.expMestId || medicineData.EXP_MEST_ID;
            const child = children.find(c => c.hisExpMestId === childExpMestId);
            const childHisData = childrenDataMap.get(childExpMestId);

            if (child && childHisData) {

              // Helper function to enrich field: use medicineData value if exists and not null, otherwise use childHisData value
              const enrichField = (fieldName: string, isNumeric: boolean = false) => {
                const medicineValue = medicineData[fieldName];
                const childValue = childHisData[fieldName];

                // For numeric fields: use medicine value if it exists (including 0), otherwise use child value
                if (isNumeric) {
                  if (medicineValue !== undefined && medicineValue !== null) {
                    return medicineValue;
                  }
                  if (childValue !== undefined && childValue !== null) {
                    return childValue;
                  }
                  return null;
                }

                // For string/other fields: use medicine value if it exists and is not empty, otherwise use child value
                if (medicineValue !== undefined && medicineValue !== null && medicineValue !== '') {
                  return medicineValue;
                }
                if (childValue !== undefined && childValue !== null && childValue !== '') {
                  return childValue;
                }
                return null;
              };

              // Enrich medicine data with child hisData if missing
              const enrichedMedicineData = {
                ...medicineData,
                // Fill in missing fields from child hisData if not present in medicine data
                aggrExpMestId: enrichField('aggrExpMestId', true) || data.parentData.id,
                reqRoomId: enrichField('reqRoomId', true),
                reqDepartmentId: enrichField('reqDepartmentId', true),
                reqUserTitle: enrichField('reqUserTitle', false),
                reqLoginname: enrichField('reqLoginname', false),
                reqUsername: enrichField('reqUsername', false),
                expMestTypeId: enrichField('expMestTypeId', true),
                // Enrich additional fields from child if available
                mediStockCode: enrichField('mediStockCode', false),
                mediStockName: enrichField('mediStockName', false),
              };

              const medicine = await this.medicineService.syncFromIntegrationApi(
                enrichedMedicineData,
                childExpMestId, // inpatientExpMestId
                child.id, // inpatientExpMestLocalId
                data.userId,
                manager, // Pass transaction manager
              );
              medicines.push(medicine);
            }
          }
        }

        return {
          parent,
          children,
          medicines
        };
      } catch (error: any) {
        console.error('=== [SyncAllInTransaction] FAILED ===');
        console.error(error);
        this.logger.error('InpatientExpMestService#syncAllInTransaction.error', {
          error: error.message,
          stack: error.stack,
        });
        throw error;
      }
    });
  }
}

