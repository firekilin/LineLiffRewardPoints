const db = require ('../getDB');
const query = db.query;

// //Line登入確認
exports.member = async(req, res) => {
  try {
    let check = await query ('select * from RP_CARD');
    if (check[0] == null){
      console.log (check[0]);
    } 
    return true;
  } catch (e){
    return false;
  }
};

module.exports = exports;