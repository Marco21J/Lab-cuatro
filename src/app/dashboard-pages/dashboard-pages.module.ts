import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardPagesRoutingModule } from './dashboard-pages-routing.module';
import { DashboardMainComponent } from './pages/dashboard-main/dashboard-main.component';
import { ReactivosModule } from '../reactivos/reactivos.module';
import { MaterialesModule } from '../materiales/materiales.module';


@NgModule({
  declarations: [
    DashboardMainComponent
  ],
  imports: [
    CommonModule,
    DashboardPagesRoutingModule,
    ReactivosModule,
    MaterialesModule,
  ]
})
export class DashboardPagesModule { }
