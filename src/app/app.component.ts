import { Component, OnInit } from '@angular/core';
import { environment } from './environment/environment';
import { TokenService } from './services/token.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(
    private tokenService: TokenService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    window.addEventListener('beforeunload', () => {
      const onCloseLogout = sessionStorage.getItem('onCloseLogout');
      if (onCloseLogout === 'true') {
        const url = `${environment.apiBaseUrl}/users/logout`;
        navigator.sendBeacon(url); // send logout before closing

        this.tokenService.removeToken();
        this.userService.removeUserResponseFromLocalStorage();
      }
    });
  }
}
