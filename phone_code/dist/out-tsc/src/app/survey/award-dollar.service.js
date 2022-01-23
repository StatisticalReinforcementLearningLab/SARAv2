import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import * as moment from 'moment';
var AwardDollarService = /** @class */ (function () {
    function AwardDollarService() {
    }
    AwardDollarService.prototype.getDollars = function () {
        if (window.localStorage['AwardDollar'] == undefined)
            this.awardDollar = 0;
        else
            this.awardDollar = parseInt(window.localStorage['AwardDollar']);
        if (window.localStorage['AwardDollarDates'] == undefined) {
            this.awardDollarObj = {};
            this.awardDollarObj['dates'] = [moment().format("DD-MM-YYYY")];
            window.localStorage.setItem("AwardDollarDates", JSON.stringify(this.awardDollarObj));
        }
        else {
            this.awardDollarObj = JSON.parse(window.localStorage["AwardDollarDates"]);
            if (this.awardDollarObj['dates'].length < 2) {
                var previousdate = moment().subtract(1, "days").format("DD-MM-YYYY");
                var dates = this.awardDollarObj["dates"];
                var dateIndex = dates.indexOf(previousdate);
                if (dateIndex > -1) {
                    this.awardDollarObj['dates'].push(moment().format("DD-MM-YYYY"));
                }
                else {
                    // if the date saved is not the previous day of today, remove it 
                    // save current date to AwardDollarDates
                    this.awardDollarObj['dates'] = [moment().format("DD-MM-YYYY")];
                }
                window.localStorage.setItem("AwardDollarDates", JSON.stringify(this.awardDollarObj));
            }
            else {
                this.awardDollar = this.awardDollar + 1;
                window.localStorage.removeItem('AwardDollarDates');
            }
        }
        console.log("awardDollarObj: " + JSON.stringify(this.awardDollarObj));
        window.localStorage.setItem("AwardDollar", "" + this.awardDollar);
        return this.awardDollar;
    };
    AwardDollarService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], AwardDollarService);
    return AwardDollarService;
}());
export { AwardDollarService };
//# sourceMappingURL=award-dollar.service.js.map