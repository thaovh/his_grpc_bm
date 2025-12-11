import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import { In, MoreThanOrEqual, LessThanOrEqual, Between } from 'typeorm';
import { GetExpMestsQuery } from '../get-exp-mests.query';
import { InventoryRepository } from '../../repositories/inventory.repository';
import { ExpMest } from '../../entities/exp-mest.entity';

@QueryHandler(GetExpMestsQuery)
export class GetExpMestsHandler implements IQueryHandler<GetExpMestsQuery> {
  constructor(
    private readonly repository: InventoryRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(GetExpMestsHandler.name);
  }

  async execute(query: GetExpMestsQuery): Promise<ExpMest[]> {
    this.logger.info('GetExpMestsHandler#execute.call', query.options);
    
    // Convert where clause from JSON format to TypeORM format
    let options = query.options;
    if (options?.where) {
      options = {
        ...options,
        where: this.convertWhereClause(options.where),
      };
    }
    
    const result = await this.repository.findAll(options);
    this.logger.info('GetExpMestsHandler#execute.result', { count: result.length });
    return result;
  }

  /**
   * Convert where clause from JSON format (with $in, $gte, $lte, etc.) to TypeORM format
   */
  private convertWhereClause(where: any): any {
    if (!where || typeof where !== 'object') {
      return where;
    }

    const converted: any = {};

    for (const [key, value] of Object.entries(where)) {
      if (value === null || value === undefined) {
        converted[key] = value;
      } else if (Array.isArray(value)) {
        // Array: use In() operator
        converted[key] = In(value as any[]);
      } else if (typeof value === 'object') {
        const val = value as any;
        // Check for custom TypeORM format
        if ('_typeorm_in' in val && Array.isArray(val._typeorm_in)) {
          converted[key] = In(val._typeorm_in);
        } else if ('_typeorm_gte' in val) {
          converted[key] = MoreThanOrEqual(val._typeorm_gte);
        } else if ('_typeorm_lte' in val) {
          converted[key] = LessThanOrEqual(val._typeorm_lte);
        } else if ('_typeorm_between' in val && Array.isArray(val._typeorm_between) && val._typeorm_between.length === 2) {
          converted[key] = Between(val._typeorm_between[0], val._typeorm_between[1]);
        } else if ('$in' in val && Array.isArray(val.$in)) {
          // Support $in format
          converted[key] = In(val.$in);
        } else if ('$gte' in val) {
          converted[key] = MoreThanOrEqual(val.$gte);
        } else if ('$lte' in val) {
          converted[key] = LessThanOrEqual(val.$lte);
        } else if ('$between' in val && Array.isArray(val.$between) && val.$between.length === 2) {
          converted[key] = Between(val.$between[0], val.$between[1]);
        } else {
          // Recursively convert nested objects
          converted[key] = this.convertWhereClause(value);
        }
      } else {
        converted[key] = value;
      }
    }

    return converted;
  }
}

