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
    let sql = `SELECT distinct  a.cardSeq,a.cardName,a.cardNum,a.cardExp,a.cardGift 
    FROM reward_point.card as a 
    left join reward_point.group as b on a.cardSeq=b.cardSeq    
    WHERE a.createUserno=? or b.groupUserno=?`;
    let values = [req.session.userId, req.session.userId];
    let check = await query (sql, values);
    if (check.length > 0){
      return check;
    }
    
  } catch (e){
    return false;
  }
};

/** 卡片詳細 */
exports.manageCard = async(req, res) => {
  let json = {};
  try {
    let sql = 'SELECT cardPosition,cardNum FROM reward_point.card WHERE ? ';
    let values = { cardSeq: req.body.cardSeq };
    let check = await query (sql, values);
    if (check.length > 0){
      json.cardPosition = check[0].cardPosition;
      json.cardNum = check[0].cardNum;

    }
    sql = 'SELECT filedata FROM reward_point.file WHERE cardSeq = ? and fileType = ? ';
    values = [req.body.cardSeq, '1'];
    check = await query (sql, values);
    if (check.length > 0){
      json.bgImage = check[0].filedata;
    }
    sql = 'SELECT filedata FROM reward_point.file WHERE cardSeq = ? and fileType = ? ';
    values = [req.body.cardSeq, '2'];
    check = await query (sql, values);
    let pointImage = [];
    if (check.length > 0){
      for (let i = 0;i < check.length;i ++){
        pointImage.push (check[i].filedata);
      }
      json.pointImage = pointImage;
    }
    sql = 'SELECT filedata FROM reward_point.file WHERE cardSeq = ? and fileType = ? ';
    values = [req.body.cardSeq, '3'];
    check = await query (sql, values);
    if (check.length > 0){
      json.getWardImage = check[0].filedata;
    }
    return json;
  } catch (e){
    return null;
  }
};


/** 確認為卡片建立者 */
exports.isCardBuilder = async(req, res) => {
  try {
    let sql = `SELECT cardSeq 
      FROM reward_point.card WHERE cardSeq = ? and createUserno = ?;`;
    let values = [req.body.cardSeq, req.session.userId];
    let check = await query (sql, values);
    if (check.length > 0){
      return true;
    }
    return false;

  } catch (e){
    return false;
  }
};

/** 發點人員清單 */
exports.groupList = async(req, res) => {
  try {
    let sql = `SELECT b.cardName,a.cardSeq,a.groupSeq,a.groupUser,a.groupCode
      FROM reward_point.group as a left join reward_point.card as b on a.cardSeq=b.cardSeq WHERE a.cardSeq =? ;`;
    let values = [req.body.cardSeq, req.session.userId];
    let check = await query (sql, values);
    if (check.length > 0){
      return check;
    }
    return null;

  } catch (e){
    return null;
  }
};

/** 刪除發點人員 */
exports.deleteGroup = async(req, res) => {
  try {
    let sql = `DELETE FROM reward_point.group WHERE  (cardSeq=?  and createUserno=? ) and (groupSeq = ? )`;
    values = [req.body.cardSeq, req.session.userId, req.body.groupSeq];
    let check = await query (sql, values);
    if (check){
      return true;
    } 
    return false;

  } catch (e){
    return false;
  }
};

/** 卡片管理員動作紀錄 */
exports.managerHistroy = async(req, res) => {
  try {
    sql = `SELECT  pointNum,createdate,status,createUser
FROM reward_point.point WHERE cardSeq = ? and (createUserno = ? or pointUserno= ?) `;
    values = [req.body.cardSeq, req.session.userId, req.session.userId];
    check = await query (sql, values);
    if (check.length > 0){
      return check;
    } else {
      return null;
    }
  } catch (e){
    return null;
  }
};


/** 卡片建立者查看所有人動作紀錄 */
exports.builderHistroy = async(req, res) => {
  try {
    sql = `SELECT  pointNum,createdate,status,createUser
      FROM reward_point.point WHERE cardSeq = ? `;
    values = [req.body.cardSeq];
    check = await query (sql, values);
    if (check.length > 0){
      return check;
    } else {
      return null;
    }
  } catch (e){
    return null;
  }
};




/** 新增發點人員 QRcode */
exports.addGroup = async(req, res) => {
  try {
    let sql = `SELECT cardName FROM reward_point.card  WHERE cardSeq=? and createUserno = ? ;`;
    let values = [req.body.cardSeq, req.session.userId];
    let check = await query (sql, values);
    if (check.length > 0){
      req.body.cardName = check[0].cardName;
      sql = 'INSERT INTO reward_point.group SET ?';
      values = {
        cardSeq: req.body.cardSeq,
        groupCode: req.body.pointCode,
        createUserno: req.session.userId,
        createUser: req.session.displayName,
        modifyUserno: req.session.userId,
        modifyUser: req.session.displayName,
      };
      check = await query (sql, values);
      if (check){
        return true;
      } 
    }
    return false;

  } catch (e){
    return false;
  }
};

/** 加入人員 */
exports.joinGroup = async(req, res) => {
  try {
    let sql = `SELECT a.groupSeq,b.cardName,a.groupUser,a.groupCode FROM reward_point.group as a 
      left join reward_point.card as b on a.cardSeq=b.cardSeq  
      WHERE groupCode = ? and a.createUserno <> ? `;
    values = [req.params.pointCode, req.session.userId];
    let check = await query (sql, values);
    if (check.length == 1){
      sql = `DELETE FROM reward_point.point WHERE pointUserno = ?`;
      values = [req.session.userId];
      let check2 = await query (sql, values);
      if (check2){
        sql = `UPDATE reward_point.group SET groupUserno=?,groupUser=?, groupCode=?,modifyUserno=?,modifyUser=? WHERE groupSeq=?`;
        values = [req.session.userId, req.session.displayName, null, req.session.userId, req.session.displayName, check[0].groupSeq];
        check2 = await query (sql, values);
        if (check2){
          return check[0];
        }
      }
    } 
    return null;

  } catch (e){
    return null;
  }
};


/** 產生點數 代碼 */
exports.createPoint = async(req, res) => {
  try {
    let sql = `SELECT distinct  a.cardSeq,a.cardName,a.cardNum,a.cardExp,a.cardGift 
    FROM reward_point.card as a 
    left join reward_point.group as b on a.cardSeq=b.cardSeq    
    WHERE a.createUserno=? or b.groupUserno=?`;
    let values = [req.session.userId, req.session.userId];
    let check = await query (sql, values);
    if (check.length > 0){
      sql = 'INSERT INTO reward_point.point SET ?';
      values = {
        cardSeq: req.body.cardSeq,
        pointNum: req.body.pointNum,
        pointCode: req.body.pointCode,
        status: 'w',
        createUserno: req.session.userId,
        createUser: req.session.displayName,
        modifyUserno: req.session.userId,
        modifyUser: req.session.displayName,
      };
      check = await query (sql, values);
      if (check){
        return true;
      }
    }
    return false;
  } catch (e){
    return false;
  }
};

/** 接收點數 代碼 */
exports.getPoint = async(req, res) => {
  try {
    let sql = `SELECT distinct  a.cardSeq,a.cardName,a.cardNum,a.cardExp,a.cardGift 
    FROM reward_point.card as a 
    left join reward_point.group as b on a.cardSeq=b.cardSeq    
    WHERE a.createUserno=? or b.groupUserno=?`;
    let values = [req.session.userId, req.session.userId];
    let check = await query (sql, values);
    if (check.length == 0){
      let sql = `SELECT a.pointSeq,b.cardName,a.pointNum,a.createUserno FROM reward_point.point as a 
        left join reward_point.card as b on a.cardSeq=b.cardSeq  
        WHERE pointCode = ? and status = ? and a.createUserno <> ? `;
      values = [req.params.pointCode, 'w', req.session.userId];
      let check = await query (sql, values);
      if (check.length == 1){
        let sql = `UPDATE reward_point.point SET pointUserno=?,status=? , pointCode=?,modifyUserno=?,modifyUser=? WHERE pointSeq=?`;
        values = [req.session.userId, 'e', null, req.session.userId, req.session.displayName, check[0].pointSeq];
        let check2 = await query (sql, values);
        if (check2){
          return check[0];
        }
      } 
    }
    return null;

  } catch (e){
    return null;
  }
};

/** 卡片清單 */
exports.pointList = async(req, res) => {
  try {
    let sql = `SELECT 
                    b.cardSeq,
                    b.cardName,
                    b.cardNum,
                    b.cardExp,
                    b.cardGift,
                    SUM(a.pointNum) - COALESCE(MAX(m.pointNum), 0) AS pointNum
                FROM 
                    reward_point.point AS a 
                LEFT JOIN 
                    reward_point.card AS b ON a.cardSeq = b.cardSeq
                LEFT JOIN 
                    (SELECT 
                        cardSeq,
                        SUM(pointNum) AS pointNum 
                    FROM 
                        reward_point.point 
                    WHERE 
                        createUserno = ? AND status in ('m','u') 
                    GROUP BY 
                        cardSeq
                    ) AS m ON a.cardSeq = m.cardSeq
                WHERE 
                    a.pointUserno = ? AND a.status in('e','m')
                GROUP BY 
                    b.cardSeq, b.cardName, b.cardNum, b.cardExp, b.cardGift;`;
    let values = [req.session.userId, req.session.userId];
    let check = await query (sql, values);
    if (check.length > 0){
      return check;
    }
    return null;
  } catch (e){
    return null;
  }
};


/** 轉送點數 代碼 */
exports.sharePoint = async(req, res) => {
  try {
    let sql = `SELECT 
                    b.cardSeq,
                    b.cardName,
                    b.cardNum,
                    b.cardExp,
                    b.cardGift,
                    SUM(a.pointNum) - COALESCE(MAX(m.pointNum), 0) AS pointNum
                FROM 
                    reward_point.point AS a 
                LEFT JOIN 
                    reward_point.card AS b ON a.cardSeq = b.cardSeq
                LEFT JOIN 
                    (SELECT 
                        cardSeq,
                        SUM(pointNum) AS pointNum 
                    FROM 
                        reward_point.point 
                    WHERE 
                        createUserno = ? AND status in ('m','g','u','r') 
                    GROUP BY 
                        cardSeq
                    ) AS m ON a.cardSeq = m.cardSeq
                WHERE 
                    a.pointUserno = ? AND a.status in('e','m') and a.cardSeq = ?
                GROUP BY 
                    b.cardSeq, b.cardName, b.cardNum, b.cardExp, b.cardGift;`;
    let values = [req.session.userId, req.session.userId, req.body.cardSeq];
    let checkpoint = await query (sql, values);
    if (checkpoint.length == 1 && checkpoint[0].pointNum >= req.body.pointNum){
      sql = 'INSERT INTO reward_point.point SET ?';
      values = {
        cardSeq: req.body.cardSeq,
        pointNum: req.body.pointNum,
        pointCode: req.body.pointCode,
        status: 'g',
        createUserno: req.session.userId,
        createUser: req.session.displayName,
        modifyUserno: req.session.userId,
        modifyUser: req.session.displayName,
      };
      check = await query (sql, values);
      if (check){
        return true;
      }
    }
    return false;
    
  } catch (e){
    return false;
  }
};


/** 接收轉送點數 代碼 */
exports.getSharePoint = async(req, res) => {
  try {
    let sql = `SELECT distinct  a.cardSeq,a.cardName,a.cardNum,a.cardExp,a.cardGift 
    FROM reward_point.card as a 
    left join reward_point.group as b on a.cardSeq=b.cardSeq    
    WHERE a.createUserno=? or b.groupUserno=?`;
    let values = [req.session.userId, req.session.userId];
    let check = await query (sql, values);
    if (check.length == 0){
      let sql = `SELECT a.pointSeq,b.cardName,a.pointNum FROM reward_point.point as a 
      left join reward_point.card as b on a.cardSeq=b.cardSeq  
      WHERE pointCode = ? and status = ? and a.createUserno <> ? `;
      values = [req.params.pointCode, 'g', req.session.userId];
      let check = await query (sql, values);
      if (check.length == 1){
        let sql = `UPDATE reward_point.point SET pointUserno=?,status=? , pointCode=?,modifyUserno=?,modifyUser=? WHERE pointSeq=?`;
        values = [req.session.userId, 'm', null, req.session.userId, req.session.displayName, check[0].pointSeq];
        let check2 = await query (sql, values);
        if (check2){
          return check[0];
        }
      } 
    }
    return null;

  } catch (e){
    return null;
  }
};


/** 使用者查看詳細卡片來源 */
exports.pointDetail = async(req, res) => {
  try {
    let sql = `SELECT  pointNum,pointUserno,status,createUserno,modifydate,createdate FROM reward_point.point 
    WHERE cardSeq= ?
    and ((pointUserno = ? and status in('e','m')) 
    or (createUserno = ? and status in('g','m','u','r'))) ; `;
    values = [req.body.cardSeq, req.session.userId, req.session.userId];
    let check = await query (sql, values);
  
    if (check.length > 0){
      for (let i = 0;i < check.length;i ++){
        if (check[i].pointUserno == req.session.userId && check[i].status == 'e'){
          check[i].status = '接收';
          check[i].date = check[i].modifydate;
        } else if (check[i].pointUserno == req.session.userId && check[i].status == 'm'){
          check[i].status = '轉收';
          check[i].date = check[i].modifydate;
        } else if (check[i].createUserno == req.session.userId && check[i].status == 'g'){
          check[i].status = '轉送中';
          check[i].date = check[i].createdate;
        } else if (check[i].createUserno == req.session.userId && check[i].status == 'm'){
          check[i].status = '已轉送';
          check[i].date = check[i].createdate;
        } else if (check[i].createUserno == req.session.userId && check[i].status == 'u'){
          check[i].status = '已兌換';
          check[i].date = check[i].modifydate;
        } else if (check[i].createUserno == req.session.userId && check[i].status == 'r'){
          check[i].status = '待兌換';
          check[i].date = check[i].createdate;

        }
      }



      return check;
    } 
    return null;

  } catch (e){
    return null;
  }
};


/** 兌換 產生代碼 */
exports.wantWard = async(req, res) => {
  try {
    let sql = `SELECT 
                    b.cardSeq,
                    b.cardName,
                    b.cardNum,
                    b.cardExp,
                    b.cardGift,
                    SUM(a.pointNum) - COALESCE(MAX(m.pointNum), 0) AS pointNum
                FROM 
                    reward_point.point AS a 
                LEFT JOIN 
                    reward_point.card AS b ON a.cardSeq = b.cardSeq
                LEFT JOIN 
                    (SELECT 
                        cardSeq,
                        SUM(pointNum) AS pointNum 
                    FROM 
                        reward_point.point 
                    WHERE 
                        createUserno = ? AND status in ('m','g','u','r') 
                    GROUP BY 
                        cardSeq
                    ) AS m ON a.cardSeq = m.cardSeq
                WHERE 
                    a.pointUserno = ? AND a.status in('e','m') and a.cardSeq = ?
                GROUP BY 
                    b.cardSeq, b.cardName, b.cardNum, b.cardExp, b.cardGift;`;
    let values = [req.session.userId, req.session.userId, req.body.cardSeq];
    let checkpoint = await query (sql, values);
    if (checkpoint.length == 1 && checkpoint[0].pointNum >= checkpoint[0].cardNum){
      sql = 'INSERT INTO reward_point.point SET ?';
      values = {
        cardSeq: req.body.cardSeq,
        pointNum: checkpoint[0].cardNum,
        pointCode: req.body.pointCode,
        status: 'r',
        createUserno: req.session.userId,
        createUser: req.session.displayName,
        modifyUserno: req.session.userId,
        modifyUser: req.session.displayName,
      };
      check = await query (sql, values);
      if (check){
        return true;
      }
    }
    return false;
    
  } catch (e){
    return false;
  }
};


/** 兌換 代碼 */
exports.sendWard = async(req, res) => {
  try {
    let sql = `SELECT a.pointSeq,b.cardName,b.createUserno,a.pointNum FROM reward_point.point as a 
      left join reward_point.card as b on a.cardSeq=b.cardSeq  
      WHERE pointCode = ? and status = ?  and b.createUserno =  ?`;
    values = [req.params.pointCode, 'r', req.session.userId];
    let check = await query (sql, values);
    if (check.length == 1){

      let sql = `UPDATE reward_point.point SET pointUserno=?,status=? , pointCode=?,modifyUserno=?,modifyUser=? WHERE pointSeq=?`;
      values = [req.session.userId, 'u', null, req.session.userId, req.session.displayName, check[0].pointSeq];
      let check2 = await query (sql, values);
      if (check2){
        return check[0];
      }
    } 
    return null;

  } catch (e){
    return null;
  }
};


/** 刪除轉送中 兌換中 送點中 */
exports.delShare = async(req, res) => {
  try {
    let sql = `DELETE FROM reward_point.point WHERE  (cardSeq=?  and createUserno=? ) and (status = ? or status =?)`;
    values = [req.body.cardSeq, req.session.userId, 'g', 'r', 'w'];
    let check = await query (sql, values);
    if (check){
      return true;
    } 
    return false;

  } catch (e){
    return false;
  }
};



module.exports = exports;