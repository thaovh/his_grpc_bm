import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PinoLogger } from 'nestjs-pino';
import { IntegrationServiceImpl } from '../services/integration.service';
import { HisLoginRequest, HisLoginResponse, HisUserInfo } from '../providers/his.provider';
import { Count } from '../../commons/interfaces/commons.interface';

@Controller()
export class IntegrationController {
  constructor(
    private readonly integrationService: IntegrationServiceImpl,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(IntegrationController.name);
  }

  @GrpcMethod('IntegrationService', 'hisLogin')
  async hisLogin(data: HisLoginRequest): Promise<HisLoginResponse> {
    this.logger.info('IntegrationController#hisLogin.call', { username: data.username });
    
    try {
      const result = await this.integrationService.hisLogin(data);
      this.logger.info('IntegrationController#hisLogin.result', { 
        Success: result.Success,
        loginName: result.user?.loginName,
        hasUser: !!result.user,
      });
      return result;
    } catch (error: any) {
      this.logger.error('IntegrationController#hisLogin.error', {
        username: data.username,
        error: error.message,
        stack: error.stack,
        response: error.response?.data,
        status: error.response?.status,
      });
      // Re-throw với message rõ ràng hơn
      throw new Error(`HIS authentication failed: ${error.message}`);
    }
  }

  @GrpcMethod('IntegrationService', 'syncUser')
  async syncUser(data: { user: HisUserInfo }): Promise<{
    userId: string;
    created: boolean;
    username: string;
    email: string;
  }> {
    this.logger.info('IntegrationController#syncUser.call', { 
      loginName: data.user.loginName 
    });
    
    try {
      const result = await this.integrationService.syncUser(data.user);
      this.logger.info('IntegrationController#syncUser.result', { 
        userId: result.userId,
        created: result.created,
      });
      return result;
    } catch (error: any) {
      this.logger.error('IntegrationController#syncUser.error', {
        loginName: data.user.loginName,
        error: error.message,
      });
      throw error;
    }
  }

  @GrpcMethod('IntegrationService', 'getToken')
  async getToken(data: { userId: string }): Promise<{
    found: boolean;
    tokenCode?: string;
    renewCode?: string;
    expireTime?: string;
    loginTime?: string;
  }> {
    this.logger.info('IntegrationController#getToken.call', { userId: data.userId });
    
    try {
      const result = await this.integrationService.getToken(data.userId);
      this.logger.info('IntegrationController#getToken.result', { 
        found: result.found,
        userId: data.userId,
      });
      return result;
    } catch (error: any) {
      this.logger.error('IntegrationController#getToken.error', {
        userId: data.userId,
        error: error.message,
      });
      throw error;
    }
  }

  @GrpcMethod('IntegrationService', 'invalidateToken')
  async invalidateToken(data: { userId: string }): Promise<Count> {
    this.logger.info('IntegrationController#invalidateToken.call', { userId: data.userId });
    
    try {
      const count = await this.integrationService.invalidateToken(data.userId);
      this.logger.info('IntegrationController#invalidateToken.result', { 
        count,
        userId: data.userId,
      });
      return { count };
    } catch (error: any) {
      this.logger.error('IntegrationController#invalidateToken.error', {
        userId: data.userId,
        error: error.message,
      });
      throw error;
    }
  }

  @GrpcMethod('IntegrationService', 'renewToken')
  async renewToken(data: { renewCode: string; userId?: string }): Promise<{
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
  }> {
    this.logger.info('IntegrationController#renewToken.call', { 
      userId: data.userId,
      renewCodePrefix: data.renewCode?.substring(0, 20) + '...',
    });
    
    try {
      const result = await this.integrationService.renewToken(data.renewCode, data.userId);
      this.logger.info('IntegrationController#renewToken.result', { 
        success: result.success,
        userId: data.userId,
      });
      return result;
    } catch (error: any) {
      this.logger.error('IntegrationController#renewToken.error', {
        userId: data.userId,
        error: error.message,
      });
      throw error;
    }
  }
}

