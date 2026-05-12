/*import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: MsalService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.instance.getAllAccounts().length > 0) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}*/

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { catchError, switchMap, take } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';
import { MsalInitializationService } from './msal-initialization.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
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
          return of(true);
        }

        this.router.navigate(['/login'], { replaceUrl: true });
        return of(false);
      }),
      catchError(() => {
        this.router.navigate(['/login'], { replaceUrl: true });
        return of(false);
      }),
      take(1)
    );
  }
}
