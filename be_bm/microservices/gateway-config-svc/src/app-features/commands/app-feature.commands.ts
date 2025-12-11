export class CreateAppFeatureCommand {
    constructor(
        public readonly code: string,
        public readonly name: string,
        public readonly icon?: string,
        public readonly route?: string,
        public readonly parentId?: string,
        public readonly orderIndex: number = 0,
        public readonly roleCodes: string[] = [],
    ) { }
}

export class UpdateAppFeatureCommand {
    constructor(
        public readonly id: string,
        public readonly name?: string,
        public readonly icon?: string,
        public readonly route?: string,
        public readonly parentId?: string,
        public readonly orderIndex?: number,
        public readonly isActive?: boolean,
        public readonly roleCodes?: string[],
    ) { }
}

export class DeleteAppFeatureCommand {
    constructor(public readonly id: string) { }
}
