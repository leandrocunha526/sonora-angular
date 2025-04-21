import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly API_URL = 'http://localhost:8080/auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(credentials: { username: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem(this.TOKEN_KEY, response.token);
      })
    );
  }

  register(data: { name: string; username: string; password: string; cpf: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, data);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  decodeToken(): any {
    const token = this.getToken();
    if (!token) return null;
    const payload = token.split('.')[1];
    try {
      return JSON.parse(atob(payload));
    } catch (e) {
      return null;
    }
  }

  getRole(): string | null {
    const decoded = this.decodeToken();
    const authority = decoded?.authorities?.[0];
    if (!authority) return null;
    return authority.replace('ROLE_', '');
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }
}
