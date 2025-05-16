import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const isAuthenticatedGuard: CanActivateFn = () => {
    const authService = inject(AuthService);

    if (authService.hasToken()) {
        return true; // Usuario autenticado
    }

    window.location.href = '/landing';

    return false;
};
