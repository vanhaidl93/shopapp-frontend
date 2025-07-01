export interface UserRegister {
  fullName: string;
  phoneNumber: string;
  address: string;
  password: string;
  retryPassword: string;
  dateOfBirth: Date;
  facebookAccountId: number;
  googleAccountId: number;
  isActive: boolean;
  roleId: number;
}

export interface UserDto {
  fullName: string;
  address: string;
  dateOfBirth: Date;
  password: string;
  retryPassword: string;
}

export interface UserResponse {
  id: number;
  fullName: string;
  phoneNumber: string;
  address: string;
  isActive: boolean;
  dateOfBirth: Date;
  facebookAccountId: number;
  googleAccountId: number;
  roleId: number;
}
