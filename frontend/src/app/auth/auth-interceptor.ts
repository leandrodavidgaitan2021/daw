import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthStore } from './auth-store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  // Opcional: Si el AuthStore tiene un token guardado, lo inyectamos automáticamente en los headers
  const token = authStore.token();
  let clonedReq = req;
  
  if (token) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el backend responde con 401 Unauthorized (token expirado, inválido o ausente)
      if (error.status === 401) {
        console.warn('Sesión caducada o token inválido. Redirigiendo...');
        
        // Limpiamos la sesión del Store
        authStore.logout(); 
        
        // Redirigimos al usuario al inicio o al login
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};