var User = /** @class */ (function () {
    function User(userName, _accessToken, _refreshToken, _accessTokenExpirationDate, _refreshTokenExpirationDate) {
        this.userName = userName;
        this._accessToken = _accessToken;
        this._refreshToken = _refreshToken;
        this._accessTokenExpirationDate = _accessTokenExpirationDate;
        this._refreshTokenExpirationDate = _refreshTokenExpirationDate;
    }
    User.prototype.setAccessToken = function (token, expirationDate) {
        this._accessToken = token;
        this._accessTokenExpirationDate = expirationDate;
    };
    User.prototype.getAccessToken = function () {
        if (!this._accessTokenExpirationDate || new Date() > this._accessTokenExpirationDate) {
            return null;
        }
        return this._accessToken;
    };
    User.prototype.getRefreshToken = function () {
        if (!this._refreshTokenExpirationDate || new Date() > this._refreshTokenExpirationDate) {
            return null;
        }
        return this._refreshToken;
    };
    return User;
}());
export { User };
//# sourceMappingURL=user.model.js.map