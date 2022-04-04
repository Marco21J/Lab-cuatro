import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UbicacionMainComponent } from './pages/ubicacion-main/ubicacion-main.component';

const routes: Routes = [
  {
    path: '',
    component: UbicacionMainComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UbicacionesRoutingModule { }
