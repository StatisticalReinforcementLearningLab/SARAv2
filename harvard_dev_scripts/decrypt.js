//Install "crypto-js" in Command Prompt: npm install crypto-js 

var CryptoJS = require("crypto-js");


//--- SHA256
//var SHA256 = require("crypto-js/sha256");
//console.log(SHA256("Message"));

 
// Encrypt
var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123');
//console.log(ciphertext);


// Decrypt
//var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
//var plaintext = bytes.toString(CryptoJS.enc.Utf8);

//--  decrypt(encrypted, "+Xr?SwA?EJ7m+g$c");
var pass = "+Xr?SwA?EJ7m+g$c";
var transitmessage = process.argv[2]; //"e6d27bd148744db9db5906eb190c05fac371896da290ba938f70800aa7a9d1e4PLSAtufrEPBOWGSoVFwbFKk7cJ5Ar0A/+hfRcLkMc3teRFrPbJZktsK26fvh/RPibfv2Ppsuxkv+KELqrPdqnzJNLH+b1KI8reOuLJasUrBHbaYPB8zI8yggZuL9LkZlxmrZ8gDyTfw+jHlHsB8dNojmZGsUDnvhGNVhQ0KDHGVnVPAQJWoYf9RlYKGBWGGMJsASYHK1f8eHchiFuwmiIysiFlGNF8jxW5mDJo2B0o2Y4QNzxLf1RgXbSfut92CawDV6z41ichmC3g8gCQYp3c2sRwmIBaoAxlRBZxg9lcc1SkUNfScfuVe5BhryOoHnZyiiWTI8N5ylnX9ubOjOI+c4olt+RpP04TTDtU6h7prb+vt+TKve9E5wglMf74TDwyesNZ3gJk9gJqYcXjKPBNhY0yM5JtqZSl2UyHEoi6ssQDPzE/a9tdQaKKb65INuW/tmSeHdLlUj3VYItn/nPRKwF0K4qGEu+GSdsLSsZExTvZBtTyXBZjOq31bFECGaASWd5BJ05y3fbBLhJ336eqeQd2Z7G2hthaoORw9gP0NgQSs50R6oFh1ePwuCxER3zz9Gf0mBFzsByTgx+yVvl6KC0h49zoARAwCq5Yv0tZ38jvoj/uA1x2Hkoa4jcUxqyfI4jkEGbXFO3BLDUABShWJtb8wIdppd4HYxQeexnWQ1rgP9WZL1soahVLxDLxe78IGMHNUuebZbp7YhWFftrTWs/Pm0RBI8Ywu2AukBd06crU3wSAcMvLz2/BHhBK5meh1j8QYfycBg1Fji4lIHk/xqgVwUbShm22T1paVPcFp5tGk/EhRvpDB9uYMru2iumir2xcravvLxya69pCmgjBlPV+xUhI/13xmFflX1pZUb1rKJVzj0b0GBeMnJandy/0NtOscl9WgbTS7gNB8ZLOTPJOwAEcp2BzyILohQQWAuyui2lwHijOKOofcJdFRm/UMrDr8Y8NFheKH4rG4Y2jscnQwy6pbp9fOBpeLF5s8BPr/YZOCBY86CZmoXvKK2lASbNo/1VgDe1UW75aVwW43byfH9S8skkJ4K/1Xd3VU6Kk7heNC2Dwsb0TkAOmWBbP1hXTfJApdmWSeiXmLDdFKo1n26aJtNHJXCU/scOFnHysTmIUlZtFi0iQimzZCS2u9ly8Qp1e3DIyekDw94P0f3BBGIMwbFOY2pWX78YcWOqEffvPQDIuGXZ8oto6dyI8D9Yd3rv4CNUVLq85zfksNNiD5rE+L0NjJfos/U4MOWKPHMuneQmVV7VctSHrL/qcycq3yYLi2cx1X/4TP7TA==";



// Code goes here
var keySize = 256;
var ivSize = 128;
var iterations = 100;

var salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32))
var encrypted = transitmessage.substring(64);

var key = CryptoJS.PBKDF2(pass, salt, {
    keySize: keySize / 32,
    iterations: iterations
});

var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC
});

console.log(decrypted.toString(CryptoJS.enc.Utf8)); 