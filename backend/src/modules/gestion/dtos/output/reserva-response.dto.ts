// src/modules/gestion/dtos/output/reserva-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { EstadosReservas } from '../../enums/estados-reservas.enum';
import { UsuarioResponseDto } from './usuario-response.dto';
import { MedicoResponseDto } from './medico-response.dto';

export class ReservaResponseDto {
  @ApiProperty({ example: 1, description: 'ID de la reserva' })
  id: number;

  @ApiProperty({ example: '2026-10-28T13:00:00.000Z', description: 'Fecha y hora del turno' })
  fechaHora: Date;

  @ApiProperty({ enum: EstadosReservas, example: EstadosReservas.ACTIVO })
  estado: EstadosReservas;

  @ApiProperty({ example: 15000, description: 'Valor de la consulta congelado al reservar' })
  valorConsulta: number;

  @ApiProperty({ type: () => UsuarioResponseDto, description: 'Paciente que reservó el turno' })
  paciente: UsuarioResponseDto;

  @ApiProperty({ type: () => MedicoResponseDto, description: 'Médico que atiende el turno' })
  medico: MedicoResponseDto;
}