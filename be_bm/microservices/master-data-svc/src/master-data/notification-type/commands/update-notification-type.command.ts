export class UpdateNotificationTypeCommand {
    constructor(
        public readonly id: string,
        public readonly code?: string,
        public readonly name?: string,
        public readonly sortOrder?: number,
        public readonly description?: string,
    ) { }
}
