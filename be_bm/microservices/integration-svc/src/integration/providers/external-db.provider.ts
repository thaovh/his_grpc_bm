import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PinoLogger } from 'nestjs-pino';
import * as oracledb from 'oracledb';

export interface ExternalDbConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  serviceName: string;
}

export interface QueryOptions {
  query: string;
  bindParams?: Record<string, any>;
}

@Injectable()
export class ExternalDbProvider {
  private pools: Map<string, oracledb.Pool> = new Map();

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(ExternalDbProvider.name);
    
    // Initialize oracledb in thin mode
    try {
      oracledb.initOracleClient();
      this.logger.info('ExternalDbProvider initialized with Oracle Instant Client');
    } catch (err: any) {
      this.logger.info('ExternalDbProvider initialized in thin mode (no Oracle Instant Client required)');
    }
  }

  /**
   * Execute a query on external database
   */
  async executeQuery(
    dbName: string,
    config: ExternalDbConfig,
    options: QueryOptions
  ): Promise<any[]> {
    this.logger.info('ExternalDbProvider#executeQuery.call', {
      dbName,
      query: options.query.substring(0, 100),
      bindParams: Object.keys(options.bindParams || {}),
    });

    const pool = await this.getConnectionPool(dbName, config);
    let connection: oracledb.Connection | null = null;

    try {
      connection = await pool.getConnection();
      
      const result = await connection.execute(
        options.query,
        options.bindParams || {},
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
        }
      );

      const rows = result.rows || [];
      this.logger.info('ExternalDbProvider#executeQuery.result', {
        dbName,
        rowCount: rows.length,
      });

      return rows as any[];
    } catch (error: any) {
      this.logger.error('ExternalDbProvider#executeQuery.error', {
        dbName,
        error: error.message,
        code: error.code,
        query: options.query.substring(0, 200),
      });
      throw new Error(`Failed to execute query on ${dbName}: ${error.message}`);
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (closeError: any) {
          this.logger.warn('ExternalDbProvider#executeQuery.closeError', {
            dbName,
            error: closeError.message,
          });
        }
      }
    }
  }

  /**
   * Get or create connection pool for a database
   */
  private async getConnectionPool(
    dbName: string,
    config: ExternalDbConfig
  ): Promise<oracledb.Pool> {
    // Check if pool already exists
    if (this.pools.has(dbName)) {
      const existingPool = this.pools.get(dbName);
      if (existingPool) {
        return existingPool;
      }
    }

    // Create new pool
    const connectString = `${config.host}:${config.port}/${config.serviceName}`;
    
    this.logger.info('ExternalDbProvider#getConnectionPool.creating', {
      dbName,
      host: config.host,
      port: config.port,
      serviceName: config.serviceName,
    });

    try {
      const pool = await oracledb.createPool({
        user: config.username,
        password: config.password,
        connectString,
        poolMin: 2,
        poolMax: 10,
        poolIncrement: 1,
        poolTimeout: 60,
        queueTimeout: 120000,
      });

      this.pools.set(dbName, pool);
      this.logger.info('ExternalDbProvider#getConnectionPool.created', {
        dbName,
      });

      return pool;
    } catch (error: any) {
      this.logger.error('ExternalDbProvider#getConnectionPool.error', {
        dbName,
        error: error.message,
        code: error.code,
      });
      throw new Error(`Failed to create connection pool for ${dbName}: ${error.message}`);
    }
  }

  /**
   * Close all connection pools (for graceful shutdown)
   */
  async closeAllPools(): Promise<void> {
    this.logger.info('ExternalDbProvider#closeAllPools.call', {
      poolCount: this.pools.size,
    });

    const closePromises = Array.from(this.pools.entries()).map(
      async ([dbName, pool]) => {
        try {
          await pool.close(10); // Wait up to 10 seconds
          this.logger.info('ExternalDbProvider#closeAllPools.closed', {
            dbName,
          });
        } catch (error: any) {
          this.logger.warn('ExternalDbProvider#closeAllPools.closeError', {
            dbName,
            error: error.message,
          });
        }
      }
    );

    await Promise.all(closePromises);
    this.pools.clear();
    this.logger.info('ExternalDbProvider#closeAllPools.completed');
  }
}

