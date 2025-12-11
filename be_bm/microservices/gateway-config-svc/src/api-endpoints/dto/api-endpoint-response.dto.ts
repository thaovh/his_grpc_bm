export class ApiEndpointResponseDto {
    id: string;
    path: string;
    method: string;
    description: string;
    module: string;
    isPublic: boolean;
    roleCodes: string[];
    rateLimitRequests: number;
    rateLimitWindow: string;
    kongRouteId: string;
    kongRouteName: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
}
