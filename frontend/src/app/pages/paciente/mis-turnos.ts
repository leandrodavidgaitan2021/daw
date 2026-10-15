import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Reserva, ReservasApiClient } from '../../shared/reservas-api-client';
import { mensajeDeError } from '../../shared/mensaje-error';

@Component({
  selector: 'app-mis-turnos',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './mis-turnos.html',
})
export class MisTurnosComponent implements OnInit {
  private reservasApi = inject(ReservasApiClient);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);

  readonly turnos = signal<Reserva[]>([]);
  readonly isLoading = signal(true);

  ngOnInit(): void {
    this.cargarTurnos();
  }

  cargarTurnos(): void {
    this.isLoading.set(true);
    this.reservasApi.getMisTurnos().subscribe({
      next: (data) => {
        this.turnos.set(data);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'No se pudieron cargar tus turnos',
          detail: mensajeDeError(err),
        });
      },
    });
  }

  // Regla del enunciado: el paciente cancela solo hasta el día anterior a la consulta
  puedeCancelar(turno: Reserva): boolean {
    if (turno.estado !== 'ACTIVO') return false;
    const inicioDelDia = new Date(turno.fechaHora);
    inicioDelDia.setHours(0, 0, 0, 0);
    return new Date() < inicioDelDia;
  }

  confirmarCancelacion(turno: Reserva): void {
    this.confirmationService.confirm({
      header: 'Cancelar turno',
      message: `¿Deseas cancelar el turno con ${turno.medico.nombres} ${turno.medico.apellidos}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, cancelar',
      rejectLabel: 'No',
      accept: () => this.cancelar(turno.id),
    });
  }

  private cancelar(id: number): void {
    this.reservasApi.cancelar(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Turno cancelado',
          detail: 'El turno fue cancelado correctamente.',
        });
        this.cargarTurnos();
      },
      error: (err: HttpErrorResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'No se pudo cancelar el turno',
          detail: mensajeDeError(err),
        });
      },
    });
  }

  irAReservar(): void {
    this.router.navigate(['/paciente/reservar']);
  }

  getSeverity(estado: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (estado) {
      case 'ACTIVO': return 'info';
      case 'ATENDIDO': return 'success';
      case 'AUSENTE': return 'warn';
      case 'CANCELADO': return 'danger';
      default: return 'secondary';
    }
  }
}