const axios = require('axios');

const KONG_ADMIN_URL = 'http://localhost:8001';
const KONG_SERVICE_ID = 'ed3bc365-3d49-4f0f-b557-776bf0a0fc84';
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmN2FiYzg4Yi05ODIyLTRlZGMtYTJlMi1jZmZkMzhjZTFhZDIiLCJ1c2VybmFtZSI6InZodDIiLCJlbWFpbCI6InZodDJAYmFjaG1haS5lZHUudm4iLCJhY3NJZCI6NjQxOSwicm9sZXMiOlsiQURNSU4iXSwiZW1wbG95ZWVDb2RlIjoiMTg0NCIsImlzcyI6ImJtYWliZS1hdXRoLXNlcnZpY2UiLCJpYXQiOjE3NjgyMjc4NjcsImV4cCI6MTc2ODIzNTA2N30.mvPaAgcF41eL39WzC0odhwT-8o8wj-uve-Ihhwft-ng';

async function deleteAllKongRoutes() {
    console.log('🗑️  Deleting all Kong routes...\n');

    try {
        // 1. Get all routes for the service
        const response = await axios.get(`${KONG_ADMIN_URL}/services/${KONG_SERVICE_ID}/routes`);
        const routes = response.data.data || [];

        console.log(`Found ${routes.length} routes in Kong\n`);

        if (routes.length === 0) {
            console.log('✅ No routes to delete');
            // Do not return, proceed to sync
        }

        // 2. Delete each route
        let deletedCount = 0;
        let failedCount = 0;

        for (const route of routes) {
            try {
                await axios.delete(`${KONG_ADMIN_URL}/routes/${route.id}`);
                console.log(`✅ Deleted: ${route.name} (${route.id})`);
                deletedCount++;
            } catch (error) {
                console.error(`❌ Failed to delete ${route.name}:`, error.message);
                failedCount++;
            }
        }

        console.log(`\n📊 Summary:`);
        console.log(`   Total: ${routes.length}`);
        console.log(`   Deleted: ${deletedCount}`);
        console.log(`   Failed: ${failedCount}`);

        // 3. Sync all routes from database
        console.log('\n🔄 Syncing routes from database...\n');

        const syncResponse = await axios.post('http://localhost:3000/api/gateway-config/sync-all', {}, {
            headers: {
                'Authorization': `Bearer ${ADMIN_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ Sync completed!');
        console.log(`   Synced: ${syncResponse.data.data.synced_count}/${syncResponse.data.data.synced_count + syncResponse.data.data.failed_count}`);


    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

deleteAllKongRoutes();
