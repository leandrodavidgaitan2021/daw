import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Obtener el token del almacenamiento local (puedes adaptarlo según cómo guardes tu sesión)
  const token = localStorage.getItem('token');

  if (token) {
    // Clonamos la petición para agregar la cabecera de autorización de forma inmutable
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  // Si no hay token, la petición pasa sin modificaciones
  return next(req);
};