import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
var SeaComponent = /** @class */ (function () {
    function SeaComponent(menuCtrl) {
        this.menuCtrl = menuCtrl;
    }
    SeaComponent.prototype.ngOnInit = function () {
        this.menuCtrl.close();
    };
    SeaComponent = tslib_1.__decorate([
        Component({
            selector: 'app-sea',
            templateUrl: './sea.component.html',
            styleUrls: ['./sea.component.css']
        }),
        tslib_1.__metadata("design:paramtypes", [MenuController])
    ], SeaComponent);
    return SeaComponent;
}());
export { SeaComponent };
//# sourceMappingURL=sea.component.js.map