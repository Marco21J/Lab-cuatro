import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IRolRead } from '../models/interface';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  constructor(private http: HttpClient) { }

  public getRoles(): Observable<IRolRead[]> {
    return this.http.get<IRolRead[]>('/roles');
  }
}
