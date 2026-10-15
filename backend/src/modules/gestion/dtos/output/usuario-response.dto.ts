// src/modules/gestion/dtos/output/usuario-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { EstadosUsuarios } from '../../enums/estados-usuarios.enum';
import { RolesUsuarios } from '../../enums/roles-usuarios.enum';

export class UsuarioResponseDto {
  @ApiProperty({ example: 1, description: 'ID del usuario' })
  id: number;

  @ApiProperty({ example: '33333333', description: 'Documento de identidad' })
  documento: string;

  @ApiProperty({ example: 'Gómez', description: 'Apellido(s)' })
  apellidos: string;

  @ApiProperty({ example: 'Juan', description: 'Nombre(s)' })
  nombres: string;

  @ApiProperty({ example: 'paciente@clinica.com', description: 'Correo electrónico' })
  email: string;

  @ApiProperty({ enum: EstadosUsuarios, example: EstadosUsuarios.ACTIVO })
  estado: EstadosUsuarios;

  @ApiProperty({ enum: RolesUsuarios, example: RolesUsuarios.PACIENTE })
  rol: RolesUsuarios;
}