import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  private clave = 'permitirEliminarCitas';

  async guardarPermiso(permitir: boolean): Promise<void> {
    await Preferences.set({
      key: this.clave,
      value: String(permitir)
    });

    console.log('Preferencia guardada:', permitir);
  }

  async obtenerPermiso(): Promise<boolean> {
    const resultado = await Preferences.get({
      key: this.clave
    });

    console.log('Preferencia recuperada:', resultado.value);

    return resultado.value === 'true';
  }
}

