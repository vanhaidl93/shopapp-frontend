import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TokenService } from '../../services/token.service';
import { UserService } from '../../services/user.service';
import { UserDto, UserResponse } from '../../models/user.model';
import { Router } from '@angular/router';

function equalValues(controlName1: string, controlName2: string) {
  return (control: AbstractControl) => {
    const value1 = control.get(controlName1)?.value;
    const value2 = control.get(controlName2)?.value;
    debugger;
    if (value1 === value2) {
      return null;
    }
    return { passwordNotEqual: true };
  };
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private router: Router
  ) {}

  token: string | null = '';
  userResponse?: UserResponse;
  updatedUserDto: UserDto = {
    fullName: '',
    address: '',
    dateOfBirth: new Date(),
    password: '',
    retryPassword: '',
  };

  userProfileForm: FormGroup = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.minLength(3)]),
    passwords: new FormGroup(
      {
        password: new FormControl('', [Validators.minLength(6)]),
        retryPassword: new FormControl('', [Validators.minLength(6)]),
      },
      {
        validators: [equalValues('password', 'retryPassword')],
      }
    ),
    dateOfBirth: new FormControl(new Date()),
  });

  ngOnInit(): void {
    debugger;
    this.token = this.tokenService.getToken();
    this.getUserDetailByToken(this.token!);
    console.log(this.userProfileForm);
  }

  getUserDetailByToken(token: String) {
    this.userService.getUserByBearToken(token).subscribe({
      next: (userResponse) => {
        this.userResponse = userResponse;
        this.userProfileForm.patchValue({
          fullName: this.userResponse.fullName,
          address: this.userResponse.address,
          dateOfBirth: this.userResponse.dateOfBirth,
        });
      },
      complete: () => {
        debugger;
      },
      error: (error) => {
        debugger;
        console.error(error);
      },
    });
  }

  onSubmit() {
    debugger;
    if (this.userProfileForm.valid) {
      this.updatedUserDto = {
        ...this.updatedUserDto,
        ...this.userProfileForm.value,
      };

      this.userService.updateUser(this.updatedUserDto).subscribe({
        next: (response) => {
          this.userService.removeUserResponseFromLocalStorage();
          this.tokenService.removeToken();
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
  }

  get passwordIsInvalid() {
    debugger;
    return (
      this.userProfileForm.get('passwords')?.invalid &&
      this.userProfileForm.get('passwords')?.dirty &&
      this.userProfileForm.get('passwords')?.touched
    );
  }
}
