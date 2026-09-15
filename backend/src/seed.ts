// src/seed.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './modules/gestion/entities/usuario.entity';
import { Medico } from './modules/gestion/entities/medico.entity';
import { RolesUsuarios } from './modules/gestion/enums/roles-usuarios.enum';
import { EstadosUsuarios } from './modules/gestion/enums/estados-usuarios.enum';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usuarioRepo = app.get<Repository<Usuario>>(getRepositoryToken(Usuario));
  const medicoRepo = app.get<Repository<Medico>>(getRepositoryToken(Medico));

  const passwordHash = await bcrypt.hash('123456', 10);

  // 1. Crear usuario Administrador
  let admin = await usuarioRepo.findOne({ where: { email: 'admin@clinica.com' } as any });
  if (!admin) {
    admin = usuarioRepo.create({
      documento: '11111111',
      email: 'admin@clinica.com',
      clave: passwordHash,
      nombres: 'Administrador',
      apellidos: 'General',
      rol: RolesUsuarios.ADMINISTRADOR,
      estado: EstadosUsuarios.ACTIVO,
    });
    await usuarioRepo.save(admin);
    console.log('Usuario Administrador creado.');
  }

  // 2. Crear usuario Médico y su perfil de Médico
  let userMedico = await usuarioRepo.findOne({ where: { email: 'medico@clinica.com' } as any });
  if (!userMedico) {
    userMedico = usuarioRepo.create({
      documento: '22222222',
      email: 'medico@clinica.com',
      clave: passwordHash,
      nombres: 'Carlos',
      apellidos: 'Pérez',
      rol: RolesUsuarios.MEDICO,
      estado: EstadosUsuarios.ACTIVO,
    });
    await usuarioRepo.save(userMedico);
    console.log('Usuario Médico creado.');
  }

  // Verificar si ya existe el registro en la tabla 'medicos'
  const medicoExistente = await medicoRepo.findOne({ where: { usuario: { id: userMedico.id } } });
  if (!medicoExistente) {
    const nuevoMedico = medicoRepo.create({
      matricula: 'MP-98765',
      valorConsulta: 15000.00, // Ajusta el valor inicial según tus reglas
      usuario: userMedico,
    });
    await medicoRepo.save(nuevoMedico);
    console.log('Perfil de Médico (matrícula y valor de consulta) vinculado correctamente.');
  }

  // 3. Crear usuario Paciente
  let paciente = await usuarioRepo.findOne({ where: { email: 'paciente@clinica.com' } as any });
  if (!paciente) {
    paciente = usuarioRepo.create({
      documento: '33333333',
      email: 'paciente@clinica.com',
      clave: passwordHash,
      nombres: 'Juan',
      apellidos: 'Gómez',
      rol: RolesUsuarios.PACIENTE,
      estado: EstadosUsuarios.ACTIVO,
    });
    await usuarioRepo.save(paciente);
    console.log('Usuario Paciente creado.');
  }

  await app.close();
  console.log('¡Seed completado con éxito!');
}
bootstrap();