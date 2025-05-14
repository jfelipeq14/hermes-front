/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class DashboardService {
    constructor(private http: HttpClient) {}

    private url = environment.SERVER_URL + 'dashboard/';

    getSales(): Observable<any> {
        return this.http.get<any>(this.url);
    }

    getPackages(): Observable<any[]> {
        return this.http.get<any[]>(this.url);
    }

    getClients(): Observable<any[]> {
        return this.http.get<any[]>(this.url);
    }
}
