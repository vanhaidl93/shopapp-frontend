import { RoleResponse } from './role.model';

export interface LoginDto {
  phoneNumber: string;
  password: string;

  roleId: number;
  rememberMe: boolean;
}

export interface LoginResponse {
  message: string;
  token: string;
  refreshToken: string;
  tokenType: 'Bearer';

  //user's detail
  id: number;
  username: string;
  role: RoleResponse;
}
