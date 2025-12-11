import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  env: process.env.NODE_ENV || 'development',
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
  apiVersion: process.env.API_VERSION || '1',
  defaultExportStatusId: process.env.DEFAULT_EXPORT_STATUS_ID || null,
  defaultNotSyncExportStatusId: process.env.DEFAULT_NOT_SYNC_EXPORT_STATUS_ID || null,
  defaultAllExportedWorkingStateId: process.env.DEFAULT_ALL_EXPORTED_WORKING_STATE_ID || null,
  otherExpMestTypeId: process.env.OTHER_EXP_MEST_TYPE_ID || '',
  s3: {
    endpoint: process.env.S3_ENDPOINT || 'http://192.168.7.189:3900',
    accessKeyId: process.env.S3_ACCESS_KEY || 'GK2b8a8371a150bd4f25f9530b',
    secretAccessKey: process.env.S3_SECRET_KEY || 'bcc2146e06b9385c296cd3086d9ee96df8bd59a9a0e840049335710f1784a3cb',
    region: process.env.S3_REGION || 'garage',
    bucket: process.env.S3_BUCKET || 'machine-info',
    publicUrl: process.env.MEDIA_PUBLIC_URL || '',
  }
}));

