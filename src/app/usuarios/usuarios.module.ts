import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuarioMainComponent } from './pages/usuario-main/usuario-main.component';
import { DataTablesModule } from 'angular-datatables';
import { UsuarioFormComponent } from './components/usuario-form/usuario-form.component';
import { UsuarioNewComponent } from './pages/usuario-new/usuario-new.component';
import { UsuarioEditComponent } from './pages/usuario-edit/usuario-edit.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UsuarioMainComponent,
    UsuarioFormComponent,
    UsuarioNewComponent,
    UsuarioEditComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    DataTablesModule,
    ReactiveFormsModule,
  ]
})
export class UsuariosModule { }
