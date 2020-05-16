import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
var ContactComponent = /** @class */ (function () {
    function ContactComponent(menuCtrl) {
        this.menuCtrl = menuCtrl;
    }
    ContactComponent.prototype.ngOnInit = function () {
        this.menuCtrl.close();
    };
    ContactComponent = tslib_1.__decorate([
        Component({
            selector: 'app-contact',
            templateUrl: './contact.component.html',
            styleUrls: ['./contact.component.css']
        }),
        tslib_1.__metadata("design:paramtypes", [MenuController])
    ], ContactComponent);
    return ContactComponent;
}());
export { ContactComponent };
//# sourceMappingURL=contact.component.js.map