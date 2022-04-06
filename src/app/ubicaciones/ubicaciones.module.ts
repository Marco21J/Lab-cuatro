import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UbicacionesRoutingModule } from './ubicaciones-routing.module';
import { UbicacionMainComponent } from './pages/ubicacion-main/ubicacion-main.component';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    UbicacionMainComponent
  ],
  imports: [
    CommonModule,
    UbicacionesRoutingModule,
    DataTablesModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class UbicacionesModule { }
