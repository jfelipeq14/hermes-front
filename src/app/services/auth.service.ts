/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ACCESS_TOKEN_KEY } from '../shared/helpers';
import { jwtDecode } from 'jwt-decode';

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
      const decodedToken = this.getDecodedAccessToken(token);
      if (decodedToken) {
        this.currentUserSubject.next(decodedToken);
      }
    }
  }

  login(user: any): Observable<any> {
    return this.http.post<any>(this.url + 'log-in', user);
  }

  register(user: any): Observable<any> {
    return this.http.post<any>(this.url + 'sign-up', user);
  }

  redirectBasedOnRole(roleId: number): void {
    if (!roleId) {
      this.router.navigate(['/landing']);
      return;
    }
    this.router.navigate(['/home']);
  }

  getDecodedAccessToken(token: string | null): any {
    try {
      if (!token) return null;
      const decodedToken = jwtDecode(token);

      this.currentUser$.subscribe((decodedToken) => {
        if (decodedToken) {
          this.currentUserSubject.next(decodedToken);
        }
      });

      console.log(this.currentUser$ + ' decoded token', decodedToken);

      return decodedToken;
    } catch (err) {
      console.error('Error decoding token:', err);
      return null;
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
    this.router.navigate(['/landing']);
    this.isAuthenticated$.next(false);
    this.currentUserSubject.next(null);
    console.log('User logged out');
  }

  logout(): void {
    this.clearSession();
  }
}
