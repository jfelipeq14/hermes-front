import { RolePrivilegeModel } from './role-privilege';

export class RoleModel {
  id = 0;
  name = '';
  status = true;
  rolePrivileges: RolePrivilegeModel[] = [];
}
