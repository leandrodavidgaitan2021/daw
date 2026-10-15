import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { AuthStore } from '../../auth/auth-store';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, ToolbarModule, ButtonModule],
  templateUrl: './navbar.html',
  //styleUrl: './navbar.css' // Opcional si usas estilos propios
})
export class NavbarComponent {
  readonly authStore = inject(AuthStore);
  private router = inject(Router);

  onLogout(): void {
    this.authStore.logout();
    this.router.navigate(['/']);
  }
}