import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { HisProvider } from '../../providers/his.provider';
import { AuthTokenService } from '../auth/auth-token.service';
import { LongConverter } from '../../utils/long-converter.util';

@Injectable()
export class WorkInfoService {
  constructor(
    private readonly hisProvider: HisProvider,
    private readonly authTokenService: AuthTokenService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(WorkInfoService.name);
  }

  async updateWorkInfo(request: {
    roomIds?: number[];
    rooms?: { roomId: number; deskId?: number | null }[];
    workingShiftId?: number | null;
    nurseLoginName?: string | null;
    nurseUserName?: string | null;
    userId?: string;
  }): Promise<{
    success: boolean;
    message?: string;
    data?: any;
  }> {
    const { roomIds, rooms, workingShiftId, nurseLoginName, nurseUserName, userId } = request;

    this.logger.info('WorkInfoService#updateWorkInfo.call', {
      roomIdsLength: roomIds?.length || 0,
      roomsLength: rooms?.length || 0,
      workingShiftId,
      nurseLoginName,
      userId,
    });

    try {
      // Get token from Redis for THIS user
      let tokenData: any | null = null;
      if (userId) {
        tokenData = await this.authTokenService.getToken(userId);
      }

      // Fallback only if no userId provided (should not happen with Gateway fix)
      if (!tokenData) {
        this.logger.warn('WorkInfoService#updateWorkInfo.noUserIdOrToken', { userId });
        // Try getting by userId again just in case, or fallback to any (not recommended but keeping existing behavior if needed?)
        // Actually, if we want to fix the bug, we should NOT use getAnyExternalToken unless absolutely necessary.
        // But for safety during transition, maybe only if userId is missing.
        if (!userId) {
          tokenData = await this.authTokenService.getAnyExternalToken();
        }
      }

      if (!tokenData?.tokenCode) {
        return {
          success: false,
          message: 'HIS token not found for user. Please login again.',
        };
      }

      const normalizeRoomIds = (ids?: any[]) =>
        (ids || [])
          .map(id => LongConverter.convertToNumber(id))
          .filter((id): id is number => id !== null);

      const normalizeRooms = (rooms?: any[]) =>
        (rooms || [])
          .map(r => ({
            RoomId: LongConverter.convertToNumber(r.roomId),
            DeskId: r.deskId !== undefined ? LongConverter.convertToNumber(r.deskId) : null,
          }))
          .filter(r => r.RoomId !== null) as { RoomId: number; DeskId: number | null }[];

      // Build payload for HIS
      const payload = {
        CommonParam: {
          Messages: [],
          BugCodes: [],
          MessageCodes: [],
          Start: null,
          Limit: null,
          Count: null,
          ModuleCode: null,
          LanguageCode: 'VI',
          Now: 0,
          HasException: false,
        },
        ApiData: {
          RoomIds: normalizeRoomIds(request.roomIds),
          Rooms: normalizeRooms(request.rooms),
          WorkingShiftId: request.workingShiftId ?? null,
          NurseLoginName: request.nurseLoginName ?? null,
          NurseUserName: request.nurseUserName ?? null,
        },
      };

      const hisResponse = await this.hisProvider.updateWorkInfo(tokenData.tokenCode, payload);

      if (!hisResponse.Success) {
        const message =
          hisResponse.Param?.Messages?.join(', ') ||
          hisResponse.Param?.MessageCodes?.join(', ') ||
          'Failed to update work info';
        return {
          success: false,
          message,
          data: hisResponse.Data,
        };
      }

      // Map HIS data (PascalCase) to camelCase & normalize Long to number
      const mappedData = Array.isArray(hisResponse.Data)
        ? hisResponse.Data.map((item: any) => ({
          roomTypeId: LongConverter.convertToNumber(item.RoomTypeId),
          bedRoomId: LongConverter.convertToNumber(item.BedRoomId),
          roomName: item.RoomName ?? null,
          roomCode: item.RoomCode ?? null,
          roomId: LongConverter.convertToNumber(item.RoomId),
          branchId: LongConverter.convertToNumber(item.BranchId),
          branchName: item.BranchName ?? null,
          branchCode: item.BranchCode ?? null,
          departmentId: LongConverter.convertToNumber(item.DepartmentId),
          departmentName: item.DepartmentName ?? null,
          departmentCode: item.DepartmentCode ?? null,
          mediStockId: LongConverter.convertToNumber(item.MediStockId),
        }))
        : [];

      return {
        success: true,
        data: mappedData,
      };
    } catch (error: any) {
      this.logger.error('WorkInfoService#updateWorkInfo.error', {
        error: error.message,
        errorType: error.constructor?.name,
        stack: error.stack?.substring(0, 500),
      });
      return {
        success: false,
        message: error.message || 'Failed to update work info',
      };
    }
  }
}

