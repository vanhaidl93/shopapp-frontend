import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';
import { UserService } from '../services/user.service';
import { Route, Router } from '@angular/router';
import { ErrorResponse } from '../models/response.model';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    debugger;
    return next.handle(this.attachToken(req)).pipe(
      catchError((error: ErrorResponse) => {
        debugger;
        if (error.errorCode === 401) {
          debugger;
          return this.userService.refreshAccessToken().pipe(
            switchMap((response) => {
              // logic whenever respone repsond (pide approach)
              this.tokenService.setToken(response.token);
              return next.handle(this.attachToken(req, response.token));
            }),

            catchError(() => {
              debugger;
              // logic whenever error occurs (pide approach)
              this.userService.logout();
              this.router.navigate(['/login']);
              return throwError(() => new Error('RefreshToken is expired!'));
            })
          );
        }
        debugger;
        return throwError(() => error);
      })
    );
  }

  private attachToken(req: HttpRequest<any>, token?: string): HttpRequest<any> {
    debugger;
    const accessToken = token || this.tokenService.getToken();
    return req.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });
  }
}
