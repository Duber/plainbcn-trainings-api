// Original: https://gitlab.com/aquator/node-get-keycloak-public-key/-/blob/master/index.js
import cache from 'memory-cache'
import fetch from 'node-fetch'

const BEGIN_KEY = '-----BEGIN RSA PUBLIC KEY-----\n';
const END_KEY = '\n-----END RSA PUBLIC KEY-----\n';
const KEY_CACHE_DURATION = 300000

export default async function DownloadPublicKey(keysUrl, kid) {
  const pemCacheKey = `${keysUrl}_${kid}`
  let pem = cache.get(pemCacheKey)
  if (!pem) {
    const keys = await downloadPublicKeys(keysUrl);
    const key = getKeyByKid(keys, kid);
    pem = buildPEM(key.n, key.e)
    cache.put(pemCacheKey, pem, KEY_CACHE_DURATION)
  }
  return pem
};

async function downloadPublicKeys(url) {
  let keys = cache.get(url)
  if (!keys) {
    const res = await fetch(url)
    let data = await res.json()
    keys = data.keys
    cache.put(url, keys, KEY_CACHE_DURATION)
  }
  return keys
}

function getKeyByKid(keys, kid) {
  return keys.find(k => k.kid === kid)
}

// Based on tracker1's node-rsa-pem-from-mod-exp module.
// See https://github.com/tracker1/node-rsa-pem-from-mod-exp
function buildPEM(modulus, exponent) {
  const mod = convertToHex(modulus);
  const exp = convertToHex(exponent);
  const encModLen = encodeLenght(mod.length / 2);
  const encExpLen = encodeLenght(exp.length / 2);
  const part = [mod, exp, encModLen, encExpLen].map(n => n.length / 2).reduce((a, b) => a + b);
  const bufferSource = `30${encodeLenght(part + 2)}02${encModLen}${mod}02${encExpLen}${exp}`;
  const pubkey = Buffer.from(bufferSource, 'hex').toString('base64');
  return BEGIN_KEY + pubkey.match(/.{1,64}/g).join('\n') + END_KEY;
}

function convertToHex(str) {
  const hex = Buffer.from(str, 'base64').toString('hex');
  return hex[0] < '0' || hex[0] > '7'
    ? `00${hex}`
    : hex;
}

function encodeLenght(n) {
  return n <= 127
    ? toHex(n)
    : toLongHex(n);
}

function toLongHex(number) {
  const str = toHex(number);
  const lengthByteLength = 128 + (str.length / 2);
  return toHex(lengthByteLength) + str;
}

function toHex(number) {
  const str = number.toString(16);
  return (str.length % 2)
    ? `0${str}`
    : str;
}
