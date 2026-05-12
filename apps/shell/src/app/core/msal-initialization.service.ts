import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AuthBackendService, AuthLoginResponse } from '@monitoreo/shared-data-access';
import { LoginService } from '../service/login.service';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MsalInitializationService {
  private initializedPromise: Promise<void> | null = null;

  constructor(
    private authService: MsalService,
    private authBackendService: AuthBackendService,
    private loginService: LoginService
  ) {}

  async initialize(): Promise<void> {
    if (!this.initializedPromise) {
      this.initializedPromise = (async () => {
        await this.authService.instance.initialize();
        const result = await this.authService.instance.handleRedirectPromise({
          navigateToLoginRequestUrl: false,
        });

        if (result?.account) {
          this.authService.instance.setActiveAccount(result.account);

          // Get ID token and call backend
          const idToken = result.idToken;
          if (idToken) {
            try {
              const backendResponse = await lastValueFrom(this.authBackendService.loginWithBackend(idToken));
              if (backendResponse) {
                // Update login service with backend data
                this.loginService.setBackendAuthData(backendResponse);
              }
            } catch (error) {
              console.error('Error calling backend auth:', error);
              // Handle error - maybe logout or show message
            }
          }
        }
      })();
    }
    return this.initializedPromise;
  }
}
