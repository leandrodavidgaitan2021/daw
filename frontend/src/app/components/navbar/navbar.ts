import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { AuthStore } from '../../auth/auth-store';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, ToolbarModule, ButtonModule],
  templateUrl: './navbar.html'
})
export class NavbarComponent {
  readonly authStore = inject(AuthStore);
}