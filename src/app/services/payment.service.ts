import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { PaymentModel, ReservationModel } from '../models';

@Injectable()
export class PaymentService {
  constructor(private http: HttpClient) {}
  private urlPayment = environment.SERVER_URL + 'payments/';
  private urlReservation = environment.SERVER_URL + 'reservations/';

  getAll(): Observable<PaymentModel[]> {
    return this.http.get<PaymentModel[]>(this.urlPayment);
  }
  getAllReservationWhitPayments(): Observable<ReservationModel[]> {
    return this.http.get<ReservationModel[]>(this.urlReservation + 'reservations-with-payments');
  }

  getById(id: number): Observable<PaymentModel> {
    return this.http.get<PaymentModel>(this.urlPayment + id);
  }

  getByReservation(idReservation: number): Observable<PaymentModel[]> {
    return this.http.get<PaymentModel[]>(`${this.urlPayment}reservation/${idReservation}`);
  }

  create(activity: PaymentModel): Observable<PaymentModel> {
    return this.http.post<PaymentModel>(this.urlPayment, activity);
  }

  update(activity: PaymentModel): Observable<PaymentModel> {
    return this.http.patch<PaymentModel>(this.urlPayment + activity.id, activity);
  }

  changeStatus(id: number, status: string): Observable<PaymentModel> {
    return this.http.patch<PaymentModel>(this.urlPayment + `changeStatus/${id}`,{status});
  }
}
