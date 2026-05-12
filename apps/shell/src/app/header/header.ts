import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { jwtDecode } from 'jwt-decode';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  @Output() onToggleSidebar = new EventEmitter<void>();
  menuOpen = signal(false);

  constructor(
    private authService: MsalService,
    private router: Router
  ) {}

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

  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  toggleSidebar() {
    this.onToggleSidebar.emit();
  }

  logout() {
    this.authService.logoutRedirect({
      postLogoutRedirectUri: window.location.origin + '/login'
    });
  }
}
