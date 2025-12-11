const axios = require('axios');

async function testUserRoles() {
    try {
        console.log('🧪 Testing user roles after migration...\n');

        // Login with user 33246
        console.log('1️⃣ Logging in with user 33246...');
        const loginRes = await axios.post('http://localhost:3000/api/auth/login', {
            username: '33246',
            password: 't123456',
            deviceId: 'test-device'
        });

        const user = loginRes.data.data.user;
        const roles = user.roles || [];

        console.log('\n📊 User Details:');
        console.log('─'.repeat(50));
        console.log(`Username: ${user.username}`);
        console.log(`Email: ${user.email}`);
        console.log(`Roles: ${JSON.stringify(roles)}`);

        if (roles.length > 0) {
            console.log('\n✅ SUCCESS! User has roles:');
            roles.forEach(role => {
                console.log(`  - ${role}`);
            });
        } else {
            console.log('\n❌ FAILED! User still has NO roles.');
        }

        // Also check navigation
        console.log('\n2️⃣ Checking navigation menu...');
        const navRes = await axios.get('http://localhost:3000/api/app/navigation', {
            headers: { Authorization: `Bearer ${loginRes.data.data.accessToken}` }
        });

        const menuItems = navRes.data.data || [];
        console.log(`\n📋 Navigation menu has ${menuItems.length} items`);

        if (menuItems.length > 0) {
            console.log('✅ Navigation menu is working!');
        } else {
            console.log('⚠️  Navigation menu is empty (might be due to role-based filtering)');
        }

    } catch (error) {
        console.error('\n❌ Error:', error.response?.data || error.message);
    }
}

testUserRoles();
