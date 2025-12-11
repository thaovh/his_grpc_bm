const oracledb = require('oracledb');
require('dotenv').config();

async function checkLoginEndpoint() {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECT_STRING
        });

        console.log('🔍 Checking /api/auth/login in database...\n');

        const result = await connection.execute(`
            SELECT ID, PATH, METHOD, IS_PUBLIC, MODULE, DESCRIPTION
            FROM GW_API_ENDPOINTS
            WHERE PATH = '/api/auth/login' AND METHOD = 'POST'
        `);

        if (result.rows.length === 0) {
            console.log('❌ Endpoint not found in database!');
            return;
        }

        const row = result.rows[0];
        console.log('✅ Found endpoint in database:');
        console.log(`   ID: ${row[0]}`);
        console.log(`   Path: ${row[1]}`);
        console.log(`   Method: ${row[2]}`);
        console.log(`   IS_PUBLIC: ${row[3]} ${row[3] === 1 ? '✅' : '❌'}`);
        console.log(`   Module: ${row[4]}`);
        console.log(`   Description: ${row[5]}`);

        if (row[3] !== 1) {
            console.log('\n⚠️  IS_PUBLIC should be 1 but is:', row[3]);
            console.log('💡 Need to update database or re-run bulk-sync-endpoints.js');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

checkLoginEndpoint();
