//
//--- The goal of this file is to upload a file to Azure, the configuration
//--- is at app/environments/environment.ts. 
import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { BlobService } from 'angular-azure-blob-service';
import { environment } from '../../environments/environment';
import { StoreBaseService } from './storage-base.service';
// Get configuration
var Config = {
    sas: environment.azureConfig.sas,
    storageAccount: environment.azureConfig.storageAccount,
    containerName: environment.azureConfig.containerName
};
var AzureService = /** @class */ (function (_super) {
    tslib_1.__extends(AzureService, _super);
    function AzureService(blobsvc) {
        var _this = _super.call(this) || this;
        _this.blobsvc = blobsvc;
        return _this;
    }
    AzureService.prototype.upload = function (result) {
        var _this = this;
        //create a file from result passed as a JSONObject
        this.currentFile = new File([JSON.stringify(result)], "result-Azure.json", { type: "text/plain" });
        var baseUrl = this.blobsvc.generateBlobUrl(Config, this.currentFile.name);
        this.config = {
            baseUrl: baseUrl,
            sasToken: Config.sas,
            blockSize: 1024 * 64,
            file: this.currentFile,
            complete: function () {
                console.log('Transfer completed !');
            },
            error: function (err) {
                console.log('Error:', err);
            },
            progress: function (percent) {
                _this.percent = percent;
            }
        };
        this.blobsvc.upload(this.config);
    };
    AzureService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [BlobService])
    ], AzureService);
    return AzureService;
}(StoreBaseService));
export { AzureService };
//# sourceMappingURL=azure.service.js.map