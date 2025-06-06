import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const hasRoleGuard = (): CanActivateFn => {
    return () => {
        const authService = inject(AuthService);

        return authService.currentUser$.pipe(
            switchMap((user) => {
                if (user) {
                    authService.redirectBasedOnRole();
                    return of(false);
                }

                window.location.href = '/landing';
                return of(false);
            })
        );
    };
};
