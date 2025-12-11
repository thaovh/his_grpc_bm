import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PinoLogger } from 'nestjs-pino';
import { HisUserInfo } from '../providers/his.provider';

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
  }): any;
}

@Injectable()
export class UserSyncService implements OnModuleInit {
  private usersGrpcService: UsersGrpcService;

  constructor(
    @Inject('USERS_PACKAGE') private readonly usersClient: ClientGrpc,
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
  async syncUser(externalUser: HisUserInfo): Promise<{
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
    } catch (error) {
      // User doesn't exist, create new user
      this.logger.info('UserSyncService#syncUser.creatingUser', { username });
      
      try {
        // Generate a random password (user will use external auth)
        // In production, you might want to use a different approach
        const randomPassword = `ext_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        // Parse GCode as acsId (assuming it's numeric)
        let acsId: number | undefined;
        if (externalUser.gCode) {
          const parsedAcsId = parseInt(externalUser.gCode, 10);
          if (!isNaN(parsedAcsId)) {
            acsId = parsedAcsId;
          }
        }

        // Create user via gRPC
        user = await firstValueFrom(
          this.usersGrpcService.create({
            username,
            email,
            password: randomPassword, // This will be hashed in users-svc
            acsId: acsId || undefined,
          })
        );

        created = true;
        this.logger.info('UserSyncService#syncUser.userCreated', { userId: user.id });
      } catch (createError: any) {
        this.logger.error('UserSyncService#syncUser.createError', {
          username,
          error: createError.message,
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

