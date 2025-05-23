import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class ImageService {
    constructor(private http: HttpClient) {}
    private url = environment.SERVER_URL + 'images/';

    upload(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('image', file, file.name);
        return this.http.post(this.url, formData, {
            headers: {
                enctype: 'multipart/form-data' // Ensure correct content type
            }
        });
    }
}
