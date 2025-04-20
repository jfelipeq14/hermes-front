import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const loggedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    map((user) => {
      // Si no está logueado, permitir acceso al landing
      if (!user) {
        return true;
      }
      router.navigate(['/home']);

      return false;
    })
  );
};
