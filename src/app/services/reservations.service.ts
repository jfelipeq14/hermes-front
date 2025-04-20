import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ReservationModel } from '../models/reservation';
import { environment } from '../../environments/environment';
import { ReservationTravelerModel } from '../models';

@Injectable()
export class ReservationsService {
  constructor(private http: HttpClient) {}

  private urlReservation = environment.SERVER_URL + 'reservations/';
  private urlTraveler = environment.SERVER_URL + 'travelers/';

  // Obtener todas las reservaciones
  getAll(): Observable<ReservationModel[]> {
    return this.http.get<ReservationModel[]>(this.urlReservation);
  }

  // Obtener una reservación por ID
  getById(id: number): Observable<ReservationModel> {
    return this.http.get<ReservationModel>(`${this.urlReservation}${id}`);
  }

  // Crear una nueva reservación
  create(reservation: ReservationModel): Observable<ReservationModel> {
    console.log('create', reservation);
    return this.http.post<ReservationModel>(this.urlReservation, reservation);
  }

  createTraveler(
    travelers: ReservationTravelerModel[]
  ): Observable<ReservationTravelerModel[]> {
    return this.http.post<ReservationTravelerModel[]>(
      this.urlTraveler,
      travelers
    );
  }

  // Actualizar una reservación existente
  update(reservation: ReservationModel): Observable<ReservationModel> {
    return this.http.patch<ReservationModel>(
      `${this.urlReservation}${reservation.id}`,
      reservation
    );
  }

  // Cambiar el estado de una reservación
  changeStatus(id: number): Observable<ReservationModel> {
    return this.http.patch<ReservationModel>(`${this.urlReservation}${id}`, {});
  }
}
