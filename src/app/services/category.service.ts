import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryModel } from '../models';
import { environment } from '../../environments/environment';

@Injectable()
export class CategoryService {
  constructor(private http: HttpClient) {}

  private url = environment.SERVER_URL + 'category-services/';

  getAll(): Observable<CategoryModel[]> {
    return this.http.get<CategoryModel[]>(this.url);
  }

  getById(id: number): Observable<CategoryModel> {
    return this.http.get<CategoryModel>(this.url + id);
  }

  create(categoryService: CategoryModel): Observable<CategoryModel> {
    return this.http.post<CategoryModel>(this.url, categoryService);
  }

  update(categoryService: CategoryModel): Observable<CategoryModel> {
    return this.http.patch<CategoryModel>(
      this.url + categoryService.id,
      categoryService
    );
  }

  changeStatus(id: number): Observable<CategoryModel> {
    return this.http.patch<CategoryModel>(this.url + `${id}/change-status`, {});
  }
}
