import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PinoLogger } from 'nestjs-pino';
import { ExternalDbProvider, ExternalDbConfig, QueryOptions } from '../providers/external-db.provider';
import { QueryLoader } from '../queries/query-loader';
import { DataMergeService, MergeStrategy } from './data-merge.service';

export interface EnrichmentConfig {
  sourceDb: string;
  sourceDbConfig: ExternalDbConfig;
  sqlQuery: string;
  sqlConditions?: Record<string, any>;
  apiProvider?: string;
  apiMethod?: string;
  apiParams?: Record<string, any>;
  mergeStrategy?: MergeStrategy;
  targetService: string;
  targetMethod: string;
  fieldMapping?: Record<string, string>;
}

export interface EnrichmentResult {
  success: boolean;
  totalRecords: number;
  processedRecords: number;
  failedRecords: number;
  errors?: Array<{ record: any; error: string }>;
}

interface UsersGrpcService {
  findByUsername(data: { name: string }): any;
  update(data: {
    id: string;
    email?: string;
    acsId?: number | null;
  }): any;
  updateProfile(data: {
    userId: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: string;
    address?: string;
    diploma?: string;
    isDoctor?: number;
    isNurse?: number;
    title?: string;
    careerTitleId?: number;
    departmentId?: number;
    branchId?: number;
    defaultMediStockIds?: string;
    genderId?: number;
    ethnicCode?: string;
    identificationNumber?: string;
    socialInsuranceNumber?: string;
    diplomaDate?: string;
    diplomaPlace?: string;
    maxServiceReqPerDay?: number;
    doNotAllowSimultaneity?: number;
    isAdmin?: number;
  }): any;
}

@Injectable()
export class DataEnrichmentService implements OnModuleInit {
  private usersGrpcService: UsersGrpcService;

  constructor(
    private readonly externalDbProvider: ExternalDbProvider,
    private readonly dataMergeService: DataMergeService,
    @Inject('USERS_PACKAGE') private readonly usersClient: ClientGrpc,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(DataEnrichmentService.name);
  }

  onModuleInit() {
    this.usersGrpcService = this.usersClient.getService<UsersGrpcService>('UsersService');
  }

  /**
   * Enrich data from external DB and save to local DB
   */
  async enrichAndSave(config: EnrichmentConfig): Promise<EnrichmentResult> {
    this.logger.info('DataEnrichmentService#enrichAndSave.call', {
      sourceDb: config.sourceDb,
      targetService: config.targetService,
    });

    const result: EnrichmentResult = {
      success: true,
      totalRecords: 0,
      processedRecords: 0,
      failedRecords: 0,
      errors: [],
    };

    try {
      // 1. Execute SQL query on external DB
      const queryOptions: QueryOptions = {
        query: config.sqlQuery,
        bindParams: config.sqlConditions || {},
      };

      const sqlResults = await this.externalDbProvider.executeQuery(
        config.sourceDb,
        config.sourceDbConfig,
        queryOptions
      );

      result.totalRecords = sqlResults.length;
      this.logger.info('DataEnrichmentService#enrichAndSave.sqlResults', {
        recordCount: sqlResults.length,
      });

      // 2. Process each record
      for (const sqlRecord of sqlResults) {
        try {
          // 3. Call API to enrich (if configured)
          let apiData = null;
          if (config.apiProvider && config.apiMethod) {
            // TODO: Implement API enrichment if needed
            // For now, we only enrich from SQL
          }

          // 4. Merge SQL + API data
          const mergedData = this.dataMergeService.merge(
            sqlRecord,
            apiData,
            config.mergeStrategy || 'merge'
          );

          // 5. Save to local DB via gRPC
          await this.saveToLocalDb(config, mergedData);

          result.processedRecords++;
        } catch (error: any) {
          result.failedRecords++;
          result.errors?.push({
            record: sqlRecord,
            error: error.message,
          });
          this.logger.warn('DataEnrichmentService#enrichAndSave.recordError', {
            record: sqlRecord,
            error: error.message,
          });
          // Continue processing other records
        }
      }

      result.success = result.failedRecords === 0;
      this.logger.info('DataEnrichmentService#enrichAndSave.completed', {
        totalRecords: result.totalRecords,
        processedRecords: result.processedRecords,
        failedRecords: result.failedRecords,
      });

      return result;
    } catch (error: any) {
      this.logger.error('DataEnrichmentService#enrichAndSave.error', {
        error: error.message,
        stack: error.stack,
      });
      result.success = false;
      throw error;
    }
  }

  /**
   * Save enriched data to local DB via gRPC
   */
  private async saveToLocalDb(
    config: EnrichmentConfig,
    mergedData: any
  ): Promise<void> {
    if (config.targetService === 'users-svc') {
      await this.saveToUsersService(mergedData);
    } else {
      throw new Error(`Unknown target service: ${config.targetService}`);
    }
  }

  /**
   * Save to users-svc
   */
  private async saveToUsersService(data: any): Promise<void> {
    // Find user by username (from USER_NAME or LOGINNAME)
    const username = data.USER_NAME || data.LOGINNAME;
    if (!username) {
      throw new Error('USER_NAME or LOGINNAME is required');
    }

    this.logger.debug('DataEnrichmentService#saveToUsersService.call', {
      username,
    });

    try {
      // Find user by username
      const user: any = await firstValueFrom(
        this.usersGrpcService.findByUsername({ name: username })
      );

      if (!user || !user.id) {
        this.logger.warn('DataEnrichmentService#saveToUsersService.userNotFound', {
          username,
        });
        return; // Skip if user not found
      }

      // Update User fields
      const userUpdateData: any = {};
      if (data.ACS_ID !== null && data.ACS_ID !== undefined) {
        const acsIdValue = Number(data.ACS_ID);
        if (!isNaN(acsIdValue)) {
          userUpdateData.acsId = acsIdValue;
          this.logger.info('DataEnrichmentService#saveToUsersService.acsIdFound', {
            userId: user.id,
            username,
            acsId: acsIdValue,
            acsIdRaw: data.ACS_ID,
          });
        } else {
          this.logger.warn('DataEnrichmentService#saveToUsersService.acsIdInvalid', {
            userId: user.id,
            username,
            acsIdRaw: data.ACS_ID,
          });
        }
      } else {
        this.logger.warn('DataEnrichmentService#saveToUsersService.acsIdMissing', {
          userId: user.id,
          username,
          dataKeys: Object.keys(data),
        });
      }
      if (data.TDL_EMAIL) {
        userUpdateData.email = data.TDL_EMAIL;
      }

      if (Object.keys(userUpdateData).length > 0) {
        await firstValueFrom(
          this.usersGrpcService.update({
            id: user.id,
            ...userUpdateData,
          })
        );
        this.logger.info('DataEnrichmentService#saveToUsersService.userUpdated', {
          userId: user.id,
          username,
          updates: userUpdateData,
        });
      } else {
        this.logger.warn('DataEnrichmentService#saveToUsersService.noUserUpdates', {
          userId: user.id,
          username,
          hasAcsId: data.ACS_ID !== null && data.ACS_ID !== undefined,
          acsIdValue: data.ACS_ID,
        });
      }

      // Update Profile fields
      const profileUpdateData: any = {};
      if (data.TDL_MOBILE) {
        profileUpdateData.phone = data.TDL_MOBILE;
      }
      if (data.DOB) {
        // Convert Oracle DATE to ISO string
        const dob = data.DOB instanceof Date ? data.DOB : new Date(data.DOB);
        profileUpdateData.dateOfBirth = dob.toISOString().split('T')[0]; // YYYY-MM-DD
      }
      // HIS Employee fields - Thông tin nghề nghiệp
      if (data.DIPLOMA !== null && data.DIPLOMA !== undefined) {
        profileUpdateData.diploma = String(data.DIPLOMA);
      }
      if (data.IS_DOCTOR !== null && data.IS_DOCTOR !== undefined) {
        profileUpdateData.isDoctor = Number(data.IS_DOCTOR);
      }
      if (data.IS_NURSE !== null && data.IS_NURSE !== undefined) {
        profileUpdateData.isNurse = Number(data.IS_NURSE);
      }
      if (data.TITLE) {
        profileUpdateData.title = String(data.TITLE);
      }
      if (data.CAREER_TITLE_ID !== null && data.CAREER_TITLE_ID !== undefined) {
        profileUpdateData.careerTitleId = Number(data.CAREER_TITLE_ID);
      }
      // HIS Employee fields - Thông tin tổ chức
      if (data.DEPARTMENT_ID !== null && data.DEPARTMENT_ID !== undefined) {
        profileUpdateData.departmentId = Number(data.DEPARTMENT_ID);
      }
      if (data.BRANCH_ID !== null && data.BRANCH_ID !== undefined) {
        profileUpdateData.branchId = Number(data.BRANCH_ID);
      }
      if (data.DEFAULT_MEDI_STOCK_IDS) {
        profileUpdateData.defaultMediStockIds = String(data.DEFAULT_MEDI_STOCK_IDS);
      }
      // HIS Employee fields - Thông tin cá nhân
      if (data.GENDER_ID !== null && data.GENDER_ID !== undefined) {
        profileUpdateData.genderId = Number(data.GENDER_ID);
      }
      if (data.ETHNIC_CODE) {
        profileUpdateData.ethnicCode = String(data.ETHNIC_CODE);
      }
      if (data.IDENTIFICATION_NUMBER) {
        profileUpdateData.identificationNumber = String(data.IDENTIFICATION_NUMBER);
      }
      if (data.SOCIAL_INSURANCE_NUMBER) {
        profileUpdateData.socialInsuranceNumber = String(data.SOCIAL_INSURANCE_NUMBER);
      }
      // HIS Employee fields - Bằng cấp
      if (data.DIPLOMA_DATE) {
        const diplomaDate = data.DIPLOMA_DATE instanceof Date ? data.DIPLOMA_DATE : new Date(data.DIPLOMA_DATE);
        profileUpdateData.diplomaDate = diplomaDate.toISOString().split('T')[0]; // YYYY-MM-DD
      }
      if (data.DIPLOMA_PLACE) {
        profileUpdateData.diplomaPlace = String(data.DIPLOMA_PLACE);
      }
      // HIS Employee fields - Cấu hình
      if (data.MAX_SERVICE_REQ_PER_DAY !== null && data.MAX_SERVICE_REQ_PER_DAY !== undefined) {
        profileUpdateData.maxServiceReqPerDay = Number(data.MAX_SERVICE_REQ_PER_DAY);
      }
      if (data.DO_NOT_ALLOW_SIMULTANEITY !== null && data.DO_NOT_ALLOW_SIMULTANEITY !== undefined) {
        profileUpdateData.doNotAllowSimultaneity = Number(data.DO_NOT_ALLOW_SIMULTANEITY);
      }
      if (data.IS_ADMIN !== null && data.IS_ADMIN !== undefined) {
        profileUpdateData.isAdmin = Number(data.IS_ADMIN);
      }

      if (Object.keys(profileUpdateData).length > 0) {
        await firstValueFrom(
          this.usersGrpcService.updateProfile({
            userId: user.id,
            ...profileUpdateData,
          })
        );
        this.logger.debug('DataEnrichmentService#saveToUsersService.profileUpdated', {
          userId: user.id,
          updates: profileUpdateData,
        });
      }
    } catch (error: any) {
      this.logger.error('DataEnrichmentService#saveToUsersService.error', {
        username,
        error: error.message,
      });
      throw error;
    }
  }
}

