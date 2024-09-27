// auth.service.ts
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { StorageService } from '../store/storageService';
import { IUser } from '../component/header/header.utils';
import {
  loginAction,
  logoutAction,
  restoreSessionAction,
  signupAction,
} from './auth.actions';
import { selectUser } from '../store/auth.selectors';
import { AppState } from '../store/auth.reducer'; // Ensure the import path is correct
import {
  IAuthLoginPayload,
  IAuthResponse,
  IAuthSignupPayload,
  IAuthTokens,
} from './auth.inerface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user$: Observable<IUser | null>;

  apiRoute = `${environment.apiUrl}/auth`;

  constructor(
    private store: Store<AppState>,
    private storageService: StorageService,
    private http: HttpClient,
    private router: Router
  ) {
    this.user$ = this.store.select(selectUser);
    this.loadUser();
  }

  private loadUser(): void {
    const userDetails = this.storageService.getObject('userDetails');
    if (userDetails) {
      this.store.dispatch(restoreSessionAction({ user: userDetails }));
    }
  }

  public signup(user: IAuthSignupPayload) {
    return this.http
      .post<IAuthResponse>(`${this.apiRoute}/register`, user)
      .pipe(
        map((data) => {
          this.setLocalStorageData(data);
          this.store.dispatch(signupAction({ user: data.user }));
          return data.user;
        })
      );
  }

  public login(user: IAuthLoginPayload) {
    return this.http.post<IAuthResponse>(`${this.apiRoute}/login`, user).pipe(
      map((data) => {
        this.setLocalStorageData(data);
        this.store.dispatch(loginAction({ user: data.user }));
        return data.user;
      })
    );
  }

  public refreshToken(refreshToken: string) {
    return this.http.post<IAuthTokens>(`${this.apiRoute}/refresh`, {
      refreshToken: refreshToken
    }).pipe(
      map((data) => {
        this.setAuthTokensStorageData(data.access_token, data.refresh_token);
        return data;
      })
    );
  }

  setLocalStorageData(data: IAuthResponse) {
    this.storageService.setObject('userDetails', data.user);
    this.setAuthTokensStorageData(data.access_token, data.refresh_token);
  }

  setAuthTokensStorageData(accessToken: string, refreshToken: string) {
    this.storageService.setObject('auth', {
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }

  getTokens(){
    return this.storageService.getObject('auth') as IAuthTokens | null;
  }

  public logout(): void {
    this.storageService.clear();
    this.store.dispatch(logoutAction());
    this.router.navigate(['/login']);
  }
  
}
