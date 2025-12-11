import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Resource } from '../common/decorators/resource.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { GatewayConfigService } from './gateway-config.service';
import { CreateApiEndpointDto } from './dto/create-api-endpoint.dto';
import { UpdateApiEndpointDto } from './dto/update-api-endpoint.dto';
import { CreateAppFeatureDto } from './dto/create-app-feature.dto';
import { UpdateAppFeatureDto } from './dto/update-app-feature.dto';

@ApiTags('Gateway Configuration')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('gateway-config')
export class GatewayConfigController {
    constructor(private readonly service: GatewayConfigService) { }

    @ApiOperation({ summary: 'List all API endpoints' })
    @Get('endpoints')
    @Resource('gateway-config.endpoints')
    async findAll(@Query('module') module?: string) {
        return this.service.findAll(module);
    }

    @ApiOperation({ summary: 'Create new API endpoint and sync to Kong' })
    @Post('endpoints')
    @Resource('gateway-config.endpoints')
    async create(@Body() dto: CreateApiEndpointDto, @Req() req) {
        // Map to snake_case for gRPC (keepCase: true)
        const grpcInput = {
            path: dto.path,
            method: dto.method,
            description: dto.description,
            module: dto.module,
            is_public: dto.isPublic,
            role_codes: dto.roleCodes,
            rate_limit_requests: dto.rateLimitRequests,
            rate_limit_window: dto.rateLimitWindow,
            resource_name: dto.resourceName,
            action: dto.action,
            created_by: req.user?.id
        };
        return this.service.create(grpcInput);
    }

    @ApiOperation({ summary: 'Update API endpoint and re-sync to Kong' })
    @Put('endpoints/:id')
    @Resource('gateway-config.endpoints')
    async update(@Param('id') id: string, @Body() dto: UpdateApiEndpointDto, @Req() req) {
        // Map to snake_case for gRPC
        const grpcInput: any = {
            id,
            updated_by: req.user?.id
        };
        
        if (dto.path !== undefined) grpcInput.path = dto.path;
        if (dto.method !== undefined) grpcInput.method = dto.method;
        if (dto.description !== undefined) grpcInput.description = dto.description;
        if (dto.module !== undefined) grpcInput.module = dto.module;
        if (dto.isPublic !== undefined) grpcInput.is_public = dto.isPublic;
        if (dto.roleCodes !== undefined) grpcInput.role_codes = dto.roleCodes;
        if (dto.rateLimitRequests !== undefined) grpcInput.rate_limit_requests = dto.rateLimitRequests;
        if (dto.rateLimitWindow !== undefined) grpcInput.rate_limit_window = dto.rateLimitWindow;
        if (dto.resourceName !== undefined) grpcInput.resource_name = dto.resourceName;
        if (dto.action !== undefined) grpcInput.action = dto.action;
        
        return this.service.update(grpcInput);
    }

    @ApiOperation({ summary: 'Delete API endpoint and remove from Kong' })
    @Delete('endpoints/:id')
    @Resource('gateway-config.endpoints')
    async delete(@Param('id') id: string) {
        return this.service.delete(id);
    }

    @ApiOperation({ summary: 'Manually sync all endpoints to Kong' })
    @Post('sync-all')
    @Resource('gateway-config')
    async syncAll() {
        return this.service.syncAll();
    }

    // --- APP FEATURES MANAGEMENT ---

    @ApiOperation({ summary: 'List all app features' })
    @Get('features')
    @Resource('gateway-config.features')
    async findAllFeatures() {
        // This could be enhanced with query params if needed
        return this.service.findAllFeatures();
    }

    @ApiOperation({ summary: 'Create new app feature' })
    @ApiBody({ type: CreateAppFeatureDto })
    @Post('features')
    @Resource('gateway-config.features')
    async createFeature(@Body() data: CreateAppFeatureDto) {
        return this.service.createFeature(data);
    }

    @ApiOperation({ summary: 'Update app feature' })
    @ApiBody({ type: UpdateAppFeatureDto })
    @Put('features/:id')
    @Resource('gateway-config.features')
    async updateFeature(@Param('id') id: string, @Body() data: UpdateAppFeatureDto) {
        return this.service.updateFeature({ id, ...data });
    }

    @ApiOperation({ summary: 'Delete app feature' })
    @Delete('features/:id')
    @Resource('gateway-config.features')
    async deleteFeature(@Param('id') id: string) {
        return this.service.deleteFeature(id);
    }
}
