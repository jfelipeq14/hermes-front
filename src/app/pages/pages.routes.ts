import { Routes } from '@angular/router';
import { DashboardPage } from './dashboard/dashboard.component';
import { UsersPage } from './users/users.component';
import { CategoriesPage } from './categories/categories.component';
import { ServicesPage } from './services/services.component';
import { ActivitiesPage } from './activities/activities.component';
import { PackagesPage } from './packages/packages.component';
import { ProgrammingPage } from './programming/programming.component';
import { PaymentsPage } from './payments/payments.component';
import { ReservationsPage } from './reservations/reservations.component';
import { ClientsPage } from './clients/clients.component';
import { ProfileComponent } from './profile/profile.component';
import { hasRoleGuard } from '../guards/has-role.guard';
import { isAuthenticatedGuard } from '../guards/is-authenticated.guard';

// Definir constantes para los IDs de roles
const ROLE_IDS = {
    ADMIN: 1,
    GUIDE: 2,
    CLIENT: 3
};

export default [
    {
        path: 'dashboard',
        component: DashboardPage,
        canActivate: [() => hasRoleGuard([ROLE_IDS.ADMIN])]
    },
    // {
    //     path: 'roles',
    //     component: RolesPage,
    //     canActivate: [() => hasRoleGuard([ROLE_IDS.ADMIN])]
    // },
    {
        path: 'users',
        component: UsersPage,
        canActivate: [() => hasRoleGuard([ROLE_IDS.ADMIN])]
    },
    {
        path: 'categories',
        component: CategoriesPage,
        canActivate: [() => hasRoleGuard([ROLE_IDS.ADMIN])]
    },
    {
        path: 'services',
        component: ServicesPage,
        canActivate: [() => hasRoleGuard([ROLE_IDS.ADMIN])]
    },
    {
        path: 'activities',
        component: ActivitiesPage,
        canActivate: [() => hasRoleGuard([ROLE_IDS.ADMIN])]
    },
    {
        path: 'packages',
        component: PackagesPage,
        canActivate: [() => hasRoleGuard([ROLE_IDS.ADMIN])]
    },
    {
        path: 'programming',
        component: ProgrammingPage,
        canActivate: [() => hasRoleGuard([ROLE_IDS.ADMIN, ROLE_IDS.GUIDE])]
    },
    {
        path: 'clients',
        component: ClientsPage,
        canActivate: [() => hasRoleGuard([ROLE_IDS.ADMIN])]
    },
    {
        path: 'payments',
        component: PaymentsPage,
        canActivate: [() => hasRoleGuard([ROLE_IDS.ADMIN, ROLE_IDS.CLIENT])]
    },
    {
        path: 'reservations',
        component: ReservationsPage,
        canActivate: [() => hasRoleGuard([ROLE_IDS.ADMIN, ROLE_IDS.CLIENT])]
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [isAuthenticatedGuard] // No es necesario pasar argumentos aquí
    },
    {
        path: '**',
        redirectTo: ''
    }
] as Routes;
