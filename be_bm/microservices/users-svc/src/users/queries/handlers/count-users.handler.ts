import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import { CountUsersQuery } from '../count-users.query';
import { UsersRepository } from '../../repositories/users.repository';

@QueryHandler(CountUsersQuery)
export class CountUsersHandler implements IQueryHandler<CountUsersQuery> {
  constructor(
    private readonly repository: UsersRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(CountUsersHandler.name);
  }

  async execute(query: CountUsersQuery): Promise<number> {
    this.logger.info('CountUsersHandler#execute.call', query.options);
    const result = await this.repository.count(query.options);
    this.logger.info('CountUsersHandler#execute.result', { count: result });
    return result;
  }
}

