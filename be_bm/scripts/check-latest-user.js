const oracledb = require('oracledb');
require('dotenv').config();

async function checkLatestUser() {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECT_STRING
        });

        console.log('🔍 Checking latest created user...\n');

        // Get latest user
        const userResult = await connection.execute(`
            SELECT ID, USERNAME, EMAIL, CREATED_AT 
            FROM USR_USERS 
            ORDER BY CREATED_AT DESC 
            FETCH FIRST 5 ROWS ONLY
        `);

        console.log('📊 Latest 5 users:');
        console.log('─'.repeat(80));
        userResult.rows.forEach(row => {
            console.log(`${row[1].padEnd(20)} | ${row[2].padEnd(30)} | ${row[3]}`);
        });

        if (userResult.rows.length > 0) {
            const latestUserId = userResult.rows[0][0];
            const latestUsername = userResult.rows[0][1];

            console.log(`\n🔍 Checking roles for latest user: ${latestUsername} (${latestUserId})\n`);

            // Check user roles
            const roleResult = await connection.execute(`
                SELECT ur.ID, ur.USER_ID, ur.ROLE_ID, r.CODE, r.NAME
                FROM USR_USER_ROLES ur
                LEFT JOIN USR_ROLES r ON ur.ROLE_ID = r.ID
                WHERE ur.USER_ID = :userId
            `, { userId: latestUserId });

            if (roleResult.rows.length > 0) {
                console.log('✅ User has roles:');
                roleResult.rows.forEach(row => {
                    console.log(`  - ${row[3]}: ${row[4]}`);
                });
            } else {
                console.log('❌ User has NO roles assigned!');
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

checkLatestUser();
