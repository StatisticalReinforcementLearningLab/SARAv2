Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@sentry/core");
var normalize_1 = require("../normalize");
/** Default Breadcrumbs instrumentations */
var Cordova = /** @class */ (function () {
    function Cordova() {
        /**
         * @inheritDoc
         */
        this.name = Cordova.id;
    }
    /**
     * @inheritDoc
     */
    Cordova.prototype.setupOnce = function () {
        core_1.addGlobalEventProcessor(function (event) {
            var self = core_1.getCurrentHub().getIntegration(Cordova);
            if (self) {
                return normalize_1.normalizeData(event);
            }
            return event;
        });
    };
    /**
     * @inheritDoc
     */
    Cordova.id = 'Cordova';
    return Cordova;
}());
exports.Cordova = Cordova;
//# sourceMappingURL=cordova.js.map