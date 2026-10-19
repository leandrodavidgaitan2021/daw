import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
 styleUrls: ['./admin.css']
})
export class AdminComponent implements OnInit {
  turnos: any[] = [];
  fechaFiltro: string = '';
  dniFiltro: string = '';

  ngOnInit() {
    this.cargarTurnos();
  }

  cargarTurnos() {
    this.turnos = [
      { id: 1, fecha: '2026-10-19', hora: '10:00', paciente: 'Juan Pérez', dni: '35123456', estado: 'Pendiente', pagado: false },
      { id: 2, fecha: '2026-10-19', hora: '11:00', paciente: 'María Gómez', dni: '40987654', estado: 'Pendiente', pagado: true },
      { id: 3, fecha: '2026-10-20', hora: '15:00', paciente: 'Carlos López', dni: '38987654', estado: 'Pendiente', pagado: false }
    ];
  }

  get turnosFiltrados() {
    return this.turnos.filter(t => {
      const matchFecha = this.fechaFiltro ? t.fecha === this.fechaFiltro : true;
      const matchDni = this.dniFiltro ? t.dni.includes(this.dniFiltro) : true;
      return matchFecha && matchDni;
    });
  }

  cobrarTurno(turno: any) {
    const confirmado = window.confirm(`¿Confirmar cobro y asistencia para ${turno.paciente} (${turno.fecha} ${turno.hora})?`);
    if (confirmado) {
      turno.pagado = true;
      turno.estado = 'Completado';
      window.alert('¡El pago y la asistencia se registraron correctamente!');
    }
  }
}