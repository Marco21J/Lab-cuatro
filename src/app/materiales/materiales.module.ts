import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialesRoutingModule } from './materiales-routing.module';
import { MaterialMainComponent } from './pages/material-main/material-main.component';
import { MaterialAddComponent } from './pages/material-add/material-add.component';
import { MaterialEditComponent } from './pages/material-edit/material-edit.component';
import { DataTablesModule } from 'angular-datatables';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialDetailComponent } from './pages/material-detail/material-detail.component';
import { MaterialSkusComponent } from './components/material-skus/material-skus.component';


@NgModule({
  declarations: [
    MaterialMainComponent,
    MaterialAddComponent,
    MaterialEditComponent,
    MaterialDetailComponent,
    MaterialSkusComponent
  ],
  imports: [
    CommonModule,
    MaterialesRoutingModule,
    DataTablesModule,
    ReactiveFormsModule
  ]
})
export class MaterialesModule { }
