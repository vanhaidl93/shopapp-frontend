import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { LoginResponse } from '../models/login.model';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN_KEY = 'access_token';
  private jwtHelperService = new JwtHelperService();
  private urlUsers = `${environment}/users`;

  private refreshing: boolean = false;

  constructor(private httpClient: HttpClient) {}

  getToken(): string {
    return localStorage.getItem(this.TOKEN_KEY) ?? '';
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  extractUserIdFromToken() {
    let decodedToken = this.jwtHelperService.decodeToken(this.getToken() ?? ''); // non-nullist, short-circuited

    return 'userId' in decodedToken ? parseInt(decodedToken['userId']) : 0;
  }

  isTokenExpired() {
    const token = this.getToken();
    if (!token) {
      return true;
    }
    return this.jwtHelperService.isTokenExpired(this.getToken()!);
  }
}
