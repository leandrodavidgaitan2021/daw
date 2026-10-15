// src/modules/gestion/services/reservas.service.ts
import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository} from '@nestjs/typeorm';
import { Repository, Between  } from 'typeorm';
import { Reserva } from '../entities/reserva.entity';
import { Medico } from '../entities/medico.entity';
import { Usuario } from '../entities/usuario.entity';
import { CrearReservaDto } from '../dtos/input/crear-reserva.dto';
import { ReservaResponseDto } from '../dtos/output/reserva-response.dto';
import { EstadosReservas } from '../enums/estados-reservas.enum';
import { EstadosUsuarios } from '../enums/estados-usuarios.enum';
import { RolesUsuarios } from '../enums/roles-usuarios.enum';
import { aReservaDto } from '../mappers/mappers';

// Datos del usuario que viajan dentro del token JWT
export interface UsuarioAutenticado {
  id: number;
  rol: RolesUsuarios;
}

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepo: Repository<Reserva>,
    @InjectRepository(Medico)
    private readonly medicoRepo: Repository<Medico>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  async crearReserva(dto: CrearReservaDto, usuarioLogueado: UsuarioAutenticado): Promise<ReservaResponseDto> {
    const fechaHoraReserva = new Date(dto.fechaHora);
    const ahora = new Date();

    // Regla: máximo 30 días de anticipación y nunca en el pasado
    const limite30Dias = new Date();
    limite30Dias.setDate(ahora.getDate() + 30);
    if (fechaHoraReserva > limite30Dias || fechaHoraReserva < ahora) {
      throw new BadRequestException('Las reservas se pueden realizar con un máximo de 30 días de anticipación y no en el pasado.');
    }

    // Regla: horario de atención de 8 a 16 hs, turnos de exactamente 1 hora
    const hora = fechaHoraReserva.getHours();
    const minutos = fechaHoraReserva.getMinutes();
    if (hora < 8 || hora >= 16 || minutos !== 0) {
      throw new BadRequestException('El horario de atención es de 8:00 a 16:00 hs y los turnos duran exactamente una hora.');
    }

    const medico = await this.medicoRepo.findOne({ where: { id: dto.idMedico } });
    if (!medico) throw new NotFoundException('Médico no encontrado.');

    // Regla: no se puede reservar un horario ya ocupado (los cancelados liberan el horario)
    const ocupado = await this.reservaRepo.findOne({
      where: { idMedico: medico.id, fechaHora: fechaHoraReserva, estado: EstadosReservas.ACTIVO },
    });
    if (ocupado) {
      throw new BadRequestException('El médico ya tiene un turno reservado en ese horario.');
    }

    // El paciente reserva siempre a su nombre; el administrador indica a quién
    let idPacienteFinal: number;

    if (usuarioLogueado.rol === RolesUsuarios.PACIENTE) {
      idPacienteFinal = usuarioLogueado.id;
    } else if (usuarioLogueado.rol === RolesUsuarios.ADMINISTRADOR) {
      if (!dto.idPaciente) {
        throw new BadRequestException('El administrador debe especificar el ID del paciente para la reserva.');
      }

      // Regla: un médico no puede reservar un turno consigo mismo
      if (medico.idUsuario === dto.idPaciente) {
        throw new BadRequestException('Un médico no puede realizar una reserva de turno consigo mismo.');
      }

      const paciente = await this.usuarioRepo.findOne({ where: { id: dto.idPaciente } });
      if (!paciente || paciente.rol !== RolesUsuarios.PACIENTE || paciente.estado !== EstadosUsuarios.ACTIVO) {
        throw new BadRequestException('El idPaciente no corresponde a un paciente activo.');
      }
      idPacienteFinal = paciente.id;
    } else {
      throw new ForbiddenException('No autorizado para crear reservas.');
    }

    // Regla: se congela el valor de la consulta al momento de reservar
    const nuevaReserva = this.reservaRepo.create({
      idMedico: medico.id,
      idPaciente: idPacienteFinal,
      fechaHora: fechaHoraReserva,
      estado: EstadosReservas.ACTIVO,
      valorConsulta: medico.valorConsulta,
    });
    const guardada = await this.reservaRepo.save(nuevaReserva);

    return this.buscarComoDto(guardada.id);
  }

  async listarTurnosPaciente(idPaciente: number): Promise<ReservaResponseDto[]> {
    const reservas = await this.reservaRepo.find({
      where: { idPaciente },
      order: { fechaHora: 'ASC' },
    });
    return reservas.map(aReservaDto);
  }

  async listarTodas(): Promise<ReservaResponseDto[]> {
    const reservas = await this.reservaRepo.find({ order: { fechaHora: 'ASC' } });
    return reservas.map(aReservaDto);
  }

  
  async listarHorariosOcupados(
    idMedico: number,
    fecha: string,
  ): Promise<string[]> {
    // Validar el formato de la fecha.
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      throw new BadRequestException(
        'La fecha debe tener el formato YYYY-MM-DD.',
      );
    }

    const [anio, mes, dia] = fecha.split('-').map(Number);
    const inicio = new Date(anio, mes - 1, dia);

    // Verificar que la fecha exista realmente.
    if (
      inicio.getFullYear() !== anio ||
      inicio.getMonth() !== mes - 1 ||
      inicio.getDate() !== dia
    ) {
      throw new BadRequestException('La fecha no es válida.');
    }

    const fin = new Date(anio, mes - 1, dia + 1);

    // Comprobar que el médico exista.
    const medico = await this.medicoRepo.findOne({
      where: { id: idMedico },
    });

    if (!medico) {
      throw new NotFoundException('Médico no encontrado.');
    }

    // Buscar únicamente las reservas activas de ese médico y ese día.
    const reservas = await this.reservaRepo.find({
      where: {
        idMedico,
        estado: EstadosReservas.ACTIVO,
        fechaHora: Between(
          inicio,
          new Date(fin.getTime() - 1),
        ),
      },
      select: {
        fechaHora: true,
      },
    });

    // Convertir las fechas a horarios HH:mm.
    return reservas.map((reserva) => {
      const hora = reserva.fechaHora
        .getHours()
        .toString()
        .padStart(2, '0');

      const minutos = reserva.fechaHora
        .getMinutes()
        .toString()
        .padStart(2, '0');

      return `${hora}:${minutos}`;
    });
  }


  async cancelarReserva(idReserva: number, usuarioLogueado: UsuarioAutenticado): Promise<ReservaResponseDto> {
    const reserva = await this.reservaRepo.findOne({ where: { id: idReserva } });
    if (!reserva) throw new NotFoundException('Reserva no encontrada.');

    // Solo se cancelan turnos pendientes: no los atendidos, ausentes o ya cancelados
    if (reserva.estado !== EstadosReservas.ACTIVO) {
      throw new BadRequestException('Solo se pueden cancelar turnos en estado ACTIVO.');
    }

    const ahora = new Date();
    const fechaReserva = new Date(reserva.fechaHora);

    if (usuarioLogueado.rol === RolesUsuarios.PACIENTE) {
      if (reserva.idPaciente !== usuarioLogueado.id) {
        throw new ForbiddenException('No puede cancelar turnos ajenos.');
      }

      // Regla: el paciente cancela solo hasta el día anterior a la consulta
      const diaAnterior = new Date(fechaReserva);
      diaAnterior.setDate(diaAnterior.getDate() - 1);
      diaAnterior.setHours(23, 59, 59, 999);

      if (ahora > diaAnterior) {
        throw new BadRequestException('Los pacientes solo pueden cancelar hasta el día anterior a la consulta.');
      }
    } else if (usuarioLogueado.rol === RolesUsuarios.ADMINISTRADOR) {
      // Regla: el administrador cancela hasta el momento en que inicia la consulta
      if (ahora >= fechaReserva) {
        throw new BadRequestException('No se puede cancelar un turno cuya consulta ya ha iniciado.');
      }
    } else {
      throw new ForbiddenException('No autorizado para cancelar turnos.');
    }

    reserva.estado = EstadosReservas.CANCELADO;
    await this.reservaRepo.save(reserva);

    return this.buscarComoDto(reserva.id);
  }

  // Vuelve a buscar la reserva (con médico, usuario y paciente) y la convierte en DTO
  private async buscarComoDto(id: number): Promise<ReservaResponseDto> {
    const reserva = await this.reservaRepo.findOneOrFail({ where: { id } });
    return aReservaDto(reserva);
  }
}