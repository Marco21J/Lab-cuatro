import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { AuthService } from '../../auth/services/auth.service';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {

  refreshTokenInProgress = false;
  accessTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor(
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isAuthenticaded = this.authService.isAuthenticated();
      return next.handle(request).pipe(
        catchError((e: HttpErrorResponse) => {
          if (e instanceof HttpErrorResponse && e.status === 401 && isAuthenticaded) {
            if (!this.refreshTokenInProgress) {
                this.refreshTokenInProgress = true;
                this.accessTokenSubject.next(null);
                return this.authService.refreshToken().pipe(
                    switchMap(authResponse => {
                      this.refreshTokenInProgress = false;
                      this.accessTokenSubject.next(authResponse.accessToken);
                      request = request.clone({
                        setHeaders: {
                          authorization: `Bearer ${authResponse.accessToken}`
                        }
                      });
                      return next.handle(request);
                    }),
                    catchError((refreshError: HttpErrorResponse) => {
                      this.refreshTokenInProgress = false;
                      this.authService.logout();
                      return throwError(refreshError);
                    })
                );
            } else {
              return this.accessTokenSubject.pipe(
                filter(accesToken => accesToken !== null),
                take(1),
                switchMap(token => {
                  request = request.clone({
                    setHeaders: {
                        authorization: `Bearer ${token}`
                    }
                  });
                  return next.handle(request);
                })
              );
            }
          }
          return throwError(e);
        })
      );
  }
}
