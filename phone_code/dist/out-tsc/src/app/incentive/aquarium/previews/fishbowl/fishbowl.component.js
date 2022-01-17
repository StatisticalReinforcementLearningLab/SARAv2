import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
var FishbowlComponent = /** @class */ (function () {
    function FishbowlComponent(menuCtrl) {
        this.menuCtrl = menuCtrl;
    }
    FishbowlComponent.prototype.ngOnInit = function () {
        this.menuCtrl.close();
    };
    FishbowlComponent = tslib_1.__decorate([
        Component({
            selector: 'app-fishbowl',
            templateUrl: './fishbowl.component.html',
            styleUrls: ['./fishbowl.component.css']
        }),
        tslib_1.__metadata("design:paramtypes", [MenuController])
    ], FishbowlComponent);
    return FishbowlComponent;
}());
export { FishbowlComponent };
//# sourceMappingURL=fishbowl.component.js.map