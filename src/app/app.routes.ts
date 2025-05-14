import { Routes } from '@angular/router';
import { AppLayout } from './layout/component/app.layout';
import { authGuard } from './guards/auth.guard';
import { loggedGuard } from './guards/logged.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'landing',
        pathMatch: 'full'
    },
    {
        path: 'landing',
        loadComponent: () => import('./pages/home/home.component').then((m) => m.HomePage),
        canActivate: [loggedGuard]
    },
    {
        path: 'home',
        component: AppLayout,
        loadChildren: () => import('./pages/pages.routes'),
        canActivate: [authGuard]
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];
