// src/modules/gestion/controllers/usuarios.controller.ts
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { UsuariosService } from '../services/usuarios.service';
import { UsuarioAutenticado } from '../services/reservas.service';
import { UsuarioResponseDto } from '../dtos/output/usuario-response.dto';
import { RolesUsuarios } from '../enums/roles-usuarios.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags('Usuarios')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // Sin @Roles: cualquier usuario autenticado puede ver su propio perfil
  @Get('perfil')
  @ApiOperation({ summary: 'Ver los datos del usuario autenticado' })
  @ApiOkResponse({ type: UsuarioResponseDto })
  async obtenerPerfil(@Req() req: { user: UsuarioAutenticado }) {
    return this.usuariosService.buscarPorId(req.user.id);
  }

  @Get('pacientes')
  @Roles(RolesUsuarios.ADMINISTRADOR)
  @ApiOperation({ summary: 'Listar los pacientes activos (para reservar a su nombre)' })
  @ApiOkResponse({ type: [UsuarioResponseDto] })
  async listarPacientes() {
    return this.usuariosService.listarPacientes();
  }
}