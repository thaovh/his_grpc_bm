import {
  HisLoginRequest,
  HisLoginResponse,
  HisUserInfo,
} from './providers/his.provider';

export interface IntegrationService {
  hisLogin(request: HisLoginRequest): Promise<HisLoginResponse>;
  syncUser(user: HisUserInfo): Promise<{
    userId: string;
    created: boolean;
    username: string;
    email: string;
  }>;
  getToken(userId: string): Promise<{
    found: boolean;
    tokenCode?: string;
    renewCode?: string;
    expireTime?: string;
    loginTime?: string;
  }>;
  invalidateToken(userId: string): Promise<number>;
  renewToken(renewCode: string, userId?: string): Promise<{
    success: boolean;
    message?: string;
    tokenCode?: string;
    renewCode?: string;
    loginTime?: string;
    expireTime?: string;
    validAddress?: string;
    loginAddress?: string;
    versionApp?: string;
    machineName?: string;
    lastAccessTime?: string;
  }>;
}

