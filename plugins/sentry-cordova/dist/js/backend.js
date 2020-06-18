Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var backend_1 = require("@sentry/browser/dist/backend");
var core_1 = require("@sentry/core");
var types_1 = require("@sentry/types");
var utils_1 = require("@sentry/utils");
var PLUGIN_NAME = 'Sentry';
/** The Sentry Cordova SDK Backend. */
var CordovaBackend = /** @class */ (function (_super) {
    tslib_1.__extends(CordovaBackend, _super);
    /** Creates a new cordova backend instance. */
    function CordovaBackend(_options) {
        if (_options === void 0) { _options = {}; }
        var _this = _super.call(this, _options) || this;
        _this._options = _options;
        _this._browserBackend = new backend_1.BrowserBackend(_options);
        if (_this._isCordova() && _options.enableNative !== false) {
            _this._deviceReadyCallback = function () {
                _this._runNativeInstall();
            };
            utils_1.getGlobalObject().document.addEventListener('deviceready', _this._deviceReadyCallback);
        }
        return _this;
    }
    /**
     * @inheritDoc
     */
    CordovaBackend.prototype.eventFromException = function (exception, hint) {
        return this._browserBackend.eventFromException(exception, hint);
    };
    /**
     * @inheritDoc
     */
    CordovaBackend.prototype.eventFromMessage = function (message, level, hint) {
        if (level === void 0) { level = types_1.Severity.Info; }
        return this._browserBackend.eventFromMessage(message, level, hint);
    };
    /**
     * @inheritDoc
     */
    CordovaBackend.prototype.sendEvent = function (event) {
        var _this = this;
        this._nativeCall('sendEvent', event).catch(function (e) {
            utils_1.logger.warn(e);
            _this._browserBackend.sendEvent(event);
        });
    };
    // CORDOVA --------------------
    /**
     * Uses exec to call cordova functions
     * @param action name of the action
     * @param args Arguments
     */
    CordovaBackend.prototype._nativeCall = function (action) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if (_this._options.enableNative === false) {
                            reject('enableNative = false, using browser transport');
                            return;
                        }
                        var _window = utils_1.getGlobalObject();
                        // tslint:disable-next-line: no-unsafe-any
                        var exec = _window && _window.Cordova && _window.Cordova.exec;
                        if (!exec) {
                            reject('Cordova.exec not available');
                        }
                        else {
                            try {
                                // tslint:disable-next-line: no-unsafe-any
                                _window.Cordova.exec(resolve, reject, PLUGIN_NAME, action, args);
                            }
                            catch (e) {
                                reject('Cordova.exec not available');
                            }
                        }
                    })];
            });
        });
    };
    /**
     * Calling into native install function
     */
    CordovaBackend.prototype._runNativeInstall = function () {
        var _this = this;
        if (this._deviceReadyCallback) {
            utils_1.getGlobalObject().document.removeEventListener('deviceready', this._deviceReadyCallback);
            if (this._options.dsn && this._options.enabled !== false) {
                utils_1.forget(this._nativeCall('install', this._options.dsn, this._options));
            }
            // tslint:disable:no-unsafe-any
            var scope = core_1.getCurrentHub().getScope();
            if (scope) {
                scope.addScopeListener(function (internalScope) {
                    _this._nativeCall('setExtraContext', internalScope._extra).catch(function () {
                        // We do nothing since scope is handled and attached to the event.
                        // This only applies to android.
                    });
                    _this._nativeCall('setTagsContext', internalScope._tags).catch(function () {
                        // We do nothing since scope is handled and attached to the event.
                        // This only applies to android.
                    });
                    _this._nativeCall('setUserContext', internalScope._user).catch(function () {
                        // We do nothing since scope is handled and attached to the event.
                        // This only applies to android.
                    });
                    _this._nativeCall('addBreadcrumb', internalScope._breadcrumbs.pop()).catch(function () {
                        // We do nothing since scope is handled and attached to the event.
                        // This only applies to android.
                    });
                });
            }
            // tslint:enable:no-unsafe-any
        }
    };
    /**
     * Has cordova on window?
     */
    CordovaBackend.prototype._isCordova = function () {
        // tslint:disable-next-line: no-unsafe-any
        return utils_1.getGlobalObject().cordova !== undefined || utils_1.getGlobalObject().Cordova !== undefined;
    };
    return CordovaBackend;
}(core_1.BaseBackend));
exports.CordovaBackend = CordovaBackend;
//# sourceMappingURL=backend.js.map