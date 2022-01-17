import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { UserProfileService } from 'src/app/user/user-profile/user-profile.service';
var CheatpageComponent = /** @class */ (function () {
    function CheatpageComponent(userProfileService) {
        this.userProfileService = userProfileService;
    }
    CheatpageComponent.prototype.ngOnInit = function () {
        /*
        if(window.localStorage['TotalPoints'] == undefined)
          this.currentPoints = 0;
        else
          this.currentPoints = parseInt(window.localStorage['TotalPoints']);
        */
        this.currentPoints = this.userProfileService.points;
    };
    CheatpageComponent.prototype.logChange = function (event) {
        //console.log(event);
        console.log("Total points: " + this.totalPoints);
    };
    CheatpageComponent.prototype.resetPoint = function () {
        console.log("Total points: " + this.totalPoints);
        this.currentPoints = this.totalPoints;
        //
        /*
        
        if(window.localStorage['TotalPoints'] == undefined)
          this.totalPoints = 0;
        else
          this.totalPoints = parseInt(window.localStorage['TotalPoints']);
        */
        //this.totalPoints = 700;//this.totalPoints + 100;
        //window.localStorage.setItem("TotalPoints", ""+this.totalPoints); 
        this.userProfileService.cheatPoints(this.totalPoints);
    };
    CheatpageComponent.prototype.returnToAquarium = function () {
        window.location.href = '/home';
    };
    CheatpageComponent = tslib_1.__decorate([
        Component({
            selector: 'app-cheatpage',
            templateUrl: './cheatpage.component.html',
            styleUrls: ['./cheatpage.component.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [UserProfileService])
    ], CheatpageComponent);
    return CheatpageComponent;
}());
export { CheatpageComponent };
//# sourceMappingURL=cheatpage.component.js.map