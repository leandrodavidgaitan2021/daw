// src/modules/gestion/services/usuarios.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { UsuarioResponseDto } from '../dtos/output/usuario-response.dto';
import { EstadosUsuarios } from '../enums/estados-usuarios.enum';
import { RolesUsuarios } from '../enums/roles-usuarios.enum';
import { aUsuarioDto } from '../mappers/mappers';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  async buscarPorId(id: number): Promise<UsuarioResponseDto> {
    const usuario = await this.usuarioRepo.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado.');
    }
    return aUsuarioDto(usuario);
  }

  // Pacientes activos, para que el administrador elija a quién reservarle el turno
  async listarPacientes(): Promise<UsuarioResponseDto[]> {
    const pacientes = await this.usuarioRepo.find({
      where: { rol: RolesUsuarios.PACIENTE, estado: EstadosUsuarios.ACTIVO },
      order: { apellidos: 'ASC', nombres: 'ASC' },
    });
    return pacientes.map(aUsuarioDto);
  }
}