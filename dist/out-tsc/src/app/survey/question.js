var Question = /** @class */ (function () {
    function Question(options) {
        if (options === void 0) { options = {}; }
        this.ID = options.ID;
        this.label = options.label || '';
        this.result1 = !!options.result1;
        this.result2 = !!options.result2;
    }
    Question.prototype.getData = function () {
        var _this = this;
        var result = {};
        Object.keys(this).map(function (key) { return result[key] = _this[key]; });
        return result;
    };
    return Question;
}());
export { Question };
//# sourceMappingURL=question.js.map