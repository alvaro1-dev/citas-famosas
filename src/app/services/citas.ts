import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BaseDatosService } from './base-datos';

export interface Cita {
  id: number;
  frase: string;
  autor: string;
}

@Injectable({
  providedIn: 'root'
})
export class CitasService {

  private citasSubject = new BehaviorSubject<Cita[]>([]);
  citas$ = this.citasSubject.asObservable();

  private cargaInicial: Promise<void> | null = null;

  constructor(private baseDatos: BaseDatosService) {}

  // Inicializar SQLite y cargar las citas guardadas
  inicializar(): Promise<void> {
    if (!this.cargaInicial) {
      this.cargaInicial = this.prepararCitas()
        .catch(error => {
          this.cargaInicial = null;
          throw error;
        });
    }
    return this.cargaInicial;
  }

  private async prepararCitas(): Promise<void> {
    const db = await this.baseDatos.obtenerConexion();

    // Registro para insertar las citas iniciales una sola vez
    await db.execute(`
      CREATE TABLE IF NOT EXISTS app_meta (
        clave TEXT PRIMARY KEY NOT NULL,
        valor TEXT NOT NULL
      );
    `);

    const resultado = await db.query(
      "SELECT valor FROM app_meta WHERE clave = ?",
      ['citas_inicializadas']
    );

    if (!resultado.values?.length) {
      const iniciales = [
        [
          'El éxito consiste en obtener lo que se desea. La felicidad en disfrutar lo que se obtiene.',
          'Ralph Waldo Emerson'
        ],
        [
          'La vida es aquello que te va sucediendo mientras te empeñas en hacer otros planes.',
          'John Lennon'
        ],
        [
          'No hay camino para la paz, la paz es el camino.',
          'Mahatma Gandhi'
        ]
      ];

      for (const [frase, autor] of iniciales) {
        await db.run(
          'INSERT INTO citas (frase, autor) VALUES (?, ?)',
          [frase, autor]
        );
      }

      await db.run(
        'INSERT INTO app_meta (clave, valor) VALUES (?, ?)',
        ['citas_inicializadas', 'true']
      );

      await this.baseDatos.guardarCambios();
    }

    await this.cargarCitas();
  }

  // Leer desde SQLite
  async cargarCitas(): Promise<void> {
    const db = await this.baseDatos.obtenerConexion();

    const resultado = await db.query(
      'SELECT id, frase, autor FROM citas ORDER BY id ASC'
    );

    this.citasSubject.next(
      (resultado.values ?? []) as Cita[]
    );
  }

  obtenerCitas(): Cita[] {
    return this.citasSubject.getValue();
  }

  // Guardar una nueva cita
  async agregarCita(
    frase: string,
    autor: string
  ): Promise<void> {
    await this.inicializar();

    const db = await this.baseDatos.obtenerConexion();

    await db.run(
      'INSERT INTO citas (frase, autor) VALUES (?, ?)',
      [frase.trim(), autor.trim()]
    );

    await this.baseDatos.guardarCambios();
    await this.cargarCitas();
  }

  // Eliminar una cita definitivamente
  async eliminarCita(id: number): Promise<void> {
    await this.inicializar();

    const db = await this.baseDatos.obtenerConexion();

    await db.run(
      'DELETE FROM citas WHERE id = ?',
      [id]
    );

    await this.baseDatos.guardarCambios();
    await this.cargarCitas();
  }

  obtenerAleatoria(): Cita | null {
    const citas = this.obtenerCitas();

    if (citas.length === 0) {
      return null;
    }

    const indice = Math.floor(Math.random() * citas.length);
    return citas[indice];
  }
}
