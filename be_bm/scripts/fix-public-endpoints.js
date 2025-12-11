const oracledb = require('oracledb');
require('dotenv').config();

async function fixPublicEndpoints() {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECT_STRING
        });

        console.log('🔧 Fixing IS_PUBLIC for public endpoints...\n');

        // List of public endpoints
        const publicEndpoints = [
            { path: '/api/auth/login', method: 'POST' },
            { path: '/api/auth/logout', method: 'POST' },
            { path: '/api/auth/refresh', method: 'POST' },
        ];

        let updatedCount = 0;

        for (const endpoint of publicEndpoints) {
            const result = await connection.execute(`
                UPDATE GW_API_ENDPOINTS
                SET IS_PUBLIC = 1, UPDATED_AT = SYSDATE
                WHERE PATH = :path AND METHOD = :method
            `, {
                path: endpoint.path,
                method: endpoint.method
            });

            if (result.rowsAffected > 0) {
                console.log(`✅ Updated: ${endpoint.method} ${endpoint.path}`);
                updatedCount++;
            } else {
                console.log(`⚠️  Not found: ${endpoint.method} ${endpoint.path}`);
            }
        }

        await connection.commit();
        console.log(`\n✅ Updated ${updatedCount} endpoints`);
        console.log('\n💡 Now run: node scripts/sync-kong-routes.js');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (connection) {
            await connection.rollback();
        }
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

fixPublicEndpoints();
