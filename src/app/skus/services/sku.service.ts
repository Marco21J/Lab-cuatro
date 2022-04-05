import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISkuCreate, ISkuRead, ISkuDeleteResponse } from '../models/interface';

@Injectable({
  providedIn: 'root'
})
export class SkuService {

  constructor(private http: HttpClient) { }

  public getOneById(id: number): Observable<ISkuRead[]> {
    return this.http.get<ISkuRead[]>(`/skus/${id}`);
  }

  public createOne(body: ISkuCreate): Observable<ISkuRead> {
    return this.http.post<ISkuRead>('/skus', body);
  }

  public updateOne(id: number, body: ISkuCreate): Observable<ISkuCreate> {
    return this.http.put<ISkuCreate>(`/skus/${id}`, body);
  }

  public deleteOne(id: number): Observable<ISkuDeleteResponse> {
    return this.http.delete<ISkuDeleteResponse>(`/skus/${id}`);
  }
}
