// src/modules/gestion/gestion.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entidades
import { Usuario } from './entities/usuario.entity';
import { Medico } from './entities/medico.entity';
import { Reserva } from './entities/reserva.entity';

// Controladores
import { UsuariosController } from './controllers/usuarios.controller';
import { MedicosController } from './controllers/medicos.controller';
import { ReservasController } from './controllers/reservas.controller';

// Servicios
import { UsuariosService } from './services/usuarios.service';
import { MedicosService } from './services/medicos.service';
import { ReservasService } from './services/reservas.service';

// 1. Importa el AuthModule para que los Guards tengan acceso al JwtService
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    // Registramos las entidades para que TypeORM cree o gestione las tablas en PostgreSQL
    TypeOrmModule.forFeature([Usuario, Medico, Reserva]),
    AuthModule, 
  ],
  controllers: [
    UsuariosController,
    MedicosController,
    ReservasController,
  ],
  providers: [
    UsuariosService,
    MedicosService,
    ReservasService,
  ],
  exports: [
    // Los exportamos por si el módulo de Autenticación u otros necesitan consultarlos
    UsuariosService,
    MedicosService,
    ReservasService,
  ],
})
export class GestionModule {}