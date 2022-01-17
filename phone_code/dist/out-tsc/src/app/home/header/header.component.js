import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { AuthService } from 'src/app/user/auth/auth.service';
import { Router } from '@angular/router';
var HeaderComponent = /** @class */ (function () {
    function HeaderComponent(authService, router) {
        this.authService = authService;
        this.router = router;
        this.isAuthenticated = false;
        this.collapsed = true;
    }
    // onTestButtonClicked(){
    //   this.userProfileService.initialize();
    //   this.userProfileService.saveToServer();
    //   }
    HeaderComponent.prototype.onLogout = function () {
        this.authService.logout();
        this.router.navigate(['/auth']);
    };
    HeaderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.userSub = this.authService.loggedInUser.subscribe(function (loggedInUser) {
            _this.isAuthenticated = _this.authService.isLoggedIn();
            console.log(!loggedInUser);
        });
        this.authService.autoLogin();
    };
    HeaderComponent.prototype.ngOnDestroy = function () {
        this.userSub.unsubscribe();
    };
    Object.defineProperty(HeaderComponent.prototype, "userName", {
        get: function () {
            return this.authService.loggedInUser.getValue();
        },
        enumerable: true,
        configurable: true
    });
    HeaderComponent = tslib_1.__decorate([
        Component({
            selector: 'app-header',
            templateUrl: './header.component.html',
            styleUrls: ['./header.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [AuthService,
            Router])
    ], HeaderComponent);
    return HeaderComponent;
}());
export { HeaderComponent };
//# sourceMappingURL=header.component.js.map