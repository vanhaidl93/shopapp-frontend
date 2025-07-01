import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { TokenService } from '../services/token.service';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { ErrorResponse } from '../models/response.model';

export const adminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const userService = inject(UserService);

  debugger;
  if (
    tokenService.getToken() &&
    userService.getUserResponseFromLocalStorage()!.roleId === 2
  ) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const userService = inject(UserService);

  debugger;
  if (
    tokenService.getToken() &&
    userService.getUserResponseFromLocalStorage()!.roleId === 1
  ) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
