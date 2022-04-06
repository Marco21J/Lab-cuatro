import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { RolEnum } from '../common/enums/rol.enum';
import { RolGuard } from '../auth/guards/rol.guard';

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
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'usuarios'
      },
      {
        path: 'usuarios',
        loadChildren: () => import('../usuarios/usuarios.module').then(m => m.UsuariosModule),
        canActivate: [RolGuard],
        data: {
          roles: [RolEnum.ADMIN]
        }
      },
      {
        path: 'marcas',
        loadChildren: () => import('../marcas/marcas.module').then(m => m.MarcasModule),
        canActivate: [RolGuard],
        data: {
          roles: [RolEnum.ADMIN, RolEnum.LABORATORIO, RolEnum.DOCENTE]
        }
      },
      {
        path: 'unidades-medida',
        loadChildren: () => import('../unidades-medida/unidades-medida.module').then(m => m.UnidadesMedidaModule),
        canActivate: [RolGuard],
        data: {
          roles: [RolEnum.ADMIN, RolEnum.LABORATORIO, RolEnum.DOCENTE]
        }
      },
      {
        path: 'ubicaciones',
        loadChildren: () => import('../ubicaciones/ubicaciones.module').then(m => m.UbicacionesModule),
      },
      {
        path: 'materiales',
        loadChildren: () => import('../materiales/materiales.module').then(m => m.MaterialesModule),
      },
      {
        path: 'reactivos',
        loadChildren: () => import('../reactivos/reactivos.module').then(m => m.ReactivosModule),
      },
      {
        path: 'main',
        loadChildren: () => import('../dashboard-pages/dashboard-pages.module').then(m => m.DashboardPagesModule),
        canActivate: [RolGuard],
        data: {
          roles: [RolEnum.ADMIN, RolEnum.LABORATORIO, RolEnum.DOCENTE]
        }
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
