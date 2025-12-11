const axios = require('axios');

const KONG_ADMIN_URL = 'http://localhost:8001';

async function syncLoginRoute() {
    try {
        console.log('🔄 Syncing /api/auth/login route directly via Kong Admin API...\n');

        // 1. Find the route
        const routesResponse = await axios.get(`${KONG_ADMIN_URL}/routes`);
        const routes = routesResponse.data.data || [];

        const loginRoute = routes.find(r =>
            r.paths && r.paths.includes('/api/auth/login') &&
            r.methods && r.methods.includes('POST')
        );

        if (!loginRoute) {
            console.log('❌ Login route not found!');
            return;
        }

        console.log(`✅ Found route: ${loginRoute.id}\n`);

        // 2. Get all plugins on this route
        const pluginsResponse = await axios.get(`${KONG_ADMIN_URL}/routes/${loginRoute.id}/plugins`);
        const plugins = pluginsResponse.data.data || [];

        console.log(`📦 Current plugins: ${plugins.length}`);

        // 3. Delete all plugins (especially JWT)
        for (const plugin of plugins) {
            await axios.delete(`${KONG_ADMIN_URL}/plugins/${plugin.id}`);
            console.log(`   ✅ Deleted plugin: ${plugin.name}`);
        }

        console.log('\n✅ Login route is now public (no JWT plugin)!');
        console.log('\n💡 Test with:');
        console.log('curl -X POST http://localhost:8000/api/auth/login \\');
        console.log('  -H "Content-Type: application/json" \\');
        console.log('  -d \'{"username":"vht2","password":"t123456","deviceId":"test"}\'');

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

syncLoginRoute();
