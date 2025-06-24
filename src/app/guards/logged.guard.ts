import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const loggedGuard: CanActivateFn = () => {
    const authService = inject(AuthService);

    return authService.currentUser$.pipe(
        take(1),
        map((user) => {
            if (user) {
                authService.redirectBasedOnRole();
                return false;
            }

            return true;
        })
    );
};
