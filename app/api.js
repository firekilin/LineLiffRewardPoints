const router = require ('express').Router ();
const points = require ('../dao/RewardPoints');
const utils = require ('./utils');
const qrcode = require ('qrcode');

//建立卡片
router.post ('/createCard', async(req, res) => {
  req.body.bgImage = utils.base64ToBuffer (req.body.bgImage);
  req.body.pointImage = utils.base64ToBuffer (req.body.pointImage);
  req.body.pointOver = utils.base64ToBuffer (req.body.pointOver);
  req.body.pointImgsTemp = [];
  for (let i = 0;i < req.body.pointImgs.length;i ++){
    let tempfile = utils.base64ToBuffer (req.body.pointImgs[i]);
    if (tempfile != null){
      req.body.pointImgsTemp.push (tempfile);

    }
  }

  if (utils.checkAuthApi (req, res)){
    if (await points.createCard (req, res)){
      res.send (utils.response ('成功'));

    } else {
      res.send (utils.response ('失敗', '0004'));

    }
  } 
});


//取得QRCode
router.post ('/sendPoint', async(req, res) => {
  if (utils.checkAuthApi (req, res)){
    let getRandomCode = utils.getRandomCode ();
    qrcode.toDataURL (getRandomCode, (err, qrCode) => {
      res.send (utils.response (qrCode));

    });
  }
});

module.exports = router ;