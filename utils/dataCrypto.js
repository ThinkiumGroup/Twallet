import Crypto from "crypto";

const crypto = require('crypto');

// 获得随机iv
const getRandomIV = () => {
  let random = parseInt(Math.random()*1000000000000);
  const hash = Crypto.createHash('sha256')
  const iv = hash.update(random + '').digest('hex').slice(0, 16);
  return iv;
};

// 加密
const encryptData = (data, password, iv, algorithm = 'aes-256-cbc') => {
  if (!data) throw new Error('Data must not be null')
  const hash = Crypto.createHash('sha256')
  const key = hash.update(password).digest('hex').slice(0, 32);

  let sign = '';
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  sign += cipher.update(data, 'utf8', 'hex');
  sign += cipher.final('hex');
  return sign;
};

// 解密
const decryptData = (encryptedData, password, iv, algorithm = 'aes-256-cbc') => {
  if (!encryptedData) throw new Error('Data must not be null');
  const hash = Crypto.createHash('sha256');
  const key = hash.update(password).digest('hex').slice(0, 32);

  let src = '';
  const cipher = crypto.createDecipheriv(algorithm, key, iv);
  src += cipher.update(encryptedData, 'hex', 'utf8');
  src += cipher.final('utf8');
  return src;
};

// 获得密钥的key
const formatPasswordToKey = (password, iv) => {
  if(!password){
    throw new Error('password must not be null');
  }
  let hash = Crypto.createHash('sha256');
  let key = hash.update(password + iv).digest('hex').slice(0, 32);
  return key;
};


export default {
  getRandomIV,
  encryptData,
  decryptData,
  formatPasswordToKey,

};
