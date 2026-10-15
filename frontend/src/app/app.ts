import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';     // <-- Importar ToastModule
import { NavbarComponent } from './components/navbar/navbar'; // <-- Importar la Navbar


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Clinica');
}
