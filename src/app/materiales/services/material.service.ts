import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPaginateResponse } from 'src/app/common/interface';
import { IMaterialCreate, IMaterialDeleteResponse, IMaterialEdit, IMaterialRead } from '../models/interface';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  constructor(private http: HttpClient) { }

  public getAllPaginated(skip = 0, take = 1, query: string): Observable<IPaginateResponse<IMaterialRead>> {
    return this.http.get<IPaginateResponse<IMaterialRead>>(`/materiales/filter/?skip=${skip}&take=${take}&query=${query}`);
  }

  public getOneById(id: string): Observable<IMaterialRead> {
    return this.http.get<IMaterialRead>(`/materiales/${id}`);
  }

  public createOne(body: IMaterialCreate): Observable<IMaterialRead> {
    return this.http.post<IMaterialRead>('/materiales', body);
  }

  public updateOne(id: string, body: IMaterialEdit): Observable<IMaterialEdit> {
    return this.http.put<IMaterialEdit>(`/materiales/${id}`, body);
  }

  public deleteOne(id: string): Observable<IMaterialDeleteResponse> {
    return this.http.delete<IMaterialDeleteResponse>(`/materiales/all/${id}`);
  }
}
