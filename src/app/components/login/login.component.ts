import { Component, inject, OnInit } from '@angular/core';

import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { RoleService } from '../../services/role.service';
import { RoleResponse } from '../../models/role.model';
import { LoginDto, LoginResponse } from '../../models/login.model';
import { Router } from '@angular/router';
import { UserResponse } from '../../models/user.model';
import { DeferBlockDepsEmitMode } from '@angular/compiler';
import { OAuthService } from '../../services/oauth.service';
import { ErrorResponse } from '../../models/response.model';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  // phoneNumber: string = '0912345679'; // admin
  phoneNumber: string = '0912345677'; // user
  password: string = 'test@12345';
  showPassword: boolean = false;
  roles: RoleResponse[] = [];
  selectedRole: RoleResponse | undefined;
  rememberMe: boolean = false;
  userResponse: UserResponse | undefined;

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private roleService: RoleService,
    private router: Router,
    private oauthService: OAuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.roleService.getRoles().subscribe({
      next: (responses: RoleResponse[]) => {
        debugger;
        // ROLE_USER
        const changeNameInRoles = responses.map((role: RoleResponse) => {
          const nameLowerCase = role.name.slice(5).toLowerCase();
          role.name = nameLowerCase[0].toUpperCase() + nameLowerCase.slice(1);
          return role;
        });
        // User
        this.roles = changeNameInRoles;
        this.selectedRole = changeNameInRoles[0];
      },
      error: (error) => {
        console.log('Error getting roles: ', error);
      },
    });
  }

  toLogin() {
    const loginDto: LoginDto = {
      phoneNumber: this.phoneNumber,
      password: this.password,
      roleId: this.selectedRole!.id,
      rememberMe: this.rememberMe,
    };

    this.userService.login(loginDto).subscribe({
      next: (loginResponse) => {
        debugger;
        this.tokenService.setToken(loginResponse.token);

        this.userService.getUserByBearToken(loginResponse.token).subscribe({
          next: (response) => {
            debugger;
            this.userResponse = response;
            this.userService.saveUserResponseToLocalStorage(this.userResponse!);

            debugger;
            if (this.userResponse!.roleId === 1) {
              this.router.navigate(['/home']);
            } else if (this.userResponse!.roleId === 2) {
              this.router.navigate(['/admin/orders']);
            }
          },
          complete: () => {
            debugger;
          },
          error: (error) => {
            console.error(error);
          },
        });
      },
      complete: () => {},
      error: (error) => {
        debugger;
        console.error(error);
      },
    });
  }

  createAccount() {
    debugger;
    this.router.navigate(['/register']);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  loginWithGoogle() {
    debugger;
    this.oauthService.redirectToSocialLogin('google').subscribe({
      next: (response) => {
        debugger;
        // redirect to goolge login, url.
        window.location.href = response;
      },
      error: (error: ErrorResponse) => {
        this.toastService.showToast({
          error: error,
          defaultMsg: 'Lỗi kết nối với Google',
          title: 'Lỗi Đăng Nhập',
        });
      },
    });
  }

  loginWithFacebook() {
    debugger;
    this.oauthService.redirectToSocialLogin('facebook').subscribe({
      next: (response) => {
        debugger;
        // redirect to facebook login, url
        window.location.href = response;
      },
      error: (error: ErrorResponse) => {
        this.toastService.showToast({
          error: error,
          defaultMsg: 'Lỗi kết nối với Facebook',
          title: 'Lỗi Đăng Nhập',
        });
      },
    });
  }
}
