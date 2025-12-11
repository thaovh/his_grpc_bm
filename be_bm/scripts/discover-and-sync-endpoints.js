/**
 * Script to automatically discover all API endpoints from NestJS controllers
 * and sync them to the database (GW_API_ENDPOINTS table)
 * 
 * This script:
 * 1. Scans all controller files in api-gateway/src
 * 2. Extracts routes with @Resource() decorator
 * 3. Infers HTTP method, path, and resource name
 * 4. Syncs to database via API Gateway
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// CONFIGURATION
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmN2FiYzg4Yi05ODIyLTRlZGMtYTJlMi1jZmZkMzhjZTFhZDIiLCJ1c2VybmFtZSI6InZodDIiLCJlbWFpbCI6InZodDJAYmFjaG1haS5lZHUudm4iLCJhY3NJZCI6NjQxOSwicm9sZXMiOlsiQURNSU4iXSwiZW1wbG95ZWVDb2RlIjoiMTg0NCIsImlzcyI6ImJtYWliZS1hdXRoLXNlcnZpY2UiLCJpYXQiOjE3Njg3MzA3MjcsImV4cCI6MTc2ODc0MjcyN30.JOtWS8ZoUsx1AwtZ4ImTD1DtNdF2UuMMVLgOQ4nydwg';
const GATEWAY_URL = process.env.GATEWAY_URL || 'http://localhost:3000/api/gateway-config/endpoints';
const GATEWAY_BASE_URL = process.env.GATEWAY_BASE_URL || 'http://localhost:3000/api/gateway-config';
const GLOBAL_PREFIX = process.env.GLOBAL_PREFIX || 'api'; // From app.setGlobalPrefix('api')
const CONTROLLERS_DIR = path.join(__dirname, '../api-gateway/src');

/**
 * Extract route information from controller file content
 */
function extractRoutes(filePath, content) {
    const routes = [];
    const lines = content.split('\n');
    
    // Extract controller base path
    const controllerMatch = content.match(/@Controller\(['"]([^'"]+)['"]\)/);
    const basePath = controllerMatch ? controllerMatch[1] : '';
    
    // Extract class-level @Resource() decorator (if exists)
    // Look for @Resource() before @Controller() or right after class declaration
    let classLevelResource = null;
    const classResourceMatch = content.match(/@Resource\(['"]([^'"]+)['"]\)[\s\S]*?@Controller/);
    if (classResourceMatch) {
        classLevelResource = classResourceMatch[1];
    }
    
    // Use class-level resource as default if no method-level resource found
    let defaultResource = classLevelResource;
    
    let currentResource = null;
    let currentMethod = null;
    let currentPath = null;
    let isPublic = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check for @Public() decorator (can be on any line before the method)
        if (line.includes('@Public()')) {
            isPublic = true;
        }
        
        // Extract @Resource() decorator (method-level, overrides class-level)
        const resourceMatch = line.match(/@Resource\(['"]([^'"]+)['"]\)/);
        if (resourceMatch) {
            currentResource = resourceMatch[1];
            continue;
        }
        
        // Extract HTTP method decorators
        const methodMatch = line.match(/@(Get|Post|Put|Patch|Delete|Options|Head)\(['"]?([^'")]*)['"]?\)/);
        if (methodMatch) {
            // Check for @Public() decorator BEFORE HTTP method (already set in loop above)
            // Also check AFTER HTTP method decorator (some decorators are placed after)
            let endpointIsPublic = isPublic; // Current state from before
            
            // If we found a method but no resource yet, look backwards for @Resource()
            if (!currentResource) {
                // Look back up to 5 lines for @Resource()
                for (let j = Math.max(0, i - 5); j < i; j++) {
                    const resourceMatchBack = lines[j].match(/@Resource\(['"]([^'"]+)['"]\)/);
                    if (resourceMatchBack) {
                        currentResource = resourceMatchBack[1];
                        break;
                    }
                }
            }
            
            // If still no resource, look forward up to 5 lines for @Resource()
            // (Some decorators are placed after the HTTP method decorator)
            if (!currentResource) {
                for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
                    const resourceMatchForward = lines[j].match(/@Resource\(['"]([^'"]+)['"]\)/);
                    if (resourceMatchForward) {
                        currentResource = resourceMatchForward[1];
                        break;
                    }
                    // Stop if we hit another HTTP method decorator or method declaration
                    if (lines[j].match(/@(Get|Post|Put|Patch|Delete|Options|Head)\(/) || lines[j].match(/^\s*(async\s+)?\w+\s*\(/)) {
                        break;
                    }
                }
            }
            
            // Also check for @Public() AFTER HTTP method decorator
            if (!endpointIsPublic) {
                for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
                    if (lines[j].includes('@Public()')) {
                        endpointIsPublic = true;
                        break;
                    }
                    // Stop if we hit another HTTP method decorator or method declaration
                    if (lines[j].match(/@(Get|Post|Put|Patch|Delete|Options|Head)\(/) || lines[j].match(/^\s*(async\s+)?\w+\s*\(/)) {
                        break;
                    }
                }
            }
            
            // If still no resource, use class-level resource (if exists)
            if (!currentResource && defaultResource) {
                currentResource = defaultResource;
            }
            
            currentMethod = methodMatch[1].toUpperCase();
            currentPath = methodMatch[2] || '';
            
            // Build full path
            // In NestJS, route paths are always relative to controller base path
            // Even if they start with '/', they're not absolute from app root
            let fullPath = basePath;
            if (currentPath) {
                // Remove leading '/' if present (it's just a route separator, not absolute)
                const normalizedRoutePath = currentPath.startsWith('/') 
                    ? currentPath.substring(1) 
                    : currentPath;
                
                // Combine basePath with route path
                if (basePath) {
                    fullPath = basePath + (basePath.endsWith('/') ? '' : '/') + normalizedRoutePath;
                } else {
                    fullPath = normalizedRoutePath;
                }
            }
            
            // Normalize path: ensure it starts with / but not duplicate /api
            if (!fullPath.startsWith('/')) {
                fullPath = '/' + fullPath;
            }
            
            // Add global prefix if not present (check both /api and /api/v1 patterns)
            const prefixPattern = new RegExp(`^/${GLOBAL_PREFIX}(/|$)`);
            if (!prefixPattern.test(fullPath)) {
                fullPath = `/${GLOBAL_PREFIX}${fullPath.startsWith('/') ? '' : '/'}${fullPath}`;
            }
            
            // Only add route if we have a resource
            if (currentResource && currentMethod) {
                routes.push({
                    path: fullPath,
                    method: currentMethod,
                    resourceName: currentResource,
                    // Infer action from method and path
                    action: inferAction(currentMethod, currentPath, fullPath),
                    module: inferModule(basePath),
                    isPublic: endpointIsPublic, // Use the checked value
                    description: extractDescription(lines, i)
                });
            }
            
            // Reset for next route
            // Keep class-level resource for next method, but reset method-level resource
            currentMethod = null;
            currentPath = null;
            currentResource = null; // Reset method-level resource
            isPublic = false; // Reset for next endpoint
        }
    }
    
    return routes;
}

/**
 * Infer action from HTTP method and path
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {string} path - Route path (e.g., ':id', 'me', 'transfer-types/:id')
 * @param {string} fullPath - Full path including base (e.g., '/api/machines/:id/maintenance')
 */
function inferAction(method, path, fullPath) {
    // Check both path (route path) and fullPath (full URL path) for action keywords
    const pathToCheck = fullPath || path;
    
    // If path contains action keywords, use them (check in order of specificity)
    // Note: Check for actual actions, not resource names (e.g., /export-statuses is a resource, not /export action)
    if (pathToCheck.includes('/actual-export')) return 'actual-export';
    // Only infer 'export' if it's a standalone action, not part of a resource name
    // Pattern: /resource/export or /resource/:id/export (action)
    // Not: /export-statuses or /export-something (resource name)
    if (pathToCheck.match(/\/export$/i) || pathToCheck.match(/\/:[^/]+\/export$/i) || 
        pathToCheck.match(/\/medicines\/export$/i) || pathToCheck.match(/\/medicines\/actual-export$/i)) {
        return pathToCheck.includes('/actual-export') ? 'actual-export' : 'export';
    }
    if (pathToCheck.includes('/sync')) return 'sync';
    if (pathToCheck.includes('/reload')) return 'reload';
    if (pathToCheck.includes('/assign')) return 'assign';
    if (pathToCheck.includes('/revoke')) return 'revoke';
    if (pathToCheck.includes('/login')) return 'login';
    if (pathToCheck.includes('/logout')) return 'logout';
    if (pathToCheck.includes('/refresh')) return 'refresh';
    if (pathToCheck.includes('/change-password')) return 'change-password';
    if (pathToCheck.includes('/summary')) return 'read';
    if (pathToCheck.includes('/count')) return 'read';
    if (pathToCheck.includes('/me')) return 'read';
    
    // Standard CRUD actions
    if (method === 'GET') {
        // Check if path has parameter at the end (e.g., ':id', ':expMestId')
        // Pattern: ends with /:paramName or /:paramName/...
        const paramAtEndMatch = path.match(/\/:[\w-]+$/);
        const paramInMiddleMatch = path.match(/\/:[\w-]+\//);
        
        if (paramAtEndMatch) {
            // Path ends with param (e.g., '/:id') -> read
            return 'read';
        } else if (paramInMiddleMatch) {
            // Path has param in middle followed by sub-path (e.g., '/:id/maintenance')
            // Check if sub-path is a collection or action
            const subPath = path.split('/').pop();
            if (['maintenance', 'documents', 'transfers', 'medicines', 'details'].includes(subPath)) {
                // Sub-resource collection -> list
                return 'list';
            }
            // Other sub-paths -> read
            return 'read';
        } else if (path.includes('/:') || path.match(/\/\w+\/\w+/)) {
            // Has param somewhere or nested path -> read
            return 'read';
        }
        // No params -> list
        return 'list';
    }
    if (method === 'POST') return 'create';
    if (method === 'PUT' || method === 'PATCH') return 'update';
    if (method === 'DELETE') return 'delete';
    
    return null; // Let guard infer automatically
}

/**
 * Infer module name from base path
 */
function inferModule(basePath) {
    const moduleMap = {
        'auth': 'Auth',
        'users': 'Users',
        'roles': 'Users',
        'master-data': 'MasterData',
        'integration': 'Integration',
        'inventory': 'Inventory',
        'attendance': 'Attendance',
        'machines': 'Machine',
        'events': 'Events',
        'upload': 'Upload',
        'app/navigation': 'Navigation',
        'gateway-config': 'GatewayConfig'
    };
    
    for (const [key, value] of Object.entries(moduleMap)) {
        if (basePath.includes(key)) {
            return value;
        }
    }
    
    return 'Unknown';
}

/**
 * Extract description from ApiOperation decorator
 */
function extractDescription(lines, startIndex) {
    for (let i = startIndex; i < Math.min(startIndex + 10, lines.length); i++) {
        const match = lines[i].match(/@ApiOperation\([^}]*summary:\s*['"]([^'"]+)['"]/);
        if (match) {
            return match[1];
        }
    }
    return '';
}

/**
 * Find all controller files recursively
 */
function findControllers(dir) {
    const controllers = [];
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            controllers.push(...findControllers(filePath));
        } else if (file.endsWith('.controller.ts')) {
            controllers.push(filePath);
        }
    }
    
    return controllers;
}

/**
 * Get existing endpoints from database for comparison
 */
async function getExistingEndpoints() {
    try {
        const response = await axios.get(`${GATEWAY_BASE_URL}/endpoints`, {
            headers: {
                'Authorization': `Bearer ${ADMIN_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        // Response might be array or wrapped in data property
        const endpoints = Array.isArray(response.data) ? response.data : (response.data?.data || response.data?.endpoints || []);
        return endpoints.map(e => ({
            id: e.id,
            path: e.path,
            method: e.method,
            resourceName: e.resourceName || e.resource_name,
            action: e.action,
            description: e.description,
            module: e.module,
            isPublic: e.isPublic !== undefined ? e.isPublic : (e.is_public === 1 || e.is_public === true)
        }));
    } catch (error) {
        console.warn('⚠️  Could not fetch existing endpoints, will use POST only:', error.message);
        return [];
    }
}

/**
 * Find endpoint ID by path and method
 */
function findEndpointId(existingEndpoints, path, method) {
    const endpoint = existingEndpoints.find(e => e.path === path && e.method === method);
    return endpoint ? endpoint.id : null;
}

/**
 * Check if endpoint needs update
 */
function needsUpdate(existingEndpoint, newEndpoint) {
    if (!existingEndpoint) return false;
    
    return (
        existingEndpoint.resourceName !== newEndpoint.resourceName ||
        existingEndpoint.action !== newEndpoint.action ||
        existingEndpoint.description !== newEndpoint.description ||
        existingEndpoint.module !== newEndpoint.module ||
        existingEndpoint.isPublic !== newEndpoint.isPublic
    );
}

/**
 * Main function to discover and sync endpoints
 */
async function discoverAndSync() {
    console.log('🔍 Discovering endpoints from controllers...\n');
    console.log(`📌 Global prefix: /${GLOBAL_PREFIX}\n`);
    
    const controllerFiles = findControllers(CONTROLLERS_DIR);
    console.log(`Found ${controllerFiles.length} controller files\n`);
    
    const allRoutes = [];
    
    for (const filePath of controllerFiles) {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const routes = extractRoutes(filePath, content);
            
            if (routes.length > 0) {
                console.log(`📄 ${path.basename(filePath)}: ${routes.length} routes`);
                allRoutes.push(...routes);
            }
        } catch (error) {
            console.error(`❌ Error reading ${filePath}:`, error.message);
        }
    }
    
    console.log(`\n✅ Total discovered: ${allRoutes.length} endpoints\n`);
    
    if (ADMIN_TOKEN === 'YOUR_ADMIN_JWT_TOKEN_HERE') {
        console.error('❌ Error: Please set ADMIN_TOKEN environment variable or update the script.');
        console.log('\n📋 Discovered endpoints:');
        allRoutes.forEach((route, index) => {
            console.log(`${index + 1}. [${route.method}] ${route.path} -> ${route.resourceName}.${route.action || 'auto'}`);
        });
        return;
    }
    
    // Fetch existing endpoints for comparison
    console.log('📥 Fetching existing endpoints from database...\n');
    const existingEndpoints = await getExistingEndpoints();
    console.log(`Found ${existingEndpoints.length} existing endpoints\n`);
    
    console.log('🚀 Syncing endpoints to database...\n');
    
    let successCount = 0;
    let updateCount = 0;
    let createCount = 0;
    let failCount = 0;
    let skippedCount = 0;
    
    for (const route of allRoutes) {
        try {
            const payload = {
                path: route.path,
                method: route.method,
                description: route.description || `${route.method} ${route.path}`,
                module: route.module,
                isPublic: route.isPublic || false,
                resourceName: route.resourceName,
                action: route.action || null
            };
            
            // Check if endpoint exists
            const existingEndpoint = existingEndpoints.find(
                e => e.path === route.path && e.method === route.method
            );
            
            if (existingEndpoint) {
                // Endpoint exists - check if update needed
                if (needsUpdate(existingEndpoint, payload)) {
                    // Update endpoint using PUT
                    try {
                        await axios.put(`${GATEWAY_BASE_URL}/endpoints/${existingEndpoint.id}`, payload, {
                            headers: {
                                'Authorization': `Bearer ${ADMIN_TOKEN}`,
                                'Content-Type': 'application/json'
                            }
                        });
                        console.log(`🔄 [${route.method}] ${route.path} -> ${route.resourceName}.${route.action || 'auto'} (updated)`);
                        updateCount++;
                        successCount++;
                    } catch (updateError) {
                        console.error(`❌ [${route.method}] ${route.path} update failed: ${updateError.response?.data?.message || updateError.message}`);
                        failCount++;
                    }
                } else {
                    // No changes needed
                    console.log(`✓  [${route.method}] ${route.path} (no changes)`);
                    skippedCount++;
                }
            } else {
                // Create new endpoint
                // Note: Backend create() method already does UPSERT, but we handle explicitly for clarity
                await axios.post(GATEWAY_URL, payload, {
                    headers: {
                        'Authorization': `Bearer ${ADMIN_TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log(`✅ [${route.method}] ${route.path} -> ${route.resourceName}.${route.action || 'auto'} (created)`);
                createCount++;
                successCount++;
            }
        } catch (error) {
            if (error.response?.status === 409) {
                // Endpoint already exists (shouldn't happen with our check, but handle anyway)
                console.log(`⏭️  [${route.method}] ${route.path} (already exists)`);
                skippedCount++;
            } else if (error.response?.status === 400) {
                // Validation error - log details
                const errorMsg = error.response?.data?.message || JSON.stringify(error.response?.data);
                console.error(`⚠️  [${route.method}] ${route.path} validation error: ${errorMsg}`);
                failCount++;
            } else {
                console.error(`❌ [${route.method}] ${route.path} failed: ${error.response?.data?.message || error.message}`);
                failCount++;
            }
        }
    }
    
    console.log('\n--- SYNC SUMMARY ---');
    console.log(`Total discovered: ${allRoutes.length}`);
    console.log(`✅ Success: ${successCount} (${createCount} created, ${updateCount} updated)`);
    console.log(`⏭️  Skipped (no changes): ${skippedCount}`);
    console.log(`❌ Failed: ${failCount}`);
}

// Run the script
discoverAndSync().catch(console.error);
