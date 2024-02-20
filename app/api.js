const router = require ('express').Router ();
const points = require ('../dao/RewardPoints');
const utils = require ('./utils');
const qrcode = require ('qrcode');
const config = require ('config');


//建立卡片
router.post ('/createCard', async(req, res) => {
  req.body.bgImage = utils.base64ToBuffer (req.body.bgImage);
  req.body.pointImage = utils.base64ToBuffer (req.body.pointImage);
  if (req.body.pointOver != null){
    req.body.pointOver = utils.base64ToBuffer (req.body.pointOver);
  }
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

//取得管理卡片清單
router.get ('/manageCardList', async(req, res) => {
  if (utils.checkAuthApi (req, res)){
    res.send (utils.response ( await points.manageCardList (req, res)));
  }
});

//取得管理卡片詳細
router.post ('/manageCard', async(req, res) => {
  if (utils.checkAuthApi (req, res)){
    let json = await points.manageCard (req, res);
    json.bgImage = utils.bufferToBase64 (json.bgImage);
    let pointImgsTemp = [];
    for (let i = 0 ;i < json.pointImage.length;i ++){
      pointImgsTemp.push (utils.bufferToBase64 (json.pointImage[i]));
    }
    json.pointImage = pointImgsTemp;

    
    if (json != null){
      res.send (utils.response (json ));
    } else {
      res.send (utils.response ('失敗', '0004'));
    }
  }
});


//送點 QRCode
router.post ('/sendPoint', async(req, res) => {
  if (utils.checkAuthApi (req, res)){
    req.body.pointCode = utils.getRandomCode ();
    let check = await points.createPoint (req, res);
    if (check){
      qrcode.toDataURL ('https://liff.line.me/' + config.get ('line.liffId') + '/getPoint/' + req.body.pointCode, (err, qrCode) => {
        res.send (utils.response (qrCode));
      });
    }
   
  }
});

//收點 掃描操作
router.get ('/getPoint/:pointCode', async(req, res) => {

  let json = await points.getPoint (req, res);
  if (json != null){
    res.send (utils.response (json ));
  } else {
    res.send (utils.response ('失敗', '0004'));
  }});


module.exports = router ;