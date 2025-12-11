import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { FindManyOptions } from 'typeorm';
import { Vendor } from './entities/vendor.entity';

// Commands
export class CreateVendorCommand {
    constructor(public readonly dto: CreateVendorDto) { }
}

export class UpdateVendorCommand {
    constructor(public readonly id: string, public readonly dto: UpdateVendorDto) { }
}

export class DeleteVendorCommand {
    constructor(public readonly id: string) { }
}

// Queries
export class GetVendorsQuery {
    constructor(public readonly options?: FindManyOptions<Vendor>) { }
}

export class GetVendorByIdQuery {
    constructor(public readonly id: string) { }
}

export class GetVendorByCodeQuery {
    constructor(public readonly code: string) { }
}

export class CountVendorsQuery {
    constructor(public readonly options?: FindManyOptions<Vendor>) { }
}
