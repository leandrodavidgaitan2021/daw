// src/modules/auth/controllers/auth.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login.dto';
import { LoginResponseDto } from '../dtos/login-response.dto';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión en el sistema' })
  @ApiOkResponse({
    type: LoginResponseDto,
    description: 'Token JWT generado con éxito.',
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  @ApiResponse({ status: 403, description: 'La cuenta está dada de baja.' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.clave);
  }
}
