// src/modules/gestion/dtos/input/actualizar-estado-reserva.dto.ts
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EstadosReservas } from '../../enums/estados-reservas.enum';

export class ActualizarEstadoReservaDto {
  @ApiProperty({ enum: EstadosReservas, description: 'Nuevo estado del turno' })
  @IsEnum(EstadosReservas)
  @IsNotEmpty()
  estado: EstadosReservas;
}