//
//--- The goal of this file is to serve as base class for all storeage classes,
//    for example, store to firebase, azure, aws s3. All common functions used  
//    to them will be added here in the future,
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { StoreBaseService } from './storage-base.service';
import { EncrDecrService } from './encrdecrservice.service';
import { NetworkService, ConnectionStatus } from './network.service';
import * as AWS from 'aws-sdk';
var AwsS3Service = /** @class */ (function (_super) {
    tslib_1.__extends(AwsS3Service, _super);
    function AwsS3Service(networkSvc, EncrDecr) {
        var _this = _super.call(this) || this;
        _this.networkSvc = networkSvc;
        _this.EncrDecr = EncrDecr;
        return _this;
    }
    AwsS3Service.prototype.upload = function (subfolder, result) {
        var _this = this;
        this.bucketName = environment.awsConfig.bucketName;
        var bucketRegion = environment.awsConfig.bucketRegion;
        var IdentityPoolId = environment.awsConfig.IdentityPoolId;
        //var accessKeyId = environment.awsConfig.accessKeyId;
        //var secretAccessKey = environment.awsConfig.secretAccessKey;
        //set properties after creating AWS.Config using the update method
        AWS.config.update({
            region: bucketRegion,
            credentials: new AWS.CognitoIdentityCredentials({
                IdentityPoolId: IdentityPoolId
            })
        });
        //creates a new Amazon S3 service object
        this.s3 = new AWS.S3({
            apiVersion: '2006-03-01',
            params: { Bucket: this.bucketName }
        });
        /*const myS3Credentials = {
          accessKeyId: accessKeyId,
          secretAcccessKey: secretAccessKey,
        };
        
        var s3 = new AWS.S3({
          apiVersion: '2006-03-01',
          params: {Bucket: bucketName},
          accessKeyId: accessKeyId,
          secretAccessKey: secretAccessKey
        });  */
        //create a file from result passed as a JSONObject
        var fileName = "result_" + (new Date().getTime()) + "_" + this.EncrDecr.getSHA256(localStorage.getItem('loggedInUser')) + ".json";
        this.currentFile = new File([JSON.stringify(result)], fileName, { type: "text/plain" });
        //upload currentFile to the subfolder in S3 bucket
        this.STORAGE_REQ_KEY = subfolder + "_result";
        this.subfolder = subfolder;
        // Upload data and data saved in local Storage to AWS when online, save data
        // to local storage when offline.
        if (this.networkSvc.getCurrentNetworkStatus() == ConnectionStatus.Online) {
            if (window.localStorage.getItem(this.STORAGE_REQ_KEY) != undefined)
                this.uploadLocalData();
            this.uploadToS3(subfolder + "/" + fileName, result).catch(function (err) {
                if (err) {
                    console.log('Caught thrown error: ' + err.message);
                    _this.storeResultLocally(result);
                }
            });
        }
        else {
            this.storeResultLocally(result);
        }
    };
    AwsS3Service.prototype.uploadToS3 = function (key, result) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.s3.upload({
                    Bucket: this.bucketName,
                    Key: key,
                    Body: JSON.stringify(result)
                    //Body: this.currentFile
                }, function (err, data) {
                    if (err) {
                        console.log('There was an error uploading your file: ' + err.message);
                        throw new Error(err.message);
                    }
                });
                return [2 /*return*/];
            });
        });
    };
    // upload data in local storage to AWS and clear local Data, if failed, save
    // data in local storage.
    AwsS3Service.prototype.uploadLocalData = function () {
        var _this = this;
        var storedObj = this.getLocalData();
        this.clearLocalData();
        if (storedObj.length > 0) {
            var _loop_1 = function (op) {
                console.log(JSON.stringify(op));
                fileName = "result_" + (new Date().getTime()) + "_" + this_1.EncrDecr.getSHA256(localStorage.getItem('loggedInUser')) + ".json";
                this_1.uploadToS3(this_1.subfolder + "/" + fileName, [op.data]).catch(function (err) {
                    if (err) {
                        console.log('Caught thrown error: ' + err.message);
                        _this.saveJsonObjLocally(op);
                    }
                    console.log('In uploadLocalData: update file successfully');
                });
            };
            var this_1 = this, fileName;
            for (var _i = 0, storedObj_1 = storedObj; _i < storedObj_1.length; _i++) {
                var op = storedObj_1[_i];
                _loop_1(op);
            }
        }
    };
    AwsS3Service = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [NetworkService,
            EncrDecrService])
    ], AwsS3Service);
    return AwsS3Service;
}(StoreBaseService));
export { AwsS3Service };
//# sourceMappingURL=aws-s3.service.js.map