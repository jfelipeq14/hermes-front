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

    getAll(): Observable<ReservationModel[]> {
        return this.http.get<ReservationModel[]>(this.urlReservation);
    }

    getAllByUser(id: number): Observable<ReservationModel[]> {
        return this.http.get<ReservationModel[]>(`${this.urlReservation}user/${id}`);
    }

    getTravelers(idDate: number): Observable<ReservationModel[]> {
        return this.http.get<ReservationModel[]>(`${this.urlReservation}travelers/${idDate}`);
    }

    create(reservation: ReservationModel): Observable<ReservationModel> {
        return this.http.post<ReservationModel>(this.urlReservation, reservation);
    }

    createTraveler(travelers: ReservationTravelerModel[]): Observable<ReservationTravelerModel[]> {
        return this.http.post<ReservationTravelerModel[]>(this.urlTraveler, travelers);
    }

    update(reservation: ReservationModel): Observable<ReservationModel> {
        return this.http.patch<ReservationModel>(`${this.urlReservation}${reservation.id}`, reservation);
    }

    changeStatus(id: number, status: string): Observable<ReservationModel> {
        return this.http.patch<ReservationModel>(this.urlReservation + `${id}/change-status`, { status });
    }
}
