/** 成功錯誤回傳內容定義 */
exports.response = ( args) => {
  console.log (args);
  if (args.length == 1){
    let res = { data: args[0],
      code: '0000' };
    return JSON.stringify (res);
  } else {
    let res = { data: args[0],
      code: args[1] };
    return JSON.stringify (res);
  }
 
};



/** 驗證使用者 */
exports.checkAuth = (req, res) => {
  if (req.session.userno == req.body.userno){
    return true;
  } else {
    return false;
  }
};

module.exports = exports;