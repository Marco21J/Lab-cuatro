import { Component, OnInit } from '@angular/core';
import { ISidenavRoute } from './models/interfaces/sidenav-routes.interface';

@Component({
  selector: 'app-dashboard-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {

  public routes: ISidenavRoute[] = [
    {
      path: '/dashboard/salv',
      text: 'Dashboard',
      faIcon: 'fas fa-tachometer-alt me-2'
    },
    {
      path: '/dashboard/prueba',
      text: 'Another',
      faIcon: 'fab fa-angular me-2'
    }
  ];

  constructor() { }

}
