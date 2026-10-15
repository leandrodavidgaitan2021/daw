import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore, Rol } from './auth-store';

// Deja pasar solo a usuarios con sesión iniciada y con uno de los roles indicados
export const rolGuard = (rolesPermitidos: Rol[]): CanActivateFn => () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (!authStore.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  const rol = authStore.rol();
  if (rol && rolesPermitidos.includes(rol)) {
    return true;
  }
  return router.createUrlTree(['/']);
};