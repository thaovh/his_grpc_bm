import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ApiEndpointRepository } from '../../repositories/api-endpoint.repository';
import { GetApiEndpointByIdQuery } from '../get-api-endpoint-by-id.query';
import { ApiEndpoint } from '../../entities/api-endpoint.entity';

@QueryHandler(GetApiEndpointByIdQuery)
export class GetApiEndpointByIdHandler implements IQueryHandler<GetApiEndpointByIdQuery> {
    constructor(private readonly repository: ApiEndpointRepository) { }

    async execute(query: GetApiEndpointByIdQuery): Promise<ApiEndpoint> {
        return this.repository.findById(query.id);
    }
}
