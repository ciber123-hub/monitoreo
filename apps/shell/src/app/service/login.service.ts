import { Injectable } from '@angular/core';
import { LoginRequest } from '../model/loginRequest';
import { AuthResponse } from '../model/authResponse';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, throwError, BehaviorSubject, tap, catchError, of, delay } from 'rxjs';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';

const jwtHelper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserData: BehaviorSubject<AuthResponse | null> = new BehaviorSubject<AuthResponse | null>(null);

  constructor(private http: HttpClient) { }


  login(credentials: LoginRequest): Observable<AuthResponse> {
  const mockUser: AuthResponse = {
    token: 'mock-jwt-token-123456',
    username: credentials.username,
    displayName: 'Juan Pérez García',
    mail: credentials.username,
    cn: 'Juan Pérez García',
    distinguishedName: 'CN=Juan Pérez García,OU=Subdireccion de Operaciones y Sistemas,OU=OrganizacionX,DC=OrganizacionX,DC=gob,DC=mx',
    role: 'USER',
    memberOf: [
      'CN=UsuariosLDAP,OU=Seguridad,DC=organizacionX,DC=gob,DC=mx',
      'CN=PortalInterno,OU=Aplicaciones,DC=organizacionX,DC=gob,DC=mx'
    ]
  };

  // <-- Tipa explícitamente el Observable con <AuthResponse>
  return of(mockUser).pipe(
    delay(1000),
    tap(userData => {
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      this.currentUserData.next(userData);
      this.currentUserLoginOn.next(true);
    })
  );
}

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserLoginOn.next(false);
    this.currentUserData.next(null);
  }

  isAuthenticated(): boolean {
    const hasToken = !!localStorage.getItem('token');
    const hasUser = !!localStorage.getItem('user');
    return hasToken && hasUser;
  }

  get currentUser(): AuthResponse | null {
    return this.currentUserData.value || JSON.parse(localStorage.getItem('user') || 'null');
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Error de red', error.error);
    } else {
      console.error('Error del backend', error);
    }
    return throwError(() => new Error('Algo falló. Por favor intente nuevamente.'));
  }
}