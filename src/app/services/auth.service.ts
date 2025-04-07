/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}
  private url = environment.SERVER_URL + 'auth/';

  LoginModel = {
    email: '',
    password: '',
  };

  RegisterModel = {
    idRole: 0,
    typeDocument: '',
    document: '',
    name: '',
    surName: '',
    idMunicipality: 0,
    phone: '',
    email: '',
    password: '',
  };

  login(): Observable<any> {
    return this.http.post<any>(this.url + 'log-in', this.LoginModel);
  }

  register(): Observable<any> {
    return this.http.post<any>(this.url + 'sign-up', this.RegisterModel);
  }
}
