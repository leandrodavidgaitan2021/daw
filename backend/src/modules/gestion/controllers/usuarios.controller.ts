// src/modules/gestion/controllers/usuarios.controller.ts
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { UsuariosService } from '../services/usuarios.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Usuarios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get('perfil')
  async obtenerPerfil(@Req() req) {
    return this.usuariosService.buscarPorId(req.user.id);
  }
}