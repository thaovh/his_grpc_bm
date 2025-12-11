import { UnitOfMeasure } from './unit-of-measure/entities/unit-of-measure.entity';
import { ExportStatus } from './export-status/entities/export-status.entity';
import { Branch } from './branch/entities/branch.entity';
import { DepartmentType } from './department-type/entities/department-type.entity';
import { Department } from './department/entities/department.entity';
import { MachineFundingSource } from './machine-funding-source/entities/machine-funding-source.entity';
import { ManufacturerCountry } from './manufacturer-country/entities/manufacturer-country.entity';
import { MachineDocumentType } from './machine-document-type/entities/machine-document-type.entity';
import { MachineCategory } from './machine-category/entities/machine-category.entity';
import { MachineStatus } from './machine-status/entities/machine-status.entity';
import { MachineUnit } from './machine-unit/entities/machine-unit.entity';
import { Vendor } from './vendor/entities/vendor.entity';
import { MaintenanceType } from './maintenance-type/entities/maintenance-type.entity';
import { TransferStatus } from './transfer-status/entities/transfer-status.entity';
import { TransferType } from './transfer-type/entities/transfer-type.entity';
import { CreateUnitOfMeasureDto } from './unit-of-measure/dto/create-unit-of-measure.dto';
import { UpdateUnitOfMeasureDto } from './unit-of-measure/dto/update-unit-of-measure.dto';
import { CreateExportStatusDto } from './export-status/dto/create-export-status.dto';
import { UpdateExportStatusDto } from './export-status/dto/update-export-status.dto';
import { CreateBranchDto } from './branch/dto/create-branch.dto';
import { UpdateBranchDto } from './branch/dto/update-branch.dto';
import { CreateDepartmentTypeDto } from './department-type/dto/create-department-type.dto';
import { UpdateDepartmentTypeDto } from './department-type/dto/update-department-type.dto';
import { CreateDepartmentDto } from './department/dto/create-department.dto';
import { UpdateDepartmentDto } from './department/dto/update-department.dto';
import { CreateMachineFundingSourceDto } from './machine-funding-source/dto/create-machine-funding-source.dto';
import { UpdateMachineFundingSourceDto } from './machine-funding-source/dto/update-machine-funding-source.dto';
import { CreateManufacturerCountryDto } from './manufacturer-country/dto/create-manufacturer-country.dto';
import { UpdateManufacturerCountryDto } from './manufacturer-country/dto/update-manufacturer-country.dto';
import { CreateMachineDocumentTypeDto } from './machine-document-type/dto/create-machine-document-type.dto';
import { UpdateMachineDocumentTypeDto } from './machine-document-type/dto/update-machine-document-type.dto';
import { CreateMachineCategoryDto } from './machine-category/dto/create-machine-category.dto';
import { UpdateMachineCategoryDto } from './machine-category/dto/update-machine-category.dto';
import { CreateMachineStatusDto } from './machine-status/dto/create-machine-status.dto';
import { UpdateMachineStatusDto } from './machine-status/dto/update-machine-status.dto';
import { CreateMachineUnitDto } from './machine-unit/dto/create-machine-unit.dto';
import { UpdateMachineUnitDto } from './machine-unit/dto/update-machine-unit.dto';
import { CreateVendorDto } from './vendor/dto/create-vendor.dto';
import { UpdateVendorDto } from './vendor/dto/update-vendor.dto';
import { CreateMaintenanceTypeDto } from './maintenance-type/dto/create-maintenance-type.dto';
import { UpdateMaintenanceTypeDto } from './maintenance-type/dto/update-maintenance-type.dto';
import { FindManyOptions } from 'typeorm';

export interface CreateMachineDocumentTypeInput {
  code: string;
  name: string;
  sortOrder?: number;
  isRequired?: number;
}

export interface UpdateMachineDocumentTypeInput {
  id: string;
  code?: string;
  name?: string;
  sortOrder?: number;
  isRequired?: number;
}

export interface UnitOfMeasureQueryResult {
  data: UnitOfMeasure[];
}

export interface ExportStatusQueryResult {
  data: ExportStatus[];
}

export interface BranchQueryResult {
  data: Branch[];
}

export interface DepartmentTypeQueryResult {
  data: DepartmentType[];
}

export interface DepartmentQueryResult {
  data: Department[];
}

export interface MachineFundingSourceQueryResult {
  data: MachineFundingSource[];
}

export interface ManufacturerCountryQueryResult {
  data: ManufacturerCountry[];
}

import { CreateNotificationTypeDto } from './notification-type/dto/create-notification-type.dto';
import { UpdateNotificationTypeDto } from './notification-type/dto/update-notification-type.dto';
import { NotificationType } from './notification-type/entities/notification-type.entity';

export interface MasterDataService {
  // Unit of Measure
  findAllUnitOfMeasures(query?: FindManyOptions<UnitOfMeasure>): Promise<UnitOfMeasure[]>;
  findUnitOfMeasureById(id: string): Promise<UnitOfMeasure | null>;
  findUnitOfMeasureByCode(code: string): Promise<UnitOfMeasure | null>;
  countUnitOfMeasures(query?: FindManyOptions<UnitOfMeasure>): Promise<number>;
  createUnitOfMeasure(dto: CreateUnitOfMeasureDto): Promise<UnitOfMeasure>;
  updateUnitOfMeasure(id: string, dto: UpdateUnitOfMeasureDto): Promise<UnitOfMeasure>;
  deleteUnitOfMeasure(id: string): Promise<void>;

  // Export Status
  findAllExportStatuses(query?: FindManyOptions<ExportStatus>): Promise<ExportStatus[]>;
  findExportStatusById(id: string): Promise<ExportStatus | null>;
  findExportStatusByCode(code: string): Promise<ExportStatus | null>;
  countExportStatuses(query?: FindManyOptions<ExportStatus>): Promise<number>;
  createExportStatus(dto: CreateExportStatusDto): Promise<ExportStatus>;
  updateExportStatus(id: string, dto: UpdateExportStatusDto): Promise<ExportStatus>;
  deleteExportStatus(id: string): Promise<void>;

  // Branch
  findAllBranches(query?: FindManyOptions<Branch>): Promise<Branch[]>;
  findBranchById(id: string): Promise<Branch | null>;
  findBranchByCode(code: string): Promise<Branch | null>;
  countBranches(query?: FindManyOptions<Branch>): Promise<number>;
  createBranch(dto: CreateBranchDto): Promise<Branch>;
  updateBranch(id: string, dto: UpdateBranchDto): Promise<Branch>;
  deleteBranch(id: string): Promise<void>;

  // Department Type
  findAllDepartmentTypes(query?: FindManyOptions<DepartmentType>): Promise<DepartmentType[]>;
  findDepartmentTypeById(id: string): Promise<DepartmentType | null>;
  findDepartmentTypeByCode(code: string): Promise<DepartmentType | null>;
  countDepartmentTypes(query?: FindManyOptions<DepartmentType>): Promise<number>;
  createDepartmentType(dto: CreateDepartmentTypeDto): Promise<DepartmentType>;
  updateDepartmentType(id: string, dto: UpdateDepartmentTypeDto): Promise<DepartmentType>;
  deleteDepartmentType(id: string): Promise<void>;

  // Department
  findAllDepartments(query?: FindManyOptions<Department>): Promise<Department[]>;
  findDepartmentById(id: string): Promise<Department | null>;
  findDepartmentByCode(code: string): Promise<Department | null>;
  countDepartments(query?: FindManyOptions<Department>): Promise<number>;
  createDepartment(dto: CreateDepartmentDto): Promise<Department>;
  updateDepartment(id: string, dto: UpdateDepartmentDto): Promise<Department>;
  deleteDepartment(id: string): Promise<void>;

  // Machine Funding Source
  findAllMachineFundingSources(query?: FindManyOptions<MachineFundingSource>): Promise<MachineFundingSource[]>;
  findMachineFundingSourceById(id: string): Promise<MachineFundingSource | null>;
  findMachineFundingSourceByCode(code: string): Promise<MachineFundingSource | null>;
  countMachineFundingSources(query?: FindManyOptions<MachineFundingSource>): Promise<number>;
  createMachineFundingSource(dto: CreateMachineFundingSourceDto): Promise<MachineFundingSource>;
  updateMachineFundingSource(id: string, dto: UpdateMachineFundingSourceDto): Promise<MachineFundingSource>;
  deleteMachineFundingSource(id: string): Promise<void>;

  // Manufacturer Country
  findAllManufacturerCountries(query?: FindManyOptions<ManufacturerCountry>): Promise<ManufacturerCountry[]>;
  findManufacturerCountryById(id: string): Promise<ManufacturerCountry | null>;
  findManufacturerCountryByCode(code: string): Promise<ManufacturerCountry | null>;
  countManufacturerCountries(query?: FindManyOptions<ManufacturerCountry>): Promise<number>;
  createManufacturerCountry(dto: CreateManufacturerCountryDto): Promise<ManufacturerCountry>;
  updateManufacturerCountry(id: string, dto: UpdateManufacturerCountryDto): Promise<ManufacturerCountry>;
  deleteManufacturerCountry(id: string): Promise<void>;

  // Machine Document Type
  findAllMachineDocumentTypes(query?: any): Promise<MachineDocumentType[]>;
  findMachineDocumentTypeById(id: string): Promise<MachineDocumentType>;
  findMachineDocumentTypeByCode(code: string): Promise<MachineDocumentType>;
  countMachineDocumentTypes(query?: any): Promise<number>;
  createMachineDocumentType(dto: CreateMachineDocumentTypeDto): Promise<MachineDocumentType>;
  updateMachineDocumentType(id: string, dto: UpdateMachineDocumentTypeDto): Promise<MachineDocumentType>;
  deleteMachineDocumentType(id: string): Promise<void>;

  // Machine Category
  findAllMachineCategories(query?: any): Promise<MachineCategory[]>;
  findMachineCategoryById(id: string): Promise<MachineCategory>;
  findMachineCategoryByCode(code: string): Promise<MachineCategory>;
  countMachineCategories(query?: any): Promise<number>;
  createMachineCategory(dto: CreateMachineCategoryDto): Promise<MachineCategory>;
  updateMachineCategory(id: string, dto: UpdateMachineCategoryDto): Promise<MachineCategory>;
  deleteMachineCategory(id: string): Promise<void>;

  // Machine Status
  findAllMachineStatuses(query?: any): Promise<MachineStatus[]>;
  findMachineStatusById(id: string): Promise<MachineStatus>;
  findMachineStatusByCode(code: string): Promise<MachineStatus>;
  countMachineStatuses(query?: any): Promise<number>;
  createMachineStatus(dto: CreateMachineStatusDto): Promise<MachineStatus>;
  updateMachineStatus(id: string, dto: UpdateMachineStatusDto): Promise<MachineStatus>;
  deleteMachineStatus(id: string): Promise<void>;

  // Machine Unit
  findAllMachineUnits(query?: any): Promise<MachineUnit[]>;
  findMachineUnitById(id: string): Promise<MachineUnit>;
  findMachineUnitByCode(code: string): Promise<MachineUnit>;
  countMachineUnits(query?: any): Promise<number>;
  createMachineUnit(dto: CreateMachineUnitDto): Promise<MachineUnit>;
  updateMachineUnit(id: string, dto: UpdateMachineUnitDto): Promise<MachineUnit>;
  deleteMachineUnit(id: string): Promise<void>;

  // Vendor
  findAllVendors(query?: any): Promise<Vendor[]>;
  findVendorById(id: string): Promise<Vendor>;
  findVendorByCode(code: string): Promise<Vendor>;
  countVendors(query?: any): Promise<number>;
  createVendor(dto: CreateVendorDto): Promise<Vendor>;
  updateVendor(id: string, dto: UpdateVendorDto): Promise<Vendor>;
  deleteVendor(id: string): Promise<void>;

  // Maintenance Type
  findAllMaintenanceTypes(query?: any): Promise<MaintenanceType[]>;
  findMaintenanceTypeById(id: string): Promise<MaintenanceType>;
  findMaintenanceTypeByCode(code: string): Promise<MaintenanceType>;
  countMaintenanceTypes(query?: any): Promise<number>;
  createMaintenanceType(dto: CreateMaintenanceTypeDto): Promise<MaintenanceType>;
  updateMaintenanceType(id: string, dto: UpdateMaintenanceTypeDto): Promise<MaintenanceType>;
  deleteMaintenanceType(id: string): Promise<void>;

  // Transfer Status
  findAllTransferStatuses(query?: any): Promise<TransferStatus[]>;
  findTransferStatusById(id: string): Promise<TransferStatus>;
  findTransferStatusByCode(code: string): Promise<TransferStatus>;
  countTransferStatuses(query?: any): Promise<number>;
  createTransferStatus(dto: any): Promise<TransferStatus>;
  updateTransferStatus(id: string, dto: any): Promise<TransferStatus>;
  deleteTransferStatus(id: string): Promise<void>;

  // Transfer Type
  findAllTransferTypes(query?: any): Promise<TransferType[]>;
  findTransferTypeById(id: string): Promise<TransferType | null>;
  findTransferTypeByCode(code: string): Promise<TransferType | null>;
  countTransferTypes(query?: any): Promise<number>;
  createTransferType(dto: any): Promise<TransferType>;
  updateTransferType(id: string, dto: any): Promise<TransferType>;
  deleteTransferType(id: string): Promise<void>;

  // Notification Type
  findAllNotificationTypes(query?: FindManyOptions<NotificationType>): Promise<NotificationType[]>;
  findNotificationTypeById(id: string): Promise<NotificationType | null>;
  findNotificationTypeByCode(code: string): Promise<NotificationType | null>;
  countNotificationTypes(query?: FindManyOptions<NotificationType>): Promise<number>;
  createNotificationType(dto: CreateNotificationTypeDto): Promise<NotificationType>;
  updateNotificationType(id: string, dto: UpdateNotificationTypeDto): Promise<NotificationType>;
  deleteNotificationType(id: string): Promise<void>;
}

export interface MachineDocumentTypeList {
  data: MachineDocumentType[];
}

export interface MachineCategoryList {
  data: MachineCategory[];
}

export interface MachineStatusList {
  data: MachineStatus[];
}

export interface MachineUnitList {
  data: MachineUnit[];
}

export interface VendorList {
  data: Vendor[];
}

export interface MaintenanceTypeList {
  data: MaintenanceType[];
}

export interface TransferStatusList {
  data: TransferStatus[];
}

export interface TransferTypeList {
  data: TransferType[];
}

export interface NotificationTypeList {
  data: NotificationType[];
}

export {
  UnitOfMeasure,
  ExportStatus,
  Branch,
  DepartmentType,
  Department,
  MachineFundingSource,
  ManufacturerCountry,
  MachineDocumentType,
  MachineCategory,
  MachineStatus,
  MachineUnit,
  Vendor,
  MaintenanceType,
  TransferStatus,
  TransferType,
  NotificationType,
};

