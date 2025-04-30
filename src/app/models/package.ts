import { PackageServiceModel } from './package-service';

export class PackageModel {
  id = 0;
  name = '';
  idActivity = 0;
  idMunicipality = 0;
  level = 0;
  price = 0;
  reserve = 0;
  description = '';
  image = null;
  status = true;
  detailPackagesServices: PackageServiceModel[] = [];
}
