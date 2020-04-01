import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
// import { Router } from '@angular/router';
var TermsOfServiceComponent = /** @class */ (function () {
    function TermsOfServiceComponent() {
        this.agreeToTerms = JSON.parse(localStorage.getItem("agreeToTerms"));
    }
    TermsOfServiceComponent.prototype.ngOnInit = function () { };
    TermsOfServiceComponent.prototype.onSubmit = function () {
        localStorage.setItem("agreeToTerms", this.agreeToTerms.toString());
        location.reload();
    };
    TermsOfServiceComponent = tslib_1.__decorate([
        Component({
            selector: 'app-terms-of-service',
            templateUrl: './terms-of-service.component.html',
            styleUrls: ['./terms-of-service.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], TermsOfServiceComponent);
    return TermsOfServiceComponent;
}());
export { TermsOfServiceComponent };
//# sourceMappingURL=terms-of-service.component.js.map