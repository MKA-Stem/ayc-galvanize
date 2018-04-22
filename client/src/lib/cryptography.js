var CryptoJS = require('crypto-js');
const SHA256 = require('crypto-js/sha256');

export function encrypt(message, key) {
  var ciphered = CryptoJS.AES.encrypt(message, key);
  return encodeURIComponent(ciphered.toString());
}

export function decrypt(cyphered, key) {
  const cyphertext = decodeURIComponent(cyphered);
  var bytes = CryptoJS.AES.decrypt(cyphertext, key);
  var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedData;
}

export function genKey() {
  var ret = '';
  while (ret.length < 58) {
    ret += Math.random()
      .toString(16)
      .substring(2);
  }
  return ret.substring(0, 58);
}

export function hash(msg) {
  return SHA256(msg).toString();
}
