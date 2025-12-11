/**
 * Script to compare endpoints in DB vs discovered from code
 * Helps identify endpoints that are:
 * 1. In DB but not in code (manually created or deleted from code)
 * 2. In code but not in DB (need to sync)
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// CONFIGURATION
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmN2FiYzg4Yi05ODIyLTRlZGMtYTJlMi1jZmZkMzhjZTFhZDIiLCJ1c2VybmFtZSI6InZodDIiLCJlbWFpbCI6InZodDJAYmFjaG1haS5lZHUudm4iLCJhY3NJZCI6NjQxOSwicm9sZXMiOlsiQURNSU4iXSwiZW1wbG95ZWVDb2RlIjoiMTg0NCIsImlzcyI6ImJtYWliZS1hdXRoLXNlcnZpY2UiLCJpYXQiOjE3Njg3MzA3MjcsImV4cCI6MTc2ODc0MjcyN30.JOtWS8ZoUsx1AwtZ4ImTD1DtNdF2UuMMVLgOQ4nydwg';
const GATEWAY_BASE_URL = process.env.GATEWAY_BASE_URL || 'http://localhost:3000/api/gateway-config';

// Import the extractRoutes function from discover-and-sync-endpoints.js
const CONTROLLERS_DIR = path.join(__dirname, '../api-gateway/src');

/**
 * Extract route information from controller file content
 * (Simplified version from discover-and-sync-endpoints.js)
 */
function extractRoutes(filePath, content) {
    const routes = [];
    const lines = content.split('\n');
    
    const controllerMatch = content.match(/@Controller\(['"]([^'"]+)['"]\)/);
    const basePath = controllerMatch ? controllerMatch[1] : '';
    
    let classLevelResource = null;
    const classResourceMatch = content.match(/@Resource\(['"]([^'"]+)['"]\)[\s\S]*?@Controller/);
    if (classResourceMatch) {
        classLevelResource = classResourceMatch[1];
    }
    
    let defaultResource = classLevelResource;
    let currentResource = null;
    let currentMethod = null;
    let currentPath = null;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        const resourceMatch = line.match(/@Resource\(['"]([^'"]+)['"]\)/);
        if (resourceMatch) {
            currentResource = resourceMatch[1];
            continue;
        }
        
        const methodMatch = line.match(/@(Get|Post|Put|Patch|Delete|Options|Head)\(['"]?([^'")]*)['"]?\)/);
        if (methodMatch) {
            if (!currentResource) {
                for (let j = Math.max(0, i - 5); j < i; j++) {
                    const resourceMatchBack = lines[j].match(/@Resource\(['"]([^'"]+)['"]\)/);
                    if (resourceMatchBack) {
                        currentResource = resourceMatchBack[1];
                        break;
                    }
                }
            }
            
            if (!currentResource && defaultResource) {
                currentResource = defaultResource;
            }
            
            currentMethod = methodMatch[1].toUpperCase();
            currentPath = methodMatch[2] || '';
            
            let fullPath = basePath;
            if (currentPath) {
                if (currentPath.startsWith('/')) {
                    fullPath = currentPath;
                } else {
                    fullPath = basePath + (basePath.endsWith('/') ? '' : '/') + currentPath;
                }
            }
            
            if (!fullPath.startsWith('/')) {
                fullPath = '/' + fullPath;
            }
            
            const prefixPattern = /^\/api(\/|$)/;
            if (!prefixPattern.test(fullPath)) {
                fullPath = `/api${fullPath.startsWith('/') ? '' : '/'}${fullPath}`;
            }
            
            if (currentResource && currentMethod) {
                routes.push({
                    path: fullPath,
                    method: currentMethod,
                    resourceName: currentResource
                });
            }
            
            currentMethod = null;
            currentPath = null;
            currentResource = null;
        }
    }
    
    return routes;
}

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

async function compareEndpoints() {
    console.log('🔍 Discovering endpoints from code...\n');
    
    const controllerFiles = findControllers(CONTROLLERS_DIR);
    const allRoutes = [];
    
    for (const filePath of controllerFiles) {
        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const routes = extractRoutes(filePath, content);
            allRoutes.push(...routes);
        } catch (error) {
            console.error(`❌ Error reading ${filePath}:`, error.message);
        }
    }
    
    console.log(`✅ Found ${allRoutes.length} endpoints in code\n`);
    
    console.log('📥 Fetching endpoints from database...\n');
    
    let dbEndpoints = [];
    try {
        const response = await axios.get(`${GATEWAY_BASE_URL}/endpoints`, {
            headers: {
                'Authorization': `Bearer ${ADMIN_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        const endpoints = Array.isArray(response.data) ? response.data : (response.data?.data || response.data?.endpoints || []);
        dbEndpoints = endpoints.map(e => ({
            id: e.id,
            path: e.path,
            method: e.method,
            resourceName: e.resourceName || e.resource_name,
            module: e.module
        }));
        console.log(`✅ Found ${dbEndpoints.length} endpoints in DB\n`);
    } catch (error) {
        console.error(`❌ Error fetching DB endpoints:`, error.message);
        return;
    }
    
    // Create sets for comparison
    const codeSet = new Set(allRoutes.map(r => `${r.method}:${r.path}`));
    const dbSet = new Set(dbEndpoints.map(e => `${e.method}:${e.path}`));
    
    // Find endpoints in DB but not in code
    const inDbNotInCode = dbEndpoints.filter(e => !codeSet.has(`${e.method}:${e.path}`));
    
    // Find endpoints in code but not in DB
    const inCodeNotInDb = allRoutes.filter(r => !dbSet.has(`${r.method}:${r.path}`));
    
    console.log('\n--- COMPARISON RESULTS ---\n');
    console.log(`📊 Total in code: ${allRoutes.length}`);
    console.log(`📊 Total in DB: ${dbEndpoints.length}`);
    console.log(`📊 Difference: ${dbEndpoints.length - allRoutes.length}\n`);
    
    if (inDbNotInCode.length > 0) {
        console.log(`⚠️  Endpoints in DB but NOT in code (${inDbNotInCode.length}):`);
        inDbNotInCode.forEach(e => {
            console.log(`   [${e.method}] ${e.path} (${e.resourceName || 'NO RESOURCE'}) - Module: ${e.module}`);
        });
        console.log('');
    }
    
    if (inCodeNotInDb.length > 0) {
        console.log(`⚠️  Endpoints in code but NOT in DB (${inCodeNotInDb.length}):`);
        inCodeNotInDb.forEach(r => {
            console.log(`   [${r.method}] ${r.path} (${r.resourceName})`);
        });
        console.log('');
    }
    
    if (inDbNotInCode.length === 0 && inCodeNotInDb.length === 0) {
        console.log('✅ All endpoints match!\n');
    }
    
    // Group by module
    console.log('\n--- BY MODULE ---\n');
    const dbByModule = {};
    dbEndpoints.forEach(e => {
        if (!dbByModule[e.module]) {
            dbByModule[e.module] = [];
        }
        dbByModule[e.module].push(e);
    });
    
    const codeByModule = {};
    allRoutes.forEach(r => {
        const module = r.path.split('/')[2] || 'unknown';
        if (!codeByModule[module]) {
            codeByModule[module] = [];
        }
        codeByModule[module].push(r);
    });
    
    Object.keys(dbByModule).sort().forEach(module => {
        const dbCount = dbByModule[module].length;
        const codeCount = codeByModule[module]?.length || 0;
        const diff = dbCount - codeCount;
        const status = diff === 0 ? '✅' : diff > 0 ? '⚠️ ' : '❌';
        console.log(`${status} ${module}: DB=${dbCount}, Code=${codeCount}, Diff=${diff}`);
    });
}

compareEndpoints().catch(console.error);
