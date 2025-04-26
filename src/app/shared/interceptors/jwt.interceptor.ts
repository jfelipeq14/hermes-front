import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../services';
import { EXTERNAL_AUTH_ACTIONS } from '../helpers';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService: AuthService = inject(AuthService);
  const externalAuthActions = [EXTERNAL_AUTH_ACTIONS.LOGIN];

  if (externalAuthActions.some((action: string) => req.url.includes(action))) {
    return next(req);
  }

  const accessToken = authService.getAccessToken();

  if (!accessToken) {
    return next(req);
  }

  if (
    !authService.isValidTokenFormat(accessToken) ||
    authService.isTokenExpired(accessToken)
  ) {
    console.error('Invalid or expired token');
    authService.logout();
    return throwError(() => new Error('Invalid or expired token'));
  }

  const clonedRequest = req.clone({
    setHeaders: { Authorization: `Bearer ${accessToken}` },
  });

  return next(clonedRequest).pipe(
    catchError((error) => {
      if (error.status === 401) {
        console.error('Unauthorized error, clearing session');
        authService.clearSession(); // Limpiar sesión sin redirigir automáticamente
      } else {
        console.error('Error in backend response:', error);
      }
      return throwError(() => error);
    })
  );
};
