import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AuthBackendService, AuthLoginResponse, UserValidationService } from '@monitoreo/shared-data-access';
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
    private userValidationService: UserValidationService,
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
                // If backend returns success, trust the login response.
                if (backendResponse.status === 'OK' && backendResponse.user?.status === 1) {
                  const userEmail = backendResponse.user.email;

                  if (userEmail) {
                    const validationResponse = await lastValueFrom(this.userValidationService.validateUserByEmail(userEmail));
                    if (validationResponse.exists) {
                      this.loginService.setBackendAuthData(backendResponse);
                      return;
                    }
                    console.error('User not found in database:', userEmail);
                    throw new Error('USER_NOT_AUTHORIZED');
                  }

                  // Fallback: backend returned OK and active user, accept the response if user id is present.
                  if (backendResponse.user?.id != null) {
                    this.loginService.setBackendAuthData(backendResponse);
                    return;
                  }

                  console.error('Backend response OK but user identifier is missing.', backendResponse);
                  throw new Error('USER_NOT_AUTHORIZED');
                }

                console.error('Backend login response not OK or user inactive:', backendResponse);
                throw new Error('USER_NOT_AUTHORIZED');
              }
            } catch (error) {
              console.error('Error during authentication:', error);
              
              // Check if it's a backend authorization error
              if (error instanceof Error && error.message === 'USER_NOT_AUTHORIZED') {
                throw error; // Re-throw the backend authorization error
              }
              
              // Check if it's an HTTP error from backend
              if (error && typeof error === 'object' && 'status' in error) {
                const httpError = error as any;
                if (httpError.status === 401 && httpError.error?.error === 'USER_NOT_AUTHORIZED') {
                  console.error('Backend authorization error:', httpError.error);
                  throw new Error('USER_NOT_AUTHORIZED');
                }
              }
              
              // For other errors, logout automatically
              try {
                await this.authService.instance.logoutRedirect();
              } catch (logoutError) {
                console.error('Error during logout:', logoutError);
              }
              throw error;
            }
          }
        }
      })();
    }
    return this.initializedPromise;
  }
}
