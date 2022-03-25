import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MarcasRoutingModule } from './marcas-routing.module';
import { MarcaMainComponent } from './pages/marca-main/marca-main.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';


@NgModule({
  declarations: [
    MarcaMainComponent
  ],
  imports: [
    CommonModule,
    MarcasRoutingModule,
    ReactiveFormsModule,
    DataTablesModule,
  ]
})
export class MarcasModule { }
