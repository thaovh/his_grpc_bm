import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { FindManyOptions, EntityManager } from 'typeorm';
import { InpatientExpMestChildRepository } from '../repositories/inpatient-exp-mest-child.repository';
import { InpatientExpMestChild } from '../entities/inpatient-exp-mest-child.entity';
import { CreateInpatientExpMestChildDto } from '../dto/create-inpatient-exp-mest-child.dto';
import { UpdateInpatientExpMestChildDto } from '../dto/update-inpatient-exp-mest-child.dto';

@Injectable()
export class InpatientExpMestChildService {
  private static firstChildLogged = false; // Flag to log only first child

  constructor(
    private readonly repository: InpatientExpMestChildRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(InpatientExpMestChildService.name);
  }

  /**
   * Reset flag để log bản ghi đầu tiên cho lần sync tiếp theo
   */
  static resetLogFlag(): void {
    InpatientExpMestChildService.firstChildLogged = false;
  }

  async findAll(options?: FindManyOptions<InpatientExpMestChild>): Promise<InpatientExpMestChild[]> {
    this.logger.info('InpatientExpMestChildService#findAll.call', options);
    return this.repository.findAll(options);
  }

  async findById(id: string): Promise<InpatientExpMestChild | null> {
    this.logger.info('InpatientExpMestChildService#findById.call', { id });
    return this.repository.findById(id);
  }

  async findByHisExpMestId(hisExpMestId: number): Promise<InpatientExpMestChild | null> {
    this.logger.info('InpatientExpMestChildService#findByHisExpMestId.call', { hisExpMestId });
    return this.repository.findByHisExpMestId(hisExpMestId);
  }

  async findByAggrExpMestId(aggrExpMestId: number): Promise<InpatientExpMestChild[]> {
    this.logger.info('InpatientExpMestChildService#findByAggrExpMestId.call', { aggrExpMestId });
    return this.repository.findByAggrExpMestId(aggrExpMestId);
  }

  async create(dto: CreateInpatientExpMestChildDto): Promise<InpatientExpMestChild> {
    this.logger.info('InpatientExpMestChildService#create.call', { hisExpMestId: dto.hisExpMestId });
    return this.repository.create(dto);
  }

  async update(id: string, dto: UpdateInpatientExpMestChildDto): Promise<InpatientExpMestChild> {
    this.logger.info('InpatientExpMestChildService#update.call', { id });
    return this.repository.update(id, dto);
  }

  async count(options?: FindManyOptions<InpatientExpMestChild>): Promise<number> {
    this.logger.info('InpatientExpMestChildService#count.call', options);
    return this.repository.count(options);
  }

  /**
   * Sync từ Integration API vào local inventory
   */
  async syncFromIntegrationApi(
    hisData: any,
    aggrExpMestId: number,
    aggrExpMestLocalId: string | null,
    userId: string,
    entityManager?: EntityManager,
  ): Promise<InpatientExpMestChild> {
    this.logger.info('InpatientExpMestChildService#syncFromIntegrationApi.call', {
      hisExpMestId: hisData.id,
      aggrExpMestId,
      userId,
    });

    try {
      // Check if exists
      const existing = await this.repository.findByHisExpMestId(hisData.id, entityManager);
      const syncDto: CreateInpatientExpMestChildDto = {
        hisExpMestId: (() => {
          const value = hisData.id;
          if (value === undefined || value === null) return null;
          return typeof value === 'number' ? value : Number(value);
        })(),
        aggrExpMestId: typeof aggrExpMestId === 'number' ? aggrExpMestId : Number(aggrExpMestId),
        aggrExpMestLocalId,
        expMestCode: hisData.expMestCode || null,
        expMestTypeId: (() => {
          const value = hisData.expMestTypeId;
          if (value === undefined || value === null) return null;
          return typeof value === 'number' ? value : Number(value);
        })(),
        expMestSttId: (() => {
          const value = hisData.expMestSttId;
          if (value === undefined || value === null) return null;
          return typeof value === 'number' ? value : Number(value);
        })(),
        mediStockId: (() => {
          const value = hisData.mediStockId;
          if (value === undefined || value === null) return null;
          return typeof value === 'number' ? value : Number(value);
        })(),
        reqLoginname: hisData.reqLoginname || null,
        reqUsername: hisData.reqUsername || null,
        reqRoomId: (() => {
          const value = hisData.reqRoomId;
          if (value === undefined || value === null) return null;
          return typeof value === 'number' ? value : Number(value);
        })(),
        reqDepartmentId: (() => {
          const value = hisData.reqDepartmentId;
          if (value === undefined || value === null) return null;
          return typeof value === 'number' ? value : Number(value);
        })(),
        createDate: (() => {
          const value = hisData.createDate;
          if (value === undefined || value === null) return null;
          return typeof value === 'number' ? value : Number(value);
        })(),
        tdlPatientTypeId: (() => {
          const value = hisData.tdlPatientTypeId;
          if (value === undefined || value === null) return null;
          return typeof value === 'number' ? value : Number(value);
        })(),
        virCreateMonth: (() => {
          const value = hisData.virCreateMonth;
          if (value === undefined || value === null) return null;
          return typeof value === 'number' ? value : Number(value);
        })(),
        virCreateYear: (() => {
          const value = hisData.virCreateYear;
          if (value === undefined || value === null) return null;
          return typeof value === 'number' ? value : Number(value);
        })(),
        reqUserTitle: hisData.reqUserTitle || null,
        expMestSubCode: hisData.expMestSubCode || null,
        expMestSubCode2: hisData.expMestSubCode2 || null,
        numOrder: (() => {
          const value = hisData.numOrder;
          if (value === undefined || value === null) return null;
          return typeof value === 'number' ? value : Number(value);
        })(),
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
        tdlIntructionDateMin: hisData.tdlIntructionDateMin !== undefined && hisData.tdlIntructionDateMin !== null
          ? Math.floor(typeof hisData.tdlIntructionDateMin === 'number' ? hisData.tdlIntructionDateMin : Number(hisData.tdlIntructionDateMin))
          : null,
        lastExpLoginname: hisData.lastExpLoginname || null,
        lastExpUsername: hisData.lastExpUsername || null,
        lastExpTime: (() => {
          const value = hisData.lastExpTime;
          if (value === undefined || value === null) return null;
          return typeof value === 'number' ? value : Number(value);
        })(),
        finishTime: (() => {
          const value = hisData.finishTime;
          if (value === undefined || value === null) return null;
          return typeof value === 'number' ? value : Number(value);
        })(),
        finishDate: (() => {
          const value = hisData.finishDate;
          if (value === undefined || value === null) return null;
          return typeof value === 'number' ? value : Number(value);
        })(),
        isExportEqualApprove: (() => {
          const value = hisData.isExportEqualApprove;
          if (value === undefined || value === null) return null;
          return typeof value === 'number' ? value : Number(value);
        })(),
        lastApprovalLoginname: hisData.lastApprovalLoginname || null,
        lastApprovalUsername: hisData.lastApprovalUsername || null,
        lastApprovalTime: (() => {
          const value = hisData.lastApprovalTime;
          if (value === undefined || value === null) return null;
          return typeof value === 'number' ? value : Number(value);
        })(),
        lastApprovalDate: (() => {
          const value = hisData.lastApprovalDate;
          if (value === undefined || value === null) return null;
          return typeof value === 'number' ? value : Number(value);
        })(),
        reqRoomCode: hisData.reqRoomCode || null,
        reqRoomName: hisData.reqRoomName || null,
        groupCode: hisData.groupCode || null,
        hisCreateTime: (() => {
          const value = hisData.createTime;
          if (value === undefined || value === null) return null;
          return typeof value === 'number' ? value : Number(value);
        })(),
        hisModifyTime: (() => {
          const value = hisData.modifyTime;
          if (value === undefined || value === null) return null;
          return typeof value === 'number' ? value : Number(value);
        })(),
        hisCreator: hisData.creator || null,
        hisModifier: hisData.modifier || null,
        // Service Request fields
        serviceReqId: (() => {
          const value = hisData.serviceReqId;
          if (value === undefined || value === null) return null;
          return typeof value === 'number' ? value : Number(value);
        })(),
        tdlTotalPrice: (() => {
          const value = hisData.tdlTotalPrice;
          if (value === undefined || value === null) return null;
          return typeof value === 'number' ? value : Number(value);
        })(),
        tdlServiceReqCode: hisData.tdlServiceReqCode || null,
        // Instruction fields
        tdlIntructionTime: (() => {
          const value = hisData.tdlIntructionTime;
          if (value === undefined || value === null) return null;
          return typeof value === 'number' ? value : Number(value);
        })(),
        tdlIntructionDate: (() => {
          const value = hisData.tdlIntructionDate;
          if (value === undefined || value === null) return null;
          return typeof value === 'number' ? value : Number(value);
        })(),
        // Treatment fields
        tdlTreatmentId: (() => {
          const value = hisData.tdlTreatmentId;
          if (value === undefined || value === null) return null;
          return typeof value === 'number' ? value : Number(value);
        })(),
        tdlTreatmentCode: hisData.tdlTreatmentCode || null,
        tdlAggrExpMestCode: hisData.tdlAggrExpMestCode || null,
        // Patient fields
        tdlPatientId: (() => {
          const value = hisData.tdlPatientId;
          if (value === undefined || value === null) return null;
          return typeof value === 'number' ? value : Number(value);
        })(),
        tdlPatientCode: hisData.tdlPatientCode || null,
        tdlPatientName: hisData.tdlPatientName || null,
        tdlPatientFirstName: hisData.tdlPatientFirstName || null,
        tdlPatientLastName: hisData.tdlPatientLastName || null,
        tdlPatientDob: (() => {
          const value = hisData.tdlPatientDob;
          if (value === undefined || value === null) return null;
          return typeof value === 'number' ? value : Number(value);
        })(),
        tdlPatientIsHasNotDayDob: (() => {
          const value = hisData.tdlPatientIsHasNotDayDob;
          if (value === undefined || value === null) return null;
          return typeof value === 'number' ? value : Number(value);
        })(),
        tdlPatientAddress: hisData.tdlPatientAddress || null,
        tdlPatientGenderId: (() => {
          const value = hisData.tdlPatientGenderId;
          if (value === undefined || value === null) return null;
          return typeof value === 'number' ? value : Number(value);
        })(),
        tdlPatientGenderName: hisData.tdlPatientGenderName || null,
        tdlHeinCardNumber: hisData.tdlHeinCardNumber || null,
        tdlPatientPhone: hisData.tdlPatientPhone || null,
        tdlPatientProvinceCode: hisData.tdlPatientProvinceCode || null,
        tdlPatientCommuneCode: hisData.tdlPatientCommuneCode || null,
        tdlPatientNationalName: hisData.tdlPatientNationalName || null,
        // ICD fields
        icdCode: hisData.icdCode || null,
        icdName: hisData.icdName || null,
        icdSubCode: hisData.icdSubCode || null,
        icdText: hisData.icdText || null,
        // Other fields
        virHeinCardPrefix: hisData.virHeinCardPrefix || null,
        priority: (() => {
          const value = hisData.priority;
          if (value === undefined || value === null) return null;
          return typeof value === 'number' ? value : Number(value);
        })(),
        reqHeadUsername: hisData.reqHeadUsername || null,
        patientTypeName: hisData.patientTypeName || null,
        currentBedIds: hisData.currentBedIds || null,
        createdBy: userId,
      };

      if (existing) {
        console.log(`[Child] Updating: ID=${existing.id}, HIS_ID=${hisData.id}`);
        const updateDto: UpdateInpatientExpMestChildDto = {
          ...syncDto,
          updatedBy: userId,
        };
        const result = await this.repository.update(existing.id, updateDto, entityManager);
        return result;
      } else {
        console.log(`[Child] Creating: HIS_ID=${hisData.id}`);
        const result = await this.repository.create(syncDto, entityManager);
        return result;
      }
    } catch (error: any) {
      console.error('=== InpatientExpMestChildService#syncFromIntegrationApi ERROR ===');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      this.logger.error('InpatientExpMestChildService#syncFromIntegrationApi.error', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}

