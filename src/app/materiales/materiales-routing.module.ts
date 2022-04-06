import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialMainComponent } from './pages/material-main/material-main.component';
import { MaterialAddComponent } from './pages/material-add/material-add.component';
import { MaterialEditComponent } from './pages/material-edit/material-edit.component';
import { MaterialDetailComponent } from './pages/material-detail/material-detail.component';
import { RolGuard } from '../auth/guards/rol.guard';
import { RolEnum } from '../common/enums';

const routes: Routes = [
  {
    path: '',
    component: MaterialMainComponent,
    canActivate: [RolGuard],
    data: {
      roles: [RolEnum.ADMIN, RolEnum.LABORATORIO, RolEnum.DOCENTE]
    }
  },
  {
    path: 'new',
    component: MaterialAddComponent,
    data: {
      roles: [RolEnum.ADMIN, RolEnum.LABORATORIO]
    }
  },
  {
    path: 'edit/:id',
    component: MaterialEditComponent,
    data: {
      roles: [RolEnum.ADMIN, RolEnum.LABORATORIO]
    }
  },
  {
    path: 'detail/:id',
    component: MaterialDetailComponent,
    data: {
      roles: [RolEnum.ADMIN, RolEnum.LABORATORIO, RolEnum.DOCENTE]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialesRoutingModule { }
