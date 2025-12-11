const axios = require('axios');

const KONG_ADMIN_URL = 'http://localhost:8001';
const KONG_SERVICE_ID = 'ed3bc365-3d49-4f0f-b557-776bf0a0fc84';

async function debugUsersRoute() {
    try {
        // 1. Get all routes
        const routesResponse = await axios.get(`${KONG_ADMIN_URL}/services/${KONG_SERVICE_ID}/routes`);
        const routes = routesResponse.data.data || [];

        // 2. Find /api/users GET route
        const usersRoute = routes.find(r =>
            r.paths && r.paths.includes('/api/users') &&
            r.methods && r.methods.includes('GET')
        );

        if (!usersRoute) {
            console.log('❌ /api/users route NOT FOUND in Kong!');
            return;
        }

        console.log('✅ Found /api/users route:');
        console.log(`   Route ID: ${usersRoute.id}`);
        console.log(`   Route Name: ${usersRoute.name}\n`);

        // 3. Get plugins for this route
        const pluginsResponse = await axios.get(`${KONG_ADMIN_URL}/routes/${usersRoute.id}/plugins`);
        const plugins = pluginsResponse.data.data || [];

        console.log(`📦 Plugins on this route: ${plugins.length}\n`);

        if (plugins.length === 0) {
            console.log('❌ NO PLUGINS! This is the problem.\n');
        }

        plugins.forEach(plugin => {
            console.log(`─── ${plugin.name.toUpperCase()} Plugin ───`);
            console.log(`ID: ${plugin.id}`);
            console.log(`Enabled: ${plugin.enabled}`);
            console.log(`Config:`);
            console.log(JSON.stringify(plugin.config, null, 2));
            console.log('');
        });

        // 4. Check if ACL plugin exists
        const aclPlugin = plugins.find(p => p.name === 'acl');
        if (!aclPlugin) {
            console.log('❌ ACL PLUGIN MISSING!');
            console.log('   This means endpoint.roles was empty or undefined during sync.\n');
        } else {
            console.log('✅ ACL plugin exists');
            if (aclPlugin.config.authenticated_groups_claim) {
                console.log(`✅ authenticated_groups_claim: ${aclPlugin.config.authenticated_groups_claim}`);
            } else {
                console.log('❌ authenticated_groups_claim NOT SET!');
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

debugUsersRoute();
