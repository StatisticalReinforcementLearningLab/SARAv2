import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
var SaveDataService = /** @class */ (function () {
    function SaveDataService(router) {
        this.router = router;
    }
    SaveDataService.prototype.saveData = function (key, obj) {
        localStorage.setItem(key, obj);
    };
    SaveDataService.prototype.browseToReward = function (path) {
        this.router.navigateByUrl(path);
    };
    SaveDataService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [Router])
    ], SaveDataService);
    return SaveDataService;
}());
export { SaveDataService };
//# sourceMappingURL=save-data.service.js.map