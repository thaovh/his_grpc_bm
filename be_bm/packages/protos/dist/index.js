"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROTO_ROOT_DIR = exports.PROTO_LOADER_OPTIONS = exports.PROTO_PATH = void 0;
const path_1 = __importDefault(require("path"));
exports.PROTO_PATH = {
    // Auth
    auth: path_1.default.join(__dirname, 'auth/auth.proto'),
    // Users
    users: path_1.default.join(__dirname, 'users/users.proto'),
    // Master Data
    masterData: path_1.default.join(__dirname, 'master-data/master-data.proto'),
    // Integration
    integration: path_1.default.join(__dirname, 'integration/integration.proto'),
    // Common (shared)
    commons: path_1.default.join(__dirname, 'common/commons.proto'),
    // Machine
    machine: path_1.default.join(__dirname, 'machine/machine.proto'),
    // Attendance
    attendance: path_1.default.join(__dirname, 'attendance/attendance.proto'),
    // Gateway Config
    gatewayConfig: path_1.default.join(__dirname, 'gateway-config/gateway-config.proto'),
    // Inventory
    inventory: {
        main: path_1.default.join(__dirname, 'inventory/inventory.proto'),
        inpatient: path_1.default.join(__dirname, 'inventory/inpatient.proto'),
        other: path_1.default.join(__dirname, 'inventory/other.proto'),
        expMest: path_1.default.join(__dirname, 'inventory/exp-mest.proto'),
        expMestCabinet: path_1.default.join(__dirname, 'inventory/exp-mest-cabinet.proto'),
        summary: path_1.default.join(__dirname, 'inventory/summary.proto'),
    },
};
// Proto loader config
exports.PROTO_LOADER_OPTIONS = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
};
// Root directory for includeDirs
exports.PROTO_ROOT_DIR = __dirname;
