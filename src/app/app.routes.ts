import { Routes } from '@angular/router';
import { AppLayout } from './layout/component/app.layout';
import { DashboardPage } from './pages/dashboard/dashboard.component';
import { RolesPage } from './pages/roles/roles.component';
import { UsersPage } from './pages/users/users.component';
import { CategoriesPage } from './pages/categories/categories.component';
import { ServicesPage } from './pages/services/services.component';
import { ActivitiesPage } from './pages/activities/activities.component';
import { PackagesPage } from './pages/packages/packages.component';
import { ProgrammingPage } from './pages/programming/programming.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayout,
    children: [
      {
        path: '',
        component: DashboardPage,
      },
      { path: 'roles', component: RolesPage },
      { path: 'users', component: UsersPage },
      { path: 'categories', component: CategoriesPage },
      { path: 'services', component: ServicesPage },
      { path: 'activities', component: ActivitiesPage },
      { path: 'packages', component: PackagesPage },
      { path: 'programming', component: ProgrammingPage },
    ],
  },
];
