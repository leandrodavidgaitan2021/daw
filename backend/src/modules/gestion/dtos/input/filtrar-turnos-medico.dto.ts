// src/modules/gestion/dtos/input/filtrar-turnos-medico.dto.ts
import { IsOptional, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FiltrarTurnosMedicoDto {
  @ApiPropertyOptional({ description: 'Fecha para filtrar los turnos (YYYY-MM-DD)', example: '2026-06-10' })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha debe tener un formato válido (YYYY-MM-DD)' })
  fecha?: string;
}