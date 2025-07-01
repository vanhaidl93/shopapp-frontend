import { Component, inject } from '@angular/core';
import { UserResponse } from '../models/user.model';
import { UserService } from '../services/user.service';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',

  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  userResponse?: UserResponse | null;

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  logout() {
    this.userService.logout();
    this.userResponse = null;
    this.router.navigate(['/login']);
  }
}
