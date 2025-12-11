import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GatewayConfigService } from '../../gateway-config/gateway-config.service';
import { ErrorTranslations } from '../constants/error-codes';
import { RESOURCE_KEY, ACTION_KEY } from '../decorators/resource.decorator';

interface EndpointCache {
    isPublic: boolean;
    roleCodes: string[];
    timestamp: number;
}

@Injectable()
export class DynamicRolesGuard implements CanActivate {
    private readonly logger = new Logger(DynamicRolesGuard.name);
    private readonly cache = new Map<string, EndpointCache>();
    private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

    constructor(
        private readonly gatewayConfigService: GatewayConfigService,
        private readonly reflector: Reflector,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user; // From JwtAuthGuard

        // Extract actual path from request URL (not route pattern)
        // request.url includes query string, so we remove it
        // request.url format: /api/inventory/exp-mests/123?page=1
        const rawPath = request.url.split('?')[0];
        const path = rawPath; // Keep full path including /api prefix as DB stores it that way
        const method = request.method.toUpperCase();

        this.logger.debug(`Checking authorization for ${method} ${path}`);

        // Check @Resource() and @Action() decorators
        const resourceName = this.reflector.getAllAndOverride<string>(RESOURCE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        let action = this.reflector.getAllAndOverride<string>(ACTION_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // If no @Action() decorator, infer from HTTP method + path pattern
        if (!action && resourceName) {
            action = this.inferActionFromMethodAndPath(method, path);
        }

        // Determine cache key: prefer resource-based, fallback to path-based
        const normalizedPath = this.normalizePathToPattern(path);
        const cacheKey = resourceName && action 
            ? `${method}:${resourceName}:${action}` 
            : `${method}:${normalizedPath}`;
        
        let endpointConfig = this.getFromCache(cacheKey);

        if (!endpointConfig) {
            let endpoint: any = null;
            let matchedBy = '';

            // Strategy 1: Try resource-based lookup first (if resource decorator exists)
            // Action can be inferred from method + path if not provided
            if (resourceName && action) {
                try {
                    endpoint = await this.gatewayConfigService.getEndpointByResource(resourceName, action, method);
                    matchedBy = `resource:${resourceName}.${action}`;
                    this.logger.debug(`Matched by resource: ${resourceName}.${action}`);
                } catch (error: any) {
                    const isNotFound = error.code === 5 || 
                        error.message?.toLowerCase().includes('not found') ||
                        error.message?.toLowerCase().includes('endpoint not found');
                    
                    if (!isNotFound) {
                        // Other errors → Re-throw
                        this.logger.error(`Error querying endpoint by resource: ${error.message}`, error.stack);
                        throw error;
                    }
                    // Not found by resource → fallback to path-based
                    this.logger.debug(`Resource-based lookup failed, falling back to path-based`);
                }
            }

            // Strategy 2: Fallback to path-based lookup
            if (!endpoint) {
                try {
                    endpoint = await this.gatewayConfigService.getEndpointByPath(path, method);
                    matchedBy = `path:${path}`;
                } catch (error: any) {
                    // If exact match fails, try pattern matching
                    const isNotFound = error.code === 5 || 
                        error.message?.toLowerCase().includes('not found') ||
                        error.message?.toLowerCase().includes('endpoint not found');

                    if (isNotFound) {
                        // Try normalized path pattern
                        try {
                            endpoint = await this.gatewayConfigService.getEndpointByPath(normalizedPath, method);
                            matchedBy = `path-pattern:${normalizedPath}`;
                            this.logger.debug(`Matched path pattern: ${path} → ${normalizedPath}`);
                        } catch (patternError: any) {
                            // Pattern matching also failed
                            endpoint = null;
                        }
                    } else {
                        // Other errors → Re-throw
                        this.logger.error(`Error querying endpoint config: ${error.message}`, error.stack);
                        throw error;
                    }
                }
            }

            if (endpoint) {
                endpointConfig = {
                    isPublic: endpoint.is_public === 1 || endpoint.is_public === true,
                    roleCodes: endpoint.role_codes || [],
                    timestamp: Date.now()
                };

                // Cache with determined cache key
                this.cache.set(cacheKey, endpointConfig);
                this.logger.debug(
                    `Cached endpoint config (matched by ${matchedBy}) for ${cacheKey}: ` +
                    `isPublic=${endpointConfig.isPublic}, roles=[${endpointConfig.roleCodes.join(', ')}]`
                );
            } else {
                // Endpoint not found in DB → Deny for security
                const triedMethods = [];
                if (resourceName && action) triedMethods.push(`resource:${resourceName}.${action}`);
                triedMethods.push(`path:${path}`, `path-pattern:${normalizedPath}`);
                
                this.logger.error(
                    `Endpoint not found in config: ${method} ${path}. ` +
                    `Tried: [${triedMethods.join(', ')}]. ` +
                    `Denying access for security. Please configure this endpoint in gateway-config-svc.`
                );
                throw new ForbiddenException('Endpoint not configured. Please contact administrator.');
            }
        } else {
            this.logger.debug(`Cache hit for ${cacheKey}: isPublic=${endpointConfig.isPublic}, roles=[${endpointConfig.roleCodes.join(', ')}]`);
        }

        // If endpoint is public (from DB config) → Allow
        if (endpointConfig.isPublic) {
            this.logger.debug(`Public endpoint (from DB config), allowing access`);
            return true;
        }

        // If no user (JWT not validated) → Deny
        if (!user) {
            this.logger.warn(`No user found in request for protected endpoint ${method} ${path}`);
            throw new ForbiddenException(ErrorTranslations.AUTHENTICATION_REQUIRED);
        }

        // If no roles required → Allow (just need to be logged in)
        if (!endpointConfig.roleCodes || endpointConfig.roleCodes.length === 0) {
            this.logger.debug(`No roles required, allowing authenticated user`);
            return true;
        }

        // Check if user has required role
        const userRoles = user.roles || [];
        const hasRole = endpointConfig.roleCodes.some(requiredRole => {
            return userRoles.some(userRole => {
                // Handle both string and object formats
                const userRoleCode = typeof userRole === 'string' 
                    ? userRole 
                    : (userRole?.code || userRole?.roleCode || '');
                return userRoleCode === requiredRole;
            });
        });

        if (!hasRole) {
            // Format user roles for logging
            const userRoleCodes = userRoles.map(role => 
                typeof role === 'string' ? role : (role?.code || role?.roleCode || '')
            ).join(', ');

            this.logger.warn(
                `User ${user.username || user.id} with roles [${userRoleCodes}] ` +
                `attempted to access ${method} ${path} requiring [${endpointConfig.roleCodes.join(', ')}]`
            );
            throw new ForbiddenException(ErrorTranslations.INSUFFICIENT_PERMISSIONS);
        }

        this.logger.debug(`User ${user.username || user.id} authorized for ${method} ${path}`);
        return true;
    }

    private getFromCache(key: string): EndpointCache | null {
        const cached = this.cache.get(key);
        if (!cached) return null;

        // Check if cache is expired
        if (Date.now() - cached.timestamp > this.CACHE_TTL) {
            this.cache.delete(key);
            return null;
        }

        return cached;
    }

    // Method to clear cache (useful for testing or manual refresh)
    clearCache() {
        this.cache.clear();
        this.logger.log('Cache cleared');
    }

    /**
     * Normalize actual request path to pattern format for matching with DB
     * Examples:
     * - /api/users/123 → /api/users/:id
     * - /api/users/username/john → /api/users/username/:username
     * - /api/users/email/test@example.com → /api/users/email/:email
     * - /api/inventory/exp-mests-other/12345/sync → /api/inventory/exp-mests-other/:expMestId/sync
     */
    private normalizePathToPattern(path: string): string {
        const segments = path.split('/').filter(s => s.length > 0);
        const normalizedSegments: string[] = [];

        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];
            const prevSegment = i > 0 ? segments[i - 1] : null;

            // Check if segment looks like a parameter value
            if (this.isParameterValue(segment, prevSegment)) {
                // Determine parameter name based on context
                const paramName = this.inferParameterName(prevSegment, segment);
                normalizedSegments.push(`:${paramName}`);
            } else {
                normalizedSegments.push(segment);
            }
        }

        return '/' + normalizedSegments.join('/');
    }

    /**
     * Check if a segment looks like a parameter value (UUID, number, or generic ID)
     */
    private isParameterValue(segment: string, prevSegment: string | null): boolean {
        // UUID format: 8-4-4-4-12 hex digits
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(segment)) {
            return true;
        }

        // Pure numeric (likely an ID)
        if (/^\d+$/.test(segment)) {
            return true;
        }

        // If previous segment suggests this is a parameter (e.g., "username", "email", "acs-id")
        if (prevSegment && this.isParameterIndicator(prevSegment)) {
            return true;
        }

        return false;
    }

    /**
     * Check if a segment indicates the next segment is a parameter
     */
    private isParameterIndicator(segment: string): boolean {
        const indicators = [
            'username', 'email', 'acs-id', 'token', 'code', 'id',
            'expMestId', 'userId', 'roleId', 'featureId', 'endpointId'
        ];
        return indicators.includes(segment.toLowerCase());
    }

    /**
     * Infer parameter name based on context
     */
    private inferParameterName(prevSegment: string | null, segment: string): string {
        // If previous segment suggests parameter name, use it
        if (prevSegment) {
            const lowerPrev = prevSegment.toLowerCase();
            
            // Map common patterns
            if (lowerPrev === 'username') return 'username';
            if (lowerPrev === 'email') return 'email';
            if (lowerPrev === 'acs-id' || lowerPrev === 'acsid') return 'acsId';
            if (lowerPrev === 'token') return 'token';
            if (lowerPrev === 'code') return 'code';
            if (lowerPrev === 'exp-mests-other' || lowerPrev === 'expmestsother') return 'expMestId';
            if (lowerPrev === 'inpatient-exp-mests' || lowerPrev === 'inpatientexpmests') return 'expMestId';
            if (lowerPrev === 'users') return 'id';
            if (lowerPrev === 'roles') return 'id';
            if (lowerPrev === 'features') return 'id';
            if (lowerPrev === 'endpoints') return 'id';
        }

        // Default: check if segment is UUID or number
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(segment)) {
            return 'id';
        }

        if (/^\d+$/.test(segment)) {
            return 'id';
        }

        // Fallback to generic 'id'
        return 'id';
    }

    /**
     * Infer action from HTTP method and path pattern
     * This allows using only @Resource() without @Action() in most cases
     */
    private inferActionFromMethodAndPath(method: string, path: string): string {
        const pathLower = path.toLowerCase();
        
        // Custom actions based on path patterns (check these FIRST before standard CRUD)
        if (pathLower.includes('/login')) return 'login';
        if (pathLower.includes('/logout')) return 'logout';
        if (pathLower.includes('/refresh')) return 'refresh';
        if (pathLower.includes('/change-password')) return 'change-password';
        if (pathLower.includes('/sync')) return 'sync';
        // Only infer 'export' if it's a standalone action, not part of a resource name
        // Pattern: /resource/export or /resource/:id/export (action)
        // Not: /export-statuses or /export-something (resource name)
        if (pathLower.match(/\/export$/i) || pathLower.match(/\/:[^/]+\/export$/i) || 
            pathLower.match(/\/medicines\/export$/i) || pathLower.match(/\/medicines\/actual-export$/i)) {
            return pathLower.includes('/actual-export') ? 'actual-export' : 'export';
        }
        if (pathLower.includes('/summary')) return 'read'; // summary is a read operation
        if (pathLower.includes('/import')) return 'import';
        if (pathLower.includes('/assign')) return 'assign';
        if (pathLower.includes('/revoke')) return 'revoke';
        if (pathLower.includes('/reload')) return 'reload';
        
        // Standard CRUD mapping
        switch (method) {
            case 'GET':
                // Check if path has ID parameter (read) or not (list)
                // Pattern: /resource/:id or /resource/:id/... → read
                // Pattern: /resource → list
                const hasIdParam = /\/:[^/]+/.test(path) || /\/([^/]+)$/.test(path) && !pathLower.includes('/list');
                return hasIdParam ? 'read' : 'list';
            
            case 'POST':
                return 'create';
            
            case 'PUT':
            case 'PATCH':
                return 'update';
            
            case 'DELETE':
                return 'delete';
            
            default:
                return 'read'; // Fallback
        }
    }
}
