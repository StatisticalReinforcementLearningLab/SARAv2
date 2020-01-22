export class User{
  constructor(
    public userName: string,
    private _accessToken: string,
    private _refreshToken: string ,
    private _accessTokenExpirationDate: Date,
    private _refreshTokenExpirationDate: Date){}

    setAccessToken(token: string, expirationDate: Date){
      this._accessToken = token;
      this._accessTokenExpirationDate = expirationDate;
    }

    getAccessToken(){
      if(!this._accessTokenExpirationDate || new Date() > this._accessTokenExpirationDate){
        return null;
      }
      return this._accessToken;
    }


    getRefreshToken(){
      if(!this._refreshTokenExpirationDate || new Date() > this._refreshTokenExpirationDate){
        return null;
      }
      return this._refreshToken;
    }
}
