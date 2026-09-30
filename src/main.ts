import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger as NestLogger } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EnvService } from './env/services/env';
import { SafeValidationPipe } from './shared/infrastructure/nest/pipes/safe-validation.pipe';
import { parseCorsOrigins } from './shared/infrastructure/utils/cors';

async function bootstrap() {
  // `bufferLogs` retiene lo que Nest escribe durante el arranque hasta que
  // `useLogger` esta puesto; sin esto esas lineas saldrian con el logger por
  // defecto y se perderia el formato.
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  const env = app.get(EnvService);
  const swaggerEnabled = env.NODE_ENV !== 'production' || env.SWAGGER_ENABLED;

  app.useGlobalPipes(
    new SafeValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableCors({
    origin: parseCorsOrigins(env.CORS_ORIGINS || env.FRONTEND_URL),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    // `x-request-id` va emparejado con el `genReqId` de Pino: permite que el
    // frontend mande su propio id de correlacion y seguirlo en los dos logs.
    allowedHeaders: ['Authorization', 'Content-Type', 'x-request-id'],
    // La autenticacion va por `Authorization: Bearer`, no por cookies.
    credentials: false,
    maxAge: 86400,
  });

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
    .addTag('Health', 'Estado del servicio')
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

  const logger = new NestLogger('Bootstrap');
  logger.log(`Server running on http://localhost:${env.PORT}`);
  if (swaggerEnabled) {
    logger.log(`Swagger documentation at http://localhost:${env.PORT}/api`);
  }
}
void bootstrap();
