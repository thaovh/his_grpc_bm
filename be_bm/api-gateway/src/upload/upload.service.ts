import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { PinoLogger } from 'nestjs-pino';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class UploadService {
    private s3Client: S3Client;
    private bucket: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly logger: PinoLogger,
    ) {
        this.logger.setContext(UploadService.name);
        const s3Config = this.configService.get('app.s3');
        this.s3Client = new S3Client({
            endpoint: s3Config.endpoint,
            credentials: {
                accessKeyId: s3Config.accessKeyId,
                secretAccessKey: s3Config.secretAccessKey,
            },
            region: s3Config.region,
            forcePathStyle: true, // Required for Minio
        });
        this.bucket = s3Config.bucket;
    }

    async uploadImage(file: Express.Multer.File): Promise<{ url: string; fileName: string }> {
        const fileExtension = path.extname(file.originalname);
        const fileName = `${uuidv4()}${fileExtension}`;

        const startTime = Date.now();
        this.logger.info(`Starting S3 upload for ${fileName} (${file.size} bytes)`);

        try {
            const parallelUploads3 = new Upload({
                client: this.s3Client,
                params: {
                    Bucket: this.bucket,
                    Key: `machines/${fileName}`,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                },
            });

            await parallelUploads3.done();
            const duration = Date.now() - startTime;
            this.logger.info(`S3 upload finished for ${fileName} in ${duration}ms`);

            const s3Config = this.configService.get('app.s3');
            const publicUrl = s3Config.publicUrl;
            const url = publicUrl
                ? `${publicUrl.replace(/\/$/, '')}/machines/${fileName}`
                : `${s3Config.endpoint}/${this.bucket}/machines/${fileName}`;

            return {
                url,
                fileName,
            };
        } catch (error) {
            const duration = Date.now() - startTime;
            this.logger.error(`Error uploading to S3 for ${fileName} after ${duration}ms`, error);
            throw new Error('Failed to upload image');
        }
    }
}
