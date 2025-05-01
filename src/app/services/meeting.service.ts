import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MeetingModel } from '../models';

@Injectable()
export class MeetingService {
  constructor(private http: HttpClient) {}

  private url = environment.SERVER_URL + 'meetings/';

  getAll(): Observable<MeetingModel[]> {
    return this.http.get<MeetingModel[]>(this.url);
  }

  create(meeting: MeetingModel): Observable<MeetingModel> {
    return this.http.post<MeetingModel>(this.url, meeting);
  }

  changeStatus(meeting: MeetingModel): Observable<MeetingModel> {
    return this.http.patch<MeetingModel>(this.url + meeting.id, {});
  }
}
