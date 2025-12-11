import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { DeviceTokenRepository } from '../../repositories/device-token.repository';
import { GetDeviceTokensByEmployeeCodeQuery } from '../device-token.cqrs';

@QueryHandler(GetDeviceTokensByEmployeeCodeQuery)
export class GetDeviceTokensByEmployeeCodeHandler
    implements IQueryHandler<GetDeviceTokensByEmployeeCodeQuery> {

    constructor(private readonly repository: DeviceTokenRepository) { }

    async execute(query: GetDeviceTokensByEmployeeCodeQuery): Promise<string[]> {
        return await this.repository.getActiveTokensByEmployeeCode(query.employeeCode);
    }
}
