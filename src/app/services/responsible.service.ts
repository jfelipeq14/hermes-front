import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from '../models';
import { environment } from '../../environments/environment';

@Injectable()
export class ResponsibleService {
    constructor(private http: HttpClient) {}

    private url = environment.SERVER_URL + 'users/responsibles/';

    getAll(): Observable<UserModel[]> {
        return this.http.get<UserModel[]>(this.url);
    }
}
