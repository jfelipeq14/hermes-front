import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { PaymentModel } from '../models';

@Injectable()
export class PaymentService {
  constructor(private http: HttpClient) {}
  private url = environment.SERVER_URL + 'payments/';

  getAll(): Observable<PaymentModel[]> {
    return this.http.get<PaymentModel[]>(this.url);
  }

  getById(id: number): Observable<PaymentModel> {
    return this.http.get<PaymentModel>(this.url + id);
  }

  create(activity: PaymentModel): Observable<PaymentModel> {
    return this.http.post<PaymentModel>(this.url, activity);
  }

  update(activity: PaymentModel): Observable<PaymentModel> {
    return this.http.put<PaymentModel>(this.url + activity.id, activity);
  }

  changeStatus(id: number): Observable<PaymentModel> {
    return this.http.patch<PaymentModel>(this.url + id, {});
  }
}
