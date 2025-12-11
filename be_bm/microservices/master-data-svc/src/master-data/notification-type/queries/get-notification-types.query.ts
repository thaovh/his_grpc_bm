export class GetNotificationTypesQuery {
    constructor(
        public readonly offset?: number,
        public readonly limit?: number,
        public readonly where?: any,
        public readonly order?: any,
    ) { }
}
