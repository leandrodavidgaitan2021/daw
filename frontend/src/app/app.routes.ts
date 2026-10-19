import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { MedicoTurnosComponent } from './pages/medico/medico-turnos';
import { MisTurnosComponent } from './pages/paciente/mis-turnos';
import { ReservarTurnoComponent } from './pages/paciente/reservar-turno';
import { LoginComponent } from './auth/login/login';
import { rolGuard } from './auth/auth-guard';
import { AdminComponent } from './pages/admin/admin';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },

  {
    path: 'medico/turnos',
    component: MedicoTurnosComponent,
    canActivate: [rolGuard(['MEDICO'])],
  },

  {
    path: 'paciente/mis-turnos',
    component: MisTurnosComponent,
    canActivate: [rolGuard(['PACIENTE'])],
  },

  {
    path: 'paciente/reservar',
    component: ReservarTurnoComponent,
    canActivate: [rolGuard(['PACIENTE'])],
  },
{
    path: 'admin',
    component: AdminComponent,
    canActivate: [rolGuard(['ADMINISTRADOR'])]
  },
  { path: '**', redirectTo: '' },
];