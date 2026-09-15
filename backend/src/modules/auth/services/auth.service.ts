// src/modules/auth/services/auth.service.ts
import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../../gestion/entities/usuario.entity';
import { EstadosUsuarios } from '../../gestion/enums/estados-usuarios.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async login(correo: string, clave: string) {
    // Nota: Si tu entidad usa 'email' en vez de 'correo', cámbialo aquí en el 'where'
    const usuario = await this.usuarioRepo.findOne({ where: { email: correo } as any });
    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas (correo no encontrado).');
    }

    // Validamos que el usuario esté activo
    if (usuario.estado !== EstadosUsuarios.ACTIVO) {
      throw new ForbiddenException('Su cuenta se encuentra inactiva o dada de baja.');
    }

    // Comparamos la contraseña
    const esPasswordValida = await bcrypt.compare(clave, usuario.clave);
    if (!esPasswordValida) {
      throw new UnauthorizedException('Credenciales inválidas (contraseña incorrecta).');
    }

    // Payload del Token JWT
    const payload = {
      id: usuario.id,
      correo: usuario.email, // Ajusta si en tu entidad se llama email o correo
      rol: usuario.rol,
      estado: usuario.estado,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      message: 'Inicio de sesión exitoso',
      accessToken: token,
      usuario: {
        id: usuario.id,
        nombres: usuario.nombres,   // Corregido a plural según tu entidad
        apellidos: usuario.apellidos, // Corregido a plural según tu entidad
        correo: usuario.email,
        rol: usuario.rol,
      },
    };
  }
}