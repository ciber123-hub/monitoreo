import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { jwtDecode } from 'jwt-decode';

@Component({
  standalone: true,
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  router = inject(Router);

  constructor(private authService: MsalService) {}

  get currentUser() {
    const accounts = this.authService.instance.getAllAccounts();
    if (accounts.length > 0) {
      const account = accounts[0];
      const idToken = account.idToken;
      if (idToken) {
        try {
          const decoded: any = jwtDecode(idToken);
          return { mail: decoded.preferred_username || decoded.email || account.username };
        } catch (e) {
          return { mail: account.username };
        }
      }
      return { mail: account.username };
    }
    return null;
  }

  isAuthenticated(): boolean {
    return this.authService.instance.getAllAccounts().length > 0;
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
