import { FindManyOptions } from 'typeorm';
import { ApiEndpoint } from '../entities/api-endpoint.entity';

export class CountApiEndpointsQuery {
    constructor(public readonly options?: FindManyOptions<ApiEndpoint>) { }
}
