import { SetMetadata } from '@nestjs/common';

export const RESOURCE_KEY = 'resource';
export const ACTION_KEY = 'action';

/**
 * Decorator to mark a controller method with a resource name
 * Action will be automatically inferred from HTTP method + path pattern
 * 
 * @param resource Resource name (e.g., 'users', 'inventory.exp-mests')
 * 
 * @example
 * // Action inferred: 'list' (GET without :id)
 * @Get('exp-mests')
 * @Resource('inventory.exp-mests')
 * async findAll() { ... }
 * 
 * @example
 * // Action inferred: 'read' (GET with :id)
 * @Get('exp-mests/:id')
 * @Resource('inventory.exp-mests')
 * async findById() { ... }
 * 
 * @example
 * // Action inferred: 'sync' (POST with /sync in path)
 * @Post('exp-mests/:id/sync')
 * @Resource('inventory.exp-mests')
 * async sync() { ... }
 * 
 * @example
 * // Custom action - explicitly specify if needed
 * @Get('exp-mests/:id/custom-action')
 * @Resource('inventory.exp-mests')
 * @Action('custom-action')
 * async customAction() { ... }
 */
export const Resource = (resource: string) => SetMetadata(RESOURCE_KEY, resource);

/**
 * Optional decorator to explicitly specify action
 * Only needed for custom actions that cannot be inferred from method + path
 * 
 * @param action Action name (e.g., 'create', 'read', 'update', 'delete', 'list', 'sync', 'export')
 * 
 * @example
 * // Custom action that doesn't match standard patterns
 * @Get('exp-mests/:id/advanced-report')
 * @Resource('inventory.exp-mests')
 * @Action('advanced-report')
 * async getAdvancedReport() { ... }
 */
export const Action = (action: string) => SetMetadata(ACTION_KEY, action);
