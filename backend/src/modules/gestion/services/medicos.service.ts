// src/modules/gestion/services/medicos.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medico } from '../entities/medico.entity';
import { Reserva } from '../entities/reserva.entity';
import { ActualizarEstadoReservaDto } from '../dtos/input/actualizar-estado-reserva.dto';
import { ModificarValorConsultaDto } from '../dtos/input/modificar-valor-consulta.dto';

@Injectable()
export class MedicosService {
  constructor(
    @InjectRepository(Medico)
    private readonly medicoRepo: Repository<Medico>,
    @InjectRepository(Reserva)
    private readonly reservaRepo: Repository<Reserva>,
  ) {}

  async obtenerMedicoPorIdUsuario(idUsuario: number): Promise<Medico> {
    const medico = await this.medicoRepo.findOne({ where: { idUsuario } });
    if (!medico) throw new NotFoundException('Perfil de médico no encontrado para este usuario.');
    return medico;
  }

  // Médicos: pueden ver sus turnos reservados dada una fecha y marcar atendido o ausente
  async listarTurnosMedico(idUsuarioMedico: number, fecha?: string) {
    const medico = await this.obtenerMedicoPorIdUsuario(idUsuarioMedico);
    
    const query = this.reservaRepo.createQueryBuilder('reserva')
      .leftJoinAndSelect('reserva.paciente', 'paciente')
      .where('reserva.id_medico = :idMedico', { idMedico: medico.id });

    if (fecha) {
      query.andWhere('DATE(reserva.fecha_hora) = :fecha', { fecha });
    }

    return await query.getMany();
  }

  async actualizarEstadoReserva(idReserva: number, idUsuarioMedico: number, dto: ActualizarEstadoReservaDto) {
    const medico = await this.obtenerMedicoPorIdUsuario(idUsuarioMedico);
    const reserva = await this.reservaRepo.findOne({ where: { id: idReserva } });

    if (!reserva) throw new NotFoundException('Reserva no encontrada.');
    if (reserva.idMedico !== medico.id) {
      throw new ForbiddenException('Este turno no corresponde al médico autenticado.');
    }

    reserva.estado = dto.estado;
    return await this.reservaRepo.save(reserva);
  }

  // Administrador: modificar el valor de la consulta de los médicos[cite: 1]
  async modificarValorConsulta(idMedico: number, dto: ModificarValorConsultaDto) {
    const medico = await this.medicoRepo.findOne({ where: { id: idMedico } });
    if (!medico) throw new NotFoundException('Médico no encontrado.');

    medico.valorConsulta = dto.valorConsulta;
    return await this.medicoRepo.save(medico);
  }
}