import { UpdateApiEndpointDto } from '../dto/update-api-endpoint.dto';

export class UpdateApiEndpointCommand {
    constructor(
        public readonly id: string,
        public readonly dto: UpdateApiEndpointDto,
    ) { }
}
