import { inject, Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RoleResponse } from '../models/role.model';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private apiGetRoles = `${environment.apiBaseUrl}/roles`;

  constructor(private httpClient: HttpClient) {}

  getRoles(): Observable<RoleResponse[]> {
    return this.httpClient.get<RoleResponse[]>(this.apiGetRoles);
  }
}
