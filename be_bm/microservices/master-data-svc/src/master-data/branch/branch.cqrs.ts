import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { FindManyOptions } from 'typeorm';
import { Branch } from './entities/branch.entity';

// Commands
export class CreateBranchCommand {
    constructor(public readonly branchDto: CreateBranchDto) { }
}

export class UpdateBranchCommand {
    constructor(public readonly id: string, public readonly branchDto: UpdateBranchDto) { }
}

// Queries
export class GetBranchesQuery {
    constructor(public readonly options?: FindManyOptions<Branch>) { }
}

export class GetBranchByIdQuery {
    constructor(public readonly id: string) { }
}

export class GetBranchByCodeQuery {
    constructor(public readonly code: string) { }
}

export class CountBranchesQuery {
    constructor(public readonly options?: FindManyOptions<Branch>) { }
}
