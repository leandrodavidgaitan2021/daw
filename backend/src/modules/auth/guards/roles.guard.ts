// src/modules/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROL_KEY } from '../decorators/roles.decorator';
import { RolesUsuarios } from '../../gestion/enums/roles-usuarios.enum';
import { EstadosUsuarios } from '../../gestion/enums/estados-usuarios.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtenemos los roles requeridos definidos en el decorador @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<RolesUsuarios[]>(ROL_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // Si la ruta no tiene @Roles, es pública o solo requiere estar logueado
    }

    const { user } = context.switchToHttp().getRequest();

    // Validamos que el usuario exista y esté activo (regla clave del enunciado: solo activos)
    if (!user || user.estado !== EstadosUsuarios.ACTIVO) {
      throw new ForbiddenException('Usuario inactivo o sin autorización.');
    }

    // Validamos si el rol del usuario está incluido en los roles permitidos
    const tienePermiso = requiredRoles.includes(user.rol);
    if (!tienePermiso) {
      throw new ForbiddenException('No cuenta con los permisos necesarios para realizar esta acción.');
    }

    return true;
  }
}