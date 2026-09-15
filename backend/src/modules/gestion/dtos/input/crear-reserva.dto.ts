// Ejemplo en tu archivo de DTO de creación de reservas
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber } from 'class-validator';

export class CrearReservaDto {
  @ApiProperty({ example: 1, description: 'ID del médico asignado' })
  @IsNumber()
  idMedico: number;

  @ApiProperty({ example: 1, description: 'ID del paciente' })
  @IsNumber()
  idPaciente: number;

  @ApiProperty({ 
    example: '2026-09-15T10:00:00.000Z', 
    description: 'Fecha y hora de la reserva en formato ISO 8601' 
  })
  @IsDateString() // Valida que sea una fecha correcta si usas class-validator
  fechaHora: string;
}