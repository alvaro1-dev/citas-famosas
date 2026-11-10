
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

import { defineCustomElements } from 'jeep-sqlite/loader';
import { Capacitor } from '@capacitor/core';

// Registrar jeep-sqlite antes de iniciar Angular
async function iniciarAplicacion() {

  if (Capacitor.getPlatform() === 'web') {

    await defineCustomElements(window);

    if (!document.querySelector('jeep-sqlite')) {
      const jeepSqlite =
        document.createElement('jeep-sqlite');

      document.body.appendChild(jeepSqlite);
    }
  }

  // Iniciar Angular
  await platformBrowserDynamic()
    .bootstrapModule(AppModule);
}

iniciarAplicacion().catch(error => {
  console.error('Error al iniciar la aplicación:', error);
});
