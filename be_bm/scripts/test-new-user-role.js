const axios = require('axios');

async function testNewUserDefaultRole() {
    try {
        console.log('🧪 Testing default role assignment for NEW user...\n');

        // 1. Login as admin
        console.log('1️⃣ Logging in as admin...');
        const loginRes = await axios.post('http://localhost:3000/api/auth/login', {
            username: 'vht2',
            password: 't123456',
            deviceId: 'test-device'
        });
        const adminToken = loginRes.data.data.accessToken;
        console.log('✅ Admin login successful\n');

        // 2. Create a brand new user
        const testUsername = `newuser_${Date.now()}`;
        console.log(`2️⃣ Creating brand new user: ${testUsername}...`);

        const createUserRes = await axios.post('http://localhost:3000/api/users', {
            username: testUsername,
            email: `${testUsername}@test.com`,
            password: 'test123456',
            firstName: 'New',
            lastName: 'User'
        }, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });

        const newUser = createUserRes.data.data;
        console.log(`✅ User created: ${newUser.id}\n`);

        // 3. Get user details with roles
        console.log('3️⃣ Fetching user details...');
        const userDetailsRes = await axios.get(`http://localhost:3000/api/users/${newUser.id}`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const userWithRoles = userDetailsRes.data.data;

        console.log('\n📊 User Details:');
        console.log('─'.repeat(50));
        console.log(`Username: ${userWithRoles.username}`);
        console.log(`Roles:`, userWithRoles.roles);

        if (userWithRoles.roles && userWithRoles.roles.length > 0) {
            console.log('\n🎉 SUCCESS! Default role assignment is working!');
            console.log('User automatically has roles:');
            userWithRoles.roles.forEach(role => {
                console.log(`  - ${role.code}: ${role.name}`);
            });
        } else {
            console.log('\n❌ FAILED! User has NO roles.');
            console.log('Default role assignment is NOT working.');
        }

    } catch (error) {
        console.error('\n❌ Error:', error.response?.data || error.message);
        if (error.response?.data) {
            console.error('Details:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

testNewUserDefaultRole();
