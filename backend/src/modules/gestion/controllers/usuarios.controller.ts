// src/modules/gestion/controllers/usuarios.controller.ts
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { UsuariosService } from '../services/usuarios.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard'; // <-- Falta importar
import { Roles } from '../../auth/decorators/roles.decorator'; // <-- Falta importar
import { RolesUsuarios } from '../enums/roles-usuarios.enum'; // <-- Falta importar
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Usuarios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard) // <-- Asegúrate de incluir RolesGuard aquí también
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get('perfil')
  async obtenerPerfil(@Req() req) {
    return this.usuariosService.buscarPorId(req.user.id);
  }

  @Get()
  @Roles(RolesUsuarios.ADMINISTRADOR)
  async listarUsuarios() {
    return this.usuariosService.listarTodos();
  }
}