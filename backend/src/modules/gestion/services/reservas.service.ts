// src/modules/gestion/services/reservas.service.ts
import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reserva } from '../entities/reserva.entity';
import { Medico } from '../entities/medico.entity';
import { CrearReservaDto } from '../dtos/input/crear-reserva.dto';
import { EstadosReservas } from '../enums/estados-reservas.enum';
import { RolesUsuarios } from '../enums/roles-usuarios.enum';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepo: Repository<Reserva>,
    @InjectRepository(Medico)
    private readonly medicoRepo: Repository<Medico>,
  ) {}

  async crearReserva(dto: CrearReservaDto, usuarioLogueado: any) {
    const fechaHoraReserva = new Date(dto.fechaHora);
    const ahora = new Date();

    // Regla: Máximo 30 días de anticipación[cite: 1]
    const limite30Dias = new Date();
    limite30Dias.setDate(ahora.getDate() + 30);
    if (fechaHoraReserva > limite30Dias || fechaHoraReserva < ahora) {
      throw new BadRequestException('Las reservas se pueden realizar con un máximo de 30 días de anticipación y no en el pasado.');
    }

    // Regla: Horario de atención de 8hs a 16hs, turnos de 1 hora[cite: 1]
    const hora = fechaHoraReserva.getHours();
    const minutos = fechaHoraReserva.getMinutes();
    if (hora < 8 || hora >= 16 || minutos !== 0) {
      throw new BadRequestException('El horario de atención es de 8:00 a 16:00 hs y los turnos duran exactamente una hora.');
    }

    // Regla: No se debe permitir reservar en un horario ya ocupado[cite: 1]
    const ocupado = await this.reservaRepo.findOne({
      where: { idMedico: dto.idMedico, fechaHora: fechaHoraReserva, estado: EstadosReservas.ACTIVO },
    });
    if (ocupado) {
      throw new BadRequestException('El médico ya tiene un turno reservado en ese horario.');
    }

    const medico = await this.medicoRepo.findOne({ where: { id: dto.idMedico } });
    if (!medico) throw new NotFoundException('Médico no encontrado.');

    // Determinación y validación segura del ID del paciente según el rol
    let idPacienteFinal: number;

    if (usuarioLogueado.rol === RolesUsuarios.PACIENTE) {
      idPacienteFinal = usuarioLogueado.id;
    } else if (usuarioLogueado.rol === RolesUsuarios.ADMINISTRADOR) {
      if (!dto.idPaciente) {
        throw new BadRequestException('El administrador debe especificar el ID del paciente para la reserva.');
      }
      idPacienteFinal = dto.idPaciente;
    } else {
      throw new ForbiddenException('No autorizado para crear reservas.');
    }

    // Regla: Un médico no puede realizar una reserva de turno consigo mismo
    if (medico.idUsuario === idPacienteFinal) {
      throw new BadRequestException('Un médico no puede realizar una reserva de turno consigo mismo.');
    }

    // Regla: Se congela el valor de la consulta al momento en que se realizó la reserva[cite: 1]
    const nuevaReserva = this.reservaRepo.create({
      idMedico: medico.id,
      idPaciente: idPacienteFinal,
      fechaHora: fechaHoraReserva,
      estado: EstadosReservas.ACTIVO,
      valorConsulta: medico.valorConsulta,
    });

    return await this.reservaRepo.save(nuevaReserva);
  }

  async listarTurnosPaciente(idPaciente: number) {
    return await this.reservaRepo.find({
      where: { idPaciente },
      relations: {
        medico: {
            usuario: true,
        },
      },
    });
  }

  async listarTodas() {
    return await this.reservaRepo.find({ 
        relations: {
            medico: {
                usuario: true,
            },
            paciente: true,
        } 
    });
  }

  async cancelarReserva(idReserva: number, usuarioLogueado: any) {
    const reserva = await this.reservaRepo.findOne({ where: { id: idReserva } });
    if (!reserva) throw new NotFoundException('Reserva no encontrada.');

    const ahora = new Date();
    const fechaReserva = new Date(reserva.fechaHora);

    if (usuarioLogueado.rol === RolesUsuarios.PACIENTE) {
      if (reserva.idPaciente !== usuarioLogueado.id) throw new ForbiddenException('No puede cancelar turnos ajenos.');
      
      // Regla: Paciente cancela solo hasta el día anterior[cite: 1]
      const diaAnterior = new Date(fechaReserva);
      diaAnterior.setDate(diaAnterior.getDate() - 1);
      diaAnterior.setHours(23, 59, 59, 999);

      if (ahora > diaAnterior) {
        throw new BadRequestException('Los pacientes solo pueden cancelar hasta el día anterior a la consulta.');
      }
    } else if (usuarioLogueado.rol === RolesUsuarios.ADMINISTRADOR) {
      // Regla: Administrador cancela hasta el momento en que inicia la consulta[cite: 1]
      if (ahora >= fechaReserva) {
        throw new BadRequestException('No se puede cancelar un turno cuya consulta ya ha iniciado.');
      }
    } else {
      throw new ForbiddenException('No autorizado para cancelar turnos.');
    }

    reserva.estado = EstadosReservas.CANCELADO;
    return await this.reservaRepo.save(reserva);
  }
}