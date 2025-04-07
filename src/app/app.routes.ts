import { Routes } from '@angular/router';
import { AppLayout } from './layout/component/app.layout';
// import { authGuard } from './guards/auth.guard';

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
  },
  {
    path: 'home',
    component: AppLayout,
    loadChildren: () => import('./pages/pages.routes'),
  },
  {
    path: '**',
    redirectTo: 'landing',
  },
];
