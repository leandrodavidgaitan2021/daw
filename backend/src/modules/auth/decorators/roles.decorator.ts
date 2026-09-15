// src/modules/auth/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { RolesUsuarios } from '../../gestion/enums/roles-usuarios.enum'; // Asegúrate de que la ruta sea correcta

export const ROL_KEY = 'rol';
export const Roles = (...roles: RolesUsuarios[]) => SetMetadata(ROL_KEY, roles);