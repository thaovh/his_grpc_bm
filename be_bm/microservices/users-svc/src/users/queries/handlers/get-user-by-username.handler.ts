import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import { GetUserByUsernameQuery } from '../get-user-by-username.query';
import { UsersRepository } from '../../repositories/users.repository';
import { User } from '../../entities/user.entity';

@QueryHandler(GetUserByUsernameQuery)
export class GetUserByUsernameHandler implements IQueryHandler<GetUserByUsernameQuery> {
  constructor(
    private readonly repository: UsersRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(GetUserByUsernameHandler.name);
  }

  async execute(query: GetUserByUsernameQuery): Promise<User | null> {
    this.logger.info('GetUserByUsernameHandler#execute.call', { username: query.username });
    const result = await this.repository.findByUsername(query.username);
    this.logger.info('GetUserByUsernameHandler#execute.result', { found: !!result });
    return result;
  }
}

