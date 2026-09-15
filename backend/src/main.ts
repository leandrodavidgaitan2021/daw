// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; // <-- Asegúrate de importar esto

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // (Opcional) Si usas un prefijo global, tenlo en cuenta
  // app.setGlobalPrefix('api/v1'); 

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Sistema de Gestión de Clínica')
    .setDescription('API backend para el TFI de desarrollo web')
    .setVersion('1.0')
    .addBearerAuth() // Esto agrega el botón del candado para el JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // <-- Esto es lo que expone Swagger en http://localhost:3000/api

  await app.listen(3000);
  console.log(`Aplicación corriendo en: ${await app.getUrl()}`);
  console.log(`Swagger disponible en: ${await app.getUrl()}/api`);
}
bootstrap();