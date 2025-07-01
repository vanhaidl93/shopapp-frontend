import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { HttpClient, HttpHandler, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginResponse } from '../models/login.model';

@Injectable({
  providedIn: 'root',
})
export class OAuthService {
  private apiUsers = `${environment.apiBaseUrl}/users`;

  constructor(private httpClient: HttpClient) {}

  redirectToSocialLogin(loginType: 'facebook' | 'google'): Observable<string> {
    debugger;
    const params = new HttpParams().set('loginType', loginType);

    return this.httpClient.get(`${this.apiUsers}/auth/socialLogin`, {
      responseType: 'text',
      params: params,
    });
  }

  exchangeAuthorizationCodeForLoginResponse(
    code: string,
    loginType: 'facebook' | 'google'
  ): Observable<LoginResponse> {
    const params = new HttpParams()
      .set('authorizationCode', code)
      .set('loginType', loginType);

    return this.httpClient.get<LoginResponse>(
      `${this.apiUsers}/auth/social/callback`,
      {
        params: params,
        withCredentials: true,
      }
    );
  }
}
