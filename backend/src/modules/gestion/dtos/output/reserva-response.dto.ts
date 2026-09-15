// src/modules/gestion/dtos/output/reserva-response.dto.ts
import { Expose, Type } from 'class-transformer';
import { EstadosReservas } from '../../enums/estados-reservas.enum';
import { UsuarioResponseDto } from './usuario-response.dto';

export class ReservaResponseDto {
  @Expose()
  id: number;

  @Expose()
  fechaHora: Date;

  @Expose()
  estado: EstadosReservas;

  @Expose()
  valorConsulta: number;

  @Expose()
  @Type(() => UsuarioResponseDto)
  paciente: UsuarioResponseDto;

  // Puedes agregar también la estructura del médico si lo necesitas
}