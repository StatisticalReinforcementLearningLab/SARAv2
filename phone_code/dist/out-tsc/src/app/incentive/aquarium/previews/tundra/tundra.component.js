import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
var TundraComponent = /** @class */ (function () {
    function TundraComponent(menuCtrl) {
        this.menuCtrl = menuCtrl;
    }
    TundraComponent.prototype.ngOnInit = function () {
        this.menuCtrl.close();
    };
    TundraComponent = tslib_1.__decorate([
        Component({
            selector: 'app-tundra',
            templateUrl: './tundra.component.html',
            styleUrls: ['./tundra.component.css']
        }),
        tslib_1.__metadata("design:paramtypes", [MenuController])
    ], TundraComponent);
    return TundraComponent;
}());
export { TundraComponent };
//# sourceMappingURL=tundra.component.js.map