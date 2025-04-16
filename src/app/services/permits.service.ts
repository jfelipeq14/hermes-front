import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PermitModel } from '../models';

@Injectable()
export class PermitsService {
  constructor(private http: HttpClient) {}

  private url = environment.SERVER_URL + 'permits/';

  getAll(): Observable<PermitModel[]> {
    return this.http.get<PermitModel[]>(this.url);
  }

  getById(id: number): Observable<PermitModel> {
    return this.http.get<PermitModel>(this.url + id);
  }

  create(role: PermitModel): Observable<PermitModel> {
    return this.http.post<PermitModel>(this.url, role);
  }

  update(role: PermitModel): Observable<PermitModel> {
    return this.http.patch<PermitModel>(this.url + role.id, role);
  }

  changeStatus(id: number): Observable<PermitModel> {
    return this.http.patch<PermitModel>(`${this.url}${id}/change-status`, {});
  }
}
