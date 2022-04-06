import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolGuard } from '../auth/guards/rol.guard';
import { RolEnum } from '../common/enums';
import { UbicacionMainComponent } from './pages/ubicacion-main/ubicacion-main.component';

const routes: Routes = [
  {
    path: '',
    component: UbicacionMainComponent,
    canActivate: [RolGuard],
    data: {
      roles: [RolEnum.ADMIN, RolEnum.LABORATORIO, RolEnum.DOCENTE]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UbicacionesRoutingModule { }
