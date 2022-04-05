import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITipoMaterialRead } from '../models/interface';

@Injectable({
  providedIn: 'root'
})
export class TipoMaterialService {

  constructor(private http: HttpClient) { }

  public getAll(): Observable<ITipoMaterialRead[]> {
    return this.http.get<ITipoMaterialRead[]>(`/tipo-material`);
  }
}
