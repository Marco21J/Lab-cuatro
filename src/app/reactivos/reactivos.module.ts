import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReactivosRoutingModule } from './reactivos-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { ReactivoMainComponent } from './pages/reactivo-main/reactivo-main.component';
import { ReactivoAddComponent } from './pages/reactivo-add/reactivo-add.component';
import { ReactivoEditComponent } from './pages/reactivo-edit/reactivo-edit.component';
import { ReactivoDetailComponent } from './pages/reactivo-detail/reactivo-detail.component';
import { ReactivoSkusComponent } from './components/reactivo-skus/reactivo-skus.component';


@NgModule({
  declarations: [
    ReactivoMainComponent,
    ReactivoAddComponent,
    ReactivoEditComponent,
    ReactivoDetailComponent,
    ReactivoSkusComponent
  ],
  imports: [
    CommonModule,
    ReactivosRoutingModule,
    ReactiveFormsModule,
    DataTablesModule
  ]
})
export class ReactivosModule { }
