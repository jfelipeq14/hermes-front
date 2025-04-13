import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PackageModel, PackageServiceModel } from '../models';
import { environment } from '../../environments/environment';

@Injectable()
export class PackageService {
  constructor(private http: HttpClient) {}

  private urlPackage = environment.SERVER_URL + 'packages/';
  private urlPackageService = environment.SERVER_URL + 'package-services/';

  getAll(): Observable<PackageModel[]> {
    return this.http.get<PackageModel[]>(this.urlPackage);
  }

  getServicePackages(idPackage: number): Observable<PackageServiceModel[]> {
    return this.http.get<PackageServiceModel[]>(
      this.urlPackageService + 'package/' + idPackage
    );
  }

  getById(id: number): Observable<PackageModel> {
    return this.http.get<PackageModel>(this.urlPackage + id);
  }

  create(pkg: PackageModel): Observable<PackageModel> {
    return this.http.post<PackageModel>(this.urlPackage, pkg);
  }

  createServicePackage(
    servicePackage: PackageServiceModel
  ): Observable<PackageServiceModel> {
    return this.http.post<PackageServiceModel>(
      this.urlPackageService,
      servicePackage
    );
  }

  update(pkg: PackageModel): Observable<PackageModel> {
    return this.http.patch<PackageModel>(this.urlPackage + pkg.id, pkg);
  }

  changeStatus(id: number): Observable<PackageModel> {
    return this.http.patch<PackageModel>(this.urlPackage + id, {});
  }
}
