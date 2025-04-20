/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ACCESS_TOKEN_KEY } from '../shared/helpers';
import { ROLE_IDS } from '../shared/constants/roles';

export interface User {
  id: number;
  idRole: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated$ = new BehaviorSubject<boolean>(this.hasToken());
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);
  private url = environment.SERVER_URL + 'auth/';

  constructor() {
    if (this.hasToken()) {
      const token = this.getAccessToken();
      if (!token && this.isTokenExpired(token)) {
        this.clearSession();
      }
    }
  }

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
      tap((response) => {
        console.log(response);
        if (response?.token) {
          this.setTokens(response.token);
          this.currentUserSubject.next(response.user);

          // Redirigir según el rol del usuario
          this.redirectBasedOnRole(response.user.idRole);
        }
      }),
      catchError((err: Error) => {
        console.error(err);
        return of(null);
      })
    );
  }

  redirectBasedOnRole(roleId: number): void {
    switch (roleId) {
      case ROLE_IDS.ADMIN:
        this.router.navigate(['/home/dashboard']);
        break;
      case ROLE_IDS.GUIDE:
        this.router.navigate(['/home/programming']);
        break;
      case ROLE_IDS.CLIENT:
        this.router.navigate(['/home/reservations']);
        break;
      default:
        this.router.navigate(['/landing']);
    }
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

  isTokenExpired(token: string | null): boolean {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp < Date.now() / 1000;
    } catch (error) {
      console.error(error);
      return true;
    }
  }

  hasRole(allowedRoleIds: number[]): boolean {
    const user = this.currentUserSubject.getValue();
    return !!user && allowedRoleIds.includes(user.idRole);
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
    this.currentUserSubject.next(null);
    this.router.navigate(['/landing']);
  }

  logout(): void {
    console.log('User logged out');
    this.clearSession();
  }
}
