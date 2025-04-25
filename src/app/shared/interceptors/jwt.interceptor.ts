import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
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

  return from(Promise.resolve(authService.refreshToken())).pipe(
    switchMap((refreshResult) => {
      if (!refreshResult) {
        authService.logout();
        return throwError(() => new Error('Session expired'));
      }

      const newToken = authService.getAccessToken();
      if (!authService.isValidTokenFormat(newToken)) {
        console.error('Invalid refreshed token format');
        authService.logout();
        return throwError(() => new Error('Session expired'));
      }

      const clonedRequest = req.clone({
        setHeaders: { Authorization: `Bearer ${newToken}` },
      });
      return next(clonedRequest);
    }),
    catchError((error) => {
      authService.logout();
      return throwError(() => error);
    })
  );

  const clonedRequest = req.clone({
    setHeaders: { Authorization: `Bearer ${accessToken}` },
  });

  return next(clonedRequest).pipe(
    catchError((error) => {
      if (error.status === 401) {
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
