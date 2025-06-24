import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const hasRoleGuard = (allowedRoleIds: number[]): CanActivateFn => {
    return () => {
        const authService = inject(AuthService);

        return authService.currentUser$.pipe(
            switchMap((user) => {
                if (!user) {
                    window.location.href = '/landing';
                    return of(false);
                }

                authService.redirectBasedOnRole();

                const hasRole = allowedRoleIds.includes(user.idRole);
                if (!hasRole) {
                    window.location.href = '/landing';
                }
                return of(hasRole);
            })
        );
    };
};
