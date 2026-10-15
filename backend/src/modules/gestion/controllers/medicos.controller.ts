// src/modules/gestion/controllers/medicos.controller.ts
import { Controller, Get, Patch, Body, Param, ParseIntPipe, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { MedicosService } from '../services/medicos.service';
import { UsuarioAutenticado } from '../services/reservas.service';
import { ActualizarEstadoReservaDto } from '../dtos/input/actualizar-estado-reserva.dto';
import { ModificarValorConsultaDto } from '../dtos/input/modificar-valor-consulta.dto';
import { FiltrarTurnosMedicoDto } from '../dtos/input/filtrar-turnos-medico.dto';
import { MedicoResponseDto } from '../dtos/output/medico-response.dto';
import { ReservaResponseDto } from '../dtos/output/reserva-response.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesUsuarios } from '../enums/roles-usuarios.enum';

@ApiTags('Médicos')
@Controller('medicos')
export class MedicosController {
  constructor(private readonly medicosService: MedicosService) {}

  // Público: se usa en el Home para mostrar los médicos
  @Get()
  @ApiOperation({ summary: 'Listar los médicos (ruta pública)' })
  @ApiOkResponse({ type: [MedicoResponseDto] })
  async listarMedicos() {
    return this.medicosService.listarTodos();
  }

  @Get('turnos')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesUsuarios.MEDICO)
  @ApiOperation({ summary: 'Ver los turnos reservados del médico para una fecha' })
  @ApiOkResponse({ type: [ReservaResponseDto] })
  async verTurnos(@Req() req: { user: UsuarioAutenticado }, @Query() queryDto: FiltrarTurnosMedicoDto) {
    return this.medicosService.listarTurnosMedico(req.user.id, queryDto.fecha);
  }

  @Patch('turnos/:id/estado')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesUsuarios.MEDICO)
  @ApiOperation({ summary: 'Marcar un turno propio como ATENDIDO o AUSENTE' })
  @ApiOkResponse({ type: ReservaResponseDto })
  async actualizarEstadoTurno(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: { user: UsuarioAutenticado },
    @Body() dto: ActualizarEstadoReservaDto,
  ) {
    return this.medicosService.actualizarEstadoReserva(id, req.user.id, dto);
  }

  @Patch(':id/valor-consulta')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RolesUsuarios.ADMINISTRADOR)
  @ApiOperation({ summary: 'Modificar el valor de la consulta de un médico (el id es el del médico)' })
  @ApiOkResponse({ type: MedicoResponseDto })
  async modificarValor(@Param('id', ParseIntPipe) id: number, @Body() dto: ModificarValorConsultaDto) {
    return this.medicosService.modificarValorConsulta(id, dto);
  }
}