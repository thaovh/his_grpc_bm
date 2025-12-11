import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import { GetUsersQuery } from '../get-users.query';
import { UsersRepository } from '../../repositories/users.repository';
import { User } from '../../entities/user.entity';

@QueryHandler(GetUsersQuery)
export class GetUsersHandler implements IQueryHandler<GetUsersQuery> {
  constructor(
    private readonly repository: UsersRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(GetUsersHandler.name);
  }

  async execute(query: GetUsersQuery): Promise<User[]> {
    this.logger.info('GetUsersHandler#execute.call', query.options);
    const result = await this.repository.findAll(query.options);
    this.logger.info('GetUsersHandler#execute.result', { count: result.length });
    return result;
  }
}

