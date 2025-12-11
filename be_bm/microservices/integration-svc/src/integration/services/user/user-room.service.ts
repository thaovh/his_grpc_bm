import { Injectable, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PinoLogger } from 'nestjs-pino';
import { HisProvider, HisUserRoom } from '../../providers/his.provider';
import { RedisService } from '../redis.service';
import { UserRoom } from '../../integration.interface';

interface UsersGrpcService {
  FindById(data: { id: string }): any;
}

@Injectable()
export class UserRoomService {
  private usersGrpcService: UsersGrpcService;

  constructor(
    @Inject('USERS_PACKAGE') private readonly usersClient: ClientGrpc,
    private readonly hisProvider: HisProvider,
    private readonly redisService: RedisService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UserRoomService.name);
    this.usersGrpcService = this.usersClient.getService<UsersGrpcService>('UsersService');
  }

  /**
   * Get user rooms from HIS system (with cache)
   */
  async getUserRooms(userId: string): Promise<{
    success: boolean;
    message?: string;
    data?: UserRoom[];
  }> {
    // Trim userId to avoid whitespace issues
    const safeUserId = userId?.trim();
    console.log(`UserRoomService#getUserRooms called with userId: "${userId}" (safe: "${safeUserId}")`);
    this.logger.info('UserRoomService#getUserRooms.call', { userId: safeUserId });

    try {
      // 1. Check cache first
      const cachedRooms = await this.redisService.getUserRooms(safeUserId);
      if (cachedRooms && cachedRooms.length > 0) {
        this.logger.info('UserRoomService#getUserRooms.cacheHit', {
          userId: safeUserId,
          roomCount: cachedRooms.length,
        });
        return {
          success: true,
          data: cachedRooms as UserRoom[],
        };
      }

      this.logger.info('UserRoomService#getUserRooms.cacheMiss', { userId: safeUserId });

      // 2. Get user info from users-svc to get loginname
      let user: any;
      console.log(`UserRoomService#getUserRooms calling usersGrpcService.findById with id: "${safeUserId}"`);
      try {
        user = await firstValueFrom(
          this.usersGrpcService.FindById({ id: safeUserId })
        );
        console.log(`UserRoomService#getUserRooms user found:`, user ? 'yes' : 'no', user?.username);
      } catch (userError: any) {
        console.error(`UserRoomService#getUserRooms userNotFound error for id "${safeUserId}":`, userError);
        this.logger.error('UserRoomService#getUserRooms.userNotFound: ' + safeUserId, {
          userId: safeUserId,
          error: userError.message,
        });
        return {
          success: false,
          message: 'User not found',
        };
      }

      if (!user || !user.username) {
        this.logger.error('UserRoomService#getUserRooms.invalidUser', {
          userId: safeUserId,
          hasUser: !!user,
          hasUsername: !!user?.username,
        });
        return {
          success: false,
          message: 'Invalid user data: username not found',
        };
      }

      const loginname = user.username;

      // 3. Get token from Redis
      const tokenData = await this.redisService.getExternalToken(safeUserId);
      if (!tokenData || !tokenData.tokenCode) {
        this.logger.warn('UserRoomService#getUserRooms.noToken', {
          userId: safeUserId,
          loginname,
        });
        return {
          success: false,
          message: 'External token not found. Please login again.',
        };
      }

      // 4. Call HIS API to get user rooms
      const hisResponse = await this.hisProvider.getUserRooms(
        tokenData.tokenCode,
        loginname
      );

      if (!hisResponse.Success || !hisResponse.Data) {
        this.logger.warn('UserRoomService#getUserRooms.hisApiFailed', {
          userId: safeUserId,
          loginname,
          Success: hisResponse.Success,
          hasData: !!hisResponse.Data,
        });
        return {
          success: false,
          message: 'Failed to get user rooms from HIS',
        };
      }

      this.logger.info('UserRoomService#getUserRooms.success', {
        userId: safeUserId,
        loginname,
        roomCount: hisResponse.Data.length,
        firstRoomSample: hisResponse.Data[0] ? {
          ID: hisResponse.Data[0].ID,
          ROOM_CODE: hisResponse.Data[0].ROOM_CODE,
          ROOM_NAME: hisResponse.Data[0].ROOM_NAME,
        } : null,
      });

      // Map UPPERCASE fields from external API to camelCase for proto message
      const mappedData: UserRoom[] = hisResponse.Data.map((room: HisUserRoom) => {
        if (!room) {
          this.logger.warn('UserRoomService#getUserRooms.nullRoom', { userId: safeUserId, loginname });
          return null as any; // Will be filtered out
        }

        return {
          id: room.ID,
          createTime: room.CREATE_TIME,
          modifyTime: room.MODIFY_TIME,
          creator: room.CREATOR,
          modifier: room.MODIFIER,
          appCreator: room.APP_CREATOR,
          appModifier: room.APP_MODIFIER,
          isActive: room.IS_ACTIVE,
          isDelete: room.IS_DELETE,
          loginname: room.LOGINNAME,
          roomId: room.ROOM_ID,
          roomCode: room.ROOM_CODE,
          roomName: room.ROOM_NAME,
          departmentId: room.DEPARTMENT_ID,
          roomTypeId: room.ROOM_TYPE_ID,
          roomTypeCode: room.ROOM_TYPE_CODE,
          roomTypeName: room.ROOM_TYPE_NAME,
          departmentCode: room.DEPARTMENT_CODE,
          departmentName: room.DEPARTMENT_NAME,
          isPause: room.IS_PAUSE,
          branchId: room.BRANCH_ID,
          branchCode: room.BRANCH_CODE,
          branchName: room.BRANCH_NAME,
          heinMediOrgCode: room.HEIN_MEDI_ORG_CODE,
        } as UserRoom;
      }).filter((room): room is UserRoom => room !== null); // Filter out any null rooms

      this.logger.info('UserRoomService#getUserRooms.mapped', {
        userId: safeUserId,
        loginname,
        mappedCount: mappedData.length,
        firstMappedRoom: mappedData[0] ? {
          id: mappedData[0].id,
          roomCode: mappedData[0].roomCode,
          roomName: mappedData[0].roomName,
        } : null,
      });

      // 5. Cache the result (TTL: 1 day = 86400 seconds)
      try {
        await this.redisService.setUserRooms(safeUserId, mappedData, 86400);
        this.logger.info('UserRoomService#getUserRooms.cached', {
          userId: safeUserId,
          roomCount: mappedData.length,
        });
      } catch (cacheError: any) {
        this.logger.error('UserRoomService#getUserRooms.cacheError', {
          userId: safeUserId,
          error: cacheError.message,
        });
        // Continue even if cache fails
      }

      return {
        success: true,
        data: mappedData,
      };
    } catch (error: any) {
      console.error(`UserRoomService#getUserRooms error for userId "${safeUserId}":`, error);
      this.logger.error('UserRoomService#getUserRooms.error: ' + safeUserId, {
        userId: safeUserId,
        error: error.message,
        errorType: error.constructor?.name,
        stack: error.stack?.substring(0, 500),
      });

      return {
        success: false,
        message: error.message || 'Failed to get user rooms',
      };
    }
  }

  /**
   * Reload user rooms from HIS system (bypass cache)
   */
  async reloadUserRooms(userId: string): Promise<{
    success: boolean;
    message?: string;
    data?: UserRoom[];
  }> {
    // Trim userId
    const safeUserId = userId?.trim();
    console.log(`UserRoomService#reloadUserRooms called with userId: "${userId}" (safe: "${safeUserId}")`);
    this.logger.info('UserRoomService#reloadUserRooms.call', { userId: safeUserId });

    try {
      // 1. Delete existing cache
      await this.redisService.deleteUserRooms(safeUserId);
      this.logger.info('UserRoomService#reloadUserRooms.cacheDeleted', { userId: safeUserId });

      // 2. Get user info from users-svc to get loginname
      let user: any;
      console.log(`UserRoomService#reloadUserRooms calling usersGrpcService.findById with id: "${safeUserId}"`);
      try {
        user = await firstValueFrom(
          this.usersGrpcService.FindById({ id: safeUserId })
        );
        console.log(`UserRoomService#reloadUserRooms user found:`, user ? 'yes' : 'no');
      } catch (userError: any) {
        console.error(`UserRoomService#reloadUserRooms userNotFound error for id "${safeUserId}":`, userError);
        this.logger.error('UserRoomService#reloadUserRooms.userNotFound: ' + safeUserId, {
          userId: safeUserId,
          error: userError.message,
        });
        return {
          success: false,
          message: 'User not found',
        };
      }

      if (!user || !user.username) {
        this.logger.error('UserRoomService#reloadUserRooms.invalidUser', {
          userId: safeUserId,
          hasUser: !!user,
          hasUsername: !!user?.username,
        });
        return {
          success: false,
          message: 'Invalid user data: username not found',
        };
      }

      const loginname = user.username;

      // 3. Get token from Redis
      const tokenData = await this.redisService.getExternalToken(safeUserId);
      if (!tokenData || !tokenData.tokenCode) {
        this.logger.warn('UserRoomService#reloadUserRooms.noToken', {
          userId: safeUserId,
          loginname,
        });
        return {
          success: false,
          message: 'External token not found. Please login again.',
        };
      }

      // 4. Call HIS API to get user rooms
      const hisResponse = await this.hisProvider.getUserRooms(
        tokenData.tokenCode,
        loginname
      );

      if (!hisResponse.Success || !hisResponse.Data) {
        this.logger.warn('UserRoomService#reloadUserRooms.hisApiFailed', {
          userId: safeUserId,
          loginname,
          Success: hisResponse.Success,
          hasData: !!hisResponse.Data,
        });
        return {
          success: false,
          message: 'Failed to get user rooms from HIS',
        };
      }

      // Map UPPERCASE fields from external API to camelCase
      const mappedData: UserRoom[] = hisResponse.Data.map((room: HisUserRoom) => {
        if (!room) {
          this.logger.warn('UserRoomService#reloadUserRooms.nullRoom', { userId: safeUserId, loginname });
          return null as any;
        }

        return {
          id: room.ID,
          createTime: room.CREATE_TIME,
          modifyTime: room.MODIFY_TIME,
          creator: room.CREATOR,
          modifier: room.MODIFIER,
          appCreator: room.APP_CREATOR,
          appModifier: room.APP_MODIFIER,
          isActive: room.IS_ACTIVE,
          isDelete: room.IS_DELETE,
          loginname: room.LOGINNAME,
          roomId: room.ROOM_ID,
          roomCode: room.ROOM_CODE,
          roomName: room.ROOM_NAME,
          departmentId: room.DEPARTMENT_ID,
          roomTypeId: room.ROOM_TYPE_ID,
          roomTypeCode: room.ROOM_TYPE_CODE,
          roomTypeName: room.ROOM_TYPE_NAME,
          departmentCode: room.DEPARTMENT_CODE,
          departmentName: room.DEPARTMENT_NAME,
          isPause: room.IS_PAUSE,
          branchId: room.BRANCH_ID,
          branchCode: room.BRANCH_CODE,
          branchName: room.BRANCH_NAME,
          heinMediOrgCode: room.HEIN_MEDI_ORG_CODE,
        } as UserRoom;
      }).filter((room): room is UserRoom => room !== null);

      // 5. Cache the result
      try {
        await this.redisService.setUserRooms(safeUserId, mappedData, 86400);
        this.logger.info('UserRoomService#reloadUserRooms.cached', {
          userId: safeUserId,
          roomCount: mappedData.length,
        });
      } catch (cacheError: any) {
        this.logger.error('UserRoomService#reloadUserRooms.cacheError', {
          userId: safeUserId,
          error: cacheError.message,
        });
      }

      return {
        success: true,
        data: mappedData,
      };
    } catch (error: any) {
      console.error(`UserRoomService#reloadUserRooms error for userId "${safeUserId}":`, error);
      this.logger.error('UserRoomService#reloadUserRooms.error: ' + safeUserId, {
        userId: safeUserId,
        error: error.message,
        errorType: error.constructor?.name,
        stack: error.stack?.substring(0, 500),
      });

      return {
        success: false,
        message: error.message || 'Failed to reload user rooms',
      };
    }
  }
}

