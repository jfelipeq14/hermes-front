import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoleModel } from '../models/role.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private apiUrl = `${environment.SERVER_URL}roles`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<RoleModel[]> {
    return this.http.get<RoleModel[]>(this.apiUrl);
  }

  getById(id: number): Observable<RoleModel> {
    return this.http.get<RoleModel>(`${this.apiUrl}/${id}`);
  }

  create(role: RoleModel): Observable<RoleModel> {
    return this.http.post<RoleModel>(this.apiUrl, role);
  }

  update(role: RoleModel): Observable<RoleModel> {
    return this.http.put<RoleModel>(`${this.apiUrl}/${role.id}`, role);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  changeStatus(id: number): Observable<RoleModel> {
    return this.http.patch<RoleModel>(`${this.apiUrl}/${id}/status`, {});
  }
}
