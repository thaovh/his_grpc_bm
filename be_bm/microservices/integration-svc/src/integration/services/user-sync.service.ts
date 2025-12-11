import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { HisUserInfo } from '../providers/his.provider';
import { ExternalDbProvider, ExternalDbConfig } from '../providers/external-db.provider';
import { QueryLoader } from '../queries/query-loader';

interface UsersGrpcService {
  findByUsername(data: { name: string }): any;
  create(data: {
    username: string;
    email: string;
    password: string;
    acsId?: number;
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
  updatePassword(data: {
    id: string;
    password: string;
  }): any;
}

@Injectable()
export class UserSyncService implements OnModuleInit {
  private usersGrpcService: UsersGrpcService;

  constructor(
    @Inject('USERS_PACKAGE') private readonly usersClient: ClientGrpc,
    private readonly externalDbProvider: ExternalDbProvider,
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UserSyncService.name);
  }

  onModuleInit() {
    this.usersGrpcService = this.usersClient.getService<UsersGrpcService>('UsersService');
  }

  /**
   * Synchronize user from external system to local database
   */
  async syncUser(
    externalUser: HisUserInfo,
    password?: string
  ): Promise<{
    userId: string;
    created: boolean;
    username: string;
    email: string;
  }> {
    this.logger.info('UserSyncService#syncUser.call', {
      loginName: externalUser.loginName
    });

    if (!externalUser.loginName) {
      throw new Error('Invalid external user data: loginName is required');
    }

    const username = externalUser.loginName;
    const email = externalUser.email || `${username}@bachmai.edu.vn`;

    // Check if user already exists
    let user: any;
    let created = false;

    try {
      user = await firstValueFrom(
        this.usersGrpcService.findByUsername({ name: username })
      );
      this.logger.info('UserSyncService#syncUser.userExists', { userId: user.id });

      // Update password if user already exists and password is provided
      if (password) {
        try {
          await firstValueFrom(
            this.usersGrpcService.updatePassword({
              id: user.id,
              password: password, // Plaintext password, will be hashed in users-svc
            })
          );
          this.logger.info('UserSyncService#syncUser.passwordUpdated', { userId: user.id });
        } catch (passwordError: any) {
          this.logger.warn('UserSyncService#syncUser.passwordUpdateFailed', {
            userId: user.id,
            error: passwordError.message,
          });
          // Don't throw, password update failure shouldn't block sync
        }
      }
    } catch (error) {
      // User doesn't exist, create new user
      this.logger.info('UserSyncService#syncUser.creatingUser', { username });

      try {
        // Use password from request if provided, otherwise generate random password
        const userPassword = password || `ext_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        // Get ACS_ID from HIS_EMPLOYEE table query
        let acsId: number | undefined;
        try {
          const sourceDbConfig: ExternalDbConfig = {
            host:
              this.configService.get('EXTERNAL_DB_HOST') ||
              process.env.EXTERNAL_DB_HOST ||
              '192.168.7.248',
            port: parseInt(
              this.configService.get('EXTERNAL_DB_PORT') ||
              process.env.EXTERNAL_DB_PORT ||
              '1521',
              10
            ),
            username:
              this.configService.get('EXTERNAL_DB_USER') ||
              process.env.EXTERNAL_DB_USER ||
              'HIS_RS',
            password:
              this.configService.get('EXTERNAL_DB_PASSWORD') ||
              process.env.EXTERNAL_DB_PASSWORD ||
              'HIS_RS',
            serviceName:
              this.configService.get('EXTERNAL_DB_SERVICE_NAME') ||
              process.env.EXTERNAL_DB_SERVICE_NAME ||
              'orclstb',
          };

          this.logger.info('UserSyncService#syncUser.queryingAcsId', {
            username,
            normalizedUsername: username.trim(),
            host: sourceDbConfig.host,
            serviceName: sourceDbConfig.serviceName,
          });

          const sqlQuery = QueryLoader.load('his-employee.query');
          this.logger.debug('UserSyncService#syncUser.sqlQueryLoaded', {
            username,
            queryLength: sqlQuery.length,
            queryPreview: sqlQuery.substring(0, 200),
          });

          // Trim và normalize username để match với LOGINNAME trong database
          const normalizedUsername = username.trim();

          const results = await this.externalDbProvider.executeQuery(
            'his-employee-db',
            sourceDbConfig,
            {
              query: sqlQuery,
              bindParams: { USER_NAME: normalizedUsername },
            }
          );

          this.logger.info('UserSyncService#syncUser.queryResult', {
            username,
            resultCount: results?.length || 0,
            hasResults: !!results && results.length > 0,
            firstResult: results && results.length > 0 ? {
              ACS_ID: results[0].ACS_ID,
              USER_NAME: results[0].USER_NAME,
              keys: Object.keys(results[0]),
            } : null,
          });

          if (results && results.length > 0) {
            const acsIdValue = results[0].ACS_ID;
            if (acsIdValue !== null && acsIdValue !== undefined) {
              acsId = Number(acsIdValue);
              this.logger.info('UserSyncService#syncUser.acsIdFromQuery', {
                username,
                acsId,
                acsIdType: typeof acsIdValue,
                acsIdRaw: acsIdValue,
              });
            } else {
              this.logger.warn('UserSyncService#syncUser.acsIdIsNull', {
                username,
                result: results[0],
              });
            }
          } else {
            this.logger.warn('UserSyncService#syncUser.acsIdNotFound', {
              username,
              resultCount: results?.length || 0,
            });
          }
        } catch (queryError: any) {
          // Log but don't fail user creation if query fails
          this.logger.error('UserSyncService#syncUser.queryAcsIdError', {
            username,
            error: queryError.message,
            errorName: queryError.name,
            errorCode: queryError.code,
            stack: queryError.stack?.substring(0, 500),
            fullError: JSON.stringify(queryError, Object.getOwnPropertyNames(queryError)).substring(0, 1000),
          });
        }

        // Create user via gRPC
        user = await firstValueFrom(
          this.usersGrpcService.create({
            username,
            email,
            password: userPassword, // Use password from request if provided
            acsId: acsId || undefined,
          })
        );

        created = true;
        this.logger.info('UserSyncService#syncUser.userCreated', { userId: user.id });
      } catch (createError: any) {
        console.error('CRITICAL: UserSyncService create failed:', createError);
        this.logger.error('UserSyncService#syncUser.createError', {
          username,
          error: createError.message,
          stack: createError.stack,
          code: createError.code,
          details: createError.details
        });
        throw new Error(`Failed to create user: ${createError.message}`);
      }
    }

    // Sync profile if user has name information
    if (externalUser.userName) {
      try {
        // Parse UserName (e.g., "VŨ HOÀNG THAO") into firstName and lastName
        const nameParts = externalUser.userName.trim().split(/\s+/);
        const lastName = nameParts.pop() || '';
        const firstName = nameParts.join(' ') || '';

        await firstValueFrom(
          this.usersGrpcService.updateProfile({
            userId: user.id,
            firstName: firstName || undefined,
            lastName: lastName || undefined,
            phone: externalUser.mobile || undefined,
          })
        );

        this.logger.info('UserSyncService#syncUser.profileUpdated', { userId: user.id });
      } catch (error: any) {
        this.logger.warn('UserSyncService#syncUser.profileUpdateFailed', {
          userId: user.id,
          error: error.message,
        });
        // Don't throw, profile update is optional
      }
    }

    return {
      userId: user.id,
      created,
      username: user.username,
      email: user.email,
    };
  }
}

