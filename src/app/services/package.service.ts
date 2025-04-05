import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PackageModel, PackageServiceModel } from '../models';
import { environment } from '../../environments/environment';

@Injectable()
export class PackageService {
  constructor(private http: HttpClient) {}

  private url = environment.SERVER_URL + '/packages/';

  getAll(): Observable<PackageModel[]> {
    return this.http.get<PackageModel[]>(this.url);
  }

  getServicePackages(idPackage: number): Observable<PackageServiceModel[]> {
    return this.http.get<PackageServiceModel[]>(
      this.url + 'package/' + idPackage
    );
  }

  getById(id: number): Observable<PackageModel> {
    return this.http.get<PackageModel>(this.url + id);
  }

  create(pkg: PackageModel): Observable<PackageModel> {
    return this.http.post<PackageModel>(this.url, pkg);
  }

  createServicePackage(
    servicePackage: PackageServiceModel
  ): Observable<PackageServiceModel> {
    return this.http.post<PackageServiceModel>(this.url, servicePackage);
  }

  update(pkg: PackageModel): Observable<PackageModel> {
    return this.http.put<PackageModel>(this.url + pkg.id, pkg);
  }

  changeStatus(id: number): Observable<PackageModel> {
    return this.http.patch<PackageModel>(this.url + id, {});
  }
}
