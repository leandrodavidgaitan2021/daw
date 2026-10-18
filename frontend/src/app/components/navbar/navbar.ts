import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { AuthStore } from '../../auth/auth-store';
import { PerfilModalComponent } from '../../components/perfil-modal/perfil-modal';
import { UsuarioPerfilApiClient, PerfilUsuarioResponse } from '../../shared/usuario-perfil-api-client';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, ToolbarModule, PerfilModalComponent],
  templateUrl: './navbar.html',
  styles: [`
    .nav-link-hover {
      transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
    }
    .nav-link-hover:hover {
      color: #000000 !important;
      background-color: rgba(255, 255, 255, 0.85) !important;
      border-radius: 4px;
    }
  `]
})
export class NavbarComponent {
  readonly authStore = inject(AuthStore);
  private perfilApi = inject(UsuarioPerfilApiClient);

  readonly visiblePerfil = signal(false);
  readonly isLoadingPerfil = signal(false);
  readonly perfilData = signal<PerfilUsuarioResponse | null>(null);

  abrirPerfil(): void {
    this.visiblePerfil.set(true);
    
    // Si ya tenemos los datos cargados, no volvemos a hacer la petición para evitar parpadeos
    if (this.perfilData()) return;

    this.isLoadingPerfil.set(true);
    this.perfilApi.getPerfil().subscribe({
      next: (data) => {
        this.perfilData.set(data);
        this.isLoadingPerfil.set(false);
      },
      error: () => {
        this.isLoadingPerfil.set(false);
      },
    });
  }

  onLogout(): void {
    this.authStore.logout();
  }
}