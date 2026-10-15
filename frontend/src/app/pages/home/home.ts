import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthStore } from '../../auth/auth-store';
import { MedicoApiClient, MedicoResponse } from './medico-api-client';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  private medicoApiClient = inject(MedicoApiClient);
  private router = inject(Router);

  readonly medicos = signal<MedicoResponse[]>([]);
  readonly isLoading = signal(true);

  ngOnInit(): void {
  // Si el usuario ya está logueado y es médico, lo mandamos a su sección de turnos
  if (this.authStore.isAuthenticated() && this.authStore.usuario()?.rol === 'MEDICO') {
    this.router.navigate(['/medico/turnos']);
    return;
  }

  // De lo contrario, carga los médicos normalmente en la Home
  this.medicoApiClient.getMedicos().subscribe({
    next: (data) => {
      this.medicos.set(data);
      this.isLoading.set(false);
    },
    error: (err) => {
      console.error('Error al cargar médicos:', err);
      this.isLoading.set(false);
    }
  });
}
}