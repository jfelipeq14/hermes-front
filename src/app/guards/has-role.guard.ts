import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const hasRoleGuard = (allowedRoleIds: number[]): CanActivateFn => {
    return () => {
        const authService = inject(AuthService);

        return authService.currentUser$.pipe(
            switchMap((user) => {
                // Si no hay usuario, redirigir al login
                if (!user) {
                    window.location.href = '/landing';
                    return of(false);
                }

                // Verificar si el usuario tiene un rol permitido
                const hasRole = allowedRoleIds.includes(user.idRole);

                if (!hasRole) {
                    window.location.href = '/landing';
                }

                return of(hasRole);
            })
        );
    };
};
