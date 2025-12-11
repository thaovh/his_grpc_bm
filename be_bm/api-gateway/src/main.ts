import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger as PinoLogger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { DynamicRolesGuard } from './common/guards/dynamic-roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use Pino logger
  app.useLogger(app.get(PinoLogger));

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(
    app.get(TransformInterceptor),
    app.get(LoggingInterceptor),
  );

  // Global guards for dynamic authorization
  app.useGlobalGuards(app.get(DynamicRolesGuard));

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Microservices API')
    .setDescription('REST API Gateway for Microservices')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('users')
    .addTag('auth')
    .addTag('inventory')
    .addTag('master-data')
    .addTag('health')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  // Use Pino logger from LoggerModule
  const logger = app.get(PinoLogger);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
