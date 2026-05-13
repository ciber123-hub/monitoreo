import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface UserValidationResponse {
  exists: boolean;
  user?: {
    id: number;
    name: string;
    email: string;
    active: boolean;
    roles: string[];
    groups: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserValidationService {
  private apiUrl = 'http://localhost:8080/api/v1/users';

  constructor(private http: HttpClient) {}

  validateUserByEmail(email: string | null): Observable<UserValidationResponse> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(users => {
        if (!email) {
          return { exists: false };
        }
        const user = users.find(u => u.email === email);
        if (user) {
          return {
            exists: true,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              active: user.active === 1,
              roles: user.roles || [],
              groups: user.groups || []
            }
          };
        }
        return { exists: false };
      })
    );
  }
}