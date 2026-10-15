// src/modules/gestion/entities/usuario.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { EstadosUsuarios } from '../enums/estados-usuarios.enum';
import { RolesUsuarios } from '../enums/roles-usuarios.enum';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true, nullable: false })
  documento: string;

  @Column({ type: 'text', nullable: false })
  apellidos: string;

  @Column({ type: 'text', nullable: false })
  nombres: string;

  @Column({ type: 'text', unique: true, nullable: false })
  email: string;

  @Column({ type: 'text', nullable: false })
  clave: string;

  @Column({
    type: 'enum',
    enum: EstadosUsuarios,
    nullable: false,
  })
  estado: EstadosUsuarios;

  @Column({
    type: 'enum',
    enum: RolesUsuarios,
    nullable: false,
  })
  rol: RolesUsuarios;
}