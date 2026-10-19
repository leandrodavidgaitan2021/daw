import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Interfaz que coincide con tu UsuarioResponseDto del backend
export interface Paciente {
  id: number;
  documento: string;
  apellidos: string;
  nombres: string;
  correo: string;
  estado: string;
  rol: string;
}

@Injectable({
  providedIn: 'root'
})
export class PacientesApiClient {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api/usuarios/pacientes'; // Ajusta la ruta base según tu controlador en NestJS

  // Obtener todos los pacientes activos o filtrar opcionalmente por DNI
  getPacientes(dni?: string): Observable<Paciente[]> {
    let params = new HttpParams();
    if (dni) {
      params = params.set('dni', dni);
    }
    return this.http.get<Paciente[]>(this.apiUrl, { params });
  }
}