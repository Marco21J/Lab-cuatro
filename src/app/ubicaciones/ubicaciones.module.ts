import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UbicacionesRoutingModule } from './ubicaciones-routing.module';
import { UbicacionMainComponent } from './pages/ubicacion-main/ubicacion-main.component';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UbicacionMainComponent
  ],
  imports: [
    CommonModule,
    UbicacionesRoutingModule,
    DataTablesModule,
    ReactiveFormsModule
  ]
})
export class UbicacionesModule { }
