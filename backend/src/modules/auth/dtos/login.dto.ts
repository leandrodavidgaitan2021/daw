// src/modules/auth/dtos/login.dto.ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class LoginDto {
  @ApiProperty({ 
    example: 'admin@clinica.com', 
    description: 'Correo electrónico registrado' 
  })
  @IsEmail()
  correo: string;

  @ApiProperty({ 
    example: '123456', 
    description: 'Contraseña de acceso' 
  })
  @IsString()
  @IsNotEmpty()
  clave: string;
}