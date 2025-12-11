const axios = require('axios');
const fs = require('fs');

async function loginAndGetToken() {
    try {
        console.log('🔐 Logging in to get new token...\n');

        const response = await axios.post('http://localhost:3000/api/auth/login', {
            username: 'vht2',
            password: 't123456',
            deviceId: 'test-device'
        });

        const token = response.data.data.accessToken;

        // Save to file
        fs.writeFileSync('admin-token.txt', token);

        console.log('✅ Login successful!\n');
        console.log('📋 Token saved to: admin-token.txt\n');
        console.log('💡 Next steps:');
        console.log('   1. Copy token from admin-token.txt');
        console.log('   2. Update line 7 in bulk-sync-endpoints.js');
        console.log('   3. Run: node scripts/bulk-sync-endpoints.js');

    } catch (error) {
        console.error('❌ Login failed:', error.response?.data || error.message);
    }
}

loginAndGetToken();
