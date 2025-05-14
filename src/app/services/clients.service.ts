import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from '../models';
import { environment } from '../../environments/environment';

@Injectable()
export class ClientsService {
    constructor(private http: HttpClient) {}

    private url = environment.SERVER_URL + 'users/clients/';

    getAll(): Observable<UserModel[]> {
        return this.http.get<UserModel[]>(this.url);
    }
}
