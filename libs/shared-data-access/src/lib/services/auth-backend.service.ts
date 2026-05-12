import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthLoginRequest, AuthLoginResponse } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthBackendService {
  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  loginWithBackend(idToken: string): Observable<AuthLoginResponse> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<AuthLoginResponse>(`${this.apiUrl}/login`, {}, { headers });
  }
}