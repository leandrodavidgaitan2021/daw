import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import {
  ReservasApiClient,
  CrearReservaRequest,
  Medico,
} from '../../shared/reservas-api-client';
import { mensajeDeError } from '../../shared/mensaje-error';

@Component({
  selector: 'app-reservar-turno',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DatePickerModule,
    SelectModule,
  ],
  templateUrl: './reservar-turno.html',
})
export class ReservarTurnoComponent implements OnInit {
  private reservasApi = inject(ReservasApiClient);
  private messageService = inject(MessageService);
  private router = inject(Router);
  
  private solicitudDisponibilidad = 0;

  cambioMedico(id: number | null): void {
    this.medicoSeleccionado.set(id);
    this.horaSeleccionada.set(null);
    this.cargarDisponibilidad();
  }

  cambioFecha(fecha: Date | null): void {
    this.fechaSeleccionada.set(fecha);
    this.horaSeleccionada.set(null);
    this.cargarDisponibilidad();
  }

  readonly errorDisponibilidad = signal(false);

  cargarDisponibilidad(): void {
    const idMedico = this.medicoSeleccionado();
    const fecha = this.fechaSeleccionada();
    const solicitud = ++this.solicitudDisponibilidad;

    this.horariosOcupados.set([]);
    this.errorDisponibilidad.set(false);

    if (idMedico === null || !fecha) {
      this.cargandoDisponibilidad.set(false);
      return;
    }

    // Formatear la fecha local como YYYY-MM-DD.
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const fechaConsulta = `${anio}-${mes}-${dia}`;

    this.cargandoDisponibilidad.set(true);

    this.reservasApi
      .getHorariosOcupados(idMedico, fechaConsulta)
      .subscribe({
        next: (horarios) => {
          // Ignorar respuestas de selecciones anteriores.
          if (solicitud !== this.solicitudDisponibilidad) return;

          this.horariosOcupados.set(horarios);
          this.cargandoDisponibilidad.set(false);
        },
        error: (err: HttpErrorResponse) => {
          if (solicitud !== this.solicitudDisponibilidad) return;

          this.cargandoDisponibilidad.set(false);
          this.errorDisponibilidad.set(true);

          this.messageService.add({
            severity: 'error',
            summary: 'No se pudo consultar la disponibilidad',
            detail: mensajeDeError(err),
          });
        },
      });
  }

  horarioOcupado(hora: string): boolean {
    return this.horariosOcupados().includes(hora);
  }
 

  readonly medicos = signal<Medico[]>([]);
  readonly medicoSeleccionado = signal<number | null>(null);
  readonly fechaSeleccionada = signal<Date | null>(null);
  readonly horaSeleccionada = signal<string | null>(null);
  readonly guardando = signal(false);
  readonly cargandoMedicos = signal(false);
  readonly horariosOcupados = signal<string[]>([]);
  readonly cargandoDisponibilidad = signal(false);
  readonly horarios = [
    '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00',
  ];

  readonly fechaMinima = this.inicioDelDia(new Date());

  ngOnInit(): void {
    this.cargarMedicos();
  }

  private inicioDelDia(fecha: Date): Date {
    const resultado = new Date(fecha);
    resultado.setHours(0, 0, 0, 0);
    return resultado;
  }

  cargarMedicos(): void {
    this.cargandoMedicos.set(true);

    this.reservasApi.getMedicos().subscribe({
      next: (data) => {
        this.medicos.set(data);
        this.cargandoMedicos.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.cargandoMedicos.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'No se pudieron cargar los médicos',
          detail: mensajeDeError(err),
        });
      },
    });
  }

  reservar(): void {
    const medicoId = this.medicoSeleccionado();
    const fecha = this.fechaSeleccionada();
    const hora = this.horaSeleccionada();

    if (medicoId === null || !fecha || !hora) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Faltan datos',
        detail: 'Seleccioná un médico, una fecha y un horario.',
      });
      return;
    }

    const [horas, minutos] = hora.split(':').map(Number);
    const fechaHora = new Date(fecha);
    fechaHora.setHours(horas, minutos, 0, 0);

    if (fechaHora <= new Date()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Horario no válido',
        detail: 'Seleccioná una fecha y hora futuras.',
      });
      return;
    }

    const datos: CrearReservaRequest = {
      idMedico: medicoId,
      fechaHora: fechaHora.toISOString(),
    };

    this.guardando.set(true);

    this.reservasApi.crear(datos).subscribe({
      next: () => {
        this.guardando.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Turno reservado',
          detail: 'Tu reserva se registró correctamente.',
        });
        this.router.navigate(['/paciente/mis-turnos']);
      },
      error: (err: HttpErrorResponse) => {
        this.guardando.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'No se pudo reservar el turno',
          detail: mensajeDeError(err),
        });
      },
    });
  }

  volver(): void {
    this.router.navigate(['/paciente/mis-turnos']);
  }
}