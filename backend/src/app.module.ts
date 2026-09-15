// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { GestionModule } from './modules/gestion/gestion.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Habilita las variables de entorno globalmente[cite: 1]
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // Cambiar a false en producción
    }),
    AuthModule,
    GestionModule,
  ],
})
export class AppModule {}