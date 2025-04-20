import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      // Si el usuario está autenticado, permitir acceso
      if (user) {
        return true;
      }
      
      // Si no está autenticado, redirigir al landing
      router.navigate(['/landing']);
      return false;
    })
  );
};