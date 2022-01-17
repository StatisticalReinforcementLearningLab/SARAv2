import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { BehaviorSubject } from 'rxjs';
import { ToastController, Platform } from '@ionic/angular';
export var ConnectionStatus;
(function (ConnectionStatus) {
    ConnectionStatus[ConnectionStatus["Online"] = 0] = "Online";
    ConnectionStatus[ConnectionStatus["Offline"] = 1] = "Offline";
})(ConnectionStatus || (ConnectionStatus = {}));
var NetworkService = /** @class */ (function () {
    function NetworkService(network, toastController, plt) {
        var _this = this;
        this.network = network;
        this.toastController = toastController;
        this.plt = plt;
        this.status = new BehaviorSubject(ConnectionStatus.Offline);
        this.plt.ready().then(function () {
            _this.initializeNetworkEvents();
            var status = _this.network.type !== 'none' ? ConnectionStatus.Online : ConnectionStatus.Offline;
            _this.status.next(status);
        });
    }
    NetworkService.prototype.initializeNetworkEvents = function () {
        var _this = this;
        this.network.onDisconnect().subscribe(function () {
            if (_this.status.getValue() === ConnectionStatus.Online) {
                console.log('WE ARE OFFLINE');
                _this.updateNetworkStatus(ConnectionStatus.Offline);
            }
        });
        this.network.onConnect().subscribe(function () {
            if (_this.status.getValue() === ConnectionStatus.Offline) {
                console.log('WE ARE ONLINE');
                _this.updateNetworkStatus(ConnectionStatus.Online);
            }
        });
    };
    NetworkService.prototype.updateNetworkStatus = function (status) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var connection, toast;
            return tslib_1.__generator(this, function (_a) {
                this.status.next(status);
                connection = status == ConnectionStatus.Offline ? 'Offline' : 'Online';
                toast = this.toastController.create({
                    message: "You are now " + connection,
                    duration: 3000,
                    position: 'bottom'
                });
                toast.then(function (toast) { return toast.present(); });
                return [2 /*return*/];
            });
        });
    };
    NetworkService.prototype.onNetworkChange = function () {
        return this.status.asObservable();
    };
    NetworkService.prototype.getCurrentNetworkStatus = function () {
        return this.status.getValue();
    };
    NetworkService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root'
        }),
        tslib_1.__metadata("design:paramtypes", [Network,
            ToastController,
            Platform])
    ], NetworkService);
    return NetworkService;
}());
export { NetworkService };
//# sourceMappingURL=network.service.js.map