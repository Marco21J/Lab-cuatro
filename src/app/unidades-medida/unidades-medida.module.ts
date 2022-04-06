import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnidadesMedidaRoutingModule } from './unidades-medida-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { UnidadMedidaMainComponent } from './pages/unidad-medida-main/unidad-medida-main.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    UnidadMedidaMainComponent
  ],
  imports: [
    CommonModule,
    UnidadesMedidaRoutingModule,
    DataTablesModule,
    ReactiveFormsModule,
    SharedModule,
  ]
})
export class UnidadesMedidaModule { }
