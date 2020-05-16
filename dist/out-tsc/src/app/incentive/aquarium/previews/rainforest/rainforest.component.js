import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
var RainforestComponent = /** @class */ (function () {
    function RainforestComponent(menuCtrl) {
        this.menuCtrl = menuCtrl;
    }
    RainforestComponent.prototype.ngOnInit = function () {
        this.menuCtrl.close();
    };
    RainforestComponent = tslib_1.__decorate([
        Component({
            selector: 'app-rainforest',
            templateUrl: './rainforest.component.html',
            styleUrls: ['./rainforest.component.css']
        }),
        tslib_1.__metadata("design:paramtypes", [MenuController])
    ], RainforestComponent);
    return RainforestComponent;
}());
export { RainforestComponent };
//# sourceMappingURL=rainforest.component.js.map