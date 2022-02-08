//Install "crypto-js" in Command Prompt: npm install crypto-js 
var CryptoJS = require("crypto-js");

var fs = require('fs');

//Install "ini" in Command Prompt: npm install ini
var ini = require('ini');
var config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'))
var encryption_string = config.SURVEY_ENCRYPTION.ENCRYPTION_STRING

// Encrypt
var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123');

// Decrypt
var pass = encryption_string;
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