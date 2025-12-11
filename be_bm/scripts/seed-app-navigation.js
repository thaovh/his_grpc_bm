const axios = require('axios');

/**
 * CONFIGURATION
 * Provide the ADMIN token received from logical login
 */
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmN2FiYzg4Yi05ODIyLTRlZGMtYTJlMi1jZmZkMzhjZTFhZDIiLCJ1c2VybmFtZSI6InZodDIiLCJlbWFpbCI6InZodDJAYmFjaG1haS5lZHUudm4iLCJhY3NJZCI6NjQxOSwicm9sZXMiOlsiQURNSU4iXSwiZW1wbG95ZWVDb2RlIjoiMTg0NCIsImlzcyI6ImJtYWliZS1hdXRoLXNlcnZpY2UiLCJpYXQiOjE3NjgyMDE2NjgsImV4cCI6MTc2ODIwODg2OH0.vhuZJg5ijuj-sgndsWt4w_bVh222lxXHgrUO7eeRlzo';
const API_URL = 'http://localhost:3000/api/gateway-config/features';

const features = [
    // --- INVENTORY ---
    {
        code: 'MOD_INVENTORY',
        name: 'Quản lý kho',
        icon: 'archive-outline',
        order_index: 10,
        role_codes: ['ADMIN', 'USER']
    },
    {
        code: 'FEAT_EXP_MEST',
        name: 'Xuất thuốc HIS',
        icon: 'sync-outline',
        route: '/inventory/exp-mests',
        parent_code: 'MOD_INVENTORY',
        order_index: 1,
        role_codes: ['ADMIN', 'USER']
    },
    {
        code: 'FEAT_EXP_OTHER',
        name: 'Xuất thuốc khác',
        icon: 'medkit-outline',
        route: '/inventory/exp-other',
        parent_code: 'MOD_INVENTORY',
        order_index: 2,
        role_codes: ['ADMIN', 'USER']
    },

    // --- MACHINE ---
    {
        code: 'MOD_MACHINE',
        name: 'Quản lý máy',
        icon: 'hardware-chip-outline',
        order_index: 20,
        role_codes: ['ADMIN']
    },
    {
        code: 'FEAT_MACHINE_LIST',
        name: 'Danh sách máy',
        icon: 'list-outline',
        route: '/machine/list',
        parent_code: 'MOD_MACHINE',
        order_index: 1,
        role_codes: ['ADMIN']
    },

    // --- SYSTEM ADMIN ---
    {
        code: 'MOD_SYSTEM',
        name: 'Hệ thống',
        icon: 'settings-outline',
        order_index: 100,
        role_codes: ['ADMIN']
    },
    {
        code: 'FEAT_GW_CONFIG',
        name: 'Cấu hình API',
        icon: 'shield-checkmark-outline',
        route: '/admin/gateway',
        parent_code: 'MOD_SYSTEM',
        order_index: 1,
        role_codes: ['ADMIN']
    }
];

async function seed() {
    console.log('🌱 Seeding App Navigation Features...');
    const createdMap = new Map();

    for (const feat of features) {
        try {
            const payload = { ...feat };
            if (feat.parent_code) {
                payload.parent_id = createdMap.get(feat.parent_code);
            }

            const res = await axios.post(API_URL, payload, {
                headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
            });

            createdMap.set(feat.code, res.data.data.id);
            console.log(`✅ Created feature: ${feat.name} (${feat.code})`);
        } catch (error) {
            console.error(`❌ Failed to create ${feat.code}:`, error.response?.data || error.message);
        }
    }
    console.log('✨ Seeding completion.');
}

seed();
