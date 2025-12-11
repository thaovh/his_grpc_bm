export class CreateNotificationTypeCommand {
    constructor(
        public readonly code: string,
        public readonly name: string,
        public readonly sortOrder?: number,
        public readonly description?: string,
    ) { }
}
