import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DateModel } from '../models';

@Injectable()
export class ProgrammingService {
  constructor(private http: HttpClient) {}

  private url = environment.SERVER_URL + 'dates/';

  // Obtener todas las reservaciones
  getAll(): Observable<DateModel[]> {
    return this.http.get<DateModel[]>(this.url);
  }

  // Obtener una reservación por ID
  getById(id: number): Observable<DateModel> {
    return this.http.get<DateModel>(`${this.url}${id}`);
  }

  // Crear una nueva reservación
  create(reservation: DateModel): Observable<DateModel> {
    return this.http.post<DateModel>(this.url, reservation);
  }

  // Actualizar una reservación existente
  update(reservation: DateModel): Observable<DateModel> {
    return this.http.put<DateModel>(
      `${this.url}${reservation.id}`,
      reservation
    );
  }

  // Cambiar el estado de una reservación
  changeStatus(id: number): Observable<DateModel> {
    return this.http.patch<DateModel>(`${this.url}${id}`, {});
  }
}
