import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { Cita } from '../../services/citas';

@Component({
  selector: 'app-cita-card',
  templateUrl: './cita-card.component.html',
  styleUrls: ['./cita-card.component.scss'],
  standalone: false
})
export class CitaCardComponent {

  // Recibe la cita desde la página principal
  @Input() cita: Cita | null = null;

  // Controla si aparece el botón de eliminar
  @Input() permitirEliminar = false;

  // Envía un evento a la página principal
  @Output() eliminar = new EventEmitter<number>();

  solicitarEliminacion() {
    if (this.cita && this.permitirEliminar) {
      this.eliminar.emit(this.cita.id);
    }
  }
}

