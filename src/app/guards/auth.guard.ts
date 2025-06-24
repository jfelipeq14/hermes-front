import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);

    return authService.currentUser$.pipe(
        take(1),
        map((user) => (user ? true : false))
    );
};
