import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DateModel } from '../models';

@Injectable()
export class ProgrammingService {
  constructor(private http: HttpClient) {}

  private url = environment.SERVER_URL + 'dates/';

  getAll(): Observable<DateModel[]> {
    return this.http.get<DateModel[]>(this.url);
  }

  getAllActive(): Observable<DateModel[]> {
    return this.http.get<DateModel[]>(`${this.url}`);
  }

  create(date: DateModel): Observable<DateModel> {
    return this.http.post<DateModel>(`${this.url}`, date);
  }

  update(dates: DateModel[]): Observable<DateModel[]> {
    return this.http.patch<DateModel[]>(`${this.url}`, dates);
  }

  changeStatus(id: number): Observable<DateModel> {
    return this.http.patch<DateModel>(`${this.url}${id}`, {});
  }
}
