
//Install "crypto-js" in Command Prompt: npm install crypto-js 

var CryptoJS = require("crypto-js");

 
// Encrypt
var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123');

// Decrypt
var pass = "+Xr?SwA?EJ7m+g$c";
var transitmessage = process.argv[2]; 

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