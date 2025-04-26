/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
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
  private authErrorSubject = new Subject<void>();
  authError$ = this.authErrorSubject.asObservable();

  private http: HttpClient = inject(HttpClient);
  private router: Router = inject(Router);
  private url = environment.SERVER_URL + 'auth/';

  constructor() {
    if (this.hasToken()) {
      const token = this.getAccessToken();
      if (!this.isValidTokenFormat(token) || this.isTokenExpired(token)) {
        console.error('Invalid or expired token during initialization');
        this.clearSession();
        return;
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

  isValidTokenFormat(token: string | null): boolean {
    if (!token) return false;
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.error('Invalid token format: Token does not have 3 parts');
      return false;
    }
    return true;
  }

  getDecodedAccessToken(token: string | null): any {
    if (!this.isValidTokenFormat(token)) return null;

    try {
      const decodedToken = jwtDecode(token!);
      this.currentUser$.subscribe((decodedToken) => {
        if (decodedToken) {
          this.currentUserSubject.next(decodedToken);
        }
      });
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

  private decodeBase64(base64: string): string {
    try {
      // Add padding if missing
      const paddedBase64 = base64.padEnd(
        base64.length + ((4 - (base64.length % 4)) % 4),
        '='
      );
      return atob(paddedBase64);
    } catch (error) {
      console.error('Error decoding Base64:', error);
      throw new Error('Invalid token format');
    }
  }

  isTokenExpired(token: string | null): boolean {
    if (!this.isValidTokenFormat(token)) return true;

    try {
      const parts = token!.split('.');
      const payloadBase64 = parts[1];
      const payload = JSON.parse(this.decodeBase64(payloadBase64));
      return payload.exp < Date.now() / 1000;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  hasRole(allowedRoleIds: number[]): boolean {
    const user = this.currentUserSubject.getValue();
    return !!user && allowedRoleIds.includes(user.idRole);
  }

  clearSession(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    this.isAuthenticated$.next(false);
    this.currentUserSubject.next(null);
    this.authErrorSubject.next(); // Emitir evento de error de autenticación
  }

  logout(redirectToLanding = true): void {
    this.clearSession();
    if (redirectToLanding) {
      this.router.navigate(['/landing']);
    }
  }
}
