import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { jwtDecode } from 'jwt-decode';
import { LoginService } from '../service/login.service';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  router = inject(Router);

  constructor(private authService: MsalService, private loginService: LoginService) {}

  get currentUser() {
    return this.loginService.currentUser;
  }

  get isAdmin(): boolean {
    const user = this.currentUser;
    return user ? user.roles.includes('ADMIN') : false;
  }

  isAuthenticated(): boolean {
    return this.loginService.isAuthenticated();
  }

  navigateTo(route: string) {
    if (this.isAuthenticated()) {
      this.router.navigate([route]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.authService.logoutRedirect({
      postLogoutRedirectUri: window.location.origin + '/login'
    });
  }
}
