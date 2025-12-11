import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import { GetUserByEmailQuery } from '../get-user-by-email.query';
import { UsersRepository } from '../../repositories/users.repository';
import { User } from '../../entities/user.entity';

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler implements IQueryHandler<GetUserByEmailQuery> {
  constructor(
    private readonly repository: UsersRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(GetUserByEmailHandler.name);
  }

  async execute(query: GetUserByEmailQuery): Promise<User | null> {
    this.logger.info('GetUserByEmailHandler#execute.call', { email: query.email });
    const result = await this.repository.findByEmail(query.email);
    this.logger.info('GetUserByEmailHandler#execute.result', { found: !!result });
    return result;
  }
}

