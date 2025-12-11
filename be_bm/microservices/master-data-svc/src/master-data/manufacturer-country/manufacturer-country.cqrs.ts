import { CreateManufacturerCountryDto } from './dto/create-manufacturer-country.dto';
import { UpdateManufacturerCountryDto } from './dto/update-manufacturer-country.dto';
import { FindManyOptions } from 'typeorm';
import { ManufacturerCountry } from './entities/manufacturer-country.entity';

// Commands
export class CreateManufacturerCountryCommand {
    constructor(public readonly dto: CreateManufacturerCountryDto) { }
}

export class UpdateManufacturerCountryCommand {
    constructor(public readonly id: string, public readonly dto: UpdateManufacturerCountryDto) { }
}

// Queries
export class GetManufacturerCountriesQuery {
    constructor(public readonly options?: FindManyOptions<ManufacturerCountry>) { }
}

export class GetManufacturerCountryByIdQuery {
    constructor(public readonly id: string) { }
}

export class GetManufacturerCountryByCodeQuery {
    constructor(public readonly code: string) { }
}

export class CountManufacturerCountriesQuery {
    constructor(public readonly options?: FindManyOptions<ManufacturerCountry>) { }
}
