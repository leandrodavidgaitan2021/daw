// src/modules/gestion/services/medicos.service.ts
import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medico } from '../entities/medico.entity';
import { Reserva } from '../entities/reserva.entity';
import { ActualizarEstadoReservaDto } from '../dtos/input/actualizar-estado-reserva.dto';
import { ModificarValorConsultaDto } from '../dtos/input/modificar-valor-consulta.dto';
import { MedicoResponseDto } from '../dtos/output/medico-response.dto';
import { ReservaResponseDto } from '../dtos/output/reserva-response.dto';
import { EstadosReservas } from '../enums/estados-reservas.enum';
import { aMedicoDto, aReservaDto } from '../mappers/mappers';

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

  // Lista pública de médicos (para el Home), sin datos sensibles
  async listarTodos(): Promise<MedicoResponseDto[]> {
    const medicos = await this.medicoRepo.find({ order: { id: 'ASC' } });
    return medicos.map(aMedicoDto);
  }

  // Médico: ve sus turnos reservados para una fecha (YYYY-MM-DD)
  async listarTurnosMedico(idUsuarioMedico: number, fecha: string): Promise<ReservaResponseDto[]> {
    const medico = await this.obtenerMedicoPorIdUsuario(idUsuarioMedico);

    // El QueryBuilder no carga las relaciones eager solas: hay que pedirlas con join
    const reservas = await this.reservaRepo
      .createQueryBuilder('reserva')
      .leftJoinAndSelect('reserva.paciente', 'paciente')
      .leftJoinAndSelect('reserva.medico', 'medico')
      .leftJoinAndSelect('medico.usuario', 'usuarioMedico')
      .where('reserva.idMedico = :idMedico', { idMedico: medico.id })
      .andWhere('reserva.estado != :cancelado', { cancelado: EstadosReservas.CANCELADO })
      .andWhere('DATE(reserva.fechaHora) = :fecha', { fecha })
      .orderBy('reserva.fechaHora', 'ASC')
      .getMany();

    return reservas.map(aReservaDto);
  }

  // Médico: marca un turno propio como ATENDIDO o AUSENTE
  async actualizarEstadoReserva(
    idReserva: number,
    idUsuarioMedico: number,
    dto: ActualizarEstadoReservaDto,
  ): Promise<ReservaResponseDto> {
    const medico = await this.obtenerMedicoPorIdUsuario(idUsuarioMedico);
    const reserva = await this.reservaRepo.findOne({ where: { id: idReserva } });

    if (!reserva) throw new NotFoundException('Reserva no encontrada.');
    if (reserva.idMedico !== medico.id) {
      throw new ForbiddenException('Este turno no corresponde al médico autenticado.');
    }
    if (reserva.estado !== EstadosReservas.ACTIVO) {
      throw new BadRequestException('Solo se puede cambiar el estado de turnos ACTIVOS.');
    }
    if (dto.estado !== EstadosReservas.ATENDIDO && dto.estado !== EstadosReservas.AUSENTE) {
      throw new BadRequestException('El estado debe ser ATENDIDO o AUSENTE.');
    }

    reserva.estado = dto.estado;
    return aReservaDto(await this.reservaRepo.save(reserva));
  }

  // Administrador: modifica el valor de la consulta de un médico
  async modificarValorConsulta(idMedico: number, dto: ModificarValorConsultaDto): Promise<MedicoResponseDto> {
    const medico = await this.medicoRepo.findOne({ where: { id: idMedico } });
    if (!medico) throw new NotFoundException('Médico no encontrado.');

    medico.valorConsulta = dto.valorConsulta;
    return aMedicoDto(await this.medicoRepo.save(medico));
  }
}