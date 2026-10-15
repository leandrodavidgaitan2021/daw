// src/modules/gestion/dtos/input/filtrar-turnos-medico.dto.ts
import { Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FiltrarTurnosMedicoDto {
  @ApiProperty({ description: 'Fecha de los turnos (YYYY-MM-DD)', example: '2026-10-28' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'La fecha debe tener formato YYYY-MM-DD' })
  fecha: string;
}