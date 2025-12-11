import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PinoLogger } from 'nestjs-pino';
import { GetUserByAcsIdQuery } from '../get-user-by-acs-id.query';
import { UsersRepository } from '../../repositories/users.repository';
import { User } from '../../entities/user.entity';

@QueryHandler(GetUserByAcsIdQuery)
export class GetUserByAcsIdHandler implements IQueryHandler<GetUserByAcsIdQuery> {
  constructor(
    private readonly repository: UsersRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(GetUserByAcsIdHandler.name);
  }

  async execute(query: GetUserByAcsIdQuery): Promise<User | null> {
    this.logger.info('GetUserByAcsIdHandler#execute.call', { acsId: query.acsId });
    const result = await this.repository.findByAcsId(query.acsId);
    this.logger.info('GetUserByAcsIdHandler#execute.result', { found: !!result });
    return result;
  }
}

