import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
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
    private msalInit: MsalInitializationService
  ) {}

  canActivate(): Observable<boolean> {
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

