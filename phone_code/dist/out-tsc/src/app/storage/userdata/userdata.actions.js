// Section 2
export var ADD_POINT = '[POINT] Add';
export var ADD_MONEY = '[Money] Add';
// Section 3
var AddPoints = /** @class */ (function () {
    function AddPoints(payload) {
        this.payload = payload;
        this.type = ADD_POINT;
    }
    return AddPoints;
}());
export { AddPoints };
var AddMoney = /** @class */ (function () {
    function AddMoney(payload) {
        this.payload = payload;
        this.type = ADD_MONEY;
    }
    return AddMoney;
}());
export { AddMoney };
//# sourceMappingURL=userdata.actions.js.map