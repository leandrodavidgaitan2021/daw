// src/modules/gestion/dtos/input/crear-reserva.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';

export class CrearReservaDto {
  @ApiProperty({ example: 1, description: 'ID del médico' })
  @IsInt()
  @Min(1)
  idMedico: number;

  @ApiPropertyOptional({
    example: 3,
    description: 'ID del paciente. Lo debe indicar solo el administrador; un paciente siempre reserva a su nombre.',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  idPaciente?: number;

  @ApiProperty({
    example: '2026-10-28T10:00:00-03:00',
    description: 'Fecha y hora del turno (ISO 8601), de 8:00 a 15:00 en punto, hasta 30 días desde hoy',
  })
  @IsDateString()
  fechaHora: string;
}