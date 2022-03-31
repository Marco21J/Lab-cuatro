import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPaginateResponse } from 'src/app/common/interface';
import { IMarcaCreate, IMarcaDeleteResponse, IMarcaEdit, IMarcaRead } from '../models/interface';

@Injectable({
  providedIn: 'root'
})
export class MarcaService {

  constructor(private http: HttpClient) { }

  public getAllPaginated(skip = 0, take = 1, query: string): Observable<IPaginateResponse<IMarcaRead>> {
    return this.http.get<IPaginateResponse<IMarcaRead>>(`/marcas/filter/?skip=${skip}&take=${take}&query=${query}`);
  }

  public createOne(body: IMarcaCreate): Observable<IMarcaRead> {
    return this.http.post<IMarcaRead>('/marcas', body);
  }

  public updateOne(id: string, body: IMarcaEdit): Observable<IMarcaEdit> {
    return this.http.put<IMarcaEdit>(`/marcas/${id}`, body);
  }

  public deleteOne(id: string): Observable<IMarcaDeleteResponse> {
    return this.http.delete<IMarcaDeleteResponse>(`/marcas/${id}`);
  }
}
