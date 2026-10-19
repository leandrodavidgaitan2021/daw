import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';

import { LoginApiClient } from './login-api-client';
import { AuthStore } from '../../auth/auth-store';
import { mensajeDeError } from '../../shared/mensaje-error';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    DialogModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private fb = inject(NonNullableFormBuilder);
  private loginApiClient = inject(LoginApiClient);
  private authStore = inject(AuthStore);
  private router = inject(Router);
  private messageService = inject(MessageService);

  readonly isLoading = signal(false);
  readonly submitted = signal(false);

  // Controla la visibilidad del diálogo
  visible = true;

  // A qué pantalla va cada rol después de iniciar sesión
  private readonly destinos: Record<string, string> = {
    MEDICO: '/medico/turnos',
    PACIENTE: '/paciente/mis-turnos',
    ADMINISTRADOR: '/admin/turnos',
  };

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    clave: ['', [Validators.required]],
  });

  onSubmit(): void {
    this.submitted.set(true);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario inválido',
        detail: 'Por favor completa correctamente los campos requeridos.'
      });
      return;
    }

    this.isLoading.set(true);
    const { email, clave } = this.loginForm.getRawValue();
    const credentials = { correo: email, clave };

    this.loginApiClient.login(credentials).subscribe({
      next: (response) => {
        this.authStore.setSession(response.accessToken, response.usuario);
        this.isLoading.set(false);

        this.messageService.add({
          severity: 'success',
          summary: `¡Bienvenido, ${response.usuario.nombres}!`,
          detail: 'Has iniciado sesión exitosamente.'
        });

        this.router.navigate([this.destinos[response.usuario.rol] ?? '/']);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'No se pudo iniciar sesión',
          detail: mensajeDeError(err, 'Ocurrió un error al iniciar sesión.'),
        });
      }
    });
  }

  // Botón Cancelar
  onCancel(): void {
    this.visible = false;
    this.router.navigate(['/']);
  }

  // Se ejecuta si el usuario cierra el diálogo (la X o un clic afuera)
  onHide(): void {
    this.router.navigate(['/']);
  }
}