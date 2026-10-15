// src/modules/gestion/controllers/reservas.controller.ts
import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { ReservasService, UsuarioAutenticado } from '../services/reservas.service';
import { CrearReservaDto } from '../dtos/input/crear-reserva.dto';
import { ReservaResponseDto } from '../dtos/output/reserva-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesUsuarios } from '../enums/roles-usuarios.enum';

@ApiTags('Reservas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Post()
  @Roles(RolesUsuarios.PACIENTE, RolesUsuarios.ADMINISTRADOR)
  @ApiOperation({ summary: 'Reservar un turno (el paciente a su nombre; el administrador indica el paciente)' })
  @ApiCreatedResponse({ type: ReservaResponseDto })
  @ApiResponse({ status: 400, description: 'Horario fuera de atención, ocupado, fuera de los 30 días o paciente inválido.' })
  @ApiResponse({ status: 404, description: 'Médico no encontrado.' })
  async crear(@Body() dto: CrearReservaDto, @Req() req: { user: UsuarioAutenticado }) {
    return this.reservasService.crearReserva(dto, req.user);
  }

  @Get('paciente')
  @Roles(RolesUsuarios.PACIENTE)
  @ApiOperation({ summary: 'Listar los turnos reservados del paciente autenticado' })
  @ApiOkResponse({ type: [ReservaResponseDto] })
  async listarMisTurnos(@Req() req: { user: UsuarioAutenticado }) {
    return this.reservasService.listarTurnosPaciente(req.user.id);
  }

  @Get()
  @Roles(RolesUsuarios.ADMINISTRADOR)
  @ApiOperation({ summary: 'Listar todos los turnos reservados' })
  @ApiOkResponse({ type: [ReservaResponseDto] })
  async listarTodas() {
    return this.reservasService.listarTodas();
  }

  @Patch(':id/cancelar')
  @Roles(RolesUsuarios.PACIENTE, RolesUsuarios.ADMINISTRADOR)
  @ApiOperation({ summary: 'Cancelar un turno (paciente hasta el día anterior; administrador hasta el inicio)' })
  @ApiOkResponse({ type: ReservaResponseDto })
  @ApiResponse({ status: 400, description: 'El turno no está ACTIVO o ya pasó el plazo para cancelar.' })
  @ApiResponse({ status: 403, description: 'Un paciente no puede cancelar turnos ajenos.' })
  @ApiResponse({ status: 404, description: 'Reserva no encontrada.' })
  async cancelar(@Param('id', ParseIntPipe) id: number, @Req() req: { user: UsuarioAutenticado }) {
    return this.reservasService.cancelarReserva(id, req.user);
  }
}