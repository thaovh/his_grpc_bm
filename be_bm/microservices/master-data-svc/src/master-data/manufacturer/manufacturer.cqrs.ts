import { CreateManufacturerDto } from './dto/create-manufacturer.dto';
import { UpdateManufacturerDto } from './dto/update-manufacturer.dto';

export class CreateManufacturerCommand {
    constructor(public readonly createManufacturerDto: CreateManufacturerDto) { }
}

export class UpdateManufacturerCommand {
    constructor(public readonly updateManufacturerDto: UpdateManufacturerDto) { }
}

export class DeleteManufacturerCommand {
    constructor(public readonly id: string) { }
}

export class GetManufacturersQuery {
    constructor(public readonly query: any) { }
}

export class GetManufacturerByIdQuery {
    constructor(public readonly id: string) { }
}

export class GetManufacturerByCodeQuery {
    constructor(public readonly code: string) { }
}

export class CountManufacturersQuery {
    constructor(public readonly query: any) { }
}
