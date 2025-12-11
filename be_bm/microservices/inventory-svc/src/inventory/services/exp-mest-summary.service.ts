import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { firstValueFrom } from 'rxjs';
import { ExpMestCabinetService } from './exp-mest-cabinet.service';
import { ExpMestCabinetMedicineService } from './exp-mest-cabinet-medicine.service';
import { ExpMestOtherService } from './exp-mest-other.service';
import { ExpMestOtherMedicineService } from './exp-mest-other-medicine.service';
import { InpatientExpMestService } from './inpatient-exp-mest.service';
import { InpatientExpMestChildService } from './inpatient-exp-mest-child.service';
import { InpatientExpMestMedicineService } from './inpatient-exp-mest-medicine.service';
import { convertLongToNumber, convertLongToNumberRequired } from '../utils/oracle-utils';

interface MasterDataGrpcService {
  findExportStatusById(data: { id: string }): any;
}

interface User {
  id: string;
  username: string;
  email: string;
}

interface UserProfile {
  firstName?: string;
  lastName?: string;
}

interface UserWithProfile {
  user?: User;
  profile?: UserProfile;
}

interface UsersGrpcService {
  getUserInfoWithProfile(data: { id: string }): any; // Returns Observable<UserWithProfile>
}

@Injectable()
export class ExpMestSummaryService implements OnModuleInit {
  private masterDataGrpcService: MasterDataGrpcService;
  private usersGrpcService: UsersGrpcService;

  constructor(
    private readonly expMestCabinetService: ExpMestCabinetService,
    private readonly expMestCabinetMedicineService: ExpMestCabinetMedicineService,
    private readonly expMestOtherService: ExpMestOtherService,
    private readonly expMestOtherMedicineService: ExpMestOtherMedicineService,
    private readonly inpatientExpMestService: InpatientExpMestService,
    private readonly inpatientExpMestChildService: InpatientExpMestChildService,
    private readonly inpatientExpMestMedicineService: InpatientExpMestMedicineService,
    @Inject('MASTER_DATA_PACKAGE') private readonly masterDataClient: ClientGrpc,
    @Inject('USERS_PACKAGE') private readonly usersClient: ClientGrpc,
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ExpMestSummaryService.name);
  }

  onModuleInit() {
    this.masterDataGrpcService = this.masterDataClient.getService<MasterDataGrpcService>('MasterDataService');
    this.usersGrpcService = this.usersClient.getService<UsersGrpcService>('UsersService');
    console.log('=== [DEBUG] ExpMestSummaryService.onModuleInit ===');
    console.log('usersClient:', !!this.usersClient);
    console.log('usersGrpcService:', !!this.usersGrpcService);
    console.log('usersGrpcService.getUserInfoWithProfile:', typeof this.usersGrpcService?.getUserInfoWithProfile);
    this.logger.info('ExpMestSummaryService initialized', {
      hasUsersClient: !!this.usersClient,
      hasUsersGrpcService: !!this.usersGrpcService,
      hasFindByIdWithProfile: typeof this.usersGrpcService?.getUserInfoWithProfile === 'function',
    });
  }

  /**
   * Get ExpMestCabinet summary with grouped medicines
   */
  async getExpMestCabinetSummary(expMestId: number, orderBy?: string): Promise<any> {
    this.logger.info('ExpMestSummaryService#getExpMestCabinetSummary.call', { expMestId, orderBy });

    // Convert expMestId from Long object to number if needed
    const expMestIdNumber = convertLongToNumberRequired(expMestId, 'expMestId');

    let parent: any;
    let medicines: any[];

    try {
      // 1. Fetch parent
      this.logger.debug('Fetching parent ExpMestCabinet', { expMestId: expMestIdNumber });
      parent = await this.expMestCabinetService.findByHisId(expMestIdNumber);
      if (!parent) {
        throw new Error(`ExpMestCabinet with ID ${expMestIdNumber} not found`);
      }

      // Convert Long objects in parent
      this.convertLongToNumber(parent);
      this.logger.debug('Parent fetched and converted', { parentId: parent.id });

      // 2. Fetch medicines
      this.logger.debug('Fetching medicines', { expMestId: expMestIdNumber });
      medicines = await this.expMestCabinetMedicineService.findByExpMestId(expMestIdNumber);

      // Convert Long objects in medicines
      medicines.forEach(med => this.convertLongToNumber(med));
      this.logger.debug('Medicines fetched and converted', { count: medicines.length });
    } catch (error: any) {
      this.logger.error('Error in getExpMestCabinetSummary before buildExpMestSummary', {
        expMestId,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }

    // 3. Build summary
    const summary = await this.buildExpMestSummary(
      parent,
      medicines,
      orderBy,
      { exportTimeField: 'expTime' } // Cabinet uses expTime instead of exportTime
    );

    // 4. Enrich with working_state
    console.log('=== [DEBUG] Enriching working_state ===');
    console.log('workingStateId:', summary.workingStateId);
    console.log('hasWorkingStateId:', !!summary.workingStateId);

    this.logger.info('Enriching working_state', {
      workingStateId: summary.workingStateId,
      hasWorkingStateId: !!summary.workingStateId
    });
    if (summary.workingStateId) {
      try {
        console.log('=== [DEBUG] Fetching working_state ===');
        console.log('workingStateId:', summary.workingStateId);

        this.logger.debug('Fetching working_state', { workingStateId: summary.workingStateId });
        const workingState = await firstValueFrom(
          this.masterDataGrpcService.findExportStatusById({ id: summary.workingStateId })
        ) as any;

        console.log('=== [DEBUG] Raw workingState from gRPC ===');
        console.log('workingState:', JSON.stringify(workingState, null, 2));
        console.log('workingState type:', typeof workingState);
        console.log('workingState keys:', Object.keys(workingState || {}));

        // Map to ensure structure matches proto ExportStatus EXACTLY
        // IMPORTANT: In proto3, nested messages must match proto definition exactly
        // Field names must match proto field names (camelCase)
        if (workingState) {
          // Convert Date objects to ISO strings if needed
          const convertDateToString = (value: any): string => {
            if (!value) return '';
            if (value instanceof Date) {
              return value.toISOString();
            }
            if (typeof value === 'string') {
              // If it's already a date string, try to convert to ISO
              const date = new Date(value);
              if (!isNaN(date.getTime())) {
                return date.toISOString();
              }
              return value;
            }
            return String(value);
          };

          // Map to proto ExportStatus structure EXACTLY
          // Ensure all fields are present and match proto definition
          summary.working_state = {
            id: String(workingState.id || ''),
            code: String(workingState.code || ''),
            name: String(workingState.name || ''),
            sortOrder: Number(workingState.sortOrder || workingState.sort_order || 0),
            createdAt: convertDateToString(workingState.createdAt || workingState.created_at),
            updatedAt: convertDateToString(workingState.updatedAt || workingState.updated_at),
            createdBy: String(workingState.createdBy || workingState.created_by || ''),
            updatedBy: String(workingState.updatedBy || workingState.updated_by || ''),
            version: Number(workingState.version || 0),
            isActive: Number(workingState.isActive || workingState.is_active || 0),
          };

          // Ensure working_state is not null/undefined (proto3 default value handling)
          // In proto3, if all fields are default values, the message won't be serialized
          // So we ensure at least id field is always set
          if (!summary.working_state.id && summary.workingStateId) {
            summary.working_state.id = summary.workingStateId;
          }

          console.log('=== [DEBUG] Mapped working_state ===');
          console.log('summary.working_state:', JSON.stringify(summary.working_state, null, 2));
          console.log('summary.working_state keys:', Object.keys(summary.working_state || {}));
        } else {
          console.log('=== [DEBUG] workingState is null/undefined ===');
          // If workingState is null/undefined, set working_state to null
          summary.working_state = null;
        }

        this.logger.info('Successfully fetched working_state', {
          workingStateId: summary.workingStateId,
          workingStateCode: summary.working_state?.code,
          workingStateName: summary.working_state?.name,
          workingStateKeys: Object.keys(summary.working_state || {}),
          rawWorkingStateKeys: Object.keys(workingState || {})
        });
      } catch (e: any) {
        console.error('=== [DEBUG] Failed to fetch working_state ===');
        console.error('error:', e);
        console.error('error message:', e?.message);
        console.error('error code:', e?.code);
        console.error('error stack:', e?.stack);

        this.logger.error('Failed to fetch working_state', {
          workingStateId: summary.workingStateId,
          error: e?.message || e,
          code: e?.code,
          stack: e?.stack
        });
        // Set to null explicitly if fetch fails
        summary.working_state = null;
      }
    } else {
      console.log('=== [DEBUG] No workingStateId found ===');
      this.logger.debug('No workingStateId found, skipping working_state enrichment');
      summary.working_state = null;
    }

    console.log('=== [DEBUG] After enriching working_state ===');
    console.log('summary.workingStateId:', summary.workingStateId);
    console.log('summary.working_state:', summary.working_state);
    console.log('hasWorkingState:', !!summary.working_state);
    console.log('working_state type:', typeof summary.working_state);
    console.log('working_state is null:', summary.working_state === null);
    console.log('working_state is undefined:', summary.working_state === undefined);
    if (summary.working_state) {
      console.log('working_state keys:', Object.keys(summary.working_state));
      console.log('working_state full:', JSON.stringify(summary.working_state, null, 2));
    }
    console.log('summary keys:', Object.keys(summary || {}));
    console.log('summary (first 1000 chars):', JSON.stringify(summary).substring(0, 1000));

    this.logger.info('After enriching working_state', {
      workingStateId: summary.workingStateId,
      hasWorkingState: !!summary.working_state,
      workingStateCode: summary.working_state?.code
    });

    return summary;
  }

  /**
   * Get ExpMestOther summary with grouped medicines
   */
  async getExpMestOtherSummary(expMestId: number, orderBy?: string): Promise<any> {
    this.logger.info('ExpMestSummaryService#getExpMestOtherSummary.call', { expMestId, orderBy });

    // Convert expMestId from Long object to number if needed
    const expMestIdNumber = convertLongToNumberRequired(expMestId, 'expMestId');

    // 1. Fetch parent
    const parent = await this.expMestOtherService.findByHisExpMestId(expMestIdNumber);
    if (!parent) {
      throw new Error(`ExpMestOther with ID ${expMestIdNumber} not found`);
    }

    // Convert Long objects in parent
    this.convertLongToNumber(parent);

    // 2. Fetch medicines
    const medicines = await this.expMestOtherMedicineService.findByExpMestId(expMestIdNumber);

    // Convert Long objects in medicines
    medicines.forEach(med => this.convertLongToNumber(med));

    // 3. Build summary
    const summary = await this.buildExpMestSummary(
      parent,
      medicines,
      orderBy,
      { exportTimeField: 'exportTime' }
    );

    // 4. Enrich with working_state
    console.log('=== [DEBUG] Enriching working_state ===');
    console.log('workingStateId:', summary.workingStateId);
    console.log('hasWorkingStateId:', !!summary.workingStateId);

    this.logger.info('Enriching working_state', {
      workingStateId: summary.workingStateId,
      hasWorkingStateId: !!summary.workingStateId
    });
    if (summary.workingStateId) {
      try {
        console.log('=== [DEBUG] Fetching working_state ===');
        console.log('workingStateId:', summary.workingStateId);

        this.logger.debug('Fetching working_state', { workingStateId: summary.workingStateId });
        const workingState = await firstValueFrom(
          this.masterDataGrpcService.findExportStatusById({ id: summary.workingStateId })
        ) as any;

        console.log('=== [DEBUG] Raw workingState from gRPC ===');
        console.log('workingState:', JSON.stringify(workingState, null, 2));
        console.log('workingState type:', typeof workingState);
        console.log('workingState keys:', Object.keys(workingState || {}));

        // Map to ensure structure matches proto ExportStatus EXACTLY
        // IMPORTANT: In proto3, nested messages must match proto definition exactly
        // Field names must match proto field names (camelCase)
        if (workingState) {
          // Convert Date objects to ISO strings if needed
          const convertDateToString = (value: any): string => {
            if (!value) return '';
            if (value instanceof Date) {
              return value.toISOString();
            }
            if (typeof value === 'string') {
              // If it's already a date string, try to convert to ISO
              const date = new Date(value);
              if (!isNaN(date.getTime())) {
                return date.toISOString();
              }
              return value;
            }
            return String(value);
          };

          // Map to proto ExportStatus structure EXACTLY
          // Ensure all fields are present and match proto definition
          summary.working_state = {
            id: String(workingState.id || ''),
            code: String(workingState.code || ''),
            name: String(workingState.name || ''),
            sortOrder: Number(workingState.sortOrder || workingState.sort_order || 0),
            createdAt: convertDateToString(workingState.createdAt || workingState.created_at),
            updatedAt: convertDateToString(workingState.updatedAt || workingState.updated_at),
            createdBy: String(workingState.createdBy || workingState.created_by || ''),
            updatedBy: String(workingState.updatedBy || workingState.updated_by || ''),
            version: Number(workingState.version || 0),
            isActive: Number(workingState.isActive || workingState.is_active || 0),
          };

          // Ensure working_state is not null/undefined (proto3 default value handling)
          // In proto3, if all fields are default values, the message won't be serialized
          // So we ensure at least id field is always set
          if (!summary.working_state.id && summary.workingStateId) {
            summary.working_state.id = summary.workingStateId;
          }

          console.log('=== [DEBUG] Mapped working_state ===');
          console.log('summary.working_state:', JSON.stringify(summary.working_state, null, 2));
          console.log('summary.working_state keys:', Object.keys(summary.working_state || {}));
        } else {
          console.log('=== [DEBUG] workingState is null/undefined ===');
          // If workingState is null/undefined, set working_state to null
          summary.working_state = null;
        }

        this.logger.info('Successfully fetched working_state', {
          workingStateId: summary.workingStateId,
          workingStateCode: summary.working_state?.code,
          workingStateName: summary.working_state?.name,
          workingStateKeys: Object.keys(summary.working_state || {}),
          rawWorkingStateKeys: Object.keys(workingState || {})
        });
      } catch (e: any) {
        console.error('=== [DEBUG] Failed to fetch working_state ===');
        console.error('error:', e);
        console.error('error message:', e?.message);
        console.error('error code:', e?.code);
        console.error('error stack:', e?.stack);

        this.logger.error('Failed to fetch working_state', {
          workingStateId: summary.workingStateId,
          error: e?.message || e,
          code: e?.code,
          stack: e?.stack
        });
        // Set to null explicitly if fetch fails
        summary.working_state = null;
      }
    } else {
      console.log('=== [DEBUG] No workingStateId found ===');
      this.logger.debug('No workingStateId found, skipping working_state enrichment');
      summary.working_state = null;
    }

    console.log('=== [DEBUG] After enriching working_state ===');
    console.log('summary.workingStateId:', summary.workingStateId);
    console.log('summary.working_state:', summary.working_state);
    console.log('hasWorkingState:', !!summary.working_state);
    console.log('working_state type:', typeof summary.working_state);
    console.log('working_state is null:', summary.working_state === null);
    console.log('working_state is undefined:', summary.working_state === undefined);
    if (summary.working_state) {
      console.log('working_state keys:', Object.keys(summary.working_state));
      console.log('working_state full:', JSON.stringify(summary.working_state, null, 2));
    }
    console.log('summary keys:', Object.keys(summary || {}));
    console.log('summary (first 1000 chars):', JSON.stringify(summary).substring(0, 1000));

    this.logger.info('After enriching working_state', {
      workingStateId: summary.workingStateId,
      hasWorkingState: !!summary.working_state,
      workingStateCode: summary.working_state?.code
    });

    return summary;
  }

  /**
   * Get InpatientExpMest summary with grouped medicines from all children
   */
  async getInpatientExpMestSummary(expMestId: number, orderBy?: string): Promise<any> {
    this.logger.info('ExpMestSummaryService#getInpatientExpMestSummary.call', { expMestId, orderBy });

    // Convert expMestId from Long object to number if needed
    const expMestIdNumber = convertLongToNumberRequired(expMestId, 'expMestId');

    // 1. Fetch parent
    const parent = await this.inpatientExpMestService.findByHisExpMestId(expMestIdNumber);
    if (!parent) {
      throw new Error(`InpatientExpMest with ID ${expMestIdNumber} not found`);
    }

    // Convert Long objects in parent
    this.convertLongToNumber(parent);

    // 2. Fetch all children
    const children = await this.inpatientExpMestChildService.findByAggrExpMestId(expMestIdNumber);

    // Convert Long objects in children
    children.forEach(child => this.convertLongToNumber(child));

    // 3. Fetch all medicines from children
    const allMedicines: any[] = [];
    for (const child of children) {
      // Convert child.hisExpMestId from Long object to number if needed
      const childHisExpMestId = convertLongToNumberRequired(child.hisExpMestId, 'child.hisExpMestId');
      const medicines = await this.inpatientExpMestMedicineService.findByInpatientExpMestId(childHisExpMestId);
      medicines.forEach(med => this.convertLongToNumber(med));
      allMedicines.push(...medicines);
    }

    // 4. Build summary
    const summary = await this.buildExpMestSummary(
      parent,
      allMedicines,
      orderBy,
      { exportTimeField: 'exportTime' }
    );

    // 5. Enrich with working_state
    if (summary.workingStateId) {
      try {
        this.logger.debug('Fetching working_state', { workingStateId: summary.workingStateId });
        const workingState = await firstValueFrom(
          this.masterDataGrpcService.findExportStatusById({ id: summary.workingStateId })
        ) as any;
        summary.working_state = workingState;
        this.logger.debug('Successfully fetched working_state', {
          workingStateId: summary.workingStateId,
          workingStateCode: workingState?.code
        });
      } catch (e: any) {
        this.logger.warn('Failed to fetch working_state', {
          workingStateId: summary.workingStateId,
          error: e?.message || e,
          code: e?.code
        });
        // Set to null explicitly if fetch fails
        summary.working_state = null;
      }
    } else {
      this.logger.debug('No workingStateId found, skipping working_state enrichment');
      summary.working_state = null;
    }

    return summary;
  }

  /**
   * Common method to build exp mest summary with grouped medicines
   */
  private async buildExpMestSummary(
    parent: any,
    allMedicines: any[],
    orderBy?: string,
    fieldConfig?: { exportTimeField: 'expTime' | 'exportTime' }
  ): Promise<any> {
    const exportTimeField = fieldConfig?.exportTimeField || 'exportTime';

    // 1. Group by medicineTypeCode and Aggregate
    const medicineMap = new Map<string, {
      medicineCode: string | null;
      medicineName: string | null;
      serviceUnitCode: string | null;
      serviceUnitName: string | null;
      amount: number;
      hisIds: number[];
    }>();

    for (const med of allMedicines) {
      const key = med.medicineTypeCode || `UNKNOWN_${med.medicineId || 'NULL'}`;

      if (!medicineMap.has(key)) {
        medicineMap.set(key, {
          medicineCode: med.medicineTypeCode || null,
          medicineName: med.medicineTypeName || null,
          serviceUnitCode: med.serviceUnitCode || null,
          serviceUnitName: med.serviceUnitName || null,
          amount: 0,
          hisIds: [],
        });
      }

      const grouped = medicineMap.get(key);
      if (grouped) {
        grouped.amount += (med.amount || 0);
        if (med.hisId) {
          // Convert Long object to number if needed
          const hisIdNumber = convertLongToNumber(med.hisId);
          if (hisIdNumber !== null) {
            grouped.hisIds.push(hisIdNumber);
          }
        }
        if (!grouped.serviceUnitCode && med.serviceUnitCode) grouped.serviceUnitCode = med.serviceUnitCode;
        if (!grouped.serviceUnitName && med.serviceUnitName) grouped.serviceUnitName = med.serviceUnitName;
      }
    }

    // 2. Create Export Status Map
    const medicinesWithExportInfo = Array.from(medicineMap.values()).map(groupedMed => {
      // Find original meds for this group
      const medsInGroup = allMedicines.filter((m: any) =>
        (m.medicineTypeCode && m.medicineTypeCode === groupedMed.medicineCode) ||
        (!m.medicineTypeCode && `UNKNOWN_${m.medicineId}` === `UNKNOWN_${groupedMed.medicineCode === null ? 'NULL' : groupedMed.medicineCode}`)
      );

      let isExported = true;
      let exportedByUser: string | null = null;
      let exportedTime: number | null = null;

      if (medsInGroup.length === 0) {
        isExported = false;
      } else {
        for (const m of medsInGroup) {
          const timeField = m[exportTimeField];
          if (!m.exportByUser && !timeField) {
            isExported = false;
            break;
          }
        }

        if (isExported) {
          exportedByUser = medsInGroup[0].exportByUser;
          const timeValue = medsInGroup[0][exportTimeField];
          exportedTime = timeValue !== null && timeValue !== undefined ? convertLongToNumber(timeValue) : null;
        }
      }

      let isActualExported = true;
      let actualExportedByUser: string | null = null;
      let actualExportedTime: number | null = null;

      if (medsInGroup.length === 0) {
        isActualExported = false;
      } else {
        for (const m of medsInGroup) {
          if (!m.actualExportByUser && !m.actualExportTime) {
            isActualExported = false;
            break;
          }
        }
        if (isActualExported) {
          actualExportedByUser = medsInGroup[0].actualExportByUser;
          const timeValue = medsInGroup[0].actualExportTime;
          actualExportedTime = timeValue !== null && timeValue !== undefined ? convertLongToNumber(timeValue) : null;
        }
      }

      return {
        ...groupedMed,
        is_exported: isExported,
        exportedByUser: isExported ? exportedByUser : null,
        exportedTime: isExported ? exportedTime : null,
        is_actual_exported: isActualExported,
        actualExportedByUser: isActualExported ? actualExportedByUser : null,
        actualExportedTime: isActualExported ? actualExportedTime : null,
      };
    });

    // 3. Enrich User Info
    console.log('=== [DEBUG] Starting to enrich User Info ===');
    console.log('medicinesWithExportInfo count:', medicinesWithExportInfo.length);
    this.logger.info('Starting to enrich User Info', { count: medicinesWithExportInfo.length });

    const medicines = await Promise.all(medicinesWithExportInfo.map(async (medicine: any) => {
      let enrichedMedicine = { ...medicine };

      console.log('=== [DEBUG] Processing medicine ===');
      console.log('medicineCode:', medicine.medicineCode);
      console.log('is_exported:', medicine.is_exported, 'type:', typeof medicine.is_exported);
      console.log('exportedByUser:', medicine.exportedByUser, 'type:', typeof medicine.exportedByUser, 'truthy:', !!medicine.exportedByUser);
      console.log('is_actual_exported:', medicine.is_actual_exported);
      console.log('actualExportedByUser:', medicine.actualExportedByUser);
      console.log('Condition check (is_exported && exportedByUser):', medicine.is_exported && medicine.exportedByUser);
      this.logger.info('Processing medicine for user info enrichment', {
        medicineCode: medicine.medicineCode,
        is_exported: medicine.is_exported,
        exportedByUser: medicine.exportedByUser,
        is_actual_exported: medicine.is_actual_exported,
        actualExportedByUser: medicine.actualExportedByUser,
        conditionResult: !!(medicine.is_exported && medicine.exportedByUser),
      });

      // Check if exported and has valid user ID (not null, undefined, or empty string)
      const hasExportedByUser = medicine.is_exported && medicine.exportedByUser && String(medicine.exportedByUser).trim().length > 0;
      if (hasExportedByUser) {
        console.log('=== [DEBUG] Fetching exportedByUserInfo ===');
        console.log('exportedByUser:', medicine.exportedByUser);
        console.log('is_exported:', medicine.is_exported);
        this.logger.info('=== [DEBUG] Fetching exportedByUserInfo ===', { exportedByUser: medicine.exportedByUser, is_exported: medicine.is_exported });
        try {
          console.log('Calling usersGrpcService.getUserInfoWithProfile with:', { id: medicine.exportedByUser });
          this.logger.info('Calling usersGrpcService.getUserInfoWithProfile', { id: medicine.exportedByUser });
          const userWithProfile = await firstValueFrom(
            this.usersGrpcService.getUserInfoWithProfile({ id: medicine.exportedByUser })
          ) as UserWithProfile;
          console.log('=== [DEBUG] Received userWithProfile ===');
          console.log('userWithProfile:', JSON.stringify(userWithProfile, null, 2));
          console.log('userWithProfile.user:', userWithProfile?.user);
          console.log('userWithProfile.profile:', userWithProfile?.profile);
          if (userWithProfile && userWithProfile.user) {
            enrichedMedicine.exportedByUserInfo = {
              id: userWithProfile.user.id,
              username: userWithProfile.user.username,
              email: userWithProfile.user.email,
              firstName: userWithProfile.profile?.firstName || null,
              lastName: userWithProfile.profile?.lastName || null,
            };
            console.log('=== [DEBUG] Successfully set exportedByUserInfo ===');
            console.log('exportedByUserInfo:', JSON.stringify(enrichedMedicine.exportedByUserInfo, null, 2));
          } else {
            console.warn('=== [WARN] UserWithProfile returned but user is null ===');
            console.warn('userId:', medicine.exportedByUser);
            console.warn('userWithProfile:', JSON.stringify(userWithProfile, null, 2));
            this.logger.warn('UserWithProfile returned but user is null', { userId: medicine.exportedByUser, userWithProfile });
            enrichedMedicine.exportedByUserInfo = null;
          }
        } catch (e: any) {
          console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ERROR FETCHING EXPORTED USER !!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
          console.error(e);
          throw e;
        }
      } else {
        console.log('=== [DEBUG] Skipping exportedByUserInfo (not exported or no user) ===');
        console.log('is_exported:', medicine.is_exported, 'type:', typeof medicine.is_exported, 'truthy:', !!medicine.is_exported);
        console.log('exportedByUser:', medicine.exportedByUser, 'type:', typeof medicine.exportedByUser, 'truthy:', !!medicine.exportedByUser);
        console.log('Condition breakdown:');
        console.log('  - medicine.is_exported:', medicine.is_exported);
        console.log('  - medicine.exportedByUser:', medicine.exportedByUser);
        console.log('  - medicine.is_exported && medicine.exportedByUser:', medicine.is_exported && medicine.exportedByUser);
        this.logger.info('=== [DEBUG] Skipping exportedByUserInfo ===', {
          is_exported: medicine.is_exported,
          exportedByUser: medicine.exportedByUser,
          is_exported_type: typeof medicine.is_exported,
          exportedByUser_type: typeof medicine.exportedByUser,
          is_exported_truthy: !!medicine.is_exported,
          exportedByUser_truthy: !!medicine.exportedByUser,
          condition_result: !!(medicine.is_exported && medicine.exportedByUser),
        });
        enrichedMedicine.exportedByUserInfo = null;
      }
      // Check if actual exported and has valid user ID (not null, undefined, or empty string)
      const hasActualExportedByUser = medicine.is_actual_exported && medicine.actualExportedByUser && String(medicine.actualExportedByUser).trim().length > 0;
      if (hasActualExportedByUser) {
        console.log('=== [DEBUG] Fetching actualExportedByUserInfo ===');
        console.log('actualExportedByUser:', medicine.actualExportedByUser);
        console.log('is_actual_exported:', medicine.is_actual_exported);
        this.logger.info('=== [DEBUG] Fetching actualExportedByUserInfo ===', { actualExportedByUser: medicine.actualExportedByUser, is_actual_exported: medicine.is_actual_exported });
        try {
          console.log('Calling usersGrpcService.findByIdWithProfile with:', { id: medicine.actualExportedByUser });
          this.logger.info('Calling usersGrpcService.getUserInfoWithProfile', { id: medicine.actualExportedByUser });
          const userWithProfile = await firstValueFrom(
            this.usersGrpcService.getUserInfoWithProfile({ id: medicine.actualExportedByUser })
          ) as UserWithProfile;
          console.log('=== [DEBUG] Received userWithProfile ===');
          console.log('userWithProfile:', JSON.stringify(userWithProfile, null, 2));
          console.log('userWithProfile.user:', userWithProfile?.user);
          console.log('userWithProfile.profile:', userWithProfile?.profile);
          if (userWithProfile && userWithProfile.user) {
            enrichedMedicine.actualExportedByUserInfo = {
              id: userWithProfile.user.id,
              username: userWithProfile.user.username,
              email: userWithProfile.user.email,
              firstName: userWithProfile.profile?.firstName || null,
              lastName: userWithProfile.profile?.lastName || null,
            };
            console.log('=== [DEBUG] Successfully set actualExportedByUserInfo ===');
            console.log('actualExportedByUserInfo:', JSON.stringify(enrichedMedicine.actualExportedByUserInfo, null, 2));
          } else {
            console.warn('=== [WARN] UserWithProfile returned but user is null ===');
            console.warn('userId:', medicine.actualExportedByUser);
            console.warn('userWithProfile:', JSON.stringify(userWithProfile, null, 2));
            this.logger.warn('UserWithProfile returned but user is null', { userId: medicine.actualExportedByUser, userWithProfile });
            enrichedMedicine.actualExportedByUserInfo = null;
          }
        } catch (e: any) {
          console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ERROR FETCHING ACTUAL USER !!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
          console.error(e);
          throw e;
        }
      } else {
        console.log('=== [DEBUG] Skipping actualExportedByUserInfo (not actual exported or no user) ===');
        console.log('is_actual_exported:', medicine.is_actual_exported);
        console.log('actualExportedByUser:', medicine.actualExportedByUser);
        enrichedMedicine.actualExportedByUserInfo = null;
      }
      return enrichedMedicine;
    }));

    // 4. Sort
    medicines.sort((a, b) => {
      const sortField = orderBy?.replace(/^-/, '') || 'medicineName';
      const sortDirection = orderBy?.startsWith('-') ? 'desc' : 'asc';

      let valA = (a as any)[sortField] || '';
      let valB = (b as any)[sortField] || '';

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDirection === 'desc' ? valB.localeCompare(valA) : valA.localeCompare(valB);
      }
      return 0;
    });

    // Convert expMestId from Long object to number if needed
    // For Cabinet: parent.expMestId is the HIS ID (number)
    // For Other/Inpatient: parent.hisExpMestId is the HIS ID, fallback to parent.expMestId
    const expMestIdValue = parent.hisExpMestId ?? parent.expMestId;
    const expMestIdNumber = expMestIdValue !== null && expMestIdValue !== undefined
      ? convertLongToNumber(expMestIdValue)
      : null;

    // Ensure expMestId is a number, not null
    if (expMestIdNumber === null) {
      throw new Error(`Invalid expMestId: cannot determine HIS ID from parent entity`);
    }

    const result = {
      expMestId: expMestIdNumber, // Use HIS ID (number) instead of local UUID
      hisExpMestId: expMestIdNumber, // Add hisExpMestId for backward compatibility (same as expMestId)
      expMestCode: parent.expMestCode,
      mediStockCode: parent.mediStockCode || null, // May not exist in entity, enriched from integration
      mediStockName: parent.mediStockName || null, // May not exist in entity, enriched from integration
      reqDepartmentCode: parent.reqDepartmentCode || null, // May not exist in entity, enriched from integration
      reqDepartmentName: parent.reqDepartmentName || null, // May not exist in entity, enriched from integration
      workingStateId: parent.workingStateId || null, // Add workingStateId field
      medicines,
    };

    // Final pass: convert any remaining Long objects recursively
    this.serializeLongObjects(result);

    return result;
  }

  /**
   * Convert Long objects to numbers (for Oracle NUMBER(19,0) fields)
   */
  private convertLongToNumber(obj: any): void {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj) || obj instanceof Date) {
      return;
    }

    const keys = Object.keys(obj);
    for (const key of keys) {
      const value = obj[key];
      if (value === null || value === undefined) continue;

      // Check if it's a Long object (from Oracle/TypeORM)
      if (typeof value === 'object' && 'low' in value && 'high' in value) {
        const longValue = value as { low: number; high: number };
        obj[key] = longValue.low + (longValue.high * 0x100000000);
      } else if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        // Recursively convert nested objects (but not arrays or dates)
        this.convertLongToNumber(value);
      }
    }
  }

  /**
   * Serialize Long objects recursively in the entire response object
   * This ensures no Long objects remain in the final response
   */
  private serializeLongObjects(obj: any): void {
    if (obj === null || obj === undefined) {
      return;
    }

    // Handle arrays
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        if (typeof item === 'object' && item !== null && !(item instanceof Date)) {
          // Check if it's a Long object (has low and high properties)
          if ('low' in item && 'high' in item) {
            // It's a Long object, convert it
            const longValue = item as { low: number; high: number };
            obj[index] = longValue.low + (longValue.high * 0x100000000);
          } else {
            // Recursively process nested objects/arrays
            this.serializeLongObjects(item);
          }
        }
      });
      return;
    }

    // Handle objects
    if (typeof obj === 'object' && !(obj instanceof Date)) {
      const keys = Object.keys(obj);
      for (const key of keys) {
        const value = obj[key];

        if (value === null || value === undefined) {
          continue;
        }

        // Check if it's a Long object (has low and high properties)
        if (typeof value === 'object' && 'low' in value && 'high' in value) {
          const longValue = value as { low: number; high: number };
          obj[key] = longValue.low + (longValue.high * 0x100000000);
        } else if (typeof value === 'object' && !(value instanceof Date)) {
          // Recursively process nested objects/arrays
          this.serializeLongObjects(value);
        }
      }
    }
  }
}
