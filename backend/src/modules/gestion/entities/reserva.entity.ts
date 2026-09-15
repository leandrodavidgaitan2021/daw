// src/modules/gestion/entities/reserva.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Medico } from './medico.entity';
import { Usuario } from './usuario.entity';
import { EstadosReservas } from '../enums/estados-reservas.enum';

@Entity('reservas')
export class Reserva {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_medico', nullable: false })
  idMedico: number;

  @ManyToOne(() => Medico, { eager: true })
  @JoinColumn({ name: 'id_medico' })
  medico: Medico;

  @Column({ name: 'id_paciente', nullable: false })
  idPaciente: number;

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'id_paciente' })
  paciente: Usuario;

  @Column({ name: 'fecha_hora', type: 'timestamp', nullable: false })
  fechaHora: Date;

  @Column({
    type: 'enum',
    enum: EstadosReservas,
    nullable: false,
  })
  estado: EstadosReservas;

  @Column({ name: 'valor_consulta', type: 'int', nullable: false })
  valorConsulta: number;
}