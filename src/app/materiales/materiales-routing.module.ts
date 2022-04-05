import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialMainComponent } from './pages/material-main/material-main.component';
import { MaterialAddComponent } from './pages/material-add/material-add.component';
import { MaterialEditComponent } from './pages/material-edit/material-edit.component';
import { MaterialDetailComponent } from './pages/material-detail/material-detail.component';

const routes: Routes = [
  {
    path: '',
    component: MaterialMainComponent,
  },
  {
    path: 'new',
    component: MaterialAddComponent
  },
  {
    path: 'edit/:id',
    component: MaterialEditComponent
  },
  {
    path: 'detail/:id',
    component: MaterialDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialesRoutingModule { }
