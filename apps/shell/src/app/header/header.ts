import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginService } from '../service/login.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
 
  @Output() onToggleSidebar = new EventEmitter<void>();
  menuOpen = signal(false);

  constructor(
    private loginService: LoginService,
    private router: Router
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
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
