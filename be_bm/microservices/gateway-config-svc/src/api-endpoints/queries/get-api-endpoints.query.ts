import { FindManyOptions } from 'typeorm';
import { ApiEndpoint } from '../entities/api-endpoint.entity';

export class GetApiEndpointsQuery {
    constructor(public readonly options?: FindManyOptions<ApiEndpoint>) { }
}
