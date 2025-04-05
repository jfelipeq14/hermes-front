import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ReservationModel } from '../models';
import { environment } from '../../environments/environment';

@Injectable()
export class ReservationsService {
  constructor(private http: HttpClient) {}

  private url = environment.SERVER_URL + '/reservations/';

  // Obtener todas las reservas
  getAll(): Observable<ReservationModel[]> {
    return this.http.get<ReservationModel[]>(this.url);
  }

  // Obtener una reserva por ID
  getById(id: number): Observable<ReservationModel> {
    return this.http.get<ReservationModel>(`${this.url}/${id}`);
  }

  // Crear una nueva reserva
  create(reservation: ReservationModel): Observable<ReservationModel> {
    return this.http.post<ReservationModel>(this.url, reservation);
  }

  // Actualizar una reserva existente
  update(reservation: ReservationModel): Observable<ReservationModel> {
    return this.http.put<ReservationModel>(
      `${this.url}/${reservation.id}`,
      reservation
    );
  }

  // Cambiar el estado de una reserva
  changeStatus(id: number): Observable<ReservationModel> {
    return this.http.patch<ReservationModel>(`${this.url}/${id}`, {});
  }
}
