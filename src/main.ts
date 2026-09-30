import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EnvService } from './env/services/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const env = app.get(EnvService);
  const swaggerEnabled = env.NODE_ENV !== 'production' || env.SWAGGER_ENABLED;

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // La allowlist con parseCorsOrigins llega en la Fase 2b.
  const corsOrigins = (env.CORS_ORIGINS || env.FRONTEND_URL)
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({ origin: corsOrigins, credentials: true });

  const config = new DocumentBuilder()
    .setTitle('ArchGallery Backend API')
    .setDescription('ArchGallery API')
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
    .addTag('Auth', 'Operaciones de autenticación')
    .addTag('Categories', 'Operaciones de categorías')
    .addTag('Comments', 'Operaciones de comentarios')
    .addTag('Experiences', 'Operaciones de experiencias de usuarios')
    .addTag('Likes', 'Operaciones de likes')
    .addTag('Projects', 'Operaciones de pryectos')
    .addTag('Skills', 'Operaciones de habilidades de usuarios')
    .addTag('Users', 'Operaciones de usuarios')
    .build();

  if (swaggerEnabled) {
    SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, config), {
      jsonDocumentUrl: 'api/json',
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
    });
  }

  await app.listen(env.PORT);

  const logger = new Logger('Bootstrap');
  logger.log(`Server running on http://localhost:${env.PORT}`);
  if (swaggerEnabled) {
    logger.log(`Swagger documentation at http://localhost:${env.PORT}/api`);
  }
}
void bootstrap();
