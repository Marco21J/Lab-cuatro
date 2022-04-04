import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnidadMedidaMainComponent } from './pages/unidad-medida-main/unidad-medida-main.component';

const routes: Routes = [
  {
    path: '',
    component: UnidadMedidaMainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnidadesMedidaRoutingModule { }
