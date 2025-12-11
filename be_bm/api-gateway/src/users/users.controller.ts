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
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { PinoLogger } from 'nestjs-pino';
import { Public } from '../common/decorators/public.decorator';
import { Resource } from '../common/decorators/resource.decorator';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { UserResponseDto, UserProfileResponseDto } from './dto/user-response.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../common/dto/pagination-response.dto';
import { SaveDeviceTokenDto, DeviceTokenResponseDto, DeviceTokensResponseDto } from './dto/device-token.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UsersController.name);
  }

  @Get()
  @Resource('users')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users', type: [UserResponseDto] })
  async findAll(@Query() query: PaginationQueryDto): Promise<PaginatedResponseDto<UserResponseDto>> {
    this.logger.info('UsersController#findAll.call', query);

    const grpcQuery: any = {
      offset: ((query.page || 1) - 1) * (query.limit || 25),
      limit: query.limit || 25,
    };

    if (query.q) {
      grpcQuery.where = JSON.stringify({
        $or: [
          { username: { $like: `%${query.q}%` } },
          { email: { $like: `%${query.q}%` } },
        ],
      });
    }

    if (query.orderBy) {
      const orderParts = query.orderBy.split(',');
      const order: any = {};
      orderParts.forEach((part) => {
        const trimmed = part.trim();
        if (trimmed.startsWith('-')) {
          order[trimmed.substring(1)] = 'DESC';
        } else {
          order[trimmed] = 'ASC';
        }
      });
      grpcQuery.order = JSON.stringify(order);
    }

    const users = await this.usersService.findAll(grpcQuery);
    const total = await this.usersService.count(grpcQuery.where ? { where: grpcQuery.where } : {});

    const totalPages = Math.ceil(total / (query.limit || 25));

    return {
      data: users,
      meta: {
        page: query.page || 1,
        limit: query.limit || 25,
        totalItems: total,
        totalPages,
        hasPrevious: (query.page || 1) > 1,
        hasNext: (query.page || 1) < totalPages,
      },
    };
  }

  @Get(':id')
  @Resource('users')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User details', type: UserResponseDto })
  async findById(@Param('id') id: string): Promise<UserResponseDto> {
    this.logger.info('UsersController#findById.call', { id });
    return this.usersService.findById(id);
  }

  @Get('username/:username')
  @Resource('users')
  @ApiOperation({ summary: 'Get user by username' })
  @ApiParam({ name: 'username', description: 'Username' })
  @ApiResponse({ status: 200, description: 'User details', type: UserResponseDto })
  async findByUsername(@Param('username') username: string): Promise<UserResponseDto> {
    this.logger.info('UsersController#findByUsername.call', { username });
    return this.usersService.findByUsername(username) as Promise<UserResponseDto>;
  }

  @Get('email/:email')
  @Resource('users')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user by email' })
  @ApiParam({ name: 'email', description: 'Email address' })
  @ApiResponse({ status: 200, description: 'User details', type: UserResponseDto })
  async findByEmail(@Param('email') email: string): Promise<UserResponseDto> {
    this.logger.info('UsersController#findByEmail.call', { email });
    return this.usersService.findByEmail(email) as Promise<UserResponseDto>;
  }

  @Get('acs-id/:acsId')
  @Resource('users')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user by ACS ID' })
  @ApiParam({ name: 'acsId', description: 'ACS System ID', type: Number })
  @ApiResponse({ status: 200, description: 'User details', type: UserResponseDto })
  async findByAcsId(@Param('acsId') acsId: string): Promise<UserResponseDto> {
    this.logger.info('UsersController#findByAcsId.call', { acsId });
    return this.usersService.findByAcsId(parseInt(acsId, 10)) as Promise<UserResponseDto>;
  }

  @Get(':id/profile')
  @Resource('users.profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user with profile' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User with profile', type: UserResponseDto })
  async findByIdWithProfile(@Param('id') id: string): Promise<UserResponseDto & { profile: UserProfileResponseDto | null }> {
    this.logger.info('UsersController#findByIdWithProfile.call', { id });
    return this.usersService.findByIdWithProfile(id) as Promise<UserResponseDto & { profile: UserProfileResponseDto | null }>;
  }

  @Public()
  @Post()
  @Resource('users')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created', type: UserResponseDto })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    this.logger.info('UsersController#create.call', { username: createUserDto.username });
    return this.usersService.create(createUserDto) as Promise<UserResponseDto>;
  }

  @Put(':id')
  @Resource('users')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User updated', type: UserResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    this.logger.info('UsersController#update.call', { id });
    return this.usersService.update(id, updateUserDto) as Promise<UserResponseDto>;
  }

  @Put(':id/profile')
  @Resource('users.profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Profile updated', type: UserProfileResponseDto })
  async updateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateUserProfileDto,
  ): Promise<UserProfileResponseDto> {
    this.logger.info('UsersController#updateProfile.call', { id });
    return this.usersService.updateProfile(id, updateProfileDto) as Promise<UserProfileResponseDto>;
  }

  @Delete(':id')
  @Resource('users')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    this.logger.info('UsersController#delete.call', { id });
    await this.usersService.delete(id);
    return { message: 'User deleted successfully' };
  }

  // Device Token Management Endpoints
  @Post('device-tokens')
  @Resource('users.device-tokens')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Register device token for push notifications' })
  @ApiBody({ type: SaveDeviceTokenDto })
  @ApiResponse({ status: 201, description: 'Device token registered successfully', type: DeviceTokenResponseDto })
  @HttpCode(HttpStatus.CREATED)
  async saveDeviceToken(
    @Body() dto: SaveDeviceTokenDto,
    @Req() req: any,
  ): Promise<DeviceTokenResponseDto> {
    this.logger.info('UsersController#saveDeviceToken.call', { userId: req.user?.id });

    const userId = req.user?.id;
    const employeeCode = req.user?.employeeCode || req.user?.profile?.employeeCode;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    return this.usersService.saveDeviceToken({
      userId,
      employeeCode,
      deviceToken: dto.deviceToken,
      deviceType: dto.deviceType,
      deviceName: dto.deviceName,
      deviceOsVersion: dto.deviceOsVersion,
      appVersion: dto.appVersion,
    });
  }

  @Delete('device-tokens/:token')
  @Resource('users.device-tokens')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Unregister device token' })
  @ApiParam({ name: 'token', description: 'Device token to remove' })
  @ApiResponse({ status: 200, description: 'Device token removed successfully', type: DeviceTokenResponseDto })
  @HttpCode(HttpStatus.OK)
  async removeDeviceToken(@Param('token') token: string): Promise<DeviceTokenResponseDto> {
    this.logger.info('UsersController#removeDeviceToken.call');
    return this.usersService.removeDeviceToken(token);
  }

  @Get('device-tokens')
  @Resource('users.device-tokens')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get my device tokens' })
  @ApiResponse({ status: 200, description: 'List of device tokens', type: DeviceTokensResponseDto })
  async getMyDeviceTokens(@Req() req: any): Promise<DeviceTokensResponseDto> {
    this.logger.info('UsersController#getMyDeviceTokens.call');

    const employeeCode = req.user?.employeeCode || req.user?.profile?.employeeCode;

    if (!employeeCode) {
      throw new Error('Employee code not found');
    }

    return this.usersService.getDeviceTokens(employeeCode);
  }
}

