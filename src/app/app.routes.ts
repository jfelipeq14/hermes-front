import { Routes } from '@angular/router';
import { AppLayout } from './layout/component/app.layout';
import { HomePage } from './pages/home/home.component';
// import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'home',
    component: AppLayout,
    // canActivate: [authGuard],
    loadChildren: () => import('./pages/pages.routes'),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
