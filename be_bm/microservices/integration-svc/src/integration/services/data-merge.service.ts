import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

export type MergeStrategy = 'override' | 'merge' | 'append';

@Injectable()
export class DataMergeService {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(DataMergeService.name);
  }

  /**
   * Merge SQL data with API data
   */
  merge(
    sqlData: any,
    apiData: any,
    strategy: MergeStrategy = 'merge',
    rules?: Record<string, string>
  ): any {
    this.logger.debug('DataMergeService#merge.call', {
      strategy,
      hasSqlData: !!sqlData,
      hasApiData: !!apiData,
    });

    if (!sqlData && !apiData) {
      return null;
    }

    if (!sqlData) {
      return apiData;
    }

    if (!apiData) {
      return sqlData;
    }

    switch (strategy) {
      case 'override':
        // API data completely overrides SQL data
        return { ...sqlData, ...apiData };

      case 'merge':
        // Deep merge, API takes precedence
        return this.deepMerge(sqlData, apiData);

      case 'append':
        // Append API data as nested object
        return {
          ...sqlData,
          apiData,
        };

      default:
        return this.deepMerge(sqlData, apiData);
    }
  }

  /**
   * Deep merge two objects
   */
  private deepMerge(target: any, source: any): any {
    const output = { ...target };

    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach((key) => {
        if (this.isObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, { [key]: source[key] });
          } else {
            output[key] = this.deepMerge(target[key], source[key]);
          }
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }

    return output;
  }

  /**
   * Check if value is an object
   */
  private isObject(item: any): boolean {
    return item && typeof item === 'object' && !Array.isArray(item);
  }
}

