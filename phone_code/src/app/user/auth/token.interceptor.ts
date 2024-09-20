// logic borrowed from https://angular-academy.com/angular-jwt/
// all http requests will be intercepted by this token interceptor
// which adds the access token to the request, unless URL contains refresh

import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(public authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {    
    console.log("token.interceptorts - intercept method - begin");
    if (this.authService.loggedInUser.getValue()) {
      //if it's a refresh request, don't overwrite the token since it was already added
      if(request.url.indexOf('refresh')<0){
        request = this.addToken(request, this.authService.getAccessToken());        
      }
    }

    return next.handle(request).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {

        // if(error.error instanceof Blob) {
        //   error.error.text().then(text => {
        //       let error_msg = (JSON.parse(text).message);
        //       console.log(error_msg)
        //     });
        // } else {
        //     //handle regular json error - useful if you are offline
        // } 

        // console.log("Error message:" + JSON.stringify(error));
        return this.handle401Error(request, next);
      }
       else {
        return throwError(error);
      }
    }));
  }

  private addToken(request: HttpRequest<any>, token: string) {
    console.log("token.interceptorts - addToken method - begin");
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    console.log("token.interceptorts - handle401Error method - begin");
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token.access_token);
          return next.handle(this.addToken(request, token.access_token));
        }));

    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(access_token => {
          return next.handle(this.addToken(request, access_token));
        }));
    }
  }
}