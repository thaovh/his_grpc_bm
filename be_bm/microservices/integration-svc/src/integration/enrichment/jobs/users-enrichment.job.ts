import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import { DataEnrichmentService, EnrichmentConfig } from '../../services/data-enrichment.service';
import { ExternalDbConfig } from '../../providers/external-db.provider';
import { QueryLoader } from '../../queries/query-loader';

@Injectable()
export class UsersEnrichmentJob {
  constructor(
    private readonly enrichmentService: DataEnrichmentService,
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UsersEnrichmentJob.name);
  }

  /**
   * Execute users enrichment for a specific username
   */
  async executeForUser(username: string): Promise<void> {
    this.logger.info('UsersEnrichmentJob#executeForUser.call', { username });

    const config = this.getEnrichmentConfig();
    // Trim và normalize username để match với LOGINNAME trong database
    const normalizedUsername = username.trim();
    config.sqlConditions = { USER_NAME: normalizedUsername };
    
    this.logger.debug('UsersEnrichmentJob#executeForUser.normalized', {
      original: username,
      normalized: normalizedUsername,
    });

    const result = await this.enrichmentService.enrichAndSave(config);

    if (!result.success) {
      this.logger.warn('UsersEnrichmentJob#executeForUser.failed', {
        username,
        failedRecords: result.failedRecords,
        errors: result.errors,
      });
    } else {
      this.logger.info('UsersEnrichmentJob#executeForUser.completed', {
        username,
        processedRecords: result.processedRecords,
      });
    }
  }

  /**
   * Execute users enrichment for multiple users
   */
  async executeForUsers(usernames: string[]): Promise<void> {
    this.logger.info('UsersEnrichmentJob#executeForUsers.call', {
      count: usernames.length,
    });

    const results = await Promise.allSettled(
      usernames.map((username) => this.executeForUser(username))
    );

    const succeeded = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    this.logger.info('UsersEnrichmentJob#executeForUsers.completed', {
      total: usernames.length,
      succeeded,
      failed,
    });
  }

  /**
   * Get enrichment configuration
   */
  private getEnrichmentConfig(): EnrichmentConfig {
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

    return {
      sourceDb: 'his-employee-db',
      sourceDbConfig,
      sqlQuery: QueryLoader.load('his-employee.query'),
      sqlConditions: {},
      mergeStrategy: 'merge',
      targetService: 'users-svc',
      targetMethod: 'update',
    };
  }
}

