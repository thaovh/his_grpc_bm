// Device Token Queries
export class GetDeviceTokensByUserIdQuery {
    constructor(public readonly userId: string) { }
}

export class GetDeviceTokensByEmployeeCodeQuery {
    constructor(public readonly employeeCode: string) { }
}
