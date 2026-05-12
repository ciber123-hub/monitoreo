import { Injectable } from '@angular/core';
import { MsalService } from '@azure/msal-angular';

@Injectable({
  providedIn: 'root'
})
export class MsalInitializationService {
  private initializedPromise: Promise<void> | null = null;

  constructor(private authService: MsalService) {}

  async initialize(): Promise<void> {
    if (!this.initializedPromise) {
      this.initializedPromise = (async () => {
        await this.authService.instance.initialize();
        const result = await this.authService.instance.handleRedirectPromise({
          navigateToLoginRequestUrl: false,
        });

        if (result?.account) {
          this.authService.instance.setActiveAccount(result.account);
        }
      })();
    }
    return this.initializedPromise;
  }
}
