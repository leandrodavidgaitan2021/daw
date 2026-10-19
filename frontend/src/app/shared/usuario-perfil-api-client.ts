import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface PerfilUsuarioResponse {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  documento?: string;
  rol: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioPerfilApiClient {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api/usuarios/perfil';

  getPerfil(): Observable<PerfilUsuarioResponse> {
    return this.http.get<PerfilUsuarioResponse>(this.apiUrl);
  }
}