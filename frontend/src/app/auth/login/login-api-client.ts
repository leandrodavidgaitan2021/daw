import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface LoginRequest {
  correo: string;
  clave: string;
}

// Define o actualiza la interfaz que tipa la respuesta de tu API
export interface LoginResponse {
  message: string;
  accessToken: string;
  usuario: {
    id: number;
    nombres: string;
    apellidos: string;
    correo: string;
    rol: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class LoginApiClient {
  private http = inject(HttpClient);
  // Ajusta la ruta base según el endpoint de login de tu NestJS (ej. '/api/auth/login')
  private readonly apiUrl = '/api/auth/login';

  /**
   * Envía las credenciales al backend para autenticar al usuario
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, credentials);
  }
}