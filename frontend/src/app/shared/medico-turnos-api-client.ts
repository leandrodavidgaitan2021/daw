import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface TurnoMedico {
  id: number;
  fechaHora: string;
  estado: 'ACTIVO' | 'ATENDIDO' | 'AUSENTE' | 'CANCELADO';
  valorConsulta: number;
  paciente: {
    id: number;
    nombres: string;
    apellidos: string;
    documento: string;
    correo: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class MedicoTurnosApiClient {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api/medicos/turnos';

  // Obtener turnos filtrados por fecha
  getTurnosPorFecha(fecha: string): Observable<TurnoMedico[]> {
    const params = new HttpParams().set('fecha', fecha);
    return this.http.get<TurnoMedico[]>(this.apiUrl, { params });
  }

  // Actualizar estado del turno (ATENDIDO o AUSENTE)
  actualizarEstadoTurno(turnoId: number, estado: 'ATENDIDO' | 'AUSENTE'): Observable<any> {
    // CORREGIDO: Uso de template string con backticks (`) y interpolación correcta (${...})
    return this.http.patch(`${this.apiUrl}/${turnoId}/estado`, { estado });
  }
}