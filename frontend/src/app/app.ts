import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';     // <-- 1. Importar ToastModule
import { MessageService } from 'primeng/api';    // <-- 2. Importar MessageService
import { NavbarComponent } from './components/navbar/navbar'; // <-- Importar la Navbar


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule, NavbarComponent],
  providers: [MessageService],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Clinica');
}
