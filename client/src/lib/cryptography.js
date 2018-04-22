var CryptoJS = require("crypto-js");

export function encrypt(message, key) {
  var ciphered = CryptoJS.AES.encrypt(message, key);
  return(ciphered.toString());
}

export function decrypt(cyphered, key){
  var bytes  = CryptoJS.AES.decrypt(cyphered, key);
  var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedData
}

export function genKey() {
  var ret = "";
  while (ret.length < 58) {
    ret += Math.random().toString(16).substring(2);
  }
  return ret.substring(0,58);
}
