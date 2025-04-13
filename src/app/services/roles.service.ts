import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoleModel } from '../models';
import { environment } from '../../environments/environment';

@Injectable()
export class RolesService {
  constructor(private http: HttpClient) {}

  private url = environment.SERVER_URL + 'roles/';

  getAll(): Observable<RoleModel[]> {
    return this.http.get<RoleModel[]>(this.url);
  }

  getById(id: number): Observable<RoleModel> {
    return this.http.get<RoleModel>(this.url + id);
  }

  create(roles: RoleModel): Observable<RoleModel> {
    return this.http.post<RoleModel>(this.url, roles);
  }

  update(roles: RoleModel): Observable<RoleModel> {
    return this.http.patch<RoleModel>(this.url + roles.id, roles);
  }

  changeStatus(id: number): Observable<RoleModel> {
    return this.http.patch<RoleModel>(this.url + id, {});
  }
}
