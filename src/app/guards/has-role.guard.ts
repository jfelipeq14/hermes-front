import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

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

          router.navigate(['/home']);
        }

        return of(hasRole);
      })
    );
  };
};
