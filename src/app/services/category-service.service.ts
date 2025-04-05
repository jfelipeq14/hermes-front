import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryServiceModel } from '../models';
import { environment } from '../../environments/environment';

@Injectable()
export class CategoryServiceService {
  constructor(private http: HttpClient) {}

  private url = environment.SERVER_URL + '/category-services/';

  getAll(): Observable<CategoryServiceModel[]> {
    return this.http.get<CategoryServiceModel[]>(this.url);
  }

  getById(id: number): Observable<CategoryServiceModel> {
    return this.http.get<CategoryServiceModel>(this.url + id);
  }

  create(
    categoryService: CategoryServiceModel
  ): Observable<CategoryServiceModel> {
    return this.http.post<CategoryServiceModel>(this.url, categoryService);
  }

  update(
    categoryService: CategoryServiceModel
  ): Observable<CategoryServiceModel> {
    return this.http.put<CategoryServiceModel>(
      this.url + categoryService.id,
      categoryService
    );
  }

  changeStatus(id: number): Observable<CategoryServiceModel> {
    return this.http.patch<CategoryServiceModel>(this.url + id, {});
  }
}
