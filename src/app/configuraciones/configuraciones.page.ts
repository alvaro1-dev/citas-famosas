import {
  Component,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';

import { ConfiguracionService } from '../services/configuracion';

@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.page.html',
  styleUrls: ['./configuraciones.page.scss'],
  standalone: false,
})
export class ConfiguracionesPage {

  permitirEliminar = false;

  constructor(
    private configuracionService: ConfiguracionService,
    private cd: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  async ionViewWillEnter() {
    try {
      const permiso =
        await this.configuracionService.obtenerPermiso();

      this.zone.run(() => {
        this.permitirEliminar = permiso;
        this.cd.detectChanges();
      });

    } catch (error) {
      console.error('Error al cargar configuración:', error);
    }
  }

  async cambiarConfiguracion(evento: any) {
    const nuevoValor = evento.detail.checked;

    this.permitirEliminar = nuevoValor;

    try {
      await this.configuracionService.guardarPermiso(
        nuevoValor
      );
    } catch (error) {
      console.error('Error al guardar configuración:', error);
    }
  }
}
