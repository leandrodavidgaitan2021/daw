// src/modules/auth/services/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../../gestion/entities/usuario.entity';
import { EstadosUsuarios } from '../../gestion/enums/estados-usuarios.enum';
import { LoginResponseDto } from '../dtos/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, clave: string): Promise<LoginResponseDto> {
    const usuario = await this.usuarioRepo.findOne({ where: { email: email } });

    // Un solo mensaje para email inexistente o clave incorrecta,
    // así no se revela qué emails están registrados
    const claveValida = usuario
      ? await bcrypt.compare(clave, usuario.clave)
      : false;
    if (!usuario || !claveValida) {
      throw new UnauthorizedException('Credenciales inválidas.');
    }

    // Regla: solo los usuarios ACTIVOS pueden iniciar sesión
    if (usuario.estado !== EstadosUsuarios.ACTIVO) {
      throw new ForbiddenException('Su cuenta se encuentra dada de baja.');
    }

    // Datos que viajan dentro del token (el RolesGuard lee rol y estado)
    const payload = {
      id: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
      estado: usuario.estado,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: 'Inicio de sesión exitoso',
      accessToken,
      usuario: {
        id: usuario.id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        email: usuario.email,
        rol: usuario.rol,
      },
    };
  }
}
