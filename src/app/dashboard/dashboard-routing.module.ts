import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { HeaderComponent } from './components/header/header.component';

const routes: Routes = [
  /* {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full'
  }, */
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      /* {
        path: '',
        pathMatch: 'full',
        redirectTo: 'prueba'
      }, */
      {
        path: 'prueba',
        loadChildren: () => import('../prueba/prueba.module').then(m => m.PruebaModule)
      },
      {
        path: 'salv',
        loadChildren: () => import('../prueba/prueba.module').then(m => m.PruebaModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
