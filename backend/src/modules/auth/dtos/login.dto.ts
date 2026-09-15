import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

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
  clave: string;
}