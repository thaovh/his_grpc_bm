import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { firstValueFrom } from 'rxjs';

interface MasterDataGrpcService {
  // Unit of Measure
  findAllUnitOfMeasures(data: any): any;
  findUnitOfMeasureById(data: { id: string }): any;
  findUnitOfMeasureByCode(data: { name: string }): any;
  countUnitOfMeasures(data: any): any;
  createUnitOfMeasure(data: any): any;
  updateUnitOfMeasure(data: any): any;
  destroyUnitOfMeasure(data: any): any;
  // Export Status
  findAllExportStatuses(data: any): any;
  findExportStatusById(data: { id: string }): any;
  findExportStatusByCode(data: { name: string }): any;
  countExportStatuses(data: any): any;
  createExportStatus(data: any): any;
  updateExportStatus(data: any): any;
  destroyExportStatus(data: any): any;
  // Branch
  findAllBranches(data: any): any;
  findBranchById(data: { id: string }): any;
  findBranchByCode(data: { name: string }): any;
  countBranches(data: any): any;
  createBranch(data: any): any;
  updateBranch(data: any): any;
  destroyBranch(data: any): any;
  // Department Type
  findAllDepartmentTypes(data: any): any;
  findDepartmentTypeById(data: { id: string }): any;
  findDepartmentTypeByCode(data: { name: string }): any;
  countDepartmentTypes(data: any): any;
  createDepartmentType(data: any): any;
  updateDepartmentType(data: any): any;
  destroyDepartmentType(data: any): any;
  // Department
  findAllDepartments(data: any): any;
  findDepartmentById(data: { id: string }): any;
  findDepartmentByCode(data: { name: string }): any;
  countDepartments(data: any): any;
  createDepartment(data: any): any;
  updateDepartment(data: any): any;
  destroyDepartment(data: any): any;
  // Machine Funding Source
  findAllMachineFundingSources(data: any): any;
  findMachineFundingSourceById(data: { id: string }): any;
  findMachineFundingSourceByCode(data: { name: string }): any;
  countMachineFundingSources(data: any): any;
  createMachineFundingSource(data: any): any;
  updateMachineFundingSource(data: any): any;
  destroyMachineFundingSource(data: any): any;
  // Manufacturer Country
  findAllManufacturerCountries(data: any): any;
  findManufacturerCountryById(data: { id: string }): any;
  findManufacturerCountryByCode(data: { name: string }): any;
  countManufacturerCountries(data: any): any;
  createManufacturerCountry(data: any): any;
  updateManufacturerCountry(data: any): any;
  destroyManufacturerCountry(data: any): any;
  // Manufacturer
  findAllManufacturers(data: any): any;
  findManufacturerById(data: { id: string }): any;
  findManufacturerByCode(data: { name: string }): any;
  countManufacturers(data: any): any;
  createManufacturer(data: any): any;
  updateManufacturer(data: any): any;
  destroyManufacturer(data: any): any;
  // Machine Document Type
  findAllMachineDocumentTypes(data: any): any;
  findMachineDocumentTypeById(data: { id: string }): any;
  findMachineDocumentTypeByCode(data: { name: string }): any;
  countMachineDocumentTypes(data: any): any;
  createMachineDocumentType(data: any): any;
  updateMachineDocumentType(data: any): any;
  destroyMachineDocumentType(data: any): any;
  // Machine Category
  findAllMachineCategories(data: any): any;
  findMachineCategoryById(data: { id: string }): any;
  findMachineCategoryByCode(data: { name: string }): any;
  countMachineCategories(data: any): any;
  createMachineCategory(data: any): any;
  updateMachineCategory(data: any): any;
  destroyMachineCategory(data: any): any;
  // Machine Status
  findAllMachineStatuses(data: any): any;
  findMachineStatusById(data: { id: string }): any;
  findMachineStatusByCode(data: { name: string }): any;
  countMachineStatuses(data: any): any;
  createMachineStatus(data: any): any;
  updateMachineStatus(data: any): any;
  destroyMachineStatus(data: any): any;
  // Machine Unit
  findAllMachineUnits(data: any): any;
  findMachineUnitById(data: { id: string }): any;
  findMachineUnitByCode(data: { name: string }): any;
  countMachineUnits(data: any): any;
  createMachineUnit(data: any): any;
  updateMachineUnit(data: any): any;
  destroyMachineUnit(data: any): any;
  // Vendor
  findAllVendors(data: any): any;
  findVendorById(data: { id: string }): any;
  findVendorByCode(data: { name: string }): any;
  countVendors(data: any): any;
  createVendor(data: any): any;
  updateVendor(data: any): any;
  destroyVendor(data: any): any;
  // Maintenance Type
  findAllMaintenanceTypes(data: any): any;
  findMaintenanceTypeById(data: { id: string }): any;
  findMaintenanceTypeByCode(data: { name: string }): any;
  countMaintenanceTypes(data: any): any;
  createMaintenanceType(data: any): any;
  updateMaintenanceType(data: any): any;
  destroyMaintenanceType(data: any): any;
  // Transfer Status
  findAllTransferStatuses(data: any): any;
  findTransferStatusById(data: { id: string }): any;
  findTransferStatusByCode(data: { name: string }): any;
  countTransferStatuses(data: any): any;
  createTransferStatus(data: any): any;
  updateTransferStatus(data: any): any;
  destroyTransferStatus(data: any): any;
  // Transfer Type
  findAllTransferTypes(data: any): any;
  findTransferTypeById(data: { id: string }): any;
  findTransferTypeByCode(data: { name: string }): any;
  countTransferTypes(data: any): any;
  createTransferType(data: any): any;
  updateTransferType(data: any): any;
  destroyTransferType(data: any): any;
  destroyTransferType(data: { id: string }): any;
  // Notification Type
  findAllNotificationTypes(data: any): any;
  findNotificationTypeById(data: { id: string }): any;
  findNotificationTypeByCode(data: { name: string }): any;
  countNotificationTypes(data: any): any;
  createNotificationType(data: any): any;
  updateNotificationType(data: any): any;
  destroyNotificationType(data: any): any;
}

@Injectable()
export class MasterDataService implements OnModuleInit {
  private masterDataGrpcService: MasterDataGrpcService;

  constructor(
    @Inject('MASTER_DATA_PACKAGE') private readonly client: ClientGrpc,
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(MasterDataService.name);
  }

  // Helper to transform Long objects to numbers
  private transformLongToNumber(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj === 'object') {
      // Check if it looks like a Long object
      if (typeof obj.low === 'number' && typeof obj.high === 'number') {
        // Simple conversion: high * 2^32 + (low >>> 0)
        const low = obj.low >>> 0;
        const high = obj.high;
        const result = high * 4294967296 + low;
        // Return string if it exceeds safe integer to avoid precision loss
        if (result > Number.MAX_SAFE_INTEGER || result < Number.MIN_SAFE_INTEGER) {
          return result.toString();
        }
        return result;
      }

      if (Array.isArray(obj)) {
        return obj.map(item => this.transformLongToNumber(item));
      }

      const newObj: any = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          newObj[key] = this.transformLongToNumber(obj[key]);
        }
      }
      return newObj;
    }

    return obj;
  }

  onModuleInit() {
    this.masterDataGrpcService = this.client.getService<MasterDataGrpcService>('MasterDataService');
  }

  // Generic methods to avoid repetition
  private async findAll(method: string, query?: any) {
    this.logger.info(`MasterDataService#${method}.call`, query);
    const result = await firstValueFrom(this.masterDataGrpcService[method](query || {})) as any;
    this.logger.info(`MasterDataService#${method}.result`, result);
    return this.transformLongToNumber(result.data || []);
  }

  private async findById(method: string, id: string) {
    this.logger.info(`MasterDataService#${method}.call`, { id });
    const result = await firstValueFrom(this.masterDataGrpcService[method]({ id })) as any;
    this.logger.info(`MasterDataService#${method}.result`, result);
    return this.transformLongToNumber(result);
  }

  private async findByCode(method: string, code: string) {
    this.logger.info(`MasterDataService#${method}.call`, { code });
    const result = await firstValueFrom(this.masterDataGrpcService[method]({ name: code })) as any;
    this.logger.info(`MasterDataService#${method}.result`, result);
    return this.transformLongToNumber(result);
  }

  private async count(method: string, query?: any) {
    this.logger.info(`MasterDataService#${method}.call`, query);
    const result = await firstValueFrom(this.masterDataGrpcService[method](query || {})) as any;
    this.logger.info(`MasterDataService#${method}.result`, result);
    return result.count || 0;
  }

  private async create(method: string, data: any) {
    this.logger.info(`MasterDataService#${method}.call`, { code: data.code });
    const result = await firstValueFrom(this.masterDataGrpcService[method](data)) as any;
    this.logger.info(`MasterDataService#${method}.result`, result);
    return this.transformLongToNumber(result);
  }

  private async update(method: string, id: string, data: any) {
    this.logger.info(`MasterDataService#${method}.call`, { id });
    const result = await firstValueFrom(this.masterDataGrpcService[method]({ id, ...data })) as any;
    this.logger.info(`MasterDataService#${method}.result`, result);
    return this.transformLongToNumber(result);
  }

  private async delete(method: string, id: string) {
    this.logger.info(`MasterDataService#${method}.call`, { id });
    // Note: The proto expects commons.Query which has 'where' as a string
    const result = await firstValueFrom(this.masterDataGrpcService[method]({ where: JSON.stringify({ id }) })) as any;
    this.logger.info(`MasterDataService#${method}.result`, result);
    return result;
  }

  // Unit of Measure methods
  findAllUnitOfMeasures(query?: any) { return this.findAll('findAllUnitOfMeasures', query); }
  findUnitOfMeasureById(id: string) { return this.findById('findUnitOfMeasureById', id); }
  findUnitOfMeasureByCode(code: string) { return this.findByCode('findUnitOfMeasureByCode', code); }
  countUnitOfMeasures(query?: any) { return this.count('countUnitOfMeasures', query); }
  createUnitOfMeasure(data: any) { return this.create('createUnitOfMeasure', data); }
  updateUnitOfMeasure(id: string, data: any) { return this.update('updateUnitOfMeasure', id, data); }
  deleteUnitOfMeasure(id: string) { return this.delete('destroyUnitOfMeasure', id); }

  // Export Status methods
  findAllExportStatuses(query?: any) { return this.findAll('findAllExportStatuses', query); }
  findExportStatusById(id: string) { return this.findById('findExportStatusById', id); }
  findExportStatusByCode(code: string) { return this.findByCode('findExportStatusByCode', code); }
  countExportStatuses(query?: any) { return this.count('countExportStatuses', query); }
  createExportStatus(data: any) { return this.create('createExportStatus', data); }
  updateExportStatus(id: string, data: any) { return this.update('updateExportStatus', id, data); }
  deleteExportStatus(id: string) { return this.delete('destroyExportStatus', id); }

  // Branch methods
  findAllBranches(query?: any) { return this.findAll('findAllBranches', query); }
  findBranchById(id: string) { return this.findById('findBranchById', id); }
  findBranchByCode(code: string) { return this.findByCode('findBranchByCode', code); }
  countBranches(query?: any) { return this.count('countBranches', query); }
  createBranch(data: any) { return this.create('createBranch', data); }
  updateBranch(id: string, data: any) { return this.update('updateBranch', id, data); }
  deleteBranch(id: string) { return this.delete('destroyBranch', id); }

  // Department Type methods
  findAllDepartmentTypes(query?: any) { return this.findAll('findAllDepartmentTypes', query); }
  findDepartmentTypeById(id: string) { return this.findById('findDepartmentTypeById', id); }
  findDepartmentTypeByCode(code: string) { return this.findByCode('findDepartmentTypeByCode', code); }
  countDepartmentTypes(query?: any) { return this.count('countDepartmentTypes', query); }
  createDepartmentType(data: any) { return this.create('createDepartmentType', data); }
  updateDepartmentType(id: string, data: any) { return this.update('updateDepartmentType', id, data); }
  deleteDepartmentType(id: string) { return this.delete('destroyDepartmentType', id); }

  // Department methods
  findAllDepartments(query?: any) { return this.findAll('findAllDepartments', query); }
  findDepartmentById(id: string) { return this.findById('findDepartmentById', id); }
  findDepartmentByCode(code: string) { return this.findByCode('findDepartmentByCode', code); }
  countDepartments(query?: any) { return this.count('countDepartments', query); }
  createDepartment(data: any) { return this.create('createDepartment', data); }
  updateDepartment(id: string, data: any) { return this.update('updateDepartment', id, data); }
  deleteDepartment(id: string) { return this.delete('destroyDepartment', id); }

  // Machine Funding Source methods
  findAllMachineFundingSources(query?: any) { return this.findAll('findAllMachineFundingSources', query); }
  findMachineFundingSourceById(id: string) { return this.findById('findMachineFundingSourceById', id); }
  findMachineFundingSourceByCode(code: string) { return this.findByCode('findMachineFundingSourceByCode', code); }
  countMachineFundingSources(query?: any) { return this.count('countMachineFundingSources', query); }
  createMachineFundingSource(data: any) { return this.create('createMachineFundingSource', data); }
  updateMachineFundingSource(id: string, data: any) { return this.update('updateMachineFundingSource', id, data); }
  deleteMachineFundingSource(id: string) { return this.delete('destroyMachineFundingSource', id); }

  // Manufacturer Country methods
  findAllManufacturerCountries(query?: any) { return this.findAll('findAllManufacturerCountries', query); }
  findManufacturerCountryById(id: string) { return this.findById('findManufacturerCountryById', id); }
  findManufacturerCountryByCode(code: string) { return this.findByCode('findManufacturerCountryByCode', code); }
  countManufacturerCountries(query?: any) { return this.count('countManufacturerCountries', query); }
  createManufacturerCountry(data: any) { return this.create('createManufacturerCountry', data); }
  updateManufacturerCountry(id: string, data: any) { return this.update('updateManufacturerCountry', id, data); }
  deleteManufacturerCountry(id: string) { return this.delete('destroyManufacturerCountry', id); }

  // Manufacturer methods
  findAllManufacturers(query?: any) { return this.findAll('findAllManufacturers', query); }
  findManufacturerById(id: string) { return this.findById('findManufacturerById', id); }
  findManufacturerByCode(code: string) { return this.findByCode('findManufacturerByCode', code); }
  countManufacturers(query?: any) { return this.count('countManufacturers', query); }
  createManufacturer(data: any) { return this.create('createManufacturer', data); }
  updateManufacturer(id: string, data: any) { return this.update('updateManufacturer', id, data); }
  deleteManufacturer(id: string) { return this.delete('destroyManufacturer', id); }

  // Machine Document Type methods
  findAllMachineDocumentTypes(query?: any) { return this.findAll('findAllMachineDocumentTypes', query); }
  findMachineDocumentTypeById(id: string) { return this.findById('findMachineDocumentTypeById', id); }
  findMachineDocumentTypeByCode(code: string) { return this.findByCode('findMachineDocumentTypeByCode', code); }
  countMachineDocumentTypes(query?: any) { return this.count('countMachineDocumentTypes', query); }
  createMachineDocumentType(data: any) { return this.create('createMachineDocumentType', data); }
  updateMachineDocumentType(id: string, data: any) { return this.update('updateMachineDocumentType', id, data); }
  deleteMachineDocumentType(id: string) { return this.delete('destroyMachineDocumentType', id); }

  // Machine Category methods
  findAllMachineCategories(query?: any) { return this.findAll('findAllMachineCategories', query); }
  findMachineCategoryById(id: string) { return this.findById('findMachineCategoryById', id); }
  findMachineCategoryByCode(code: string) { return this.findByCode('findMachineCategoryByCode', code); }
  countMachineCategories(query?: any) { return this.count('countMachineCategories', query); }
  createMachineCategory(data: any) { return this.create('createMachineCategory', data); }
  updateMachineCategory(id: string, data: any) { return this.update('updateMachineCategory', id, data); }
  deleteMachineCategory(id: string) { return this.delete('destroyMachineCategory', id); }

  // Machine Status methods
  findAllMachineStatuses(query?: any) { return this.findAll('findAllMachineStatuses', query); }
  findMachineStatusById(id: string) { return this.findById('findMachineStatusById', id); }
  findMachineStatusByCode(code: string) { return this.findByCode('findMachineStatusByCode', code); }
  countMachineStatuses(query?: any) { return this.count('countMachineStatuses', query); }
  createMachineStatus(data: any) { return this.create('createMachineStatus', data); }
  updateMachineStatus(id: string, data: any) { return this.update('updateMachineStatus', id, data); }
  deleteMachineStatus(id: string) { return this.delete('destroyMachineStatus', id); }

  // Machine Unit methods
  findAllMachineUnits(query?: any) { return this.findAll('findAllMachineUnits', query); }
  findMachineUnitById(id: string) { return this.findById('findMachineUnitById', id); }
  findMachineUnitByCode(code: string) { return this.findByCode('findMachineUnitByCode', code); }
  countMachineUnits(query?: any) { return this.count('countMachineUnits', query); }
  createMachineUnit(data: any) { return this.create('createMachineUnit', data); }
  updateMachineUnit(id: string, data: any) { return this.update('updateMachineUnit', id, data); }
  deleteMachineUnit(id: string) { return this.delete('destroyMachineUnit', id); }

  // Vendor methods
  findAllVendors(query?: any) { return this.findAll('findAllVendors', query); }
  findVendorById(id: string) { return this.findById('findVendorById', id); }
  findVendorByCode(code: string) { return this.findByCode('findVendorByCode', code); }
  countVendors(query?: any) { return this.count('countVendors', query); }
  createVendor(data: any) { return this.create('createVendor', data); }
  updateVendor(id: string, data: any) { return this.update('updateVendor', id, data); }
  deleteVendor(id: string) { return this.delete('destroyVendor', id); }

  // Maintenance Type methods
  findAllMaintenanceTypes(query?: any) { return this.findAll('findAllMaintenanceTypes', query); }
  findMaintenanceTypeById(id: string) { return this.findById('findMaintenanceTypeById', id); }
  findMaintenanceTypeByCode(code: string) { return this.findByCode('findMaintenanceTypeByCode', code); }
  countMaintenanceTypes(query?: any) { return this.count('countMaintenanceTypes', query); }
  createMaintenanceType(data: any) { return this.create('createMaintenanceType', data); }
  updateMaintenanceType(id: string, data: any) { return this.update('updateMaintenanceType', id, data); }
  deleteMaintenanceType(id: string) { return this.delete('destroyMaintenanceType', id); }

  // Transfer Status methods
  findAllTransferStatuses(query?: any) { return this.findAll('findAllTransferStatuses', query); }
  findTransferStatusById(id: string) { return this.findById('findTransferStatusById', id); }
  findTransferStatusByCode(code: string) { return this.findByCode('findTransferStatusByCode', code); }
  countTransferStatuses(query?: any) { return this.count('countTransferStatuses', query); }
  createTransferStatus(data: any) { return this.create('createTransferStatus', data); }
  updateTransferStatus(id: string, data: any) { return this.update('updateTransferStatus', id, data); }
  deleteTransferStatus(id: string) { return this.delete('destroyTransferStatus', id); }

  // Transfer Type methods
  findAllTransferTypes(query?: any) { return this.findAll('findAllTransferTypes', query); }
  findTransferTypeById(id: string) { return this.findById('findTransferTypeById', id); }
  findTransferTypeByCode(code: string) { return this.findByCode('findTransferTypeByCode', code); }
  countTransferTypes(query?: any) { return this.count('countTransferTypes', query); }
  createTransferType(data: any) { return this.create('createTransferType', data); }
  updateTransferType(id: string, data: any) { return this.update('updateTransferType', id, data); }
  deleteTransferType(id: string) { return this.delete('destroyTransferType', id); }

  // Notification Type methods
  findAllNotificationTypes(query?: any) { return this.findAll('findAllNotificationTypes', query); }
  findNotificationTypeById(id: string) { return this.findById('findNotificationTypeById', id); }
  findNotificationTypeByCode(code: string) { return this.findByCode('findNotificationTypeByCode', code); }
  countNotificationTypes(query?: any) { return this.count('countNotificationTypes', query); }
  createNotificationType(data: any) { return this.create('createNotificationType', data); }
  updateNotificationType(id: string, data: any) { return this.update('updateNotificationType', id, data); }
  deleteNotificationType(id: string) { return this.delete('destroyNotificationType', id); }
}
