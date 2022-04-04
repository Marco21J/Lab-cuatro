import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPaginateResponse } from 'src/app/common/interface';
import { IUbicacionRead, IUbicacionCreate, IUbicacionDeleteResponse, IUbicacionEdit } from '../models/interface';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {

  constructor(private http: HttpClient) { }

  public getAllPaginated(skip = 0, take = 1, query: string): Observable<IPaginateResponse<IUbicacionRead>> {
    return this.http.get<IPaginateResponse<IUbicacionRead>>(`/ubicaciones/filter/?skip=${skip}&take=${take}&query=${query}`);
  }

  public createOne(body: IUbicacionCreate): Observable<IUbicacionRead> {
    return this.http.post<IUbicacionRead>('/ubicaciones', body);
  }

  public updateOne(id: string, body: IUbicacionEdit): Observable<IUbicacionEdit> {
    return this.http.put<IUbicacionEdit>(`/ubicaciones/${id}`, body);
  }

  public deleteOne(id: string): Observable<IUbicacionDeleteResponse> {
    return this.http.delete<IUbicacionDeleteResponse>(`/ubicaciones/${id}`);
  }
}
