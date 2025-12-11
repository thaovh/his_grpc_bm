const oracledb = require('oracledb');
require('dotenv').config();

async function assignDefaultRoleToExistingUsers() {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECT_STRING
        });

        console.log('🔄 Assigning default USER role to existing users without roles...\n');

        // 1. Get USER role ID
        const roleResult = await connection.execute(`
            SELECT ID FROM USR_ROLES WHERE CODE = 'USER'
        `);

        if (roleResult.rows.length === 0) {
            console.log('❌ USER role not found! Please create it first.');
            return;
        }

        const userRoleId = roleResult.rows[0][0];
        console.log(`✅ Found USER role: ${userRoleId}\n`);

        // 2. Find users without any roles
        const usersWithoutRoles = await connection.execute(`
            SELECT u.ID, u.USERNAME
            FROM USR_USERS u
            WHERE u.IS_ACTIVE = 1
            AND NOT EXISTS (
                SELECT 1 FROM USR_USER_ROLES ur WHERE ur.USER_ID = u.ID
            )
        `);

        console.log(`📊 Found ${usersWithoutRoles.rows.length} users without roles:\n`);

        if (usersWithoutRoles.rows.length === 0) {
            console.log('✅ All users already have roles!');
            return;
        }

        // 3. Assign USER role to each user
        let successCount = 0;
        for (const row of usersWithoutRoles.rows) {
            const userId = row[0];
            const username = row[1];

            try {
                const { randomUUID } = require('crypto');
                const userRoleId_new = randomUUID();
                const now = new Date();

                await connection.execute(`
                    INSERT INTO USR_USER_ROLES (
                        ID, USER_ID, ROLE_ID, IS_ACTIVE, VERSION, 
                        CREATED_AT, UPDATED_AT, DELETED_AT, CREATED_BY, UPDATED_BY
                    ) VALUES (
                        :id, :userId, :roleId, 1, 1,
                        :createdAt, :updatedAt, NULL, NULL, NULL
                    )
                `, {
                    id: userRoleId_new,
                    userId: userId,
                    roleId: userRoleId,
                    createdAt: now,
                    updatedAt: now
                });

                console.log(`  ✅ ${username}`);
                successCount++;
            } catch (error) {
                console.log(`  ❌ ${username}: ${error.message}`);
            }
        }

        await connection.commit();
        console.log(`\n🎉 Successfully assigned USER role to ${successCount}/${usersWithoutRoles.rows.length} users!`);

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

assignDefaultRoleToExistingUsers();
