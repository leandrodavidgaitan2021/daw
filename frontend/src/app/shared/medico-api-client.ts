import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Misma forma que el MedicoResponseDto del backend (datos planos)
export interface MedicoResponse {
  id: number;
  matricula: number;
  valorConsulta: number;
  nombres: string;
  apellidos: string;
}

@Injectable({
  providedIn: 'root'
})
export class MedicoApiClient {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api/medicos';

  getMedicos(): Observable<MedicoResponse[]> {
    return this.http.get<MedicoResponse[]>(this.apiUrl);
  }
}