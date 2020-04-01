import * as tslib_1 from "tslib";
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';
var AuthGuard = /** @class */ (function () {
    function AuthGuard(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    AuthGuard.prototype.canActivate = function (route, router) {
        //This using reactive programming
        //--- pipe: is a series of operation to be executed when the observables "loggedInUser" state changes
        //--- take: an observable can emit a series of values. take(1) means only the first value will be used
        //--- map: function takes an observable, do some transformation and returns a observable.
        //--- search documentation here: https://rxjs-dev.firebaseapp.com/
        var _this = this;
        return this.authService.loggedInUser.pipe(take(1), map(function (loggedInUser) {
            var isAuth = !!loggedInUser;
            if (isAuth) {
                console.log("auth.guard.ts - (isAuth): true");
                return true;
            }
            else {
                console.log("auth.guard.ts - (isAuth): false");
                return _this.router.createUrlTree(['auth']);
            }
        }));
    };
    AuthGuard = tslib_1.__decorate([
        Injectable({ providedIn: 'root' }),
        tslib_1.__metadata("design:paramtypes", [AuthService, Router])
    ], AuthGuard);
    return AuthGuard;
}());
export { AuthGuard };
//# sourceMappingURL=auth.guard.js.map