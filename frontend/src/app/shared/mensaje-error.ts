import { HttpErrorResponse } from '@angular/common/http';

// Convierte el error del backend en un texto para mostrar en un toast
export function mensajeDeError(err: HttpErrorResponse, porDefecto = 'Ocurrió un error. Intentá de nuevo.'): string {
  if (err.status === 0) {
    return 'No se pudo conectar con el servidor.';
  }
  const mensaje = err.error?.message;
  if (Array.isArray(mensaje)) {
    return mensaje.join('. ');
  }
  return mensaje || porDefecto;
}