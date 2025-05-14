import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RoleModel } from '../models/role';
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

    create(role: RoleModel): Observable<RoleModel> {
        return this.http.post<RoleModel>(this.url, role);
    }

    update(role: RoleModel): Observable<RoleModel> {
        return this.http.patch<RoleModel>(this.url + role.id, role);
    }

    changeStatus(id: number): Observable<RoleModel> {
        return this.http.patch<RoleModel>(`${this.url}${id}/change-status`, {});
    }
}
