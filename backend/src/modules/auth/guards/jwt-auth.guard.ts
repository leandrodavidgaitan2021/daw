// src/modules/auth/guards/jwt-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No se proporcionó el token de autenticación.');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Formato de token inválido (debe ser Bearer <token>).');
    }

    try {
      // Verificamos el token con la clave secreta
      const payload = await this.jwtService.verifyAsync(token);
      
      // Inyectamos el payload decodificado en el request (aquí viaja id, rol, estado, etc.)
      request.user = payload;
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado.');
    }

    return true;
  }
}