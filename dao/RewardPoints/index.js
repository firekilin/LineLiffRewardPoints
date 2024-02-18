const db = require ('../getDB');
const query = db.query;



/** 建立卡片 */
exports.createCard = async(req, res) => {
  try {
    let params = req.body;
    let sql = 'INSERT INTO reward_point.card SET ?';
    let values = {
      cardName: params.cardName,
      cardNum: params.cardNum,
      cardPosition: JSON.stringify (params.cardPosition),
      cardExp: params.cardExp,
      cardGift: params.cardGift,
      createUserno: req.session.userId,
      createUser: req.session.displayName,
      modifyUserno: req.session.userId,
      modifyUser: req.session.displayName
    };
    let check = await query (sql, values);
    if (! check){
      return false;
    }
    let cardId = check.insertId ;

    if (params.bgImage != null){
      sql = 'INSERT INTO reward_point.file SET ?';
      values = {
        cardSeq: cardId,
        fileType: '1',
        fileData: params.bgImage,
        createUserno: req.session.userId,
        createUser: req.session.displayName,
        modifyUserno: req.session.userId,
        modifyUser: req.session.displayName,
      };
      check = await query (sql, values);
    }
    if (! check){
      return false;
    }
    if (params.pointImage != null){
      sql = 'INSERT INTO reward_point.file SET ?';
      values = {
        cardSeq: cardId,
        fileType: '2',
        fileData: params.pointImage,
        createUserno: req.session.userId,
        createUser: req.session.displayName,
        modifyUserno: req.session.userId,
        modifyUser: req.session.displayName,
      };
      check = await query (sql, values);
      
    }
    if (! check){
      return false;
    }
    if (params.pointOver != null){
      sql = 'INSERT INTO reward_point.file SET ?';
      values = {
        cardSeq: cardId,
        fileType: '3',
        fileData: params.pointOver,
        createUserno: req.session.userId,
        createUser: req.session.displayName,
        modifyUserno: req.session.userId,
        modifyUser: req.session.displayName,
      };
      check = await query (sql, values);
    }
    if (! check){
      return false;
    }
    if (params.pointImgsTemp.length != 0){
      for (let i = 0;i < params.pointImgsTemp.length;i ++){
        sql = 'INSERT INTO reward_point.file SET ?';
        values = {
          cardSeq: cardId,
          fileType: '2',
          fileData: params.pointImgsTemp[i],
          createUserno: req.session.userId,
          createUser: req.session.displayName,
          modifyUserno: req.session.userId,
          modifyUser: req.session.displayName,
        };
        check = await query (sql, values);

      }
    }
    return true;
  } catch (e){
    return false;
  }
};

/** 卡片清單 */
exports.manageCardList = async(req, res) => {
  try {
    let sql = 'SELECT cardSeq,cardName,cardNum,cardExp,cardGift FROM reward_point.card where ? ';
    let values = { createUserno: req.session.userId };
    let check = await query (sql, values);
    if (check){
      return check;
    }
    
  } catch (e){
    return false;
  }
};

exports.manageCard = async(req, res) => {
  let json = {};
  try {
    let sql = 'SELECT cardPosition FROM reward_point.card where ? ';
    let values = { cardSeq: req.body.cardSeq };
    let check = await query (sql, values);
    if (check){
      json.cardPosition = check[0].cardPosition;
    }
    sql = 'SELECT filedata FROM reward_point.file where cardSeq = ? and fileType = ? ';
    values = [req.body.cardSeq, '1' ];
    check = await query (sql, values);
    if (check){
      json.bgImage = check[0].filedata;
    }
    sql = 'SELECT filedata FROM reward_point.file where cardSeq = ? and fileType = ? ';
    values = [req.body.cardSeq, '2' ];
    check = await query (sql, values);
    let pointImage = [];
    if (check){
      for (let i = 0;i < check.length;i ++){
        pointImage.push (check[i].filedata);
      }
      json.pointImage = pointImage;
    }
    return json;
  } catch (e){
    return null;
  }
};


/** 產生點數 代碼 */
exports.createPoint = async(req, res) => {
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
      req.session.userId,
      req.session.displayName,
      req.session.userId,
      req.session.displayName
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





module.exports = exports;