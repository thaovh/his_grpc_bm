const oracledb = require('oracledb');
require('dotenv').config();

async function checkEndpointRoles() {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECT_STRING
        });

        console.log('🔍 Checking /api/users endpoint in database...\n');

        // Get endpoint ID
        const endpointResult = await connection.execute(`
            SELECT ID, PATH, METHOD, IS_PUBLIC
            FROM GW_API_ENDPOINTS
            WHERE PATH = '/api/users' AND METHOD = 'GET'
        `);

        if (endpointResult.rows.length === 0) {
            console.log('❌ Endpoint /api/users not found in database!');
            return;
        }

        const [endpointId, path, method, isPublic] = endpointResult.rows[0];
        console.log(`✅ Found endpoint:`);
        console.log(`   ID: ${endpointId}`);
        console.log(`   Path: ${path}`);
        console.log(`   Method: ${method}`);
        console.log(`   IS_PUBLIC: ${isPublic}\n`);

        // Get roles for this endpoint
        const rolesResult = await connection.execute(`
            SELECT ROLE_CODE
            FROM GW_API_ENDPOINT_ROLES
            WHERE ENDPOINT_ID = :endpointId
        `, [endpointId]);

        console.log(`📋 Roles for this endpoint: ${rolesResult.rows.length}`);

        if (rolesResult.rows.length === 0) {
            console.log('❌ NO ROLES FOUND! This is why ACL plugin is not attached.\n');
        } else {
            console.log('✅ Roles:');
            rolesResult.rows.forEach(row => {
                console.log(`   - ${row[0]}`);
            });
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

checkEndpointRoles();
