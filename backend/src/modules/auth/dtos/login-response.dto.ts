// src/modules/auth/dtos/login-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { RolesUsuarios } from '../../gestion/enums/roles-usuarios.enum';

export class LoginUsuarioDto {
  @ApiProperty({ example: 3 })
  id: number;

  @ApiProperty({ example: 'Juan' })
  nombres: string;

  @ApiProperty({ example: 'Gómez' })
  apellidos: string;

  @ApiProperty({ example: 'paciente@clinica.com' })
  correo: string;

  @ApiProperty({ enum: RolesUsuarios, example: RolesUsuarios.PACIENTE })
  rol: RolesUsuarios;
}

export class LoginResponseDto {
  @ApiProperty({ example: 'Inicio de sesión exitoso' })
  message: string;

  @ApiProperty({ description: 'Token JWT para enviar en el header Authorization: Bearer <token>' })
  accessToken: string;

  @ApiProperty({ type: () => LoginUsuarioDto })
  usuario: LoginUsuarioDto;
}