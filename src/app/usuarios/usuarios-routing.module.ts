import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioMainComponent } from './pages/usuario-main/usuario-main.component';
import { UsuarioNewComponent } from './pages/usuario-new/usuario-new.component';
import { UsuarioEditComponent } from './pages/usuario-edit/usuario-edit.component';

const routes: Routes = [
  {
    path: '',
    component: UsuarioMainComponent
  },
  {
    path: 'new',
    component: UsuarioNewComponent
  },
  {
    path: 'edit/:id',
    component: UsuarioEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
