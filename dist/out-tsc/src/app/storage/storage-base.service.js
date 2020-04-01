//
//--- The goal of this file is to serve as base class for all storeage classes,
//    for example, store to firebase, azure, aws s3. All common functions used  
//    to them will be added here in the future,
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import * as moment from 'moment';
var StoreBaseService = /** @class */ (function () {
    function StoreBaseService() {
    }
    StoreBaseService.prototype.storeResultLocally = function (surveyResult) {
        var obj = {
            date: moment().format('YYYYMMDD'),
            data: surveyResult
        };
        console.log("Before saveJsonObjLocally: " + this.STORAGE_REQ_KEY);
        if (window.localStorage.getItem(this.STORAGE_REQ_KEY) == undefined) {
            var storedObj = [obj];
            window.localStorage.setItem(this.STORAGE_REQ_KEY, JSON.stringify(storedObj));
        }
        else {
            this.saveJsonObjLocally(obj);
        }
    };
    StoreBaseService.prototype.saveJsonObjLocally = function (obj) {
        var storedObj = this.getLocalData();
        console.log("before push survey to local storage: " + JSON.stringify(storedObj));
        storedObj.push(obj);
        console.log("after push survey to loca storage: " + JSON.stringify(storedObj));
        // Save old & new local transactions back to Storage
        window.localStorage.setItem(this.STORAGE_REQ_KEY, JSON.stringify(storedObj));
    };
    StoreBaseService.prototype.getLocalData = function () {
        return JSON.parse(window.localStorage.getItem(this.STORAGE_REQ_KEY));
    };
    StoreBaseService.prototype.clearLocalData = function () {
        window.localStorage.removeItem(this.STORAGE_REQ_KEY);
    };
    StoreBaseService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [])
    ], StoreBaseService);
    return StoreBaseService;
}());
export { StoreBaseService };
//# sourceMappingURL=storage-base.service.js.map