import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { MedicoTurnosComponent } from './pages/medico/medico-turnos';
import { LoginComponent } from './auth/login/login';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'medico/turnos', 
    component: MedicoTurnosComponent,
    // canActivate: [authGuard] // Opcional si ya usas guards de protección
  },
  { path: '**', redirectTo: '' } // Redireccionar rutas desconocidas al Home
];