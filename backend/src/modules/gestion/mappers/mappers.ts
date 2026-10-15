// src/modules/gestion/mappers/mappers.ts
import { Usuario } from '../entities/usuario.entity';
import { Medico } from '../entities/medico.entity';
import { Reserva } from '../entities/reserva.entity';
import { UsuarioResponseDto } from '../dtos/output/usuario-response.dto';
import { MedicoResponseDto } from '../dtos/output/medico-response.dto';
import { ReservaResponseDto } from '../dtos/output/reserva-response.dto';

// Copia solo los datos autorizados del usuario (la clave nunca se incluye)
export const aUsuarioDto = (u: Usuario): UsuarioResponseDto => ({
  id: u.id,
  documento: u.documento,
  apellidos: u.apellidos,
  nombres: u.nombres,
  email: u.email,
  estado: u.estado,
  rol: u.rol,
});

// Une los datos del médico con los de su usuario en una sola ficha plana
export const aMedicoDto = (m: Medico): MedicoResponseDto => ({
  id: m.id,
  matricula: m.matricula,
  valorConsulta: m.valorConsulta,
  nombres: m.usuario.nombres,
  apellidos: m.usuario.apellidos,

  //Como la lista es pública, no tiene por qué mostrar esos datos

  /*email: m.usuario.email,
  documento: m.usuario.documento,*/
});

// Arma la ficha del turno con el paciente y el médico adentro
export const aReservaDto = (r: Reserva): ReservaResponseDto => ({
  id: r.id,
  fechaHora: r.fechaHora,
  estado: r.estado,
  valorConsulta: r.valorConsulta,
  paciente: aUsuarioDto(r.paciente),
  medico: aMedicoDto(r.medico),
});