const axios = require('axios');

const KONG_ADMIN_URL = 'http://localhost:8001';
const KONG_SERVICE_ID = 'ed3bc365-3d49-4f0f-b557-776bf0a0fc84';

async function checkUsersRoute() {
    try {
        console.log('🔍 Searching for /api/users route in Kong...\n');

        // Get all routes for the service
        const response = await axios.get(`${KONG_ADMIN_URL}/services/${KONG_SERVICE_ID}/routes`);
        const routes = response.data.data || [];

        // Find the /api/users GET route
        const usersRoute = routes.find(r =>
            r.paths && r.paths.includes('/api/users') &&
            r.methods && r.methods.includes('GET')
        );

        if (!usersRoute) {
            console.log('❌ /api/users route not found in Kong!');
            return;
        }

        console.log('✅ Found /api/users route:');
        console.log(`   ID: ${usersRoute.id}`);
        console.log(`   Name: ${usersRoute.name}`);
        console.log(`   Paths: ${JSON.stringify(usersRoute.paths)}`);
        console.log(`   Methods: ${JSON.stringify(usersRoute.methods)}`);

        // Get plugins for this route
        console.log('\n📦 Checking plugins on this route...\n');
        const pluginsResponse = await axios.get(`${KONG_ADMIN_URL}/routes/${usersRoute.id}/plugins`);
        const plugins = pluginsResponse.data.data || [];

        if (plugins.length === 0) {
            console.log('❌ No plugins found on this route!');
            return;
        }

        console.log(`Found ${plugins.length} plugin(s):\n`);
        plugins.forEach(plugin => {
            console.log(`   Plugin: ${plugin.name}`);
            console.log(`   ID: ${plugin.id}`);
            console.log(`   Enabled: ${plugin.enabled}`);
            if (plugin.name === 'acl') {
                console.log(`   ACL Config: ${JSON.stringify(plugin.config, null, 2)}`);
            }
            console.log('');
        });

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

checkUsersRoute();
