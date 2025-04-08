import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ReservationModel } from '../models/reservation';
import { environment } from '../../environments/environment';

@Injectable()
export class ReservationsService {
  constructor(private http: HttpClient) {}

  private url = environment.SERVER_URL + 'reservations/';

  // Obtener todas las reservaciones
  getAll(): Observable<ReservationModel[]> {
    return this.http.get<ReservationModel[]>(this.url);
  }

  // Obtener una reservación por ID
  getById(id: number): Observable<ReservationModel> {
    return this.http.get<ReservationModel>(`${this.url}${id}`);
  }

  // Crear una nueva reservación
  create(reservation: ReservationModel): Observable<ReservationModel> {
    return this.http.post<ReservationModel>(this.url, reservation);
  }

  // Actualizar una reservación existente
  update(reservation: ReservationModel): Observable<ReservationModel> {
    return this.http.put<ReservationModel>(
      `${this.url}${reservation.id}`,
      reservation
    );
  }

  // Cambiar el estado de una reservación
  changeStatus(id: number): Observable<ReservationModel> {
    return this.http.patch<ReservationModel>(`${this.url}${id}`, {});
  }
}
