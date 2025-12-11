import { PartialType } from '@nestjs/swagger';
import { CreateApiEndpointDto } from './create-api-endpoint.dto';

export class UpdateApiEndpointDto extends PartialType(CreateApiEndpointDto) { }
