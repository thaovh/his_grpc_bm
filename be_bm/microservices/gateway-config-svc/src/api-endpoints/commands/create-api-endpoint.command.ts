import { CreateApiEndpointDto } from '../dto/create-api-endpoint.dto';

export class CreateApiEndpointCommand {
    constructor(public readonly dto: CreateApiEndpointDto) { }
}
