import {
  Component,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';
import { addIcons } from 'ionicons';

import {
  settingsOutline,
  refreshOutline,
  trashOutline
} from 'ionicons/icons';

import {
  CitasService,
  Cita
} from '../services/citas';

import {
  ConfiguracionService
} from '../services/configuracion';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  cita: Cita | null = null;

  permitirEliminar = false;

   constructor(
  private citasService: CitasService,
  private configuracionService: ConfiguracionService,
  private cd: ChangeDetectorRef,
  private zone: NgZone
) {
  addIcons({
    'settings-outline': settingsOutline,
    'refresh-outline': refreshOutline,
    'trash-outline': trashOutline
  });
}



async ionViewWillEnter() {
  try {
    // Cargar las citas guardadas en SQLite
    await this.citasService.inicializar();
    await this.citasService.cargarCitas();

    // Recuperar el permiso actualizado desde Preferences
    const permiso =
      await this.configuracionService.obtenerPermiso();

    this.zone.run(() => {
      this.permitirEliminar = permiso;
      this.cita = this.citasService.obtenerAleatoria();

      console.log('Permiso en Inicio:', this.permitirEliminar);

      this.cd.detectChanges();
    });

  } catch (error) {
    console.error('Error al cargar Inicio:', error);
  }
}

// Selecciona y muestra una cita aleatoria
nuevaCita() {
  this.zone.run(() => {
    this.cita = this.citasService.obtenerAleatoria();
    this.cd.detectChanges();
  });
}

async eliminarCita(id: number) {
  if (!this.permitirEliminar) {
    return;
  }

  try {
    await this.citasService.eliminarCita(id);
    this.nuevaCita();
  } catch (error) {
    console.error('Error al eliminar la cita:', error);
  }
}
}
