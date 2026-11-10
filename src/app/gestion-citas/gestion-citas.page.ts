import { Component, ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';

import {
  CitasService,
  Cita
} from '../services/citas';

@Component({
  selector: 'app-gestion-citas',
  templateUrl: './gestion-citas.page.html',
  styleUrls: ['./gestion-citas.page.scss'],
  standalone: false
})
export class GestionCitasPage {

  formulario: FormGroup;
  citas: Cita[] = [];

   constructor(
       private fb: FormBuilder,
       private citasService: CitasService,
       private cd: ChangeDetectorRef
  ) {
    addIcons({
      'trash-outline': trashOutline
    });

    this.formulario = this.fb.group({
      frase: ['', [
        Validators.required,
        Validators.minLength(5)
      ]],
      autor: ['', [
        Validators.required,
        Validators.minLength(2)
      ]]
    });
  }


async ionViewWillEnter() {
  try {
    await this.citasService.inicializar();
    await this.cargarCitas();
  } catch (error) {
    console.error('Error al cargar SQLite:', error);
  }
}

async cargarCitas() {
  await this.citasService.cargarCitas();
  this.citas = this.citasService.obtenerCitas();
  this.cd.detectChanges();
}

async agregarCita() {
  const frase = String(
    this.formulario.value.frase ?? ''
  ).trim();

  const autor = String(
    this.formulario.value.autor ?? ''
  ).trim();

  if (
    this.formulario.invalid ||
    frase.length < 5 ||
    autor.length < 2
  ) {
    this.formulario.markAllAsTouched();
    return;
  }

  try {
    await this.citasService.agregarCita(frase, autor);
    await this.cargarCitas();
    this.formulario.reset();
  } catch (error) {
    console.error('Error al agregar la cita:', error);
  }
}

async eliminarCita(id: number) {
  try {
    await this.citasService.eliminarCita(id);
    await this.cargarCitas();
  } catch (error) {
    console.error('Error al eliminar la cita:', error);
  }
}
}
