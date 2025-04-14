import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MunicipalityModel } from '../models';
import { environment } from '../../environments/environment';

@Injectable()
export class MunicipalityService {
  constructor(private http: HttpClient) {}
  private url = environment.SERVER_URL + 'municipalities/';

  getAll(): Observable<MunicipalityModel[]> {
    return this.http.get<MunicipalityModel[]>(this.url);
  }

  getById(id: number): Observable<MunicipalityModel> {
    return this.http.get<MunicipalityModel>(this.url + id);
  }

  create(activity: MunicipalityModel): Observable<MunicipalityModel[]> {
    return this.http.post<MunicipalityModel[]>(this.url, activity);
  }

  update(activity: MunicipalityModel): Observable<MunicipalityModel[]> {
    return this.http.patch<MunicipalityModel[]>(
      this.url + activity.id,
      activity
    );
  }

  changeStatus(id: number): Observable<MunicipalityModel[]> {
    return this.http.patch<MunicipalityModel[]>(this.url + id, {});
  }
}
