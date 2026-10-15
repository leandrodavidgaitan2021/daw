// src/modules/gestion/services/usuarios.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { UsuarioResponseDto } from '../dtos/output/usuario-response.dto';

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
    
    // Mapeo manual a UsuarioResponseDto
    return {
      id: usuario.id,
      documento: usuario.documento,
      apellidos: usuario.apellidos,
      nombres: usuario.nombres,
      email: usuario.email,
      estado: usuario.estado,
      rol: usuario.rol,
    };
  }

  async listarTodos(): Promise<UsuarioResponseDto[]> {
    const usuarios = await this.usuarioRepo.createQueryBuilder('usuario')
      .select([
        'usuario.id',
        'usuario.documento',
        'usuario.apellidos',
        'usuario.nombres',
        'usuario.email',
        'usuario.estado',
        'usuario.rol',
      ])
      .getMany();

    return usuarios.map((usuario) => ({
      id: usuario.id,
      documento: usuario.documento,
      apellidos: usuario.apellidos,
      nombres: usuario.nombres,
      email: usuario.email,
      estado: usuario.estado,
      rol: usuario.rol,
    }));
  }
}