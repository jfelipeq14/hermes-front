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

    getAllByResponsible(idResponsible: number): Observable<DateModel[]> {
        return this.http.get<DateModel[]>(`${this.url}responsible/${idResponsible}`);
    }

    create(date: DateModel): Observable<DateModel> {
        return this.http.post<DateModel>(`${this.url}`, date);
    }

    update(date: DateModel): Observable<DateModel> {
        return this.http.patch<DateModel>(`${this.url}${date.id}`, date);
    }

    changeStatus(id: number): Observable<DateModel> {
        return this.http.patch<DateModel>(`${this.url}changeStatus/${id}`, {});
    }
}
