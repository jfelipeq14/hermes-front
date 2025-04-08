export class UserModel {
  id = 0;
  idRole = 3;
  typeDocument = '';
  document = '';
  name = '';
  surName = '';
  dateBirth: Date | null = null;
  email = '';
  password = '';
  idMunicipality = 0;
  address: string | null = null;
  phone = '';
  emergency: string | null = null;
  sex: string | null = null;
  bloodType: string | null = null;
  eps: string | null = null;
  status = true;
}
