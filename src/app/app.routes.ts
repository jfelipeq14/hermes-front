import { Routes } from '@angular/router';
import { AppLayout } from './layout/component/app.layout';
import { authGuard } from './guards/auth.guard';
import { loggedGuard } from './guards/logged.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
  {
    path: 'landing',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomePage),
    canActivate: [loggedGuard], // Si el usuario ya está logueado, redirige según su rol
  },
  {
    path: 'reservation',
    loadComponent: () =>
      import('./pages/reservation/reservation.component').then(
        (m) => m.ReservationComponent
      ),
  },
  {
    path: 'home',
    component: AppLayout,
    canActivate: [authGuard], // Protege todas las rutas internas con authGuard
    loadChildren: () => import('./pages/pages.routes'),
  },
  {
    path: '**',
    redirectTo: 'landing',
  },
];
