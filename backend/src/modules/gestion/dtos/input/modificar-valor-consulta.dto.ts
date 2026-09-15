// src/modules/gestion/dtos/input/modificar-valor-consulta.dto.ts
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ModificarValorConsultaDto {
  @ApiProperty({ description: 'Nuevo valor de la consulta médica' })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  valorConsulta: number;
}