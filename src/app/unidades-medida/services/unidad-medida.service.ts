import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPaginateResponse } from 'src/app/common/interface';
import { Observable } from 'rxjs';
import { IUnidadMedidaCreate, IUnidadMedidaDeleteResponse, IUnidadMedidaEdit, IUnidadMedidaRead } from '../models/interface';

@Injectable({
  providedIn: 'root'
})
export class UnidadMedidaService {

  constructor(private http: HttpClient) { }

  public getAllPaginated(skip = 0, take = 1, query: string): Observable<IPaginateResponse<IUnidadMedidaRead>> {
    return this.http.get<IPaginateResponse<IUnidadMedidaRead>>(`/unidad-medida/filter/?skip=${skip}&take=${take}&query=${query}`);
  }

  public getAll(): Observable<IUnidadMedidaRead[]> {
    return this.http.get<IUnidadMedidaRead[]>(`/unidad-medida`);
  }

  public createOne(body: IUnidadMedidaCreate): Observable<IUnidadMedidaRead> {
    return this.http.post<IUnidadMedidaRead>('/unidad-medida', body);
  }

  public updateOne(id: string, body: IUnidadMedidaEdit): Observable<IUnidadMedidaEdit> {
    return this.http.put<IUnidadMedidaEdit>(`/unidad-medida/${id}`, body);
  }

  public deleteOne(id: string): Observable<IUnidadMedidaDeleteResponse> {
    return this.http.delete<IUnidadMedidaDeleteResponse>(`/unidad-medida/${id}`);
  }
}
