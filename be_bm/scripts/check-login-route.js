const axios = require('axios');

const KONG_ADMIN_URL = 'http://localhost:8001';

async function checkLoginRoute() {
    try {
        console.log('🔍 Checking /api/auth/login route in Kong...\n');

        // 1. Find the route
        const routesResponse = await axios.get(`${KONG_ADMIN_URL}/routes`);
        const routes = routesResponse.data.data || [];

        const loginRoute = routes.find(r =>
            r.paths && r.paths.includes('/api/auth/login') &&
            r.methods && r.methods.includes('POST')
        );

        if (!loginRoute) {
            console.log('❌ Login route not found in Kong!');
            return;
        }

        console.log('✅ Found login route:');
        console.log(`   ID: ${loginRoute.id}`);
        console.log(`   Name: ${loginRoute.name}`);
        console.log(`   Paths: ${JSON.stringify(loginRoute.paths)}`);
        console.log(`   Methods: ${JSON.stringify(loginRoute.methods)}\n`);

        // 2. Check plugins on this route
        const pluginsResponse = await axios.get(`${KONG_ADMIN_URL}/routes/${loginRoute.id}/plugins`);
        const plugins = pluginsResponse.data.data || [];

        console.log(`📦 Plugins on this route: ${plugins.length}`);
        if (plugins.length > 0) {
            plugins.forEach(plugin => {
                console.log(`   - ${plugin.name} (${plugin.enabled ? 'enabled' : 'disabled'})`);
            });
        } else {
            console.log('   (No plugins)');
        }

        // 3. Check for global JWT plugin
        console.log('\n🌍 Checking for global JWT plugin...');
        const globalPluginsResponse = await axios.get(`${KONG_ADMIN_URL}/plugins`);
        const globalPlugins = globalPluginsResponse.data.data || [];

        const globalJwtPlugins = globalPlugins.filter(p =>
            p.name === 'jwt' && !p.route && !p.service
        );

        if (globalJwtPlugins.length > 0) {
            console.log('⚠️  Found global JWT plugin(s):');
            globalJwtPlugins.forEach(plugin => {
                console.log(`   - ID: ${plugin.id} (${plugin.enabled ? 'enabled' : 'disabled'})`);
            });
            console.log('\n💡 This might be blocking public endpoints!');
        } else {
            console.log('✅ No global JWT plugin found');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkLoginRoute();
