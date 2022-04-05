import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactivoMainComponent } from './pages/reactivo-main/reactivo-main.component';
import { ReactivoAddComponent } from './pages/reactivo-add/reactivo-add.component';
import { ReactivoEditComponent } from './pages/reactivo-edit/reactivo-edit.component';
import { ReactivoDetailComponent } from './pages/reactivo-detail/reactivo-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ReactivoMainComponent
  },
  {
    path: 'new',
    component: ReactivoAddComponent
  },
  {
    path: 'edit/:id',
    component: ReactivoEditComponent
  },
  {
    path: 'detail/:id',
    component: ReactivoDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReactivosRoutingModule { }
