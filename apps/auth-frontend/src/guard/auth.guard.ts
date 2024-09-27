// auth.guard.ts
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { AppState } from '../store/auth.reducer';
import { selectUser } from '../store/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private store: Store<AppState>, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const isNoAuth = route?.data?.['isNoAuth'] || false;
    return this.store.select(selectUser).pipe(
      map((user) => {
        if (isNoAuth && user) {
          // If no authentication is required but user is already logged in, redirect to home
          this.router.navigate(['/home']);
          return false;
        }
        if (!isNoAuth && !user) {
          // If authentication is required but user is not logged in, redirect to login
          this.router.navigate(['/login']);
          return false;
        }
        // If the user is in the correct state for the route, allow access
        return true;
      })
    );
  }
}
