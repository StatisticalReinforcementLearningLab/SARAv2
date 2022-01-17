// logic borrowed from https://angular-academy.com/angular-jwt/
// all http requests will be intercepted by this token interceptor
// which adds the access token to the request, unless URL contains refresh
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
var TokenInterceptor = /** @class */ (function () {
    function TokenInterceptor(authService) {
        this.authService = authService;
        this.isRefreshing = false;
        this.refreshTokenSubject = new BehaviorSubject(null);
    }
    TokenInterceptor.prototype.intercept = function (request, next) {
        var _this = this;
        console.log("token.interceptorts - intercept method - begin");
        if (this.authService.loggedInUser.getValue()) {
            //if it's a refresh request, don't overwrite the token since it was already added
            if (request.url.indexOf('refresh') < 0) {
                request = this.addToken(request, this.authService.getAccessToken());
            }
        }
        return next.handle(request).pipe(catchError(function (error) {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                return _this.handle401Error(request, next);
            }
            else {
                return throwError(error);
            }
        }));
    };
    TokenInterceptor.prototype.addToken = function (request, token) {
        console.log("token.interceptorts - addToken method - begin");
        return request.clone({
            setHeaders: {
                'Authorization': "Bearer " + token
            }
        });
    };
    TokenInterceptor.prototype.handle401Error = function (request, next) {
        var _this = this;
        console.log("token.interceptorts - handle401Error method - begin");
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);
            return this.authService.refreshToken().pipe(switchMap(function (token) {
                _this.isRefreshing = false;
                _this.refreshTokenSubject.next(token.access_token);
                return next.handle(_this.addToken(request, token.access_token));
            }));
        }
        else {
            return this.refreshTokenSubject.pipe(filter(function (token) { return token != null; }), take(1), switchMap(function (access_token) {
                return next.handle(_this.addToken(request, access_token));
            }));
        }
    };
    TokenInterceptor = tslib_1.__decorate([
        Injectable(),
        tslib_1.__metadata("design:paramtypes", [AuthService])
    ], TokenInterceptor);
    return TokenInterceptor;
}());
export { TokenInterceptor };
//# sourceMappingURL=token.interceptor.js.map