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
}));
