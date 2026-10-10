// src/modules/gestion/controllers/medicos.controller.ts
import { Controller, Get, Patch, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { MedicosService } from '../services/medicos.service';
import { ActualizarEstadoReservaDto } from '../dtos/input/actualizar-estado-reserva.dto';
import { ModificarValorConsultaDto } from '../dtos/input/modificar-valor-consulta.dto';
import { FiltrarTurnosMedicoDto } from '../dtos/input/filtrar-turnos-medico.dto'; // <-- Importar el DTO
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesUsuarios } from '../enums/roles-usuarios.enum';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Médicos')
@Controller('medicos')
export class MedicosController {
  constructor(private readonly medicosService: MedicosService) {}

  // Este endpoint ahora es PÚBLICO para que se vea en el Home
  @Get()
  async listarMedicos() {
    return this.medicosService.listarTodos();
  }

  @Get('turnos')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesUsuarios.MEDICO)
  async verTurnos(@Req() req, @Query() queryDto: FiltrarTurnosMedicoDto) {
    return this.medicosService.listarTurnosMedico(req.user.id, queryDto.fecha);
  }

  @Patch('turnos/:id/estado')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesUsuarios.MEDICO)
  async actualizarEstadoTurno(@Param('id') id: number, @Req() req, @Body() dto: ActualizarEstadoReservaDto) {
    return this.medicosService.actualizarEstadoReserva(Number(id), req.user.id, dto);
  }

  @Patch(':id/valor-consulta')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesUsuarios.ADMINISTRADOR)
  async modificarValor(@Param('id') id: number, @Body() dto: ModificarValorConsultaDto) {
    return this.medicosService.modificarValorConsulta(Number(id), dto);
  }
}