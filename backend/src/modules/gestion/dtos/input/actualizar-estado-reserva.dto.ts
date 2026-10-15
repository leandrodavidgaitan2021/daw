// src/modules/gestion/dtos/input/actualizar-estado-reserva.dto.ts
import { IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EstadosReservas } from '../../enums/estados-reservas.enum';

const ESTADOS_PERMITIDOS = [EstadosReservas.ATENDIDO, EstadosReservas.AUSENTE];

export class ActualizarEstadoReservaDto {
  @ApiProperty({ enum: ESTADOS_PERMITIDOS, example: EstadosReservas.ATENDIDO, description: 'Resultado del turno' })
  @IsIn(ESTADOS_PERMITIDOS, { message: 'El estado debe ser ATENDIDO o AUSENTE' })
  estado: EstadosReservas;
}