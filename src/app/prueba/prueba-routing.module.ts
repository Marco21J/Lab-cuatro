import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PruebaMainComponent } from './components/prueba-main/prueba-main.component';

const routes: Routes = [
  {
    path: '',
    component: PruebaMainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PruebaRoutingModule { }
