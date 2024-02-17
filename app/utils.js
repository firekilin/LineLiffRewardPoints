/** 成功回傳內容定義 */
exports.response = (data) => {
  let res = { data: data,
    code: '0000' };
  return JSON.stringify (res);

};

/** 錯誤回傳內容定義 */
exports.response = ( data, code) => {
  let res = { data: data,
    code: code };
  return JSON.stringify (res);
 
};



/** 驗證使用者 */
exports.checkAuth = (req, res) => {
  if (req.session.userno == req.body.userno){
    return true;
  } else {
    return false;
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