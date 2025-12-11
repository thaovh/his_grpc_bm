const oracledb = require('oracledb');
require('dotenv').config();

async function updateNavigationHierarchy() {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECT_STRING
        });

        console.log('🔄 Updating navigation hierarchy...\n');

        // 1. Update features thuộc MOD_INVENTORY
        await connection.execute(`
            UPDATE APP_FEATURES 
            SET PARENT_ID = (SELECT ID FROM APP_FEATURES WHERE CODE = 'MOD_INVENTORY')
            WHERE CODE IN ('FEAT_EXP_MEST', 'FEAT_EXP_OTHER')
        `);
        console.log('✅ Updated features under MOD_INVENTORY');

        // 2. Update features thuộc MOD_MACHINE
        await connection.execute(`
            UPDATE APP_FEATURES 
            SET PARENT_ID = (SELECT ID FROM APP_FEATURES WHERE CODE = 'MOD_MACHINE')
            WHERE CODE IN ('FEAT_MACHINE_LIST')
        `);
        console.log('✅ Updated features under MOD_MACHINE');

        // 3. Update features thuộc MOD_SYSTEM
        await connection.execute(`
            UPDATE APP_FEATURES 
            SET PARENT_ID = (SELECT ID FROM APP_FEATURES WHERE CODE = 'MOD_SYSTEM')
            WHERE CODE IN ('FEAT_GW_CONFIG')
        `);
        console.log('✅ Updated features under MOD_SYSTEM');

        // Commit
        await connection.commit();
        console.log('\n✅ Changes committed!\n');

        // Verify kết quả
        const result = await connection.execute(`
            SELECT 
                f.CODE,
                f.NAME,
                p.CODE as PARENT_CODE
            FROM APP_FEATURES f
            LEFT JOIN APP_FEATURES p ON f.PARENT_ID = p.ID
            ORDER BY f.ORDER_INDEX
        `);

        console.log('📊 Current hierarchy:');
        console.log('─'.repeat(70));
        result.rows.forEach(row => {
            const code = row[0];
            const name = row[1];
            const parentCode = row[2] || 'ROOT';
            const indent = parentCode === 'ROOT' ? '' : '  ├─ ';
            console.log(`${indent}${code.padEnd(20)} | ${name.padEnd(25)} | Parent: ${parentCode}`);
        });

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

updateNavigationHierarchy();
