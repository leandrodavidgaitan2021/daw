// src/modules/gestion/entities/medico.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('medicos')
export class Medico {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_usuario', nullable: false })
  idUsuario: number;

  @OneToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @Column({ type: 'varchar', unique: true })
  matricula: string;

  @Column({ name: 'valor_consulta', type: 'int', nullable: false })
  valorConsulta: number;
}