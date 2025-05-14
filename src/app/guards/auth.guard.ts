import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.currentUser$.pipe(
        take(1),
        map((user) => {
            if (user) {
                return true; // Permitir acceso si el usuario está autenticado
            }

            // Redirigir al landing si no está autenticado
            router.navigate(['/landing']);
            return false;
        })
    );
};
