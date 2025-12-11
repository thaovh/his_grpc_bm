const axios = require('axios');

/**
 * CONFIGURATION
 * Edit these values before running
 */
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmN2FiYzg4Yi05ODIyLTRlZGMtYTJlMi1jZmZkMzhjZTFhZDIiLCJ1c2VybmFtZSI6InZodDIiLCJlbWFpbCI6InZodDJAYmFjaG1haS5lZHUudm4iLCJhY3NJZCI6NjQxOSwicm9sZXMiOlsiQURNSU4iXSwiZW1wbG95ZWVDb2RlIjoiMTg0NCIsImlzcyI6ImJtYWliZS1hdXRoLXNlcnZpY2UiLCJpYXQiOjE3NjgyMjQ2NzYsImV4cCI6MTc2ODIzMTg3Nn0.kZ65hargpPPgJg-Mvy_i6X5pyFd9LyeTxtQmQ_cI8ws';
const GATEWAY_URL = 'http://localhost:3000/api/gateway-config/endpoints';

const endpoints = [
    // --- AUTH ---
    { path: '/api/auth/login', method: 'POST', description: 'User login', module: 'Auth', isPublic: true },
    { path: '/api/auth/logout', method: 'POST', description: 'User logout', module: 'Auth', isPublic: false },
    { path: '/api/auth/refresh', method: 'POST', description: 'Refresh token', module: 'Auth', isPublic: false },
    { path: '/api/auth/me', method: 'GET', description: 'Get profile', module: 'Auth', isPublic: false },
    { path: '/api/auth/change-password', method: 'POST', description: 'Change password', module: 'Auth', isPublic: false },

    // --- USERS (Basic) ---
    { path: '/api/users', method: 'GET', description: 'List users', module: 'Users', isPublic: false, roleCodes: ['ADMIN'] },
    { path: '/api/users', method: 'POST', description: 'Create user', module: 'Users', isPublic: false, roleCodes: ['ADMIN'] },
    { path: '/api/users/:id', method: 'GET', description: 'Get user by ID', module: 'Users', isPublic: false, roleCodes: ['ADMIN'] },
    { path: '/api/users/:id', method: 'PUT', description: 'Update user', module: 'Users', isPublic: false, roleCodes: ['ADMIN'] },
    { path: '/api/users/:id', method: 'DELETE', description: 'Delete user', module: 'Users', isPublic: false, roleCodes: ['ADMIN'] },

    // --- USERS (Extended) ---
    { path: '/api/users/username/:username', method: 'GET', description: 'Get user by username', module: 'Users', isPublic: false, roleCodes: ['ADMIN'] },
    { path: '/api/users/email/:email', method: 'GET', description: 'Get user by email', module: 'Users', isPublic: false, roleCodes: ['ADMIN'] },
    { path: '/api/users/acs-id/:acsId', method: 'GET', description: 'Get user by ACS ID', module: 'Users', isPublic: false, roleCodes: ['ADMIN'] },
    { path: '/api/users/:id/profile', method: 'GET', description: 'Get user profile', module: 'Users', isPublic: false, roleCodes: ['ADMIN'] },
    { path: '/api/users/:id/profile', method: 'PUT', description: 'Update user profile', module: 'Users', isPublic: false, roleCodes: ['ADMIN'] },

    // --- USERS (Device Tokens / FCM) ---
    { path: '/api/users/device-tokens', method: 'POST', description: 'Save device token (FCM)', module: 'Users', isPublic: false },
    { path: '/api/users/device-tokens/:token', method: 'DELETE', description: 'Remove device token', module: 'Users', isPublic: false },
    { path: '/api/users/device-tokens', method: 'GET', description: 'Get device tokens by employee code', module: 'Users', isPublic: false },

    // --- ROLES (Basic) ---
    { path: '/api/roles', method: 'GET', description: 'List roles', module: 'Users', isPublic: false, roleCodes: ['ADMIN'] },
    { path: '/api/roles', method: 'POST', description: 'Create role', module: 'Users', isPublic: false, roleCodes: ['ADMIN'] },
    { path: '/api/roles/:id', method: 'GET', description: 'Get role by ID', module: 'Users', isPublic: false, roleCodes: ['ADMIN'] },
    { path: '/api/roles/:id', method: 'PUT', description: 'Update role', module: 'Users', isPublic: false, roleCodes: ['ADMIN'] },
    { path: '/api/roles/:id', method: 'DELETE', description: 'Delete role', module: 'Users', isPublic: false, roleCodes: ['ADMIN'] },

    // --- ROLES (Extended) ---
    { path: '/api/roles/code/:code', method: 'GET', description: 'Get role by code', module: 'Users', isPublic: false, roleCodes: ['ADMIN'] },
    { path: '/api/roles/assign', method: 'POST', description: 'Assign role to user', module: 'Users', isPublic: false, roleCodes: ['ADMIN'] },
    { path: '/api/roles/revoke', method: 'POST', description: 'Revoke role from user', module: 'Users', isPublic: false, roleCodes: ['ADMIN'] },
    { path: '/api/roles/user/:userId', method: 'GET', description: 'Get user roles', module: 'Users', isPublic: false, roleCodes: ['ADMIN'] },

    // --- MASTER DATA (CRUD) ---
    ...['unit-of-measures', 'export-statuses', 'branches', 'department-types', 'departments', 'machine-funding-sources', 'manufacturers'].flatMap(item => [
        { path: `/api/master-data/${item}`, method: 'GET', description: `List ${item}`, module: 'MasterData', isPublic: false },
        { path: `/api/master-data/${item}`, method: 'POST', description: `Create ${item}`, module: 'MasterData', isPublic: false, roleCodes: ['ADMIN'] },
        { path: `/api/master-data/${item}/:id`, method: 'PUT', description: `Update ${item}`, module: 'MasterData', isPublic: false, roleCodes: ['ADMIN'] },
        { path: `/api/master-data/${item}/:id`, method: 'DELETE', description: `Delete ${item}`, module: 'MasterData', isPublic: false, roleCodes: ['ADMIN'] }
    ]),

    // --- INTEGRATION (HIS) ---
    { path: '/api/integration/user-rooms', method: 'GET', description: 'HIS Rooms', module: 'Integration', isPublic: false },
    { path: '/api/integration/exp-mests', method: 'GET', description: 'HIS ExpMests', module: 'Integration', isPublic: false },
    { path: '/api/integration/exp-mests/inpatient', method: 'GET', description: 'HIS Inpatient', module: 'Integration', isPublic: false },

    // --- INVENTORY ---
    { path: '/api/inventory/exp-mests', method: 'GET', description: 'List local ExpMests', module: 'Inventory', isPublic: false },
    { path: '/api/inventory/inpatient-exp-mests/:expMestId/sync', method: 'POST', description: 'Sync Inpatient', module: 'Inventory', isPublic: false },
    { path: '/api/inventory/exp-mests-other/:expMestId/sync', method: 'POST', description: 'Sync Other', module: 'Inventory', isPublic: false },

    // --- ATTENDANCE ---
    { path: '/api/attendance', method: 'GET', description: 'List records', module: 'Attendance', isPublic: false },
    { path: '/api/attendance/me', method: 'GET', description: 'My attendance', module: 'Attendance', isPublic: false },

    // --- MACHINE ---
    { path: '/api/machines', method: 'GET', description: 'List machines', module: 'Machine', isPublic: false },
    { path: '/api/machines', method: 'POST', description: 'Add machine', module: 'Machine', isPublic: false, roleCodes: ['ADMIN'] },
    { path: '/api/machines/:id', method: 'PATCH', description: 'Update machine', module: 'Machine', isPublic: false, roleCodes: ['ADMIN'] },

    // --- EVENTS (SSE - Server-Sent Events) ---
    { path: '/api/events/stream', method: 'GET', description: 'Real-time event stream (SSE)', module: 'Events', isPublic: false },

    // --- UPLOAD ---
    { path: '/api/upload/image', method: 'POST', description: 'Upload machine photo', module: 'Upload', isPublic: false },

    // --- APP NAVIGATION ---
    { path: '/api/app/navigation', method: 'GET', description: 'App dynamic menu', module: 'Navigation', isPublic: false },
    { path: '/api/gateway-config/features', method: 'GET', description: 'List app features', module: 'GatewayConfig', isPublic: false, roleCodes: ['ADMIN'] },
    { path: '/api/gateway-config/features', method: 'POST', description: 'Create app feature', module: 'GatewayConfig', isPublic: false, roleCodes: ['ADMIN'] },
    { path: '/api/gateway-config/features/:id', method: 'PUT', description: 'Update app feature', module: 'GatewayConfig', isPublic: false, roleCodes: ['ADMIN'] },
    { path: '/api/gateway-config/features/:id', method: 'DELETE', description: 'Delete app feature', module: 'GatewayConfig', isPublic: false, roleCodes: ['ADMIN'] },

    // --- GATEWAY CONFIG ---
    { path: '/api/gateway-config/endpoints', method: 'GET', description: 'List configs', module: 'GatewayConfig', isPublic: false, roleCodes: ['ADMIN'] },
    { path: '/api/gateway-config/endpoints', method: 'POST', description: 'Add config', module: 'GatewayConfig', isPublic: false, roleCodes: ['ADMIN'] },
    { path: '/api/gateway-config/sync-all', method: 'POST', description: 'Reconcile Kong', module: 'GatewayConfig', isPublic: false, roleCodes: ['ADMIN'] }
];

async function syncEndpoints() {
    console.log(`🚀 Starting bulk sync of ${endpoints.length} endpoints...`);

    if (ADMIN_TOKEN === 'YOUR_ADMIN_JWT_TOKEN_HERE') {
        console.error('❌ Error: Please provide a valid ADMIN_TOKEN in the script.');
        return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const endpoint of endpoints) {
        try {
            await axios.post(GATEWAY_URL, endpoint, {
                headers: {
                    'Authorization': `Bearer ${ADMIN_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(`✅ [${endpoint.method}] ${endpoint.path} synced.`);
            successCount++;
        } catch (error) {
            console.error(`❌ [${endpoint.method}] ${endpoint.path} failed: ${error.response?.data?.message || error.message}`);
            failCount++;
        }
    }

    console.log('\n--- SYNC SUMMARY ---');
    console.log(`Total: ${endpoints.length}`);
    console.log(`Success: ${successCount}`);
    console.log(`Failed: ${failCount}`);
}

syncEndpoints();
