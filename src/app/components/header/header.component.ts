import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UserResponse } from '../../models/user.model';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  userResponse?: UserResponse | null;
  isDropdowOpen = false;

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    debugger;
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
  }

  toggleDropdown(event: Event) {
    event.preventDefault();
    this.isDropdowOpen = !this.isDropdowOpen;
  }

  handleClickDropdownNav(index: number) {
    if (index === 0) {
      this.router.navigate(['/profile']);
    } else if (index === 2) {
      this.userService.logout();
      this.userResponse = null;
      this.router.navigate(['/login']);
    }
    this.isDropdowOpen = false;
  }
}
