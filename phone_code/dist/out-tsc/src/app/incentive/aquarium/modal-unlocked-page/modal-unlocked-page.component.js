import * as tslib_1 from "tslib";
import { Component, Input } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';
var ModalUnlockedPageComponent = /** @class */ (function () {
    function ModalUnlockedPageComponent(navParams, modalCtrl, userProfileService) {
        this.modalCtrl = modalCtrl;
        this.userProfileService = userProfileService;
        // componentProps can also be accessed at construction time using NavParams
        console.log(navParams.get('firstName'));
        //this.reinforcements = [];//[{'img': "assets/img/" + "nemo" + '_tn.jpg', 'header': 'Nemo', 'text': "Do you know the animators of \"Finding nemo\" studied dogs’ facial expressions and eyes to animate the fishes’ expressions?"}];
    }
    ModalUnlockedPageComponent.prototype.ngOnInit = function () {
    };
    ModalUnlockedPageComponent.prototype.dismiss = function () {
        //pass-data: https://ionicframework.com/docs/v3/api/components/modal/ModalController/
        //let data = { 'foo': 'bar' };
        //this.modalCtrl.dismiss(data);
        this.modalCtrl.dismiss();
    };
    tslib_1.__decorate([
        Input(),
        tslib_1.__metadata("design:type", Object)
    ], ModalUnlockedPageComponent.prototype, "reinforcements", void 0);
    ModalUnlockedPageComponent = tslib_1.__decorate([
        Component({
            selector: 'app-modal-unlocked-page',
            templateUrl: './modal-unlocked-page.component.html',
            styleUrls: ['./modal-unlocked-page.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [NavParams, ModalController, UserProfileService])
    ], ModalUnlockedPageComponent);
    return ModalUnlockedPageComponent;
}());
export { ModalUnlockedPageComponent };
//# sourceMappingURL=modal-unlocked-page.component.js.map