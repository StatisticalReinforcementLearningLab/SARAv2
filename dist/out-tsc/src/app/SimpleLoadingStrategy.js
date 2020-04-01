import { of } from 'rxjs';
var SimpleLoadingStrategy = /** @class */ (function () {
    function SimpleLoadingStrategy() {
    }
    SimpleLoadingStrategy.prototype.preload = function (route, load) {
        return route.data && route.data.preload ? load() : of(null);
    };
    return SimpleLoadingStrategy;
}());
export { SimpleLoadingStrategy };
//# sourceMappingURL=SimpleLoadingStrategy.js.map