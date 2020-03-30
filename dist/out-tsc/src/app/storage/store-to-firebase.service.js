//
//--- The goal of this file is to upload an object to firebase, the configuration
//--- is at app/environments/environment.ts. At app/storage/storage.module.ts, 
//--- we load the environment configuration and setup our module to use the 
//--- AngularFire package 
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { StoreBaseService } from './storage-base.service';
var StoreToFirebaseService = /** @class */ (function (_super) {
    tslib_1.__extends(StoreToFirebaseService, _super);
    function StoreToFirebaseService(afs) {
        var _this = _super.call(this) || this;
        _this.afs = afs;
        return _this;
    }
    //upload obj to path in firebase
    StoreToFirebaseService.prototype.addSurvey = function (path, obj) {
        var _this = this;
        console.log("Start to addSurvey!");
        return new Promise(function (resolve, reject) {
            _this.afs.collection(path).add(obj)
                .then(function (res) {
                resolve(res);
            }, function (err) { return reject(err); });
        });
    };
    StoreToFirebaseService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root',
        }),
        tslib_1.__metadata("design:paramtypes", [AngularFirestore])
    ], StoreToFirebaseService);
    return StoreToFirebaseService;
}(StoreBaseService));
export { StoreToFirebaseService };
//# sourceMappingURL=store-to-firebase.service.js.map