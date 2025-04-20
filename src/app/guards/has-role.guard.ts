import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ROLE_IDS } from '../shared/constants/roles';

export const hasRoleGuard = (allowedRoleIds: number[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.currentUser$.pipe(
      switchMap((user) => {
        // Si no hay usuario, redirigir al login
        if (!user) {
          router.navigate(['/landing']);
          return of(false);
        }

        // Verificar si el usuario tiene un rol permitido
        const hasRole = allowedRoleIds.includes(user.idRole);

        if (!hasRole) {
          // Mostrar mensaje de acceso denegado
          alert('Acceso denegado. No tiene los permisos necesarios.');

          // Redirigir según el rol del usuario
          switch (user.idRole) {
            case ROLE_IDS.ADMIN:
              router.navigate(['/home/dashboard']);
              break;
            case ROLE_IDS.GUIDE:
              router.navigate(['/home/programming']);
              break;
            case ROLE_IDS.CLIENT:
              router.navigate(['/home/reservations']);
              break;
            default:
              router.navigate(['/landing']);
          }
        }

        return of(hasRole);
      })
    );
  };
};
