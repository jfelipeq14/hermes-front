import { Routes } from '@angular/router';
import { DashboardPage } from './dashboard/dashboard.component';
import { RolesPage } from './roles/roles.component';
import { UsersPage } from './users/users.component';
import { CategoriesPage } from './categories/categories.component';
import { ServicesPage } from './services/services.component';
import { ActivitiesPage } from './activities/activities.component';
import { PackagesPage } from './packages/packages.component';
import { ProgrammingPage } from './programming/programming.component';
import { PaymentsPage } from './payments/payments.component';


export default [
  { path: 'dashboard', component: DashboardPage },
  { path: 'roles', component: RolesPage },
  { path: 'users', component: UsersPage },
  { path: 'categories', component: CategoriesPage },
  { path: 'services', component: ServicesPage },
  { path: 'activities', component: ActivitiesPage },
  { path: 'packages', component: PackagesPage },
  { path: 'programming', component: ProgrammingPage },
  { path: 'payments', component: PaymentsPage },
  {
    path: '**',
    redirectTo: 'home',
  },
] as Routes;
