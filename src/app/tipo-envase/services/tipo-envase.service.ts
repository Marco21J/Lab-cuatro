import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ITipoEnvaseRead } from '../models/interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoEnvaseService {

  constructor(private http: HttpClient) { }

  public getAll(): Observable<ITipoEnvaseRead[]> {
    return this.http.get<ITipoEnvaseRead[]>(`/tipo-envase`);
  }
}
