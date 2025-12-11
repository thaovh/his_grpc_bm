import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiEndpointService } from '../services/api-endpoint.service';
import { CreateApiEndpointDto } from '../dto/create-api-endpoint.dto';
import { UpdateApiEndpointDto } from '../dto/update-api-endpoint.dto';
import { ApiEndpointResponseDto } from '../dto/api-endpoint-response.dto';
import { KongSyncService } from '../../kong-sync/services/kong-sync.service';

@Controller('admin/api-endpoints')
export class ApiEndpointRestController {
    constructor(
        private readonly service: ApiEndpointService,
        private readonly kongSyncService: KongSyncService,
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() dto: CreateApiEndpointDto): Promise<ApiEndpointResponseDto> {
        const result = await this.service.create(dto);

        // Auto-sync to Kong
        try {
            const endpoint = await this.service.findById(result.id);
            await this.kongSyncService.syncEndpoint(endpoint);
        } catch (error) {
            // Log but don't fail the request
            console.error('Failed to auto-sync to Kong on create:', error.message);
        }

        return result;
    }

    @Get()
    async findAll(@Query('module') module?: string): Promise<ApiEndpointResponseDto[]> {
        return this.service.findAll(module);
    }

    @Post('sync-all')
    async syncAll(): Promise<{ success: number; total: number }> {
        return this.kongSyncService.syncAll();
    }

    @Get(':id')
    async findById(@Param('id') id: string): Promise<ApiEndpointResponseDto> {
        const endpoint = await this.service.findById(id);
        return this.service.toResponseDto(endpoint);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateApiEndpointDto,
    ): Promise<ApiEndpointResponseDto> {
        const result = await this.service.update(id, dto);

        // Auto-sync to Kong
        try {
            const endpoint = await this.service.findById(id);
            await this.kongSyncService.syncEndpoint(endpoint);
        } catch (error) {
            console.error('Failed to auto-sync to Kong on update:', error.message);
        }

        return result;
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id') id: string): Promise<void> {
        const endpoint = await this.service.findById(id);

        // Delete from Kong first
        if (endpoint.kongRouteId) {
            try {
                await this.kongSyncService.deleteRoute(endpoint.kongRouteId);
            } catch (error) {
                console.error('Failed to delete Kong route on delete:', error.message);
            }
        }

        return this.service.delete(id);
    }
}
