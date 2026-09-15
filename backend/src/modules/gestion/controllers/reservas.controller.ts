// src/modules/gestion/controllers/reservas.controller.ts
import { Controller, Get, Post, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ReservasService } from '../services/reservas.service';
import { CrearReservaDto } from '../dtos/input/crear-reserva.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesUsuarios } from '../enums/roles-usuarios.enum';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Reservas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reservas')
export class ReservasController {
  constructor(private readonly reservasService: ReservasService) {}

  @Post()
  @Roles(RolesUsuarios.PACIENTE, RolesUsuarios.ADMINISTRADOR)
  async crear(@Body() dto: CrearReservaDto, @Req() req) {
    return this.reservasService.crearReserva(dto, req.user);
  }

  @Get('paciente')
  @Roles(RolesUsuarios.PACIENTE)
  async listarMisTurnos(@Req() req) {
    return this.reservasService.listarTurnosPaciente(req.user.id);
  }

  @Get()
  @Roles(RolesUsuarios.ADMINISTRADOR)
  async listarTodas() {
    return this.reservasService.listarTodas();
  }

  @Patch(':id/cancelar')
  @Roles(RolesUsuarios.PACIENTE, RolesUsuarios.ADMINISTRADOR)
  async cancelar(@Param('id') id: number, @Req() req) {
    return this.reservasService.cancelarReserva(Number(id), req.user);
  }
}