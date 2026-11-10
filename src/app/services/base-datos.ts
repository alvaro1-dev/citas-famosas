
import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection
} from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root'
})
export class BaseDatosService {

  private sqlite = new SQLiteConnection(CapacitorSQLite);
  private db: SQLiteDBConnection | null = null;
  private inicializacion: Promise<void> | null = null;
  private readonly nombreBD = 'citas_famosas';

  // Evita inicializar dos veces la base de datos
  inicializar(): Promise<void> {
    if (!this.inicializacion) {
      this.inicializacion = this.prepararBaseDatos()
        .catch(error => {
          this.inicializacion = null;
          throw error;
        });
    }

    return this.inicializacion;
  }

  private async prepararBaseDatos(): Promise<void> {

    // Preparar el almacenamiento SQLite del navegador
    if (Capacitor.getPlatform() === 'web') {
      await customElements.whenDefined('jeep-sqlite');
      await this.sqlite.initWebStore();
    }

    // Crear o recuperar la conexión
    const existe = await this.sqlite.isConnection(
      this.nombreBD,
      false
    );

    if (existe.result) {
      this.db = await this.sqlite.retrieveConnection(
        this.nombreBD,
        false
      );
    } else {
      this.db = await this.sqlite.createConnection(
        this.nombreBD,
        false,
        'no-encryption',
        1,
        false
      );
    }

    const abierta = await this.db.isDBOpen();

    if (!abierta.result) {
      await this.db.open();
    }

    // Crear la tabla solamente si no existe
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS citas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        frase TEXT NOT NULL,
        autor TEXT NOT NULL
      );
    `);

    await this.guardarCambios();

    console.log('Base de datos SQLite inicializada');
  }

  // Devuelve la conexión inicializada
  async obtenerConexion(): Promise<SQLiteDBConnection> {
    await this.inicializar();

    if (!this.db) {
      throw new Error('SQLite no está disponible');
    }

    return this.db;
  }

  // En navegador, guardar en el almacenamiento persistente
  async guardarCambios(): Promise<void> {
    if (Capacitor.getPlatform() === 'web') {
      await this.sqlite.saveToStore(this.nombreBD);
    }
  }
}
