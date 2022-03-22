import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPaginateResponse } from 'src/app/common/interface';
import { IFullUsuarioRead, IUsuarioCreate, IUsuarioEdit, IUsuarioRead, IUsuarioStatusRequest, IUsuarioStatusResponse } from '../models/interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  public getUsuarios(skip = 0, take = 1, query: string): Observable<IPaginateResponse<IUsuarioRead>> {
    return this.http.get<IPaginateResponse<IUsuarioRead>>(`/usuarios/filter/?skip=${skip}&take=${take}&query=${query}`);
  }

  public getUserById(id: string): Observable<IUsuarioRead> {
    return this.http.get<IUsuarioRead>(`/usuarios/${id}`);
  }

  public getFullUserById(id: string): Observable<IFullUsuarioRead> {
    return this.http.get<IFullUsuarioRead>(`/usuarios/full/${id}`);
  }

  public editOne(id: string, body: IUsuarioEdit): Observable<IUsuarioEdit> {
    return this.http.put<IUsuarioEdit>(`/usuarios/${id}`, body);
  }

  public createOne(body: IUsuarioCreate): Observable<IUsuarioRead> {
    return this.http.post<IUsuarioRead>('/auth/new-user', body);
  }

  public deleteOne(id: string): Observable<IUsuarioRead> {
    return this.http.delete<IUsuarioRead>(`/usuarios/${id}`);
  }

  public statusToggle(id: string, body: IUsuarioStatusRequest): Observable<IUsuarioStatusResponse> {
    return this.http.put<IUsuarioStatusResponse>(`/usuarios/${id}/status`, body);
  }
}
