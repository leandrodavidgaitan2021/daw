import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';

export interface UsuarioPerfil {
  nombres: string;
  apellidos: string;
  correo?: string;       // Añadir opcional si puede venir undefined
  documento?: string;   // <--- Soluciona el error permitiendo undefined
  rol: string;
}

@Component({
  selector: 'app-perfil-modal',
  standalone: true,
  imports: [CommonModule, ButtonModule, DialogModule, TagModule],
  templateUrl: './perfil-modal.html',
})
export class PerfilModalComponent {
  // Recibimos los datos directamente desde el Navbar para evitar peticiones y parpadeos al abrir
  readonly perfil = input<UsuarioPerfil | null>(null);
  readonly isLoading = input<boolean>(false);

  readonly visible = input.required<boolean>();
  readonly visibleChange = output<boolean>();

  cerrar(): void {
    this.visibleChange.emit(false);
  }
}