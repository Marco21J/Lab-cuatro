import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { ILoginResponse } from '../../../auth/models/interfaces/login-response.interface';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/ngrx/reducer/app.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  /* user!: ILoginResponse;
  private subscription = new Subscription(); */

  constructor(
    /* private authService: AuthService,
    private store: Store<AppState> */
  ) {
    /* this.getUser();
    this.authService.userStatus(); */
  }

  /* public getUser(): void {
    this.subscription.add(this.store.select('user').subscribe(({ user }) => {
      if (user) {
        this.user = user;
      }
    }));
  }

  public logout(): void {
    this.authService.logout();
  } */

}
