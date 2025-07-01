import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';

import { environment } from '../environment/environment';
import { UserDto, UserRegister, UserResponse } from '../models/user.model';
import { LoginDto, LoginResponse } from '../models/login.model';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiRegister = `${environment.apiBaseUrl}/users/register`;
  private apiLogin = `${environment.apiBaseUrl}/users/login`;
  private apiUserByBearToken = `${environment.apiBaseUrl}/users/details`;
  private apiUser = `${environment.apiBaseUrl}/users`;

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept-Language': 'vi',
  });

  constructor(
    private httpClient: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {}

  // to register user
  register(registerDto: UserRegister) {
    return this.httpClient.post(this.apiRegister, registerDto, {
      headers: this.headers,
    });
  }

  // to login user
  login(loginDto: LoginDto): Observable<LoginResponse> {
    return this.httpClient
      .post<LoginResponse>(this.apiLogin, loginDto, {
        headers: this.headers,
        withCredentials: true, // accept Cookie from BE.
      })
      .pipe(
        tap(() => {
          if (!loginDto.rememberMe) {
            sessionStorage.setItem('onCloseLogout', 'true'); // logout when closing browser.
          }
        })
      );
  }

  // to log out user
  logout() {
    this.removeUserResponseFromLocalStorage();
    this.tokenService.removeToken();
    localStorage.removeItem('currentOrderAdminPage');
    localStorage.removeItem('currentProductAdminPage');
    sessionStorage.removeItem('loggedIn');
    debugger;
    this.httpClient
      .post(
        `${this.apiUser}/logout`,
        {},
        {
          withCredentials: true, // allow server to clear cookie (BE set maxAge: 0)
        }
      )
      .subscribe();
  }

  // refresh token
  refreshAccessToken(): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(
      `${this.apiUser}/refreshToken`,
      {},
      {
        withCredentials: true, // request include corresponding cookie (path, origin...)
      }
    );
  }

  updateUser(userDto: UserDto) {
    debugger;
    let userResponse = this.getUserResponseFromLocalStorage();
    return this.httpClient.put(`${this.apiUser}/${userResponse?.id}`, userDto);
  }

  getUserByBearToken(token: String): Observable<UserResponse> {
    return this.httpClient.get<UserResponse>(this.apiUserByBearToken, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }),
    });
  }

  saveUserResponseToLocalStorage(userResponse: UserResponse) {
    if (userResponse) {
      localStorage.setItem('userResponse', JSON.stringify(userResponse));
    }
  }

  getUserResponseFromLocalStorage(): UserResponse | null {
    const userReponse = localStorage.getItem('userResponse');

    if (userReponse) {
      return JSON.parse(userReponse);
    }
    return null;
  }

  removeUserResponseFromLocalStorage() {
    localStorage.removeItem('userResponse');
  }
}
