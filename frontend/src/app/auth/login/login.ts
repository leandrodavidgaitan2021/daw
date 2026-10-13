import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';

import { LoginApiClient } from './login-api-client';
import { AuthStore } from '../../auth/auth-store';

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
  readonly submitted = signal(false); // Señal para controlar la aparición de errores
  
  // Controla la visibilidad del modal
  visible = true;

  readonly loginForm = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    clave: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    this.submitted.set(true); // Activamos la señal de intento de envío

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
    const credentials = this.loginForm.getRawValue();

    this.loginApiClient.login(credentials).subscribe({
      next: (response) => {
        this.authStore.setSession(response.accessToken, response.usuario);
        this.isLoading.set(false);

        this.messageService.add({
          severity: 'success',
          summary: `¡Bienvenido, ${response.usuario.nombres}!`,
          detail: 'Has iniciado sesión exitosamente.'
        });

        const rol = response.usuario.rol;
        
        setTimeout(() => {
          if (rol === 'MEDICO') {
            this.router.navigate(['/medico/turnos']);
          } else if (rol === 'ADMINISTRADOR') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/']);
          }
        }, 800);
      },
      error: (err) => {
        console.error('Error en el login', err);
        this.isLoading.set(false);

        const errorMsg = err.error?.message || 'Ocurrió un error al iniciar sesión. Verifica tus credenciales.';
        this.messageService.add({
          severity: 'error',
          summary: 'Error de Autenticación',
          detail: errorMsg
        });
      }
    });
  }

  // Método para el botón Cancelar
  onCancel(): void {
    this.visible = false;
    this.router.navigate(['/']);
  }

  // Método que se ejecuta si el usuario cierra el modal (la 'X' o hace clic fuera)
  onHide(): void {
    this.router.navigate(['/']);
  }
}