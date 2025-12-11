const axios = require('axios');

const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmN2FiYzg4Yi05ODIyLTRlZGMtYTJlMi1jZmZkMzhjZTFhZDIiLCJ1c2VybmFtZSI6InZodDIiLCJlbWFpbCI6InZodDJAYmFjaG1haS5lZHUudm4iLCJhY3NJZCI6NjQxOSwicm9sZXMiOlsiQURNSU4iXSwiZW1wbG95ZWVDb2RlIjoiMTg0NCIsImlzcyI6ImJtYWliZS1hdXRoLXNlcnZpY2UiLCJpYXQiOjE3NjgyMTQ1MDIsImV4cCI6MTc2ODIyMTcwMn0.j-G1zhLYWLhgWuOJEtk9Bf2eDo9fC1Q_zUkWkmo4U3M';

async function syncKongRoutes() {
    console.log('🔄 Syncing all Kong routes...\n');

    try {
        const response = await axios.post('http://localhost:3000/api/gateway-config/sync-all', {}, {
            headers: {
                'Authorization': `Bearer ${ADMIN_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ Kong sync completed successfully!\n');
        console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('❌ Error syncing Kong routes:', error.response?.data || error.message);
    }
}

syncKongRoutes();
