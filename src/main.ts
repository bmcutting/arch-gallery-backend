import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableCors('*');

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
    .addTag('Users', 'Operaciones de usuarios')
    .addTag('Auth', 'Operaciones de autenticación')
    .addTag('Projects', 'Operaciones de pryectos')
    .addTag('Categories', 'Operaciones de categorías')
    .addTag('Comments', 'Operaciones de comentarios')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  console.log(
    `🚀 Server running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `📚 Swagger documentation: http://localhost:${process.env.PORT ?? 3000}/api`,
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
