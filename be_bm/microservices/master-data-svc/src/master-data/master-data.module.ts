import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { LoggerModule } from 'nestjs-pino';

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
import { Manufacturer } from './manufacturer/entities/manufacturer.entity';
import { NotificationType } from './notification-type/entities/notification-type.entity';

import { MasterDataController } from './controllers/master-data.controller';
import { UnitOfMeasureService } from './services/unit-of-measure.service';
import { ExportStatusService } from './services/export-status.service';
import { BranchService } from './services/branch.service';
import { DepartmentTypeService } from './services/department-type.service';
import { DepartmentService } from './services/department.service';
import { MachineFundingSourceService } from './services/machine-funding-source.service';
import { ManufacturerCountryService } from './services/manufacturer-country.service';
import { MachineDocumentTypeService } from './services/machine-document-type.service';
import { MachineCategoryService } from './services/machine-category.service';
import { MachineStatusService } from './services/machine-status.service';
import { MachineUnitService } from './services/machine-unit.service';
import { VendorService } from './services/vendor.service';
import { MaintenanceTypeService } from './services/maintenance-type.service';
import { TransferStatusService } from './services/transfer-status.service';
import { TransferTypeService } from './services/transfer-type.service';
import { ManufacturerService } from './services/manufacturer.service';
import { NotificationTypeService } from './services/notification-type.service';

import { UnitOfMeasureRepository } from './unit-of-measure/repositories/unit-of-measure.repository';
import { ExportStatusRepository } from './export-status/repositories/export-status.repository';
import { BranchRepository } from './branch/repositories/branch.repository';
import { DepartmentTypeRepository } from './department-type/repositories/department-type.repository';
import { DepartmentRepository } from './department/repositories/department.repository';
import { MachineFundingSourceRepository } from './machine-funding-source/repositories/machine-funding-source.repository';
import { ManufacturerCountryRepository } from './manufacturer-country/repositories/manufacturer-country.repository';
import { MachineDocumentTypeRepository } from './machine-document-type/repositories/machine-document-type.repository';
import { MachineCategoryRepository } from './machine-category/repositories/machine-category.repository';
import { MachineStatusRepository } from './machine-status/repositories/machine-status.repository';
import { MachineUnitRepository } from './machine-unit/repositories/machine-unit.repository';
import { VendorRepository } from './vendor/repositories/vendor.repository';
import { MaintenanceTypeRepository } from './maintenance-type/repositories/maintenance-type.repository';
import { TransferStatusRepository } from './transfer-status/repositories/transfer-status.repository';
import { TransferTypeRepository } from './transfer-type/repositories/transfer-type.repository';
import { ManufacturerRepository } from './manufacturer/repositories/manufacturer.repository';
import { NotificationTypeRepository } from './notification-type/repositories/notification-type.repository';

// Handlers
import { UnitOfMeasureHandlers } from './unit-of-measure/commands/handlers/unit-of-measure.handlers';
import { ExportStatusHandlers } from './export-status/commands/handlers/export-status.handlers';
import { BranchHandlers } from './branch/commands/handlers/branch.handlers';
import { DepartmentTypeHandlers } from './department-type/commands/handlers/department-type.handlers';
import { DepartmentHandlers } from './department/commands/handlers/department.handlers';
import { MachineFundingSourceHandlers } from './machine-funding-source/commands/handlers/machine-funding-source.handlers';
import { ManufacturerCountryHandlers } from './manufacturer-country/commands/handlers/manufacturer-country.handlers';
import { MachineDocumentTypeHandlers } from './machine-document-type/commands/handlers/machine-document-type.handlers';
import { MachineCategoryHandlers } from './machine-category/handlers/machine-category.handlers';
import { MachineStatusHandlers } from './machine-status/handlers/machine-status.handlers';
import { MachineUnitHandlers } from './machine-unit/handlers/machine-unit.handlers';
import { VendorHandlers } from './vendor/handlers/vendor.handlers';
import { MaintenanceTypeHandlers } from './maintenance-type/handlers/maintenance-type.handlers';
import { TransferStatusHandlers } from './transfer-status/handlers/transfer-status.handlers';
import { TransferTypeHandlers } from './transfer-type/handlers/transfer-type.handlers';
import { ManufacturerHandlers } from './manufacturer/commands/handlers/manufacturer.handlers';
import { CreateNotificationTypeHandler } from './notification-type/commands/handlers/create-notification-type.handler';
import { UpdateNotificationTypeHandler } from './notification-type/commands/handlers/update-notification-type.handler';
import { DeleteNotificationTypeHandler } from './notification-type/commands/handlers/delete-notification-type.handler';
import { GetNotificationTypesHandler } from './notification-type/queries/handlers/get-notification-types.handler';
import { GetNotificationTypeByIdHandler } from './notification-type/queries/handlers/get-notification-type-by-id.handler';
import { GetNotificationTypeByCodeHandler } from './notification-type/queries/handlers/get-notification-type-by-code.handler';
import { CountNotificationTypesHandler } from './notification-type/queries/handlers/count-notification-types.handler';

import { ManufacturerController } from './manufacturer.controller';

const NotificationTypeHandlers = [
  CreateNotificationTypeHandler,
  UpdateNotificationTypeHandler,
  DeleteNotificationTypeHandler,
  GetNotificationTypesHandler,
  GetNotificationTypeByIdHandler,
  GetNotificationTypeByCodeHandler,
  CountNotificationTypesHandler,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([
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
      Manufacturer,
      NotificationType,
    ]),
    CqrsModule,
    LoggerModule.forRoot({
      pinoHttp: {
        safe: true,
        transport: {
          targets: [
            {
              target: 'pino-pretty',
              options: {
                singleLine: true,
                colorize: true,
                translateTime: 'SYS:standard',
              },
            },
            {
              target: 'pino-roll',
              level: 'error',
              options: {
                file: './logs/master-data-svc-error.log',
                frequency: 'daily',
                mkdir: true,
                dateFormat: 'yyyy-MM-dd',
                limit: {
                  count: 14,
                },
              },
            },
            {
              target: 'pino-roll',
              level: 'info',
              options: {
                file: './logs/master-data-svc-combined.log',
                frequency: 'daily',
                mkdir: true,
                dateFormat: 'yyyy-MM-dd',
                limit: {
                  count: 14,
                },
              },
            },
          ],
        },
      } as any,
    }),
  ],
  controllers: [MasterDataController, ManufacturerController],
  providers: [
    UnitOfMeasureRepository,
    ExportStatusRepository,
    BranchRepository,
    DepartmentTypeRepository,
    DepartmentRepository,
    MachineFundingSourceRepository,
    ManufacturerCountryRepository,
    MachineDocumentTypeRepository,
    MachineCategoryRepository,
    MachineStatusRepository,
    MachineUnitRepository,
    VendorRepository,
    MaintenanceTypeRepository,
    TransferStatusRepository,
    TransferTypeRepository,
    ManufacturerRepository,
    NotificationTypeRepository,
    ...UnitOfMeasureHandlers,
    ...ExportStatusHandlers,
    ...BranchHandlers,
    ...DepartmentTypeHandlers,
    ...DepartmentHandlers,
    ...MachineFundingSourceHandlers,
    ...ManufacturerCountryHandlers,
    ...MachineDocumentTypeHandlers,
    ...MachineCategoryHandlers,
    ...MachineStatusHandlers,
    ...MachineUnitHandlers,
    ...VendorHandlers,
    ...MaintenanceTypeHandlers,
    ...TransferStatusHandlers,
    ...TransferTypeHandlers,
    ...TransferStatusHandlers,
    ...TransferTypeHandlers,
    ...ManufacturerHandlers,
    ...NotificationTypeHandlers,
    {
      provide: 'MasterDataService',
      useFactory: (
        unitOfMeasureService: UnitOfMeasureService,
        exportStatusService: ExportStatusService,
        branchService: BranchService,
        departmentTypeService: DepartmentTypeService,
        departmentService: DepartmentService,
        machineFundingSourceService: MachineFundingSourceService,
        manufacturerCountryService: ManufacturerCountryService,
        machineDocumentTypeService: MachineDocumentTypeService,
        machineCategoryService: MachineCategoryService,
        machineStatusService: MachineStatusService,
        machineUnitService: MachineUnitService,
        vendorService: VendorService,
        maintenanceTypeService: MaintenanceTypeService,
        transferStatusService: TransferStatusService,
        transferTypeService: TransferTypeService,
        manufacturerService: ManufacturerService,
        notificationTypeService: NotificationTypeService,
      ) => {
        return {
          // Unit of Measure
          findAllUnitOfMeasures: (query?: any) => unitOfMeasureService.findAll(query),
          findUnitOfMeasureById: (id: string) => unitOfMeasureService.findById(id),
          findUnitOfMeasureByCode: (code: string) => unitOfMeasureService.findByCode(code),
          countUnitOfMeasures: (query?: any) => unitOfMeasureService.count(query),
          createUnitOfMeasure: (dto: any) => unitOfMeasureService.create(dto),
          updateUnitOfMeasure: (id: string, dto: any) => unitOfMeasureService.update(id, dto),
          deleteUnitOfMeasure: (id: string) => unitOfMeasureService.delete(id),
          // Export Status
          findAllExportStatuses: (query?: any) => exportStatusService.findAll(query),
          findExportStatusById: (id: string) => exportStatusService.findById(id),
          findExportStatusByCode: (code: string) => exportStatusService.findByCode(code),
          countExportStatuses: (query?: any) => exportStatusService.count(query),
          createExportStatus: (dto: any) => exportStatusService.create(dto),
          updateExportStatus: (id: string, dto: any) => exportStatusService.update(id, dto),
          deleteExportStatus: (id: string) => exportStatusService.delete(id),
          // Branch
          findAllBranches: (query?: any) => branchService.findAll(query),
          findBranchById: (id: string) => branchService.findById(id),
          findBranchByCode: (code: string) => branchService.findByCode(code),
          countBranches: (query?: any) => branchService.count(query),
          createBranch: (dto: any) => branchService.create(dto),
          updateBranch: (id: string, dto: any) => branchService.update(id, dto),
          deleteBranch: (id: string) => branchService.delete(id),
          // Department Type
          findAllDepartmentTypes: (query?: any) => departmentTypeService.findAll(query),
          findDepartmentTypeById: (id: string) => departmentTypeService.findById(id),
          findDepartmentTypeByCode: (code: string) => departmentTypeService.findByCode(code),
          countDepartmentTypes: (query?: any) => departmentTypeService.count(query),
          createDepartmentType: (dto: any) => departmentTypeService.create(dto),
          updateDepartmentType: (id: string, dto: any) => departmentTypeService.update(id, dto),
          deleteDepartmentType: (id: string) => departmentTypeService.delete(id),
          // Department
          findAllDepartments: (query?: any) => departmentService.findAll(query),
          findDepartmentById: (id: string) => departmentService.findById(id),
          findDepartmentByCode: (code: string) => departmentService.findByCode(code),
          countDepartments: (query?: any) => departmentService.count(query),
          createDepartment: (dto: any) => departmentService.create(dto),
          updateDepartment: (id: string, dto: any) => departmentService.update(id, dto),
          deleteDepartment: (id: string) => departmentService.delete(id),
          // Machine Funding Source
          findAllMachineFundingSources: (query?: any) => machineFundingSourceService.findAll(query),
          findMachineFundingSourceById: (id: string) => machineFundingSourceService.findById(id),
          findMachineFundingSourceByCode: (code: string) => machineFundingSourceService.findByCode(code),
          countMachineFundingSources: (query?: any) => machineFundingSourceService.count(query),
          createMachineFundingSource: (dto: any) => machineFundingSourceService.create(dto),
          updateMachineFundingSource: (id: string, dto: any) => machineFundingSourceService.update(id, dto),
          deleteMachineFundingSource: (id: string) => machineFundingSourceService.delete(id),
          // Manufacturer Country
          findAllManufacturerCountries: (query?: any) => manufacturerCountryService.findAll(query),
          findManufacturerCountryById: (id: string) => manufacturerCountryService.findById(id),
          findManufacturerCountryByCode: (code: string) => manufacturerCountryService.findByCode(code),
          countManufacturerCountries: (query?: any) => manufacturerCountryService.count(query),
          createManufacturerCountry: (dto: any) => manufacturerCountryService.create(dto),
          updateManufacturerCountry: (id: string, dto: any) => manufacturerCountryService.update(id, dto),
          deleteManufacturerCountry: (id: string) => manufacturerCountryService.delete(id),
          // Machine Document Type
          findAllMachineDocumentTypes: (query?: any) => machineDocumentTypeService.findAll(query),
          findMachineDocumentTypeById: (id: string) => machineDocumentTypeService.findById(id),
          findMachineDocumentTypeByCode: (code: string) => machineDocumentTypeService.findByCode(code),
          countMachineDocumentTypes: (query?: any) => machineDocumentTypeService.count(query),
          createMachineDocumentType: (dto: any) => machineDocumentTypeService.create(dto),
          updateMachineDocumentType: (id: string, dto: any) => machineDocumentTypeService.update(id, dto),
          deleteMachineDocumentType: (id: string) => machineDocumentTypeService.delete(id),
          // Machine Category
          findAllMachineCategories: (query?: any) => machineCategoryService.findAll(query),
          findMachineCategoryById: (id: string) => machineCategoryService.findById(id),
          findMachineCategoryByCode: (code: string) => machineCategoryService.findByCode(code),
          countMachineCategories: (query?: any) => machineCategoryService.count(query),
          createMachineCategory: (dto: any) => machineCategoryService.create(dto),
          updateMachineCategory: (id: string, dto: any) => machineCategoryService.update(id, dto),
          deleteMachineCategory: (id: string) => machineCategoryService.delete(id),
          // Machine Status
          findAllMachineStatuses: (query?: any) => machineStatusService.findAll(query),
          findMachineStatusById: (id: string) => machineStatusService.findById(id),
          findMachineStatusByCode: (code: string) => machineStatusService.findByCode(code),
          countMachineStatuses: (query?: any) => machineStatusService.count(query),
          createMachineStatus: (dto: any) => machineStatusService.create(dto),
          updateMachineStatus: (id: string, dto: any) => machineStatusService.update(id, dto),
          deleteMachineStatus: (id: string) => machineStatusService.delete(id),
          // Machine Unit
          findAllMachineUnits: (query?: any) => machineUnitService.findAll(query),
          findMachineUnitById: (id: string) => machineUnitService.findById(id),
          findMachineUnitByCode: (code: string) => machineUnitService.findByCode(code),
          countMachineUnits: (query?: any) => machineUnitService.count(query),
          createMachineUnit: (dto: any) => machineUnitService.create(dto),
          updateMachineUnit: (id: string, dto: any) => machineUnitService.update(id, dto),
          deleteMachineUnit: (id: string) => machineUnitService.delete(id),
          // Vendor
          findAllVendors: (query?: any) => vendorService.findAll(query),
          findVendorById: (id: string) => vendorService.findById(id),
          findVendorByCode: (code: string) => vendorService.findByCode(code),
          countVendors: (query?: any) => vendorService.count(query),
          createVendor: (dto: any) => vendorService.create(dto),
          updateVendor: (id: string, dto: any) => vendorService.update(id, dto),
          deleteVendor: (id: string) => vendorService.delete(id),
          // Maintenance Type
          findAllMaintenanceTypes: (query?: any) => maintenanceTypeService.findAll(query),
          findMaintenanceTypeById: (id: string) => maintenanceTypeService.findById(id),
          findMaintenanceTypeByCode: (code: string) => maintenanceTypeService.findByCode(code),
          countMaintenanceTypes: (query?: any) => maintenanceTypeService.count(query),
          createMaintenanceType: (dto: any) => maintenanceTypeService.create(dto),
          updateMaintenanceType: (id: string, dto: any) => maintenanceTypeService.update(id, dto),
          deleteMaintenanceType: (id: string) => maintenanceTypeService.delete(id),
          // Transfer Status
          findAllTransferStatuses: (query?: any) => transferStatusService.findAll(query),
          findTransferStatusById: (id: string) => transferStatusService.findById(id),
          findTransferStatusByCode: (code: string) => transferStatusService.findByCode(code),
          countTransferStatuses: (query?: any) => transferStatusService.count(query),
          createTransferStatus: (dto: any) => transferStatusService.create(dto),
          updateTransferStatus: (id: string, dto: any) => transferStatusService.update(id, dto),
          deleteTransferStatus: (id: string) => transferStatusService.delete(id),
          // Transfer Type
          findAllTransferTypes: (query?: any) => transferTypeService.findAll(query),
          findTransferTypeById: (id: string) => transferTypeService.findById(id),
          findTransferTypeByCode: (code: string) => transferTypeService.findByCode(code),
          countTransferTypes: (query?: any) => transferTypeService.count(query),
          createTransferType: (dto: any) => transferTypeService.create(dto),
          updateTransferType: (id: string, dto: any) => transferTypeService.update(id, dto),
          deleteTransferType: (id: string) => transferTypeService.delete(id),
          // Manufacturer
          findAllManufacturers: (query?: any) => manufacturerService.findAll(query),
          findManufacturerById: (id: string) => manufacturerService.findOne(id),
          findManufacturerByCode: (code: string) => manufacturerService.findByCode(code),
          countManufacturers: (query?: any) => manufacturerService.findAll({ ...query, count: true }).then((res: any) => res.total),
          createManufacturer: (dto: any) => manufacturerService.create(dto),
          updateManufacturer: (id: string, dto: any) => manufacturerService.update({ ...dto, id }),
          destroyManufacturer: (id: string) => manufacturerService.remove(id),
          // Notification Type
          findAllNotificationTypes: (query?: any) => notificationTypeService.findAll(query),
          findNotificationTypeById: (id: string) => notificationTypeService.findOne(id),
          findNotificationTypeByCode: (code: string) => notificationTypeService.findByCode(code),
          countNotificationTypes: (query?: any) => notificationTypeService.count(query),
          createNotificationType: (dto: any) => notificationTypeService.create(dto),
          updateNotificationType: (id: string, dto: any) => notificationTypeService.update({ ...dto, id }),
          destroyNotificationType: (id: string) => notificationTypeService.delete({ where: JSON.stringify({ id }) }),
        };
      },
      inject: [
        UnitOfMeasureService,
        ExportStatusService,
        BranchService,
        DepartmentTypeService,
        DepartmentService,
        MachineFundingSourceService,
        ManufacturerCountryService,
        MachineDocumentTypeService,
        MachineCategoryService,
        MachineStatusService,
        MachineUnitService,
        VendorService,
        MaintenanceTypeService,
        TransferStatusService,
        TransferTypeService,
        ManufacturerService,
        NotificationTypeService,
      ],
    },
    UnitOfMeasureService,
    ExportStatusService,
    BranchService,
    DepartmentTypeService,
    DepartmentService,
    MachineFundingSourceService,
    ManufacturerCountryService,
    MachineDocumentTypeService,
    MachineCategoryService,
    MachineStatusService,
    MachineUnitService,
    VendorService,
    MaintenanceTypeService,
    TransferStatusService,
    TransferTypeService,
    ManufacturerService,
    NotificationTypeService,
  ],
  exports: ['MasterDataService'],
})
export class MasterDataModule { }
