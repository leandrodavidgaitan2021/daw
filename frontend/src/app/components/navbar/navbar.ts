import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { AuthStore } from '../../auth/auth-store';
import { UsuarioPerfilApiClient, PerfilUsuarioResponse } from './usuario-perfil-api-client';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, ToolbarModule, ButtonModule, DialogModule, TagModule],
  templateUrl: './navbar.html'
})
export class NavbarComponent {
  readonly authStore = inject(AuthStore);
  private perfilApiClient = inject(UsuarioPerfilApiClient);
  private router = inject(Router);

  // Estados para el Modal de Perfil
  readonly visiblePerfil = signal(false);
  readonly perfilData = signal<PerfilUsuarioResponse | null>(null);
  readonly isLoadingPerfil = signal(false);

  // Método para abrir el modal y cargar el perfil
  abrirPerfil(): void {
    this.visiblePerfil.set(true);
    this.isLoadingPerfil.set(true);

    this.perfilApiClient.getPerfil().subscribe({
      next: (data) => {
        //console.log('Datos de perfil recibidos del backend:', data);
        this.perfilData.set(data);
        this.isLoadingPerfil.set(false);
      },
      error: (err) => {
        console.error('Error al cargar el perfil', err);
        this.isLoadingPerfil.set(false);
      }
    });
  }

  onLogout(): void {
    this.authStore.logout();
    this.router.navigate(['/']);
  }
}