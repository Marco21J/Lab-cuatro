import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RolEnum } from '../../common/enums/rol.enum';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RolGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated() && route.data.roles) {
      const userRol = this.authService.getUserSession();
      const roles = route.data.roles as RolEnum[];
      const isAllowed = roles.includes(userRol.rol.id); 
      if (isAllowed) {
        return true;
      }
      this.router.navigateByUrl('/forbidden');
      return false;
    }
    this.router.navigateByUrl('/forbidden');
    return false;
  }
  
}
