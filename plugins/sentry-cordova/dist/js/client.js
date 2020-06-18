Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = require("@sentry/core");
var backend_1 = require("./backend");
var version_1 = require("./version");
/**
 * The Sentry Cordova SDK Client.
 *
 * @see CordovaOptions for documentation on configuration options.
 * @see SentryClient for usage documentation.
 */
var CordovaClient = /** @class */ (function (_super) {
    tslib_1.__extends(CordovaClient, _super);
    /**
     * Creates a new Cordova SDK instance.
     * @param options Configuration options for this SDK.
     */
    function CordovaClient(options) {
        return _super.call(this, backend_1.CordovaBackend, options) || this;
    }
    /**
     * @inheritDoc
     */
    CordovaClient.prototype._prepareEvent = function (event, scope, hint) {
        event.platform = event.platform || 'javascript';
        event.sdk = tslib_1.__assign(tslib_1.__assign({}, event.sdk), { name: version_1.SDK_NAME, packages: tslib_1.__spread(((event.sdk && event.sdk.packages) || []), [
                {
                    name: 'npm:sentry-cordova',
                    version: version_1.SDK_VERSION,
                },
            ]), version: version_1.SDK_VERSION });
        return _super.prototype._prepareEvent.call(this, event, scope, hint);
    };
    return CordovaClient;
}(core_1.BaseClient));
exports.CordovaClient = CordovaClient;
//# sourceMappingURL=client.js.map