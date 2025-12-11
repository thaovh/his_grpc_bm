import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Resource } from '../common/decorators/resource.decorator';
import { UploadService } from './upload.service';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) { }

    @Post('image')
    @Resource('upload')
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Upload machine photo' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file', {
        limits: {
            fileSize: 10 * 1024 * 1024, // 10MB
        },
    }))
    @HttpCode(HttpStatus.OK)
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        return this.uploadService.uploadImage(file);
    }
}
