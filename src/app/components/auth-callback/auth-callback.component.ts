import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserResponse } from '../../models/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { OAuthService } from '../../services/oauth.service';
import { switchMap, tap } from 'rxjs';
import { TokenService } from '../../services/token.service';
import { UserService } from '../../services/user.service';
import { ErrorResponse } from '../../models/response.model';
import { ToastService } from '../../services/toast.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.scss'],
})
export class AuthCallbackComponent implements OnInit {
  userResponse?: UserResponse;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private oAuthService: OAuthService,
    private tokenService: TokenService,
    private userService: UserService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    /* 
    Responsibility: 
    Receive Authorization Code and redirect to BE, 
    Finally receive the Login reponse ( bearer token - cookies refresh token)
    */

    debugger;
    const url = this.router.url;
    let loginType: 'google' | 'facebook';

    if (url.includes('/auth/google/callback')) {
      loginType = 'google';
    } else if (url.includes('/auth/facebook/callback')) {
      loginType = 'facebook';
    } else {
      console.error('Không xác định được nhà cung cấp xác thực.');
      return;
    }

    // retrieve "authorization code" from redirect url of Goole ( register client console)
    this.activatedRoute.queryParams.subscribe((params) => {
      debugger;
      const authorizationCode = params['code'];

      if (authorizationCode) {
        // send "authorization code" to BE
        // to fetch "bear token" corresponding to user profile (save into database).
        this.oAuthService
          .exchangeAuthorizationCodeForLoginResponse(
            authorizationCode,
            loginType
          )
          // manipulate response before subscribe (switchMap)
          .pipe(
            tap((response) => {
              debugger;
              // store localStorage
              this.tokenService.setToken(response.token);
            }),
            switchMap((response) => {
              debugger;
              return this.userService.getUserByBearToken(response.token);
            })
          )
          .subscribe({
            next: (response) => {
              // response from switchMap.
              debugger;
              this.userResponse = {
                ...response,
              };
              this.userService.saveUserResponseToLocalStorage(
                this.userResponse
              );

              // redirect based on role.
              if (this.userResponse?.roleId === 2) {
                this.router.navigate(['/admin']);
              } else if (this.userResponse?.roleId === 1) {
                this.router.navigate(['/']);
              }
            },
            error: (error: ErrorResponse) => {
              this.toastService.showToast({
                error: error,
                defaultMsg: 'Lỗi xác thực tài khoản',
                title: 'Lỗi Đăng Nhập',
              });
            },
            complete: () => {
              debugger;
            },
          });
      } else {
        this.toastService.showToast({
          error: null,
          defaultMsg: 'Lỗi hệ thống xác thực',
          title: 'Lỗi Đăng Nhập',
        });
      }
    });
  }
}
