var crypto = require('crypto');


/**
 * 取得指定长度的随机数，辅助函数
 * @param  {Int}  length     随机长度
 * @return {String}           随机字符串
 */
function genRandomString (length) {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex') /** convert to hexadecimal format */
    .slice(0, length);   /** return required number of characters */
}


/**
 * sha512加盐
 * @param  {String} password 密码
 * @param  {String} salt     盐
 * @return {Object}          盐和hash密码
 */
function sha512 (password, salt) {
  var value = ''
  var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  value = hash.digest('hex');
  return {
    salt: salt,
    passwordHash: value
  };
}

/**
 * 加密密码
 * @param  {String} password    密码
 * @return {String}              加盐和hash后的密码
 */
function saltHashPassword (password) {
  var salt = genRandomString(16); /** Gives us salt of length 16 */
  var passwordData = sha512(password, salt);
  return `${passwordData.passwordHash}:${passwordData.salt}`;
}


/**
 * 验证密码
 * @param  {String} [from=''] 加盐的密码
 * @param  {String} [to='']   原密码
 * @return {Boolean}          比较结果
 */
function compare (from = '', to = '') {
  var parts = from.split(':')
  var passwordHash = parts[0] || ''
  var salt = parts[1] || ''
  return sha512(to, salt).passwordHash === passwordHash
}


/**
 * 系统对称加密的算法
 * @type {String}
 */
const ALGORITHM = 'aes-256-ctr'


/**
 * 加密id和日期
 * @param  {String} id    id
 * @param  {String} email 邮箱
 * @param  {String} key   密钥
 * @return {String}       密文
 */
const encryptIdAndDate = (id, date, key) => {
  var cipher = crypto.createCipher(ALGORITHM, key)
  var crypted = cipher.update(`${id};${date}`, 'utf8', 'hex')
  crypted += cipher.final('hex');
  return crypted
}


/**
 * 加密id和邮箱
 * @param  {String} id    id
 * @param  {String} email 邮箱
 * @param  {String} key   密钥
 * @return {String}       密文
 */
const encryptIdAndEmail = (id, email, key) => {
  var cipher = crypto.createCipher(ALGORITHM, key)
  var crypted = cipher.update(`${id};${email};${Date.now()}`, 'utf8', 'hex')
  crypted += cipher.final('hex');
  return crypted
}


/**
 * 生成token
 * @param  {String} type      用户类型
 * @param  {String} subType   子类型
 * @param  {String} id        id
 * @param  {Date}   expiredAt token失效时间
 * @param  {String} key       密钥
 * @return {String}           密文
 */
const encryptToken = (user, expiredAt, key) => {
  var subType = user.sub_type || user.subType
  var cipher = crypto.createCipher(ALGORITHM, key)
  var crypted = cipher.update(`${user.id};${expiredAt.getTime()};${user.type};${subType};`, 'utf8', 'hex')
  crypted += cipher.final('hex');
  return crypted
}


/**
 * 解密
 * @param  {String} crypted 密文
 * @param  {String} key     密钥
 * @return {Array}          解密后的数组
 */
const decript = (crypted, key) => {
  var decipher = crypto.createDecipher(ALGORITHM, key)
  var dec = decipher.update(crypted, 'hex', 'utf8')
  dec += decipher.final('utf8');
  return dec.split(';')
}


/**
 * 声明导出
 * @type {Object}
 */
module.exports = {
  saltHashPassword,
  compare,

  encryptIdAndEmail,
  encryptIdAndDate,
  encryptToken,
  decript
}
