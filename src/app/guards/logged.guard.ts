import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const loggedGuard: CanActivateFn = () => {
    const authService = inject(AuthService);

    return authService.currentUser$.pipe(
        take(1),
        map((user) => {
            // Si no está logueado, permitir acceso al landing
            if (!user) {
                return true;
            }
            window.location.href = '/home';

            return false;
        })
    );
};
