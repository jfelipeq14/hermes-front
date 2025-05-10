import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivityModel } from '../models';
import { environment } from '../../environments/environment';

@Injectable()
export class ActivityService {
    constructor(private http: HttpClient) {}
    private url = environment.SERVER_URL + 'activities/';

    getAll(): Observable<ActivityModel[]> {
        return this.http.get<ActivityModel[]>(this.url);
    }

    getById(id: number): Observable<ActivityModel> {
        return this.http.get<ActivityModel>(this.url + id);
    }

    create(activity: ActivityModel): Observable<ActivityModel> {
        return this.http.post<ActivityModel>(this.url, activity);
    }

    update(activity: ActivityModel): Observable<ActivityModel> {
        return this.http.patch<ActivityModel>(this.url + activity.id, activity);
    }

    changeStatus(id: number): Observable<ActivityModel> {
        return this.http.patch<ActivityModel>(this.url + `${id}/change-status`, {});
    }
}
