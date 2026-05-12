import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../service/login.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(): boolean {
    const user = this.loginService.currentUser;
    if (user && user.roles.includes('ADMIN')) {
      return true;
    }
    this.router.navigate(['/mfMonitoreo']); // Redirect to safe page
    return false;
  }
}