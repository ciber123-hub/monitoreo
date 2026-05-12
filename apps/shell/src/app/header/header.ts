import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { jwtDecode } from 'jwt-decode';
import { LoginService } from '../service/login.service';

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
    private router: Router,
    private loginService: LoginService
  ) {}

  get currentUser() {
    return this.loginService.currentUser;
  }

  isAuthenticated(): boolean {
    return this.loginService.isAuthenticated();
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
