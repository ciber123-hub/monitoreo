import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  constructor(
    private authService: MsalService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.authService.instance.getAllAccounts().length > 0) {
      this.router.navigate(['/mfMonitoreo']);
    }
  }

  login() {
    this.authService.loginRedirect();
  }
}
