import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ApiEndpointRepository } from '../../repositories/api-endpoint.repository';
import { GetApiEndpointsQuery } from '../get-api-endpoints.query';
import { ApiEndpoint } from '../../entities/api-endpoint.entity';

@QueryHandler(GetApiEndpointsQuery)
export class GetApiEndpointsHandler implements IQueryHandler<GetApiEndpointsQuery> {
    constructor(private readonly repository: ApiEndpointRepository) { }

    async execute(query: GetApiEndpointsQuery): Promise<ApiEndpoint[]> {
        return this.repository.findAll(query.options);
    }
}
