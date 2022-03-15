import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ILoginResponse, ILoginRequest } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  public login(body: ILoginRequest): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`/auth/login`, body);
  }
}
