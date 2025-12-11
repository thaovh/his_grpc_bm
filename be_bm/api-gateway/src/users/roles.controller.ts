import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    HttpCode,
    HttpStatus,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';
import { UsersService } from './users.service';
import { RoleDto, CreateRoleDto, UpdateRoleDto, AssignRoleDto, AssignUserRoleDto, RolesResponseDto, RoleResponseDto } from './dto/role.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Resource } from '../common/decorators/resource.decorator';

@ApiTags('roles')
@Controller('roles')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RolesController {
    constructor(
        private readonly usersService: UsersService,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(RolesController.name);
    }

    @Post()
    @Resource('roles')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Create a new role' })
    @ApiResponse({ status: 201, description: 'Role created', type: RoleResponseDto })
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
        this.logger.info('RolesController#create.call', { code: createRoleDto.code });
        return this.usersService.createRole(createRoleDto);
    }

    @Get()
    @Resource('roles')
    @ApiOperation({ summary: 'Get all roles' })
    @ApiResponse({ status: 200, description: 'List of roles', type: RolesResponseDto })
    async findAll(@Query() query: any): Promise<RolesResponseDto> {
        this.logger.info('RolesController#findAll.call', query);
        return this.usersService.getRoles(query);
    }

    @Get(':id')
    @Resource('roles')
    @ApiOperation({ summary: 'Get role by ID' })
    @ApiParam({ name: 'id', description: 'Role ID' })
    @ApiResponse({ status: 200, description: 'Role details', type: RoleResponseDto })
    async findById(@Param('id') id: string): Promise<RoleResponseDto> {
        this.logger.info('RolesController#findById.call', { id });
        return this.usersService.getRoleById(id);
    }

    @Get('code/:code')
    @Resource('roles')
    @ApiOperation({ summary: 'Get role by Code' })
    @ApiParam({ name: 'code', description: 'Role Code' })
    @ApiResponse({ status: 200, description: 'Role details', type: RoleResponseDto })
    async findByCode(@Param('code') code: string): Promise<RoleResponseDto> {
        this.logger.info('RolesController#findByCode.call', { code });
        return this.usersService.getRoleByCode(code);
    }

    @Put(':id')
    @Resource('roles')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Update role' })
    @ApiParam({ name: 'id', description: 'Role ID' })
    @ApiResponse({ status: 200, description: 'Role updated', type: RoleResponseDto })
    async update(
        @Param('id') id: string,
        @Body() updateRoleDto: UpdateRoleDto,
    ): Promise<RoleResponseDto> {
        this.logger.info('RolesController#update.call', { id });
        return this.usersService.updateRole({ id, ...updateRoleDto });
    }

    @Delete(':id')
    @Resource('roles')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Delete role' })
    @ApiParam({ name: 'id', description: 'Role ID' })
    @ApiResponse({ status: 200, description: 'Role deleted' })
    @HttpCode(HttpStatus.OK)
    async delete(@Param('id') id: string): Promise<{ message: string }> {
        this.logger.info('RolesController#delete.call', { id });
        await this.usersService.deleteRole(id);
        return { message: 'Role deleted successfully' };
    }

    @Post('assign')
    @Resource('roles')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Assign role to user' })
    @ApiResponse({ status: 201, description: 'Role assigned' })
    async assignRole(@Body() assignRoleDto: AssignUserRoleDto): Promise<any> {
        this.logger.info('RolesController#assignRole.call', { userId: assignRoleDto.userId, roleCode: assignRoleDto.roleCode });
        return this.usersService.assignRole(assignRoleDto.userId, assignRoleDto.roleCode);
    }

    @Post('revoke')
    @Resource('roles')
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Revoke role from user' })
    @ApiResponse({ status: 200, description: 'Role revoked' })
    async revokeRole(@Body() assignRoleDto: AssignUserRoleDto): Promise<any> {
        this.logger.info('RolesController#revokeRole.call', { userId: assignRoleDto.userId, roleCode: assignRoleDto.roleCode });
        return this.usersService.revokeRole(assignRoleDto.userId, assignRoleDto.roleCode);
    }

    @Get('user/:userId')
    @Resource('roles')
    @ApiOperation({ summary: 'Get user roles' })
    @ApiParam({ name: 'userId', description: 'User ID' })
    @ApiResponse({ status: 200, description: 'List of user roles' })
    async getUserRoles(@Param('userId') userId: string): Promise<any> {
        this.logger.info('RolesController#getUserRoles.call', { userId });
        return this.usersService.getUserRoles(userId);
    }
}
