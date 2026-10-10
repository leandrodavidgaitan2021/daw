import { Injectable, computed, signal } from '@angular/core';

export interface Usuario {
  id: number | string;
  nombres?: string;
  apellidos?: string;
  correo: string;
  rol?: string; // Usamos 'rol' tal cual viene de tu API de NestJS
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  // Estado privado con Signals
  private readonly _user = signal<Usuario | null>(this.getUserFromStorage());
  private readonly _token = signal<string | null>(localStorage.getItem('token'));

  // Propiedades públicas de solo lectura
  readonly usuario = this._user.asReadonly();
  readonly token = this._token.asReadonly();
  
  // Señal computada para saber si el usuario está autenticado
  readonly isAuthenticated = computed(() => !!this._token());

  /**
   * Establece la sesión del usuario guardando el token y sus datos
   */
  setSession(token: string, user: Usuario): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this._token.set(token);
    this._user.set(user);
  }

  /**
   * Cierra la sesión limpiando el almacenamiento y reseteando las señales
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this._token.set(null);
    this._user.set(null);
  }

  /**
   * Recupera el usuario almacenado en localStorage al iniciar
   */
  private getUserFromStorage(): Usuario | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error('Error al parsear el usuario del localStorage', e);
        return null;
      }
    }
    return null;
  }
}