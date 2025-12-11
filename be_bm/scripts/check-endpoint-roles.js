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

        console.log('🔍 Checking GW_API_ENDPOINT_ROLES table...\n');

        // Count total roles
        const countResult = await connection.execute(`
            SELECT COUNT(*) as TOTAL FROM GW_API_ENDPOINT_ROLES
        `);
        const totalRoles = countResult.rows[0][0];

        console.log(`📊 Total roles in table: ${totalRoles}\n`);

        if (totalRoles === 0) {
            console.log('❌ No roles found! Bulk sync may have failed.');
            return;
        }

        // Get sample roles
        const sampleResult = await connection.execute(`
            SELECT er.ENDPOINT_ID, er.ROLE_CODE, e.PATH, e.METHOD
            FROM GW_API_ENDPOINT_ROLES er
            JOIN GW_API_ENDPOINTS e ON er.ENDPOINT_ID = e.ID
            WHERE ROWNUM <= 10
            ORDER BY e.PATH
        `);

        console.log('✅ Sample endpoint roles:');
        console.log('─'.repeat(80));
        sampleResult.rows.forEach(row => {
            console.log(`${row[2].padEnd(40)} ${row[3].padEnd(8)} → ${row[1]}`);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

checkEndpointRoles();
