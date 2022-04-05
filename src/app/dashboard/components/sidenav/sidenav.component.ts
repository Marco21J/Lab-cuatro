import { Component, OnInit, OnDestroy } from '@angular/core';
import { ISidenavRoute } from './models/interfaces/sidenav-routes.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../ngrx/reducer/app.reducer';
import { Subscription } from 'rxjs';
import { ILoginResponse } from 'src/app/auth/models/interfaces';

@Component({
  selector: 'app-dashboard-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnDestroy {

  user!: ILoginResponse;
  private subscription = new Subscription();

  public routes: ISidenavRoute[] = [
    {
      path: '/dashboard/olv',
      text: 'Dashboard',
      faIcon: 'fas fa-tachometer-alt me-2'
    },
    {
      path: '/dashboard/usuarios',
      text: 'Usuarios',
      faIcon: 'fas fa-users me-2'
    },
    {
      path: '/dashboard/marcas',
      text: 'Marcas',
      faIcon: 'far fa-copyright me-2',
    },
    {
      path: '/dashboard/unidades-medida',
      text: 'Unidades de Medida',
      faIcon: 'fas fa-ruler-combined me-2',
    },
    {
      path: '/dashboard/ubicaciones',
      text: 'Ubicaciones',
      faIcon: 'fas fa-th me-2',
    },
    {
      path: '/dashboard/materiales',
      text: 'Materiales',
      faIcon: 'fas fa-prescription-bottle me-2',
    }
  ];

  constructor(private authService: AuthService, private store: Store<AppState>) {
    this.getUser();
    this.authService.userStatus();
  }

  public getUser(): void {
    this.subscription.add(this.store.select('user').subscribe(({ user }) => {
      if (user) {
        this.user = user;
      }
    }));
  }

  public logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
