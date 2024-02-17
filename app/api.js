const router = require ('express').Router ();
const points = require ('../dao/RewardPoints');
const utils = require ('./utils');
const qrcode = require ('qrcode');

//登入會員
router.post ('/createCard', async(req, res) => {
  if (utils.checkAuth (req, res)){
    res.send (utils.response (await points.createCard (req, res)));
  } else {
    res.send (utils.response ('登入錯誤', '0001'));
  }
});


//取得QRCode
router.post ('/sendPoint', async(req, res) => {
  let getRandomCode = utils.getRandomCode ();
  qrcode.toDataURL (getRandomCode, (err, qrCode) => {
    res.send (utils.response (qrCode));

  });
});

module.exports = router ;