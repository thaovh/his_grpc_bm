const axios = require('axios');

async function testDefaultRoleAssignment() {
    try {
        console.log('🧪 Testing default role assignment...\n');

        // 1. Login as admin to get token
        console.log('1️⃣ Logging in as admin...');
        const loginRes = await axios.post('http://localhost:3000/api/auth/login', {
            username: 'vht2',
            password: 't123456',
            deviceId: 'test-device'
        });
        const adminToken = loginRes.data.data.accessToken;
        console.log('✅ Admin login successful\n');

        // 2. Create a new test user via API Gateway
        const testUsername = `testuser_${Date.now()}`;
        console.log(`2️⃣ Creating new user: ${testUsername}...`);

        const createUserRes = await axios.post('http://localhost:3000/api/users', {
            username: testUsername,
            email: `${testUsername}@test.com`,
            password: 'test123456',
            firstName: 'Test',
            lastName: 'User'
        }, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });

        const newUser = createUserRes.data.data;
        console.log(`✅ User created: ${newUser.id}\n`);

        // 3. Check if user has roles
        console.log('3️⃣ Fetching user details with roles...');
        const userDetailsRes = await axios.get(`http://localhost:3000/api/users/${newUser.id}`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const userWithRoles = userDetailsRes.data.data;

        console.log('\n📊 User Details:');
        console.log('─'.repeat(50));
        console.log(`Username: ${userWithRoles.username}`);
        console.log(`Email: ${userWithRoles.email}`);
        console.log(`User Roles:`, userWithRoles.userRoles);

        if (userWithRoles.userRoles && userWithRoles.userRoles.length > 0) {
            console.log('\n✅ SUCCESS! User has roles:');
            userWithRoles.userRoles.forEach(ur => {
                console.log(`  - ${ur.role?.code || ur.roleId}: ${ur.role?.name || 'N/A'}`);
            });

            // Check if USER role is assigned
            const hasUserRole = userWithRoles.userRoles.some(ur => ur.role?.code === 'USER');
            if (hasUserRole) {
                console.log('\n🎉 DEFAULT ROLE ASSIGNMENT WORKING! User has USER role.');
            } else {
                console.log('\n⚠️  User has roles, but USER role is missing.');
            }
        } else {
            console.log('\n❌ FAILED! User has NO roles assigned.');
        }

    } catch (error) {
        console.error('\n❌ Error:', error.response?.data || error.message);
        if (error.response?.data) {
            console.error('Details:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

testDefaultRoleAssignment();
