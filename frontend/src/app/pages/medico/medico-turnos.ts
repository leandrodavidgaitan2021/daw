import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicoTurnosApiClient, TurnoMedico } from './medico-turnos-api-client';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker'; // <-- Actualizado a DatePicker
import { MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-medico-turnos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DatePickerModule, // <-- Reemplazado aquí
    TagModule
  ],
  templateUrl: './medico-turnos.html',
  styleUrl: './medico-turnos.css'
})
export class MedicoTurnosComponent implements OnInit {
  private medicoTurnosApiClient = inject(MedicoTurnosApiClient);
  private messageService = inject(MessageService);

  readonly turnos = signal<TurnoMedico[]>([]);
  readonly isLoading = signal(false);
  
  // Guardamos un objeto Date de JavaScript para que el DatePicker de PrimeNG trabaje de forma nativa
  selectedDate: Date = new Date();

  ngOnInit(): void {
    this.cargarTurnos();
  }

  cargarTurnos(): void {
    if (!this.selectedDate) return;

    // Convertimos correctamente respetando la hora local
    const fechaFormateada = this.formatDateToYYYYMMDD(this.selectedDate);

    this.isLoading.set(true);
    this.medicoTurnosApiClient.getTurnosPorFecha(fechaFormateada).subscribe({
      next: (data) => {
        this.turnos.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar turnos:', err);
        this.isLoading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los turnos para la fecha seleccionada.'
        });
      }
    });
  }

  cambiarEstado(turnoId: number, nuevoEstado: 'ATENDIDO' | 'AUSENTE'): void {
    this.medicoTurnosApiClient.actualizarEstadoTurno(turnoId, nuevoEstado).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Actualizado',
          detail: `Turno marcado como ${nuevoEstado.toLowerCase()}.`
        });
        this.cargarTurnos();
      },
      error: (err) => {
        console.error('Error al actualizar estado:', err);
        const errorMsg = err.error?.message || 'No se pudo actualizar el estado del turno.';
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMsg
        });
      }
    });
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

 private formatDateToYYYYMMDD(date: Date | string): string {
    if (!date) return '';
    
    // Asegurarnos de que sea un objeto Date válido
    const d = new Date(date);
    
    // Usamos métodos LOCALES (.getFullYear, .getMonth, .getDate) 
    // para evitar que la zona horaria (UTC) nos cambie el día
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }
}