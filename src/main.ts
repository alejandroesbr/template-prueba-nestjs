import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { ResponseInterceptor } from '@common/interceptors/response.interceptor';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');
  const corsOrigin = configService.get<string>('CORS_ORIGIN', '*');

  // 1. Security Headers & CORS
  app.use(helmet());
  app.enableCors({
    origin: corsOrigin === '*' ? true : corsOrigin.split(','),
    credentials: true,
  });

  // 2. Global API Route Prefix
  app.setGlobalPrefix(apiPrefix);

  // 3. Global Input Validation & Sanitization Pipe
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

  // 4. Global Standardized Exception Filter & Response Interceptor
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // 5. OpenAPI (Swagger) Interactive Documentation
  const swaggerEnabled =
    configService.get<string>('SWAGGER_ENABLED', 'true') === 'true';

  if (swaggerEnabled) {
    const swaggerTitle = configService.get<string>(
      'SWAGGER_TITLE',
      'Technical Assessment API',
    );
    const swaggerDescription = configService.get<string>(
      'SWAGGER_DESCRIPTION',
      'RESTful API built with NestJS using Package by Feature Architecture',
    );
    const swaggerVersion = configService.get<string>('SWAGGER_VERSION', '1.0.0');
    const swaggerPath = configService.get<string>('SWAGGER_PATH', 'docs');

    const swaggerConfig = new DocumentBuilder()
      .setTitle(swaggerTitle)
      .setDescription(swaggerDescription)
      .setVersion(swaggerVersion)
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your Bearer token (JWT / OAuth2 / Session Token)',
        },
        'bearer',
      )
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(swaggerPath, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'list',
        filter: true,
      },
    });

    logger.log(
      `Swagger documentation available at: http://localhost:${port}/${swaggerPath}`,
    );
  }

  await app.listen(port);
  logger.log(
    `Application is running on: http://localhost:${port}/${apiPrefix}`,
  );
}

void bootstrap();

