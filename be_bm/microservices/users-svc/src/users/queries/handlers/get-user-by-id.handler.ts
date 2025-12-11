import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import { GetUserByIdQuery } from '../get-user-by-id.query';
import { UsersRepository } from '../../repositories/users.repository';
import { User } from '../../entities/user.entity';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(
    private readonly repository: UsersRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(GetUserByIdHandler.name);
  }

  async execute(query: GetUserByIdQuery): Promise<User | null> {
    this.logger.info('GetUserByIdHandler#execute.call', { id: query.id });
    const result = await this.repository.findById(query.id);
    this.logger.info('GetUserByIdHandler#execute.result', { found: !!result });
    return result;
  }
}

