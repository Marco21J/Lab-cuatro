import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPaginateResponse } from 'src/app/common/interface';
import { IReactivoCreate, IReactivoDeleteResponse, IReactivoEdit, IReactivoRead } from '../models/interface';

@Injectable({
  providedIn: 'root'
})
export class ReactivoService {

  constructor(private http: HttpClient) { }

  public getAllPaginated(skip = 0, take = 1, query: string): Observable<IPaginateResponse<IReactivoRead>> {
    return this.http.get<IPaginateResponse<IReactivoRead>>(`/reactivos/filter/?skip=${skip}&take=${take}&query=${query}`);
  }

  public getOneById(id: string): Observable<IReactivoRead> {
    return this.http.get<IReactivoRead>(`/reactivos/${id}`);
  }

  public createOne(body: IReactivoCreate): Observable<IReactivoRead> {
    return this.http.post<IReactivoRead>('/reactivos', body);
  }

  public updateOne(id: string, body: IReactivoEdit): Observable<IReactivoEdit> {
    return this.http.put<IReactivoEdit>(`/reactivos/${id}`, body);
  }

  public deleteOne(id: string): Observable<IReactivoDeleteResponse> {
    return this.http.delete<IReactivoDeleteResponse>(`/reactivos/all/${id}`);
  }
}
