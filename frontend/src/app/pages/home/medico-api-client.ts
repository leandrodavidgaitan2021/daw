import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface MedicoResponse {
  id: number;
  idUsuario: number;
  matricula: string;
  valorConsulta: number;
  usuario: {
    id: number;
    documento: string;
    apellidos: string;
    nombres: string;
    email: string;
    estado: string;
    rol: string;
  };
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