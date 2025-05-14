import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PrivilegeModel } from '../models/privilege';
import { environment } from '../../environments/environment';

@Injectable()
export class PrivilegeService {
    constructor(private http: HttpClient) {}

    private url = environment.SERVER_URL + 'privileges/';

    getAll(): Observable<PrivilegeModel[]> {
        return this.http.get<PrivilegeModel[]>(this.url);
    }

    getById(id: number): Observable<PrivilegeModel> {
        return this.http.get<PrivilegeModel>(this.url + id);
    }

    create(privilege: PrivilegeModel): Observable<PrivilegeModel> {
        return this.http.post<PrivilegeModel>(this.url, privilege);
    }

    update(privilege: PrivilegeModel): Observable<PrivilegeModel> {
        return this.http.patch<PrivilegeModel>(this.url + privilege.id, privilege);
    }

    changeStatus(id: number): Observable<PrivilegeModel> {
        return this.http.patch<PrivilegeModel>(`${this.url}${id}/change-status`, {});
    }
}
