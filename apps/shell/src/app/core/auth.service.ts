import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; // Cambiar según el backend

  login(username: string, password: string): Observable<any> {
    return from(
      fetch(`${this.apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      }).then(response => response.json()).then(data => {
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        return data;
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
  }
  

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}