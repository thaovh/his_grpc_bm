import path from 'path';

export const PROTO_PATH = {
    // Auth
    auth: path.join(__dirname, 'auth/auth.proto'),

    // Users
    users: path.join(__dirname, 'users/users.proto'),

    // Master Data
    masterData: path.join(__dirname, 'master-data/master-data.proto'),

    // Integration
    integration: path.join(__dirname, 'integration/integration.proto'),

    // Common (shared)
    commons: path.join(__dirname, 'common/commons.proto'),

    // Machine
    machine: path.join(__dirname, 'machine/machine.proto'),

    // Attendance
    attendance: path.join(__dirname, 'attendance/attendance.proto'),

    // Gateway Config
    gatewayConfig: path.join(__dirname, 'gateway-config/gateway-config.proto'),

    // Inventory
    inventory: {
        main: path.join(__dirname, 'inventory/inventory.proto'),
        inpatient: path.join(__dirname, 'inventory/inpatient.proto'),
        other: path.join(__dirname, 'inventory/other.proto'),
        expMest: path.join(__dirname, 'inventory/exp-mest.proto'),
        expMestCabinet: path.join(__dirname, 'inventory/exp-mest-cabinet.proto'),
        summary: path.join(__dirname, 'inventory/summary.proto'),
    },
} as const;

// Proto loader config
export const PROTO_LOADER_OPTIONS = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};

// Root directory for includeDirs
export const PROTO_ROOT_DIR = __dirname;
