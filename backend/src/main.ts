// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Todas las rutas de la API empiezan con /api
  app.setGlobalPrefix('api');

  // Valida los DTOs de entrada y rechaza campos que no estén declarados
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Documentación Swagger en /docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Sistema de Gestión de Clínica')
    .setDescription('API backend del Trabajo Final Integrador de Desarrollo de Aplicaciones Web')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = config.get<number>('PORT', 3000);
  await app.listen(port, '127.0.0.1');
  console.log(`API corriendo en: ${await app.getUrl()}/api`);
  console.log(`Swagger disponible en: ${await app.getUrl()}/docs`);
}
bootstrap();