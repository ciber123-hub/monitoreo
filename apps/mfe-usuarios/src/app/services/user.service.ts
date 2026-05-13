import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUser, CreateUserRequest, UpdateUserRequest, User } from '../models/user.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/v1/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<ApiUser[]>(this.apiUrl).pipe(
      map((users) => users.map((user) => this.mapApiUser(user)))
    );
  }

  createUser(request: CreateUserRequest): Observable<User> {
    return this.http.post<ApiUser>(this.apiUrl, request).pipe(
      map((user) => this.mapApiUser(user))
    );
  }

  updateUser(id: number, request: UpdateUserRequest): Observable<User> {
    return this.http.put<ApiUser>(`${this.apiUrl}/${id}`, request).pipe(
      map((user) => this.mapApiUser(user))
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private mapApiUser(user: ApiUser): User {
    return {
      id: user.id,
      usuario: user.name,
      perfil: user.roles.includes('ADMIN')
        ? 'Admin'
        : user.roles.includes('SUPPORT')
          ? 'Soporte'
          : 'Usuario',
      activo: user.active === 1,
      email: user.email,
      azureOid: user.azureOid,
      roles: user.roles || [],
      groups: user.groups || []
    };
  }

  public mapPerfilToRole(perfil: User['perfil']): string {
    if (perfil === 'Admin') {
      return 'ADMIN';
    }

    if (perfil === 'Soporte') {
      return 'SUPPORT';
    }

    return 'USUARIO';
  }
}
