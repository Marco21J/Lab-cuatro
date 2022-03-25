import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MarcaMainComponent } from './pages/marca-main/marca-main.component';

const routes: Routes = [
  {
    path: '',
    component: MarcaMainComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarcasRoutingModule { }
