import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
// import { User } from './user.model';
import { Router } from '@angular/router';
// import { AngularFireAuth } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
var AuthService = /** @class */ (function () {
    function AuthService(http, router) {
        this.http = http;
        this.router = router;
        //new
        this.loggedInUser = new BehaviorSubject(localStorage.getItem('loggedInUser')); //localStorage.getItem('loggedInUser') 
        this.userSub = this.loggedInUser.subscribe(function (loggedInUser) {
            if (loggedInUser === null) {
                localStorage.removeItem('loggedInUser');
                localStorage.removeItem('userProfile');
            }
            else {
                localStorage.setItem('loggedInUser', loggedInUser);
            }
        });
        this.ACCESS_TOKEN = 'ACCESS_TOKEN';
        this.ACCESS_TOKEN_EXPIRATION = 'ACCESS_TOKEN_EXPIRATION';
        this.REFRESH_TOKEN = 'REFRESH_TOKEN';
        this.REFRESH_TOKEN_EXPIRATION = 'REFRESH_TOKEN_EXPIRATION';
    }
    // used to register new user
    AuthService.prototype.signup = function (userName, password) {
        var _this = this;
        return this.http
            .post(environment.userServer + '/registration', {
            username: userName,
            password: password
        }).pipe(catchError(this.handleError), tap(function (resData) {
            _this.loggedInUser.next(userName);
            _this.storeAccessToken(resData.access_token, resData.access_expires);
            _this.storeRefreshToken(resData.refresh_token, resData.refresh_expires);
            console.log("resData: " + JSON.stringify(resData));
        }));
    };
    // initializes loggedinUsder
    AuthService.prototype.autoLogin = function () {
        console.log("auth.service.ts - autoLogin method - begin");
        var loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser === null) {
            console.log("auth.service.ts - autoLogin method - (loggedInUser===null)");
            return;
        }
        else {
            console.log("auth.service.ts - autoLogin method - (sending saved observable)");
            this.loggedInUser.next(loggedInUser);
        }
    };
    AuthService.prototype.logout = function () {
        this.loggedInUser.next(null);
        this.router.navigate(['/home']);
        localStorage.removeItem('loggedInUser');
        this.removeTokens();
    };
    //may not need 
    // autoLogout(expirationDuration: number){
    //   console.log(expirationDuration);
    //   this.tokenExpirationTimer= setTimeout(() => {
    //     this.logout();
    //   },expirationDuration);
    // }
    AuthService.prototype.login = function (userName, password) {
        var _this = this;
        console.log("auth.service.ts -login method - begin");
        return this.http
            .post(environment.userServer + '/login', {
            username: userName,
            password: password
        }).pipe(catchError(this.handleError), tap(function (resData) {
            _this.loggedInUser.next(userName);
            _this.storeAccessToken(resData.access_token, resData.access_token);
            _this.storeRefreshToken(resData.refresh_token, resData.refresh_expires);
            console.log("auth.service.ts -login method - loggedInUser: " + _this.loggedInUser.getValue());
            console.log("auth.service.ts -login method - resData: " + JSON.stringify(resData));
        }));
    };
    AuthService.prototype.handleError = function (errorRes) {
        console.log("auth.service.ts - handleError method - begin");
        var errorMessage = 'An unknown error occurred!!!! \n' + JSON.stringify(errorRes);
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email exists already!';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'Email address not found!';
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'This password is not correct.';
                break;
        }
        return throwError(errorMessage);
    };
    //use refresh token to get a new access token
    AuthService.prototype.refreshToken = function () {
        var _this = this;
        console.log("auth.service.ts - refreshToken method - begin");
        var token = this.getRefreshToken();
        var httpOptions = {
            headers: new HttpHeaders({
                'Authorization': "Bearer " + token
            })
        };
        return this.http.post(environment.userServer + "/token/refresh", {
            'refreshToken': this.getRefreshToken()
        }, httpOptions).pipe(tap(function (resData) {
            _this.storeAccessToken(resData.access_token, resData.access_expires);
        }));
    };
    // private removeUser(){
    //   localStorage.removeItem('user');
    // }
    // check if loggedInUser has a value and in which case, the user is logged in
    AuthService.prototype.isLoggedIn = function () {
        console.log("auth.service.ts - isLoggedIn method - begin");
        return !!this.loggedInUser.getValue();
    };
    AuthService.prototype.getAccessToken = function () {
        console.log("auth.service.ts - getAccessToken method - begin");
        return localStorage.getItem(this.ACCESS_TOKEN);
    };
    AuthService.prototype.doLogoutUser = function () {
        this.loggedInUser = null;
        this.removeTokens();
    };
    AuthService.prototype.getRefreshToken = function () {
        console.log("auth.service.ts - getRefreshToken method - begin");
        return localStorage.getItem(this.REFRESH_TOKEN);
    };
    AuthService.prototype.storeAccessToken = function (token, expires) {
        console.log("auth.service.ts - storeAccessToken method - begin");
        localStorage.setItem(this.ACCESS_TOKEN, token);
        var expirationDate = new Date(new Date().getTime() + +expires * 1000);
        localStorage.ACCESS_TOKEN_EXPIRATION = expirationDate;
    };
    AuthService.prototype.storeRefreshToken = function (token, expires) {
        console.log("auth.service.ts - storeRefreshToken method - begin");
        localStorage.setItem(this.REFRESH_TOKEN, token);
        var expirationDate = new Date(new Date().getTime() + +expires * 1000);
        localStorage.REFRESH_TOKEN_EXPIRATION = expirationDate;
    };
    AuthService.prototype.removeTokens = function () {
        console.log("auth.service.ts - removeTokens method - begin");
        localStorage.removeItem(this.ACCESS_TOKEN);
        localStorage.removeItem(this.ACCESS_TOKEN_EXPIRATION);
        localStorage.removeItem(this.REFRESH_TOKEN);
        localStorage.removeItem(this.REFRESH_TOKEN_EXPIRATION);
    };
    AuthService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [HttpClient,
            Router])
    ], AuthService);
    return AuthService;
}());
export { AuthService };
//# sourceMappingURL=auth.service.js.map