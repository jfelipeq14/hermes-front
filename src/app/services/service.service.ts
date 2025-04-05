import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ServiceModel } from '../models';
import { environment } from '../../environments/environment';

@Injectable()
export class ServiceService {
  constructor(private http: HttpClient) {}

  private url = environment.SERVER_URL + 'services/';

  getAll(): Observable<ServiceModel[]> {
    return this.http.get<ServiceModel[]>(this.url);
  }

  getById(id: number): Observable<ServiceModel> {
    return this.http.get<ServiceModel>(this.url + id);
  }

  getByPackage(id: number): Observable<ServiceModel[]> {
    return this.http.get<ServiceModel[]>(this.url + id);
  }

  create(service: ServiceModel): Observable<ServiceModel> {
    return this.http.post<ServiceModel>(this.url, service);
  }

  update(service: ServiceModel): Observable<ServiceModel> {
    return this.http.put<ServiceModel>(this.url + service.id, service);
  }

  changeStatus(id: number): Observable<ServiceModel> {
    return this.http.patch<ServiceModel>(this.url + id, {});
  }
}
