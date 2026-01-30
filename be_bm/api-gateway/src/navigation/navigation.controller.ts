import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Resource } from '../common/decorators/resource.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GatewayConfigService } from '../gateway-config/gateway-config.service';

@ApiTags('Application')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('app/navigation')
export class NavigationController {
    constructor(private readonly gatewayConfigService: GatewayConfigService) { }

    @ApiOperation({ summary: 'Get app navigation tree based on user roles' })
    @Get()
    @Resource('app.navigation.read')
    async getNavigation(@Req() req: any) {
        // req.user is populated by JwtAuthGuard (decoded token)
        const roleCodes = req.user?.roles || [];
        try {
            return await this.gatewayConfigService.getNavigationTree(roleCodes);
        } catch (error) {
            throw error;
        }
    }
}
