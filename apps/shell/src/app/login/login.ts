import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  showUnauthorizedDialog = false;

  constructor(
    private authService: MsalService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const unauthorizedFlag = sessionStorage.getItem('unauthorized') === 'true';

    this.route.queryParams.subscribe(params => {
      if (params['error'] === 'unauthorized' || unauthorizedFlag) {
        this.showUnauthorizedDialog = true;
        // Don't redirect when showing error dialog
        return;
      }

      // If user is already authenticated and no error, redirect
      if (this.authService.instance.getAllAccounts().length > 0) {
        this.router.navigate(['/mfMonitoreo']);
      }
    });
  }

  login() {
    this.authService.loginRedirect();
  }

  onUnauthorizedDialogClose() {
    this.showUnauthorizedDialog = false;
    sessionStorage.removeItem('unauthorized');
    // Clear the error parameter from URL
    this.router.navigate(['/login'], { replaceUrl: true });
    
    // Small delay to ensure modal is closed before logout
    setTimeout(() => {
      this.authService.logoutRedirect();
    }, 300);
  }
}
