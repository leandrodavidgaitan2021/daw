// src/modules/gestion/dtos/output/usuario-response.dto.ts
import { Expose } from 'class-transformer';
import { EstadosUsuarios } from '../../enums/estados-usuarios.enum';
import { RolesUsuarios } from '../../enums/roles-usuarios.enum';

export class UsuarioResponseDto {
  @Expose()
  id: number;

  @Expose()
  documento: string;

  @Expose()
  apellidos: string;

  @Expose()
  nombres: string;

  @Expose()
  email: string;

  @Expose()
  estado: EstadosUsuarios;

  @Expose()
  rol: RolesUsuarios;
}