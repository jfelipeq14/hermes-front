import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = 'https://api.example.com/dashboard'; // Cambia esta URL por la de tu API

  constructor(private http: HttpClient) {}

  getDailyRevenue(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/daily-revenue`);
  }

  getTopClients(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/top-clients`);
  }

  getTopSellingPackages(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/top-selling-packages`);
  }
}