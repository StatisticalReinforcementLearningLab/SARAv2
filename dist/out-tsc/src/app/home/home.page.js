import * as tslib_1 from "tslib";
import { Component, ViewChild } from '@angular/core';
import { AquariumComponent } from '../incentive/aquarium/aquarium.component';
var HomePage = /** @class */ (function () {
    function HomePage() {
    }
    HomePage.prototype.ngOnInit = function () {
    };
    HomePage.prototype.ionViewDidEnter = function () {
        console.log("ionViewDidEnterFunction");
        //this.child.ionViewDidEnterFunction();
    };
    HomePage.prototype.ionViewDidLeave = function () {
        console.log("ionViewDidLeaveFunction");
        //this.child.ionViewDidLeaveFunction();
    };
    tslib_1.__decorate([
        ViewChild(AquariumComponent, { static: true }),
        tslib_1.__metadata("design:type", Object)
    ], HomePage.prototype, "child", void 0);
    HomePage = tslib_1.__decorate([
        Component({
            selector: 'app-home',
            templateUrl: 'home.page.html',
            styleUrls: ['home.page.scss'],
        })
    ], HomePage);
    return HomePage;
}());
export { HomePage };
//# sourceMappingURL=home.page.js.map