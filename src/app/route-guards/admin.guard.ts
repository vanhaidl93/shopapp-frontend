import { inject, Inject, Injectable } from '@angular/core';
import { UserResponse } from '../models/user.model';

import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UserService } from '../services/user.service';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard {
  constructor(
    private tokenService: TokenService,
    private router: Router,
    private userService: UserService
  ) {}

  userResponse?: UserResponse | null;

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isTokenExpired = this.tokenService.isTokenExpired();
    const isUserIdValid = this.tokenService.extractUserIdFromToken() > 0;

    this.userResponse = this.userService.getUserResponseFromLocalStorage();
    const isAdmin = this.userResponse?.roleId === 2;

    debugger;
    if (!isTokenExpired && isUserIdValid && isAdmin) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}

export const AdminGuardFn: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  debugger;
  return inject(AdminGuard).canActivate(next, state);
};
