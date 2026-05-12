import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MsalModule, MsalInterceptor } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    providePrimeNG({ theme: { preset: Lara } }),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(
      MsalModule.forRoot(
        new PublicClientApplication({
          auth: {
            clientId: '93b1a599-bed9-4796-bbfe-a02fcaaefe35',
            authority: 'https://login.microsoftonline.com/01d2dfea-e8b0-455b-91ba-bb9b70d2f5ca',
            redirectUri: window.location.origin,
            postLogoutRedirectUri: window.location.origin
          },
          cache: {
            cacheLocation: 'localStorage',
          }
        }),
        {
          interactionType: InteractionType.Redirect,
          authRequest: {
            scopes: ['openid', 'profile', 'email']
          }
        },
        {
          interactionType: InteractionType.Redirect,
          protectedResourceMap: new Map([])
        }
      )
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    }
  ],
};
