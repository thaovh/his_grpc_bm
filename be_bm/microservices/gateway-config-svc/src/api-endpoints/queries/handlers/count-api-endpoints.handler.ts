import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ApiEndpointRepository } from '../../repositories/api-endpoint.repository';
import { CountApiEndpointsQuery } from '../count-api-endpoints.query';

@QueryHandler(CountApiEndpointsQuery)
export class CountApiEndpointsHandler implements IQueryHandler<CountApiEndpointsQuery> {
    constructor(private readonly repository: ApiEndpointRepository) { }

    async execute(query: CountApiEndpointsQuery): Promise<number> {
        return this.repository.count(query.options);
    }
}
