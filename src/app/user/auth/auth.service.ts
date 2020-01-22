import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject, Observable, Subscription } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { UserProfileService } from '../user-profile/user-profile.service';

export interface AuthResponseData{
  message?: string;
  access_token?: string;
  refresh_token?: string;
  access_expires?: string;
  refresh_expires?: string;
  registered? : boolean;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //new
  loggedInUser =  new BehaviorSubject<string>(localStorage.getItem('loggedInUser')); //localStorage.getItem('loggedInUser') 

  userSub:Subscription = this.loggedInUser.subscribe(loggedInUser => {
    if(loggedInUser === null){
      localStorage.removeItem('loggedInUser');
      localStorage.removeItem('userProfile');
    }
    else{
      localStorage.setItem('loggedInUser', loggedInUser);
    }
  });

  private readonly ACCESS_TOKEN = 'ACCESS_TOKEN';
  private readonly ACCESS_TOKEN_EXPIRATION = 'ACCESS_TOKEN_EXPIRATION';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private readonly REFRESH_TOKEN_EXPIRATION = 'REFRESH_TOKEN_EXPIRATION';

  private tokenExpirationTimer: any;

  constructor(private http: HttpClient,
              private router: Router) { }

  signup(userName: string, password: string){
    return this.http
    .post<AuthResponseData>(environment.userServer+'/registration',
    {
      username: userName,
      password: password
    }).pipe(catchError(this.handleError),tap(resData => {
      this.loggedInUser.next(userName);
      this.storeAccessToken(resData.access_token, resData.access_expires);
      this.storeRefreshToken(resData.refresh_token, resData.refresh_expires);

      console.log("resData: " + JSON.stringify(resData));
    }));
  }

  autoLogin(){

    const loggedInUser = localStorage.getItem('loggedInUser');
    if(loggedInUser===null){
      return;
    }
    else{
      this.loggedInUser.next(loggedInUser);
    }
  }

  logout(){
    this.loggedInUser.next(null);
    this.router.navigate(['/home']);
    localStorage.removeItem('loggedInUser');
    this.removeTokens();
  }

  //may not need 
  autoLogout(expirationDuration: number){
    console.log(expirationDuration);
    this.tokenExpirationTimer= setTimeout(() => {
      this.logout();
    },expirationDuration);
  }

  login(userName: string, password: string){
    return this.http
    .post<AuthResponseData>(environment.userServer+'/login',
    {
      username: userName,
      password: password
    }).pipe(catchError(this.handleError),tap(resData => {

      this.loggedInUser.next(userName);
      this.storeAccessToken(resData.access_token, resData.access_token);
      this.storeRefreshToken(resData.refresh_token, resData.refresh_expires);
      
      console.log("loggedInUser: " +  this.loggedInUser.getValue());
      console.log("resData: " + JSON.stringify(resData));
    }));
  }

  private handleError(errorRes: HttpErrorResponse){
      let errorMessage = 'An unknown error occurred!';
      if(!errorRes.error || !errorRes.error.error){
        return throwError(errorMessage);
      }
      switch(errorRes.error.error.message){
        case 'EMAIL_EXISTS':
          errorMessage = 'This email exists already!';
          break;
        case 'EMAIL_NOT_FOUND':
          errorMessage = 'Email address not found!';
          break;
        case 'INVALID_PASSWORD':
          errorMessage= 'This password is not correct.'
          break;

      }
      return throwError(errorMessage);
  }

  refreshToken() {
    const token = this.getRefreshToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };

    return this.http.post<any>(`${environment.userServer}/token/refresh`, {
      'refreshToken': this.getRefreshToken() 
    },httpOptions ).pipe(tap((
        resData: {
          "access_token": string, 
          "access_expires": string}) => {
        this.storeAccessToken(resData.access_token, resData.access_expires);
    }));
  }

  // private removeUser(){
  //   localStorage.removeItem('user');
  // }

isLoggedIn() {
  return !!this.loggedInUser.getValue();
}

getAccessToken() {
  return localStorage.getItem(this.ACCESS_TOKEN);
}

private doLogoutUser() {
  this.loggedInUser = null;
  this.removeTokens();
}

private getRefreshToken() {
  return localStorage.getItem(this.REFRESH_TOKEN);
}

private storeAccessToken(token: string, expires: string) {
  localStorage.setItem(this.ACCESS_TOKEN, token);
  
  const expirationDate = new Date(new Date().getTime() + +expires * 1000);
  localStorage.ACCESS_TOKEN_EXPIRATION = expirationDate;
}

private storeRefreshToken(token: string, expires: string) {
  localStorage.setItem(this.REFRESH_TOKEN, token);
  const expirationDate = new Date(new Date().getTime() + +expires * 1000);
  localStorage.REFRESH_TOKEN_EXPIRATION = expirationDate;
}

private removeTokens() {
  localStorage.removeItem(this.ACCESS_TOKEN);
  localStorage.removeItem(this.ACCESS_TOKEN_EXPIRATION);
  localStorage.removeItem(this.REFRESH_TOKEN);
  localStorage.removeItem(this.REFRESH_TOKEN_EXPIRATION);

}


}
