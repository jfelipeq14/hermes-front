import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from '../models';
import { environment } from '../../environments/environment';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  private url = environment.SERVER_URL + 'users/';

  getAll(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(this.url);
  }

  getById(id: number): Observable<UserModel> {
    return this.http.get<UserModel>(this.url + id);
  }

  create(roles: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(this.url, roles);
  }

  update(roles: UserModel): Observable<UserModel> {
    return this.http.patch<UserModel>(this.url + roles.id, roles);
  }

  changeStatus(id: number): Observable<UserModel> {
    return this.http.patch<UserModel>(this.url + id, {});
  }
}
