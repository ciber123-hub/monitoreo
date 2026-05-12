import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUser, User } from '../models/user.model';
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

  private mapApiUser(user: ApiUser): User {
    return {
      id: user.id,
      usuario: user.name,
      perfil: user.roles.includes('ADMIN') ? 'Admin' : 'Usuario',
      activo: user.active === 1,
      email: user.email,
      azureOid: user.azureOid,
      roles: user.roles || [],
      groups: user.groups || []
    };
  }
}
