import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError, BehaviorSubject } from "rxjs";
import { catchError, filter, take, switchMap } from "rxjs/operators";
import { AuthService } from "../../store/auth.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(public authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const tokens = this.authService.getTokens();
    if (tokens && tokens.access_token) {
      request = this.addToken(request, tokens.access_token);
    } 

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        } else {
          return throwError(error);
        }
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

//   private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
//     if (!this.isRefreshing) {
//       this.isRefreshing = true;
//       this.refreshTokenSubject.next(null);
      
//       const tokens = this.authService.getTokens();

//       return this.authService.refreshToken(tokens?.refresh_token).pipe(
//         switchMap((token: any) => {
//           this.isRefreshing = false;
//           this.refreshTokenSubject.next(token['result'].accessToken);
//           return next.handle(this.addToken(request, token['result'].accessToken));
//         })
//       );
//     } else {
//       return this.refreshTokenSubject.pipe(
//         filter((token) => token != null),
//         take(1),
//         switchMap((jwt) => {
//           return next.handle(this.addToken(request, jwt));
//         })
//       );
//     }
//   }

private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      
      const tokens = this.authService.getTokens();
  
      if (tokens && tokens.refresh_token) {
        // Try refreshing the token
        return this.authService.refreshToken(tokens?.refresh_token).pipe(
          switchMap((token) => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(token.access_token);
            return next.handle(this.addToken(request, token.access_token));
          }),
          catchError((error) => {
            // If refresh token fails, log out the user
            this.isRefreshing = false;
            this.authService.logout();
            return throwError(error);
          })
        );
      } else {
        // If no refresh token available, log out the user
        this.isRefreshing = false;
        this.authService.logout();
        return throwError('No refresh token available, logging out.');
      }
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((jwt) => {
          return next.handle(this.addToken(request, jwt));
        })
      );
    }
  }
}