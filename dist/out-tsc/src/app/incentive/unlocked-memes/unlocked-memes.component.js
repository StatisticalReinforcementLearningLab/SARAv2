import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import * as moment from 'moment';
var UnlockedMemesComponent = /** @class */ (function () {
    function UnlockedMemesComponent() {
    }
    UnlockedMemesComponent.prototype.ngOnInit = function () {
    };
    UnlockedMemesComponent.prototype.ionViewDidEnter = function () {
        this.already_shown_memes = window.localStorage["already_shown_memes3"];
        if (this.already_shown_memes == undefined)
            this.already_shown_memes = [{ "filename": "assets/memes/4.jpg", "unlock_date": moment().format('MM/DD/YYYY') }];
        else
            this.already_shown_memes = JSON.parse(window.localStorage["already_shown_memes3"]);
        this.unlockedMemeCount = this.already_shown_memes.length;
        this.already_shown_memes.reverse();
        console.log(this.already_shown_memes);
    };
    UnlockedMemesComponent = tslib_1.__decorate([
        Component({
            selector: 'app-unlocked-memes',
            templateUrl: './unlocked-memes.component.html',
            styleUrls: ['./unlocked-memes.component.css']
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], UnlockedMemesComponent);
    return UnlockedMemesComponent;
}());
export { UnlockedMemesComponent };
//# sourceMappingURL=unlocked-memes.component.js.map