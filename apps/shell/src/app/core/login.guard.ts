import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRoute } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { catchError, switchMap, take } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';
import { MsalInitializationService } from './msal-initialization.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private authService: MsalService,
    private router: Router,
    private route: ActivatedRoute,
    private msalInit: MsalInitializationService
  ) {}

  canActivate(): Observable<boolean> {
    const hasUnauthorizedError = this.route.snapshot.queryParams['error'] === 'unauthorized';
    const unauthorizedFlag = sessionStorage.getItem('unauthorized') === 'true';

    if (hasUnauthorizedError || unauthorizedFlag) {
      // Allow access to show the error dialog and prevent redirect to the app.
      return of(true);
    }

    return from(this.msalInit.initialize()).pipe(
      switchMap(() => {
        const accounts = this.authService.instance.getAllAccounts();

        if (accounts.length > 0) {
          this.router.navigate(['/mfMonitoreo'], { replaceUrl: true });
          return of(false);
        }

        return of(true);
      }),
      catchError(() => of(true)),
      take(1)
    );
  }
}

