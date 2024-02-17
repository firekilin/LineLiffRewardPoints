const db = require ('../getDB');
const query = db.query;



/** 建立卡片 */
exports.createCard = async(req, res) => {
  try {
    let params = req.body;
    let check = await query (`INSERT INTO reward_point.card (
      cardName, cardNum, cardPosition, cardExp, cardGift,
      createUserno, createUser, modifyUserno, modifyUser
      ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?);`, [
      params.cardName,
      params.cardNum,
      JSON.stringify (params.cardPosition),
      params.cardExp,
      params.cardGift,
      req.session.userno,
      req.session.user,
      req.session.userno,
      req.session.user
    ]);
    if (check){
      return true;
    } else {
      return false;
    }
  } catch (e){
    return false;
  }
};

/** 產生點數 代碼 */
exports.createCard = async(req, res) => {
  try {
    let params = req.body;
    let check = await query (`INSERT INTO reward_point.card (
      cardName, cardNum, cardPosition, cardExp, cardGift,
      createUserno, createUser, modifyUserno, modifyUser
      ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?);`, [
      params.cardName,
      params.cardNum,
      JSON.stringify (params.cardPosition),
      params.cardExp,
      params.cardGift,
      req.session.userno,
      req.session.user,
      req.session.userno,
      req.session.user
    ]);
    if (check){
      return true;
    } else {
      return false;
    }
  } catch (e){
    return false;
  }
};

/** 讀取點數 */




module.exports = exports;