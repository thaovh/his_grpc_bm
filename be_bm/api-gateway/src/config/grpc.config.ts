import { registerAs } from '@nestjs/config';

export default registerAs('grpc', () => ({
  users: {
    url: process.env.USERS_SVC_URL || 'localhost',
    port: process.env.USERS_SVC_PORT || '50051',
  },
  auth: {
    url: process.env.AUTH_SVC_URL || 'localhost',
    port: process.env.AUTH_SVC_PORT || '50052',
  },
  inventory: {
    url: process.env.INVENTORY_SVC_URL || 'localhost',
    port: process.env.INVENTORY_SVC_PORT || '50054',
  },
  masterData: {
    url: process.env.MASTER_DATA_SVC_URL || 'localhost',
    port: process.env.MASTER_DATA_SVC_PORT || '50055',
  },
  integration: {
    url: process.env.INTEGRATION_SVC_URL || 'localhost',
    port: process.env.INTEGRATION_SVC_PORT || '50053',
  },
  machine: {
    url: process.env.MACHINE_SVC_URL || 'localhost',
    port: process.env.MACHINE_SVC_PORT || '50056',
  },
  gatewayConfig: {
    url: process.env.GATEWAY_CONFIG_SVC_URL || 'localhost',
    port: process.env.GATEWAY_CONFIG_SVC_PORT || '50058',
  },
}));
