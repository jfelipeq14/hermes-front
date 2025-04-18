/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ACCESS_TOKEN_KEY } from '../shared/helpers';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated$ = new BehaviorSubject<boolean>(this.hasToken());

  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);
  private url = environment.SERVER_URL + 'auth/';

  register(user: any): Observable<any | null> {
    return this.http.post<any>(`${this.url}register`, user).pipe(
      catchError((err: Error) => {
        console.error(err);
        return of(null);
      })
    );
  }

  login(loginUserRequest: any): Observable<any | null> {
    return this.http.post<any>(`${this.url}log-in`, loginUserRequest).pipe(
      catchError((err: Error) => {
        console.error(err);
        return of(null);
      })
    );
  }

  setTokens(accessToken: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    this.isAuthenticated$.next(true);
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  isTokenExpired(token: string): boolean {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp < Date.now() / 1000;
    } catch (error) {
      console.error(error);
      return true;
    }
  }

  refreshToken() {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      this.logout();
      return;
    }

    return this.http
      .post<any>(`${this.url}/refreshToken`, {
        expiredAccessToken: accessToken,
      })
      .pipe(
        tap((response) => {
          this.setTokens(response.accessToken);
        }),
        catchError(() => {
          this.logout();
          this.clearSession();
          throw new Error('Session expired');
        })
      );
  }

  clearSession(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    this.isAuthenticated$.next(false);
    this.router.navigate(['/landing']);
  }

  logout(): void {
    // codigo pendiente
    console.log('User logged out');
    this.clearSession();
  }
}
