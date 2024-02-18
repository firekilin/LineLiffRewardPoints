

/** 成功錯誤回傳內容定義 */
exports.response = ( data, code) => {
  if (code == null){
    code = '0000';
  }
  let res = { data: data,
    code: code };
  return JSON.stringify (res);
 
};

/** 驗證使用者  */
exports.checkAuth = (req, res) => {
  if (req.session.userId){
    return true;
  } else {
    return false;
  }
};

/** base64 to buffer */
exports.base64ToBuffer = (base64) => {
  if (base64 == null || base64 == ''){
    return null;
  }
  const base64String = base64.substring (base64.indexOf (',') + 1); 
  const buffer = Buffer.from (base64String, 'base64');
  return buffer;
};

/** buffer to base64 */
exports.bufferToBase64 = (buffer) => {
  if (buffer == null || buffer == ''){
    return null;
  }
  let base64 = buffer.toString('base64');
  return base64;
};




/** 驗證使用者 api專用 */
exports.checkAuthApi = (req, res) => {
  if (req.session.userId){
    return true;
  } else {
    res.send (exports.response ('登入錯誤', '0001'));
  }
};

/** 產生亂數16碼 */
exports.getRandomCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 16;
  let randomCode = '';
  
  for (let i = 0; i < length; i ++) {
    const randomIndex = Math.floor (Math.random () * characters.length);
    randomCode += characters.charAt (randomIndex);
  }
  
  return randomCode;
};


module.exports = exports;