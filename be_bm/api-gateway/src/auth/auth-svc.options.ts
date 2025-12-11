import { join } from 'path';
import { ClientOptions, Transport } from '@nestjs/microservices';

export const AuthServiceClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: `${process.env.AUTH_SVC_URL || 'localhost'}:${process.env.AUTH_SVC_PORT || '50052'}`,
    package: 'auth',
    protoPath: join(__dirname, '../_proto/auth.proto'),
    loader: {
      enums: String,
      objects: true,
      arrays: true,
    },
  },
};

