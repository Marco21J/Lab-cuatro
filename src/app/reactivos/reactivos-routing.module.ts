import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReactivoMainComponent } from './pages/reactivo-main/reactivo-main.component';
import { ReactivoAddComponent } from './pages/reactivo-add/reactivo-add.component';
import { ReactivoEditComponent } from './pages/reactivo-edit/reactivo-edit.component';
import { ReactivoDetailComponent } from './pages/reactivo-detail/reactivo-detail.component';
import { RolGuard } from '../auth/guards/rol.guard';
import { RolEnum } from '../common/enums';

const routes: Routes = [
  {
    path: '',
    component: ReactivoMainComponent,
    data: {
      roles: [RolEnum.ADMIN, RolEnum.LABORATORIO, RolEnum.DOCENTE]
    }
  },
  {
    path: 'new',
    component: ReactivoAddComponent,
    canActivate: [RolGuard],
    data: {
      roles: [RolEnum.ADMIN, RolEnum.LABORATORIO]
    }
  },
  {
    path: 'edit/:id',
    component: ReactivoEditComponent,
    data: {
      roles: [RolEnum.ADMIN, RolEnum.LABORATORIO]
    }
  },
  {
    path: 'detail/:id',
    component: ReactivoDetailComponent,
    data: {
      roles: [RolEnum.ADMIN, RolEnum.LABORATORIO, RolEnum.DOCENTE]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReactivosRoutingModule { }
