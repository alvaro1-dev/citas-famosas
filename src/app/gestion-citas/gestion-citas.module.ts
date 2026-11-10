import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { GestionCitasPageRoutingModule } from './gestion-citas-routing.module';
import { GestionCitasPage } from './gestion-citas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    GestionCitasPageRoutingModule
  ],
  declarations: [GestionCitasPage]
})
export class GestionCitasPageModule {}
