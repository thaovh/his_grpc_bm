import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RpcException } from '@nestjs/microservices';
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
    if (!result) {
      throw new RpcException({
        code: 5, // NOT_FOUND
        message: 'USER_NOT_FOUND',
      });
    }
    this.logger.info('GetUserByUsernameHandler#execute.result', { found: !!result });
    return result;
  }
}

