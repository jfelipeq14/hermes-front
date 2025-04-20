import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ROLE_IDS } from '../shared/constants/roles';

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

      // Si ya está logueado, redirigir según su rol
      switch (user.idRole) {
        case ROLE_IDS.GUIDE:
          router.navigate(['/home/programming']);
          break;
        case ROLE_IDS.CLIENT:
          router.navigate(['/home/reservations']);
          break;
        case ROLE_IDS.ADMIN:
          router.navigate(['/home/dashboard']);
          break;
        default:
          router.navigate(['/home']);
      }

      return false;
    })
  );
};
