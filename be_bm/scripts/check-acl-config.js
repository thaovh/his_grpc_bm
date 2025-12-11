const axios = require('axios');

const KONG_ADMIN_URL = 'http://localhost:8001';

async function checkAclConfig() {
    try {
        console.log('🔍 Checking ACL plugin configuration...\n');

        // Get all plugins
        const response = await axios.get(`${KONG_ADMIN_URL}/plugins`);
        const plugins = response.data.data || [];

        // Find ACL plugins
        const aclPlugins = plugins.filter(p => p.name === 'acl');

        console.log(`Found ${aclPlugins.length} ACL plugin(s)\n`);

        for (const plugin of aclPlugins) {
            console.log('─'.repeat(80));
            console.log(`Plugin ID: ${plugin.id}`);
            console.log(`Route ID: ${plugin.route ? plugin.route.id : 'N/A'}`);
            console.log(`Enabled: ${plugin.enabled}`);
            console.log(`\nConfig:`);
            console.log(JSON.stringify(plugin.config, null, 2));
            console.log('');

            // Get route info
            if (plugin.route) {
                const routeResponse = await axios.get(`${KONG_ADMIN_URL}/routes/${plugin.route.id}`);
                const route = routeResponse.data;
                console.log(`Route: ${route.methods} ${route.paths}`);
            }
            console.log('');
        }

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

checkAclConfig();
