import { CreateMachineFundingSourceDto } from './dto/create-machine-funding-source.dto';
import { UpdateMachineFundingSourceDto } from './dto/update-machine-funding-source.dto';
import { FindManyOptions } from 'typeorm';
import { MachineFundingSource } from './entities/machine-funding-source.entity';

// Commands
export class CreateMachineFundingSourceCommand {
    constructor(public readonly dto: CreateMachineFundingSourceDto) { }
}

export class UpdateMachineFundingSourceCommand {
    constructor(public readonly id: string, public readonly dto: UpdateMachineFundingSourceDto) { }
}

// Queries
export class GetMachineFundingSourcesQuery {
    constructor(public readonly options?: FindManyOptions<MachineFundingSource>) { }
}

export class GetMachineFundingSourceByIdQuery {
    constructor(public readonly id: string) { }
}

export class GetMachineFundingSourceByCodeQuery {
    constructor(public readonly code: string) { }
}

export class CountMachineFundingSourcesQuery {
    constructor(public readonly options?: FindManyOptions<MachineFundingSource>) { }
}
