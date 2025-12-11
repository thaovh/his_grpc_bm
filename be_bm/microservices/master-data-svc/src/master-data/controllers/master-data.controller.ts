
import { PinoLogger } from 'nestjs-pino';
import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { isEmpty } from 'lodash';

import { Query, Count, Id, Name } from '../../commons/interfaces/commons.interface';
import {
  MasterDataService,
  UnitOfMeasureQueryResult,
  ExportStatusQueryResult,
  BranchQueryResult,
  DepartmentTypeQueryResult,
  DepartmentQueryResult,
  MachineFundingSourceQueryResult,
  ManufacturerCountryQueryResult,
  MachineDocumentType,
  MachineDocumentTypeList,
  CreateMachineDocumentTypeInput,
  UpdateMachineDocumentTypeInput,
  MachineCategory,
  MachineStatus,
  MachineStatusList,
  MachineUnit,
  MachineUnitList,
  Vendor,
  VendorList,
  MaintenanceType,
  MaintenanceTypeList,
  TransferStatusList,
  TransferTypeList,
  NotificationType,
  NotificationTypeList,
} from '../master-data.interface';
import { UnitOfMeasure } from '../unit-of-measure/entities/unit-of-measure.entity';
import { ExportStatus } from '../export-status/entities/export-status.entity';
import { Branch } from '../branch/entities/branch.entity';
import { DepartmentType } from '../department-type/entities/department-type.entity';
import { Department } from '../department/entities/department.entity';
import { MachineFundingSource } from '../machine-funding-source/entities/machine-funding-source.entity';
import { ManufacturerCountry } from '../manufacturer-country/entities/manufacturer-country.entity';
import { TransferStatus } from '../transfer-status/entities/transfer-status.entity';
import { TransferType } from '../transfer-type/entities/transfer-type.entity';
import { CreateUnitOfMeasureDto } from '../unit-of-measure/dto/create-unit-of-measure.dto';
import { UpdateUnitOfMeasureDto } from '../unit-of-measure/dto/update-unit-of-measure.dto';
import { CreateExportStatusDto } from '../export-status/dto/create-export-status.dto';
import { UpdateExportStatusDto } from '../export-status/dto/update-export-status.dto';
import { CreateBranchDto } from '../branch/dto/create-branch.dto';
import { UpdateBranchDto } from '../branch/dto/update-branch.dto';
import { CreateDepartmentTypeDto } from '../department-type/dto/create-department-type.dto';
import { UpdateDepartmentTypeDto } from '../department-type/dto/update-department-type.dto';
import { CreateDepartmentDto } from '../department/dto/create-department.dto';
import { UpdateDepartmentDto } from '../department/dto/update-department.dto';
import { CreateMachineFundingSourceDto } from '../machine-funding-source/dto/create-machine-funding-source.dto';
import { UpdateMachineFundingSourceDto } from '../machine-funding-source/dto/update-machine-funding-source.dto';
import { CreateManufacturerCountryDto } from '../manufacturer-country/dto/create-manufacturer-country.dto';
import { UpdateManufacturerCountryDto } from '../manufacturer-country/dto/update-manufacturer-country.dto';
import { CreateMachineDocumentTypeDto } from '../machine-document-type/dto/create-machine-document-type.dto';
import { UpdateMachineDocumentTypeDto } from '../machine-document-type/dto/update-machine-document-type.dto';
import { CreateNotificationTypeDto } from '../notification-type/dto/create-notification-type.dto';
import { UpdateNotificationTypeDto } from '../notification-type/dto/update-notification-type.dto';

@Controller('master-data')
export class MasterDataController {
  constructor(
    @Inject('MasterDataService') private readonly masterDataService: MasterDataService,
    private readonly logger: PinoLogger,
  ) {
    logger.setContext(MasterDataController.name);
  }

  // Unit of Measure methods
  @GrpcMethod('MasterDataService', 'findAllUnitOfMeasures')
  async findAllUnitOfMeasures(query: Query): Promise<UnitOfMeasureQueryResult> {
    this.logger.info('MasterDataController#findAllUnitOfMeasures.call', query);

    const result: Array<UnitOfMeasure> = await this.masterDataService.findAllUnitOfMeasures({
      select: !isEmpty(query.attributes) ? query.attributes as any : undefined,
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
      order: !isEmpty(query.order) ? JSON.parse(query.order) : undefined,
      skip: query.offset ? query.offset : 0,
      take: query.limit ? query.limit : 25,
    });

    this.logger.info('MasterDataController#findAllUnitOfMeasures.result', { count: result.length });
    return { data: result };
  }

  @GrpcMethod('MasterDataService', 'findUnitOfMeasureById')
  async findUnitOfMeasureById(data: Id): Promise<UnitOfMeasure> {
    this.logger.info('MasterDataController#findUnitOfMeasureById.call', data);
    const result: UnitOfMeasure | null = await this.masterDataService.findUnitOfMeasureById(data.id);
    if (!result) {
      throw new Error('UnitOfMeasure not found');
    }
    this.logger.info('MasterDataController#findUnitOfMeasureById.result', { id: result.id });
    return result;
  }

  @GrpcMethod('MasterDataService', 'findUnitOfMeasureByCode')
  async findUnitOfMeasureByCode(data: Name): Promise<UnitOfMeasure> {
    this.logger.info('MasterDataController#findUnitOfMeasureByCode.call', data);
    const result: UnitOfMeasure | null = await this.masterDataService.findUnitOfMeasureByCode(data.name);
    if (!result) {
      throw new Error('UnitOfMeasure not found');
    }
    this.logger.info('MasterDataController#findUnitOfMeasureByCode.result', { id: result.id });
    return result;
  }

  @GrpcMethod('MasterDataService', 'countUnitOfMeasures')
  async countUnitOfMeasures(query: Query): Promise<Count> {
    this.logger.info('MasterDataController#countUnitOfMeasures.call', query);
    const count: number = await this.masterDataService.countUnitOfMeasures({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
    });
    this.logger.info('MasterDataController#countUnitOfMeasures.result', { count });
    return { count };
  }

  @GrpcMethod('MasterDataService', 'createUnitOfMeasure')
  async createUnitOfMeasure(data: CreateUnitOfMeasureDto): Promise<UnitOfMeasure> {
    this.logger.info('MasterDataController#createUnitOfMeasure.call', { code: data.code, createdBy: data.createdBy });
    const result: UnitOfMeasure = await this.masterDataService.createUnitOfMeasure(data);
    this.logger.info('MasterDataController#createUnitOfMeasure.result', { id: result.id, code: result.code });
    return result;
  }

  @GrpcMethod('MasterDataService', 'updateUnitOfMeasure')
  async updateUnitOfMeasure(data: { id: string } & UpdateUnitOfMeasureDto): Promise<UnitOfMeasure> {
    this.logger.info('MasterDataController#updateUnitOfMeasure.call', { id: data.id, updatedBy: data.updatedBy });
    const { id, ...updateData } = data;
    const result: UnitOfMeasure = await this.masterDataService.updateUnitOfMeasure(id, updateData);
    this.logger.info('MasterDataController#updateUnitOfMeasure.result', { id: result.id });
    return result;
  }

  @GrpcMethod('MasterDataService', 'destroyUnitOfMeasure')
  async destroyUnitOfMeasure(query: Query): Promise<Count> {
    this.logger.info('MasterDataController#destroyUnitOfMeasure.call', query);
    const where = !isEmpty(query.where) ? JSON.parse(query.where) : {};
    if (where.id) {
      await this.masterDataService.deleteUnitOfMeasure(where.id);
    }
    this.logger.info('MasterDataController#destroyUnitOfMeasure.result');
    return { count: 1 };
  }

  // Export Status methods
  @GrpcMethod('MasterDataService', 'findAllExportStatuses')
  async findAllExportStatuses(query: Query): Promise<ExportStatusQueryResult> {
    this.logger.info('MasterDataController#findAllExportStatuses.call', query);

    const result: Array<ExportStatus> = await this.masterDataService.findAllExportStatuses({
      select: !isEmpty(query.attributes) ? query.attributes as any : undefined,
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
      order: !isEmpty(query.order) ? JSON.parse(query.order) : undefined,
      skip: query.offset ? query.offset : 0,
      take: query.limit ? query.limit : 25,
    });

    this.logger.info('MasterDataController#findAllExportStatuses.result', { count: result.length });
    return { data: result };
  }

  @GrpcMethod('MasterDataService', 'findExportStatusById')
  async findExportStatusById(data: Id): Promise<ExportStatus> {
    this.logger.info('MasterDataController#findExportStatusById.call', data);
    const result: ExportStatus | null = await this.masterDataService.findExportStatusById(data.id);
    if (!result) {
      throw new Error('ExportStatus not found');
    }
    this.logger.info('MasterDataController#findExportStatusById.result', { id: result.id });
    return result;
  }

  @GrpcMethod('MasterDataService', 'findExportStatusByCode')
  async findExportStatusByCode(data: Name): Promise<ExportStatus> {
    this.logger.info('MasterDataController#findExportStatusByCode.call', data);
    const result: ExportStatus | null = await this.masterDataService.findExportStatusByCode(data.name);
    if (!result) {
      throw new Error('ExportStatus not found');
    }
    this.logger.info('MasterDataController#findExportStatusByCode.result', { id: result.id });
    return result;
  }

  @GrpcMethod('MasterDataService', 'countExportStatuses')
  async countExportStatuses(query: Query): Promise<Count> {
    this.logger.info('MasterDataController#countExportStatuses.call', query);
    const count: number = await this.masterDataService.countExportStatuses({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
    });
    this.logger.info('MasterDataController#countExportStatuses.result', { count });
    return { count };
  }

  @GrpcMethod('MasterDataService', 'createExportStatus')
  async createExportStatus(data: CreateExportStatusDto): Promise<ExportStatus> {
    this.logger.info('MasterDataController#createExportStatus.call', { code: data.code, createdBy: data.createdBy });
    const result: ExportStatus = await this.masterDataService.createExportStatus(data);
    this.logger.info('MasterDataController#createExportStatus.result', { id: result.id, code: result.code });
    return result;
  }

  @GrpcMethod('MasterDataService', 'updateExportStatus')
  async updateExportStatus(data: { id: string } & UpdateExportStatusDto): Promise<ExportStatus> {
    this.logger.info('MasterDataController#updateExportStatus.call', { id: data.id, updatedBy: data.updatedBy });
    const { id, ...updateData } = data;
    const result: ExportStatus = await this.masterDataService.updateExportStatus(id, updateData);
    this.logger.info('MasterDataController#updateExportStatus.result', { id: result.id });
    return result;
  }

  @GrpcMethod('MasterDataService', 'destroyExportStatus')
  async destroyExportStatus(query: Query): Promise<Count> {
    this.logger.info('MasterDataController#destroyExportStatus.call', query);
    const where = !isEmpty(query.where) ? JSON.parse(query.where) : {};
    if (where.id) {
      await this.masterDataService.deleteExportStatus(where.id);
    }
    this.logger.info('MasterDataController#destroyExportStatus.result');
    return { count: 1 };
  }

  // Branch methods
  @GrpcMethod('MasterDataService', 'findAllBranches')
  async findAllBranches(query: Query): Promise<BranchQueryResult> {
    const result = await this.masterDataService.findAllBranches({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
      skip: query.offset ? query.offset : 0,
      take: query.limit ? query.limit : 25,
    });
    return { data: result };
  }

  @GrpcMethod('MasterDataService', 'findBranchById')
  async findBranchById(data: Id): Promise<Branch> {
    const result = await this.masterDataService.findBranchById(data.id);
    if (!result) throw new Error('Branch not found');
    return result;
  }

  @GrpcMethod('MasterDataService', 'findBranchByCode')
  async findBranchByCode(data: Name): Promise<Branch> {
    const result = await this.masterDataService.findBranchByCode(data.name);
    if (!result) throw new Error('Branch not found');
    return result;
  }

  @GrpcMethod('MasterDataService', 'countBranches')
  async countBranches(query: Query): Promise<Count> {
    const count = await this.masterDataService.countBranches({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
    });
    return { count };
  }

  @GrpcMethod('MasterDataService', 'createBranch')
  async createBranch(data: CreateBranchDto): Promise<Branch> {
    return this.masterDataService.createBranch(data);
  }

  @GrpcMethod('MasterDataService', 'updateBranch')
  async updateBranch(data: { id: string } & UpdateBranchDto): Promise<Branch> {
    const { id, ...updateData } = data;
    return this.masterDataService.updateBranch(id, updateData);
  }

  @GrpcMethod('MasterDataService', 'destroyBranch')
  async destroyBranch(query: Query): Promise<Count> {
    const where = !isEmpty(query.where) ? JSON.parse(query.where) : {};
    if (where.id) {
      await this.masterDataService.deleteBranch(where.id);
    }
    return { count: 1 };
  }

  // Department Type methods
  @GrpcMethod('MasterDataService', 'findAllDepartmentTypes')
  async findAllDepartmentTypes(query: Query): Promise<DepartmentTypeQueryResult> {
    const result = await this.masterDataService.findAllDepartmentTypes({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
      skip: query.offset ? query.offset : 0,
      take: query.limit ? query.limit : 25,
    });
    return { data: result };
  }

  @GrpcMethod('MasterDataService', 'findDepartmentTypeById')
  async findDepartmentTypeById(data: Id): Promise<DepartmentType> {
    const result = await this.masterDataService.findDepartmentTypeById(data.id);
    if (!result) throw new Error('DepartmentType not found');
    return result;
  }

  @GrpcMethod('MasterDataService', 'findDepartmentTypeByCode')
  async findDepartmentTypeByCode(data: Name): Promise<DepartmentType> {
    const result = await this.masterDataService.findDepartmentTypeByCode(data.name);
    if (!result) throw new Error('DepartmentType not found');
    return result;
  }

  @GrpcMethod('MasterDataService', 'countDepartmentTypes')
  async countDepartmentTypes(query: Query): Promise<Count> {
    const count = await this.masterDataService.countDepartmentTypes({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
    });
    return { count };
  }

  @GrpcMethod('MasterDataService', 'createDepartmentType')
  async createDepartmentType(data: CreateDepartmentTypeDto): Promise<DepartmentType> {
    return this.masterDataService.createDepartmentType(data);
  }

  @GrpcMethod('MasterDataService', 'updateDepartmentType')
  async updateDepartmentType(data: { id: string } & UpdateDepartmentTypeDto): Promise<DepartmentType> {
    const { id, ...updateData } = data;
    return this.masterDataService.updateDepartmentType(id, updateData);
  }

  @GrpcMethod('MasterDataService', 'destroyDepartmentType')
  async destroyDepartmentType(query: Query): Promise<Count> {
    const where = !isEmpty(query.where) ? JSON.parse(query.where) : {};
    if (where.id) {
      await this.masterDataService.deleteDepartmentType(where.id);
    }
    return { count: 1 };
  }

  // Department methods
  @GrpcMethod('MasterDataService', 'findAllDepartments')
  async findAllDepartments(query: Query): Promise<DepartmentQueryResult> {
    const result = await this.masterDataService.findAllDepartments({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
      skip: query.offset ? query.offset : 0,
      take: query.limit ? query.limit : 25,
    });
    return { data: result };
  }

  @GrpcMethod('MasterDataService', 'findDepartmentById')
  async findDepartmentById(data: Id): Promise<Department> {
    const result = await this.masterDataService.findDepartmentById(data.id);
    if (!result) throw new Error('Department not found');
    return result;
  }

  @GrpcMethod('MasterDataService', 'findDepartmentByCode')
  async findDepartmentByCode(data: Name): Promise<Department> {
    const result = await this.masterDataService.findDepartmentByCode(data.name);
    if (!result) throw new Error('Department not found');
    return result;
  }

  @GrpcMethod('MasterDataService', 'countDepartments')
  async countDepartments(query: Query): Promise<Count> {
    const count = await this.masterDataService.countDepartments({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
    });
    return { count };
  }

  @GrpcMethod('MasterDataService', 'createDepartment')
  async createDepartment(data: CreateDepartmentDto): Promise<Department> {
    return this.masterDataService.createDepartment(data);
  }

  @GrpcMethod('MasterDataService', 'updateDepartment')
  async updateDepartment(data: { id: string } & UpdateDepartmentDto): Promise<Department> {
    const { id, ...updateData } = data;
    return this.masterDataService.updateDepartment(id, updateData);
  }

  @GrpcMethod('MasterDataService', 'destroyDepartment')
  async destroyDepartment(query: Query): Promise<Count> {
    const where = !isEmpty(query.where) ? JSON.parse(query.where) : {};
    if (where.id) {
      await this.masterDataService.deleteDepartment(where.id);
    }
    return { count: 1 };
  }

  // Machine Funding Source methods
  @GrpcMethod('MasterDataService', 'findAllMachineFundingSources')
  async findAllMachineFundingSources(query: Query): Promise<MachineFundingSourceQueryResult> {
    const result = await this.masterDataService.findAllMachineFundingSources({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
      skip: query.offset ? query.offset : 0,
      take: query.limit ? query.limit : 25,
    });
    return { data: result };
  }

  @GrpcMethod('MasterDataService', 'findMachineFundingSourceById')
  async findMachineFundingSourceById(data: Id): Promise<MachineFundingSource> {
    const result = await this.masterDataService.findMachineFundingSourceById(data.id);
    if (!result) throw new Error('MachineFundingSource not found');
    return result;
  }

  @GrpcMethod('MasterDataService', 'findMachineFundingSourceByCode')
  async findMachineFundingSourceByCode(data: Name): Promise<MachineFundingSource> {
    const result = await this.masterDataService.findMachineFundingSourceByCode(data.name);
    if (!result) throw new Error('MachineFundingSource not found');
    return result;
  }

  @GrpcMethod('MasterDataService', 'countMachineFundingSources')
  async countMachineFundingSources(query: Query): Promise<Count> {
    const count = await this.masterDataService.countMachineFundingSources({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
    });
    return { count };
  }

  @GrpcMethod('MasterDataService', 'createMachineFundingSource')
  async createMachineFundingSource(data: CreateMachineFundingSourceDto): Promise<MachineFundingSource> {
    return this.masterDataService.createMachineFundingSource(data);
  }

  @GrpcMethod('MasterDataService', 'updateMachineFundingSource')
  async updateMachineFundingSource(data: { id: string } & UpdateMachineFundingSourceDto): Promise<MachineFundingSource> {
    const { id, ...updateData } = data;
    return this.masterDataService.updateMachineFundingSource(id, updateData);
  }

  @GrpcMethod('MasterDataService', 'destroyMachineFundingSource')
  async destroyMachineFundingSource(query: Query): Promise<Count> {
    const where = !isEmpty(query.where) ? JSON.parse(query.where) : {};
    if (where.id) {
      await this.masterDataService.deleteMachineFundingSource(where.id);
    }
    return { count: 1 };
  }

  // Manufacturer Country methods
  @GrpcMethod('MasterDataService', 'findAllManufacturerCountries')
  async findAllManufacturerCountries(query: Query): Promise<ManufacturerCountryQueryResult> {
    const result = await this.masterDataService.findAllManufacturerCountries({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
      skip: query.offset ? query.offset : 0,
      take: query.limit ? query.limit : 25,
    });
    return { data: result };
  }

  @GrpcMethod('MasterDataService', 'findManufacturerCountryById')
  async findManufacturerCountryById(data: Id): Promise<ManufacturerCountry> {
    const result = await this.masterDataService.findManufacturerCountryById(data.id);
    if (!result) throw new Error('ManufacturerCountry not found');
    return result;
  }

  @GrpcMethod('MasterDataService', 'findManufacturerCountryByCode')
  async findManufacturerCountryByCode(data: Name): Promise<ManufacturerCountry> {
    const result = await this.masterDataService.findManufacturerCountryByCode(data.name);
    if (!result) throw new Error('ManufacturerCountry not found');
    return result;
  }

  @GrpcMethod('MasterDataService', 'countManufacturerCountries')
  async countManufacturerCountries(query: Query): Promise<Count> {
    const count = await this.masterDataService.countManufacturerCountries({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
    });
    return { count };
  }

  @GrpcMethod('MasterDataService', 'createManufacturerCountry')
  async createManufacturerCountry(data: CreateManufacturerCountryDto): Promise<ManufacturerCountry> {
    return this.masterDataService.createManufacturerCountry(data);
  }

  @GrpcMethod('MasterDataService', 'updateManufacturerCountry')
  async updateManufacturerCountry(data: { id: string } & UpdateManufacturerCountryDto): Promise<ManufacturerCountry> {
    const { id, ...updateData } = data;
    return this.masterDataService.updateManufacturerCountry(id, updateData);
  }

  @GrpcMethod('MasterDataService', 'destroyManufacturerCountry')
  async destroyManufacturerCountry(query: Query): Promise<Count> {
    const where = !isEmpty(query.where) ? JSON.parse(query.where) : {};
    if (where.id) {
      await this.masterDataService.deleteManufacturerCountry(where.id);
    }
    return { count: 1 };
  }

  // Machine Document Type gRPC methods
  @GrpcMethod('MasterDataService', 'findAllMachineDocumentTypes')
  async findAllMachineDocumentTypes(query: Query): Promise<MachineDocumentTypeList> {
    const result = await this.masterDataService.findAllMachineDocumentTypes({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
    });
    return { data: result };
  }

  @GrpcMethod('MasterDataService', 'findMachineDocumentTypeById')
  async findMachineDocumentTypeById(data: Id): Promise<MachineDocumentType> {
    const result = await this.masterDataService.findMachineDocumentTypeById(data.id);
    if (!result) throw new Error('MachineDocumentType not found');
    return result;
  }

  @GrpcMethod('MasterDataService', 'findMachineDocumentTypeByCode')
  async findMachineDocumentTypeByCode(data: Name): Promise<MachineDocumentType> {
    const result = await this.masterDataService.findMachineDocumentTypeByCode(data.name);
    if (!result) throw new Error('MachineDocumentType not found');
    return result;
  }

  @GrpcMethod('MasterDataService', 'countMachineDocumentTypes')
  async countMachineDocumentTypes(query: Query): Promise<Count> {
    const count = await this.masterDataService.countMachineDocumentTypes({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
    });
    return { count };
  }

  @GrpcMethod('MasterDataService', 'createMachineDocumentType')
  async createMachineDocumentType(data: CreateMachineDocumentTypeInput): Promise<MachineDocumentType> {
    const dto: CreateMachineDocumentTypeDto = {
      ...data,
      sortOrder: data.sortOrder || 0,
      isRequired: data.isRequired || 0,
      createdBy: 'system', // Default for gRPC if not provided
    };
    return this.masterDataService.createMachineDocumentType(dto);
  }

  @GrpcMethod('MasterDataService', 'updateMachineDocumentType')
  async updateMachineDocumentType(data: UpdateMachineDocumentTypeInput): Promise<MachineDocumentType> {
    const { id, ...updateData } = data;
    const dto: UpdateMachineDocumentTypeDto = {
      ...updateData,
    };
    return this.masterDataService.updateMachineDocumentType(id, dto);
  }

  @GrpcMethod('MasterDataService', 'destroyMachineDocumentType')
  async destroyMachineDocumentType(query: Query): Promise<Count> {
    const where = !isEmpty(query.where) ? JSON.parse(query.where) : {};
    if (where.id) {
      await this.masterDataService.deleteMachineDocumentType(where.id);
    }
    return { count: 1 };
  }

  // Machine Category methods
  @GrpcMethod('MasterDataService', 'findAllMachineCategories')
  async findAllMachineCategories(query: Query): Promise<any> {
    this.logger.info('MasterDataController#findAllMachineCategories.call', query);
    const result = await this.masterDataService.findAllMachineCategories({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
    });
    return { data: result };
  }

  @GrpcMethod('MasterDataService', 'findMachineCategoryById')
  async findMachineCategoryById(data: Id): Promise<any> {
    this.logger.info('MasterDataController#findMachineCategoryById.call', data);
    return this.masterDataService.findMachineCategoryById(data.id);
  }

  @GrpcMethod('MasterDataService', 'findMachineCategoryByCode')
  async findMachineCategoryByCode(data: Name): Promise<any> {
    this.logger.info('MasterDataController#findMachineCategoryByCode.call', data);
    return this.masterDataService.findMachineCategoryByCode(data.name);
  }

  @GrpcMethod('MasterDataService', 'countMachineCategories')
  async countMachineCategories(query: Query): Promise<Count> {
    this.logger.info('MasterDataController#countMachineCategories.call', query);
    const count = await this.masterDataService.countMachineCategories({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
    });
    return { count };
  }

  @GrpcMethod('MasterDataService', 'createMachineCategory')
  async createMachineCategory(data: any): Promise<any> {
    this.logger.info('MasterDataController#createMachineCategory.call', { code: data.code });
    return this.masterDataService.createMachineCategory(data);
  }

  @GrpcMethod('MasterDataService', 'updateMachineCategory')
  async updateMachineCategory(data: any): Promise<any> {
    this.logger.info('MasterDataController#updateMachineCategory.call', { id: data.id });
    const { id, ...dto } = data;
    return this.masterDataService.updateMachineCategory(id, dto);
  }

  @GrpcMethod('MasterDataService', 'destroyMachineCategory')
  async destroyMachineCategory(query: Query): Promise<Count> {
    this.logger.info('MasterDataController#destroyMachineCategory.call', query);
    const where = !isEmpty(query.where) ? JSON.parse(query.where) : {};
    const id = where.id;
    await this.masterDataService.deleteMachineCategory(id);
    return { count: 1 };
  }

  // Machine Status methods
  @GrpcMethod('MasterDataService', 'findAllMachineStatuses')
  async findAllMachineStatuses(query: Query): Promise<MachineStatusList> {
    const result = await this.masterDataService.findAllMachineStatuses({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
    });
    return { data: result };
  }

  @GrpcMethod('MasterDataService', 'findMachineStatusById')
  async findMachineStatusById(data: Id): Promise<MachineStatus> {
    return this.masterDataService.findMachineStatusById(data.id);
  }

  @GrpcMethod('MasterDataService', 'findMachineStatusByCode')
  async findMachineStatusByCode(data: Name): Promise<MachineStatus> {
    return this.masterDataService.findMachineStatusByCode(data.name);
  }

  @GrpcMethod('MasterDataService', 'countMachineStatuses')
  async countMachineStatuses(query: Query): Promise<Count> {
    const count = await this.masterDataService.countMachineStatuses({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
    });
    return { count };
  }

  @GrpcMethod('MasterDataService', 'createMachineStatus')
  async createMachineStatus(data: any): Promise<MachineStatus> {
    return this.masterDataService.createMachineStatus(data);
  }

  @GrpcMethod('MasterDataService', 'updateMachineStatus')
  async updateMachineStatus(data: any): Promise<MachineStatus> {
    const { id, ...dto } = data;
    return this.masterDataService.updateMachineStatus(id, dto);
  }

  @GrpcMethod('MasterDataService', 'destroyMachineStatus')
  async destroyMachineStatus(query: Query): Promise<Count> {
    const where = !isEmpty(query.where) ? JSON.parse(query.where) : {};
    if (where.id) {
      await this.masterDataService.deleteMachineStatus(where.id);
    }
    return { count: 1 };
  }

  // Machine Unit methods
  @GrpcMethod('MasterDataService', 'findAllMachineUnits')
  async findAllMachineUnits(query: Query): Promise<MachineUnitList> {
    const result = await this.masterDataService.findAllMachineUnits({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
    });
    return { data: result };
  }

  @GrpcMethod('MasterDataService', 'findMachineUnitById')
  async findMachineUnitById(data: Id): Promise<MachineUnit> {
    return this.masterDataService.findMachineUnitById(data.id);
  }

  @GrpcMethod('MasterDataService', 'findMachineUnitByCode')
  async findMachineUnitByCode(data: Name): Promise<MachineUnit> {
    return this.masterDataService.findMachineUnitByCode(data.name);
  }

  @GrpcMethod('MasterDataService', 'countMachineUnits')
  async countMachineUnits(query: Query): Promise<Count> {
    const count = await this.masterDataService.countMachineUnits({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
    });
    return { count };
  }

  @GrpcMethod('MasterDataService', 'createMachineUnit')
  async createMachineUnit(data: any): Promise<MachineUnit> {
    return this.masterDataService.createMachineUnit(data);
  }

  @GrpcMethod('MasterDataService', 'updateMachineUnit')
  async updateMachineUnit(data: any): Promise<MachineUnit> {
    const { id, ...dto } = data;
    return this.masterDataService.updateMachineUnit(id, dto);
  }

  @GrpcMethod('MasterDataService', 'destroyMachineUnit')
  async destroyMachineUnit(query: Query): Promise<Count> {
    const where = !isEmpty(query.where) ? JSON.parse(query.where) : {};
    if (where.id) {
      await this.masterDataService.deleteMachineUnit(where.id);
    }
    return { count: 1 };
  }

  // Vendor methods
  @GrpcMethod('MasterDataService', 'findAllVendors')
  async findAllVendors(query: Query): Promise<VendorList> {
    const result = await this.masterDataService.findAllVendors({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
    });
    return { data: result };
  }

  @GrpcMethod('MasterDataService', 'findVendorById')
  async findVendorById(data: Id): Promise<Vendor> {
    return this.masterDataService.findVendorById(data.id);
  }

  @GrpcMethod('MasterDataService', 'findVendorByCode')
  async findVendorByCode(data: Name): Promise<Vendor> {
    return this.masterDataService.findVendorByCode(data.name);
  }

  @GrpcMethod('MasterDataService', 'countVendors')
  async countVendors(query: Query): Promise<Count> {
    const count = await this.masterDataService.countVendors({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
    });
    return { count };
  }

  @GrpcMethod('MasterDataService', 'createVendor')
  async createVendor(data: any): Promise<Vendor> {
    return this.masterDataService.createVendor(data);
  }

  @GrpcMethod('MasterDataService', 'updateVendor')
  async updateVendor(data: any): Promise<Vendor> {
    const { id, ...dto } = data;
    return this.masterDataService.updateVendor(id, dto);
  }

  @GrpcMethod('MasterDataService', 'destroyVendor')
  async destroyVendor(query: Query): Promise<Count> {
    const where = !isEmpty(query.where) ? JSON.parse(query.where) : {};
    if (where.id) {
      await this.masterDataService.deleteVendor(where.id);
    }
    return { count: 1 };
  }

  // Maintenance Type methods
  @GrpcMethod('MasterDataService', 'findAllMaintenanceTypes')
  async findAllMaintenanceTypes(query: Query): Promise<MaintenanceTypeList> {
    const result = await this.masterDataService.findAllMaintenanceTypes({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
    });
    return { data: result };
  }

  @GrpcMethod('MasterDataService', 'findMaintenanceTypeById')
  async findMaintenanceTypeById(data: Id): Promise<MaintenanceType> {
    return this.masterDataService.findMaintenanceTypeById(data.id);
  }

  @GrpcMethod('MasterDataService', 'findMaintenanceTypeByCode')
  async findMaintenanceTypeByCode(data: Name): Promise<MaintenanceType> {
    return this.masterDataService.findMaintenanceTypeByCode(data.name);
  }

  @GrpcMethod('MasterDataService', 'countMaintenanceTypes')
  async countMaintenanceTypes(query: Query): Promise<Count> {
    const count = await this.masterDataService.countMaintenanceTypes({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
    });
    return { count };
  }

  @GrpcMethod('MasterDataService', 'createMaintenanceType')
  async createMaintenanceType(data: any): Promise<MaintenanceType> {
    return this.masterDataService.createMaintenanceType(data);
  }

  @GrpcMethod('MasterDataService', 'updateMaintenanceType')
  async updateMaintenanceType(data: any): Promise<MaintenanceType> {
    const { id, ...dto } = data;
    return this.masterDataService.updateMaintenanceType(id, dto);
  }

  @GrpcMethod('MasterDataService', 'destroyMaintenanceType')
  async destroyMaintenanceType(query: Query): Promise<Count> {
    const where = !isEmpty(query.where) ? JSON.parse(query.where) : {};
    if (where.id) {
      await this.masterDataService.deleteMaintenanceType(where.id);
    }
    return { count: 1 };
  }

  // Transfer Status methods
  @GrpcMethod('MasterDataService', 'findAllTransferStatuses')
  async findAllTransferStatuses(query: Query): Promise<TransferStatusList> {
    const result = await this.masterDataService.findAllTransferStatuses({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
    });
    return { data: result };
  }

  @GrpcMethod('MasterDataService', 'findTransferStatusById')
  async findTransferStatusById(data: Id): Promise<TransferStatus> {
    return this.masterDataService.findTransferStatusById(data.id);
  }

  @GrpcMethod('MasterDataService', 'findTransferStatusByCode')
  async findTransferStatusByCode(data: Name): Promise<TransferStatus> {
    return this.masterDataService.findTransferStatusByCode(data.name);
  }

  @GrpcMethod('MasterDataService', 'countTransferStatuses')
  async countTransferStatuses(query: Query): Promise<Count> {
    const count = await this.masterDataService.countTransferStatuses({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
    });
    return { count };
  }

  @GrpcMethod('MasterDataService', 'createTransferStatus')
  async createTransferStatus(data: any): Promise<TransferStatus> {
    return this.masterDataService.createTransferStatus(data);
  }

  @GrpcMethod('MasterDataService', 'updateTransferStatus')
  async updateTransferStatus(data: any): Promise<TransferStatus> {
    const { id, ...dto } = data;
    return this.masterDataService.updateTransferStatus(id, dto);
  }

  @GrpcMethod('MasterDataService', 'destroyTransferStatus')
  async destroyTransferStatus(query: Query): Promise<Count> {
    const where = !isEmpty(query.where) ? JSON.parse(query.where) : {};
    if (where.id) {
      await this.masterDataService.deleteTransferStatus(where.id);
    }
    return { count: 1 };
  }

  // Transfer Type methods
  @GrpcMethod('MasterDataService', 'findAllTransferTypes')
  async findAllTransferTypes(query: Query): Promise<TransferTypeList> {
    const result = await this.masterDataService.findAllTransferTypes({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
    });
    return { data: result };
  }

  @GrpcMethod('MasterDataService', 'findTransferTypeById')
  async findTransferTypeById(data: Id): Promise<any> {
    return this.masterDataService.findTransferTypeById(data.id);
  }

  @GrpcMethod('MasterDataService', 'findTransferTypeByCode')
  async findTransferTypeByCode(data: Name): Promise<any> {
    return this.masterDataService.findTransferTypeByCode(data.name);
  }

  @GrpcMethod('MasterDataService', 'countTransferTypes')
  async countTransferTypes(query: Query): Promise<Count> {
    const count = await this.masterDataService.countTransferTypes({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
    });
    return { count };
  }

  @GrpcMethod('MasterDataService', 'createTransferType')
  async createTransferType(data: any): Promise<any> {
    return this.masterDataService.createTransferType(data);
  }

  @GrpcMethod('MasterDataService', 'updateTransferType')
  async updateTransferType(data: any): Promise<any> {
    const { id, ...dto } = data;
    return this.masterDataService.updateTransferType(id, dto);
  }

  @GrpcMethod('MasterDataService', 'destroyTransferType')
  async destroyTransferType(query: Query): Promise<Count> {
    const where = !isEmpty(query.where) ? JSON.parse(query.where) : {};
    if (where.id) {
      await this.masterDataService.deleteTransferType(where.id);
    }
    return { count: 1 };
  }

  // Notification Type methods
  @GrpcMethod('MasterDataService', 'findAllNotificationTypes')
  async findAllNotificationTypes(query: Query): Promise<NotificationTypeList> {
    this.logger.info('MasterDataController#findAllNotificationTypes.call', query);
    const result = await this.masterDataService.findAllNotificationTypes({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
      skip: query.offset ? query.offset : 0,
      take: query.limit ? query.limit : 25,
    });
    this.logger.info('MasterDataController#findAllNotificationTypes.result', { count: result.length });
    return { data: result };
  }

  @GrpcMethod('MasterDataService', 'findNotificationTypeById')
  async findNotificationTypeById(data: Id): Promise<NotificationType> {
    this.logger.info('MasterDataController#findNotificationTypeById.call', data);
    const result = await this.masterDataService.findNotificationTypeById(data.id);
    if (!result) throw new Error('NotificationType not found');
    return result;
  }

  @GrpcMethod('MasterDataService', 'findNotificationTypeByCode')
  async findNotificationTypeByCode(data: Name): Promise<NotificationType> {
    this.logger.info('MasterDataController#findNotificationTypeByCode.call', data);
    const result = await this.masterDataService.findNotificationTypeByCode(data.name);
    if (!result) throw new Error('NotificationType not found');
    return result;
  }

  @GrpcMethod('MasterDataService', 'countNotificationTypes')
  async countNotificationTypes(query: Query): Promise<Count> {
    this.logger.info('MasterDataController#countNotificationTypes.call', query);
    const count = await this.masterDataService.countNotificationTypes({
      where: !isEmpty(query.where) ? JSON.parse(query.where) : undefined,
    });
    return { count };
  }

  @GrpcMethod('MasterDataService', 'createNotificationType')
  async createNotificationType(data: CreateNotificationTypeDto): Promise<NotificationType> {
    this.logger.info('MasterDataController#createNotificationType.call', { code: data.code });
    return this.masterDataService.createNotificationType(data);
  }

  @GrpcMethod('MasterDataService', 'updateNotificationType')
  async updateNotificationType(data: { id: string } & UpdateNotificationTypeDto): Promise<NotificationType> {
    this.logger.info('MasterDataController#updateNotificationType.call', { id: data.id });
    const { id, ...dto } = data;
    return this.masterDataService.updateNotificationType(id, dto);
  }

  @GrpcMethod('MasterDataService', 'destroyNotificationType')
  async destroyNotificationType(query: Query): Promise<Count> {
    this.logger.info('MasterDataController#destroyNotificationType.call', query);
    const where = !isEmpty(query.where) ? JSON.parse(query.where) : {};
    if (where.id) {
      await this.masterDataService.deleteNotificationType(where.id);
    }
    return { count: 1 };
  }
}
