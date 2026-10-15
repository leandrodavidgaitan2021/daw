// src/modules/gestion/dtos/output/medico-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class MedicoResponseDto {
  @ApiProperty({ example: 1, description: 'ID único del registro del médico' })
  id: number;

  @ApiProperty({ example: 12345, description: 'Matrícula profesional del médico' })
  matricula: number;

  @ApiProperty({ example: 15000, description: 'Valor actual de la consulta médica' })
  valorConsulta: number;

  @ApiProperty({ example: 'Carlos', description: 'Nombre(s) del médico' })
  nombres: string;

  @ApiProperty({ example: 'Gómez', description: 'Apellido(s) del médico' })
  apellidos: string;

  @ApiProperty({ example: 'carlos.gomez@clinica.com', description: 'Correo electrónico' })
  email: string;

  @ApiProperty({ example: '35123456', description: 'Documento de identidad' })
  documento: string;
}