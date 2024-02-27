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

//取得發點數人員清單
router.post ('/groupList', async(req, res) => {
  if (utils.checkAuthApi (req, res)){
    if (await points.isCardBuilder (req, res)){
      let json = await points.groupList (req, res);
      for (let i = 0;i < json.length;i ++){
        json[i].url = 'https://liff.line.me/1656461762-Gq9B5Oz9/addGroup/' + json[i].groupCode;
      }


      res.send (utils.response (json ));
    } else {
      res.send (utils.response ('無權限', '0004'));
    }
  }

});

//新增發點數人員QRCode
router.post ('/addGroup', async(req, res) => {
  if (utils.checkAuthApi (req, res)){
    req.body.pointCode = utils.getRandomCode ();
    let check = await points.addGroup (req, res);
    if (check){
      let url = 'https://liff.line.me/' + config.get ('line.liffId') + '/addGroup/' + req.body.pointCode;
      qrcode.toDataURL (url, (err, qrCode) => {
        let json = {
          img: qrCode,
          url: url,
          cardName: req.body.cardName
        };
    
        res.send (utils.response (json));
      });
    } else {
      res.send (utils.response ('無權限', '0004'));

    }
   
  }
});

//人員加入
router.get ('/joinGroup/:pointCode', async(req, res) => {
  let json = await points.joinGroup (req, res);
  if (json != null){
    res.send (utils.response (json ));
  } else {
    res.send (utils.response ('連結失效，無法加入', '0004'));
  }});

//人員刪除
router.post ('/deleteGroup', async(req, res) => {
  if (utils.checkAuthApi (req, res)){
    if (await points.isCardBuilder (req, res)){
      if (await points.deleteGroup (req, res)){
        res.send (utils.response ('成功'));
      } else {
        res.send (utils.response ('刪除失敗', '0004'));
      }
    } else {
      res.send (utils.response ('無權限', '0004'));

    }
  }
});

//取得卡片詳細
router.post ('/showCard', async(req, res) => {
  if (utils.checkAuthApi (req, res)){
    let json = await points.manageCard (req, res);
    json.bgImage = utils.bufferToBase64 (json.bgImage);
    let pointImgsTemp = [];
    for (let i = 0 ;i < json.pointImage.length;i ++){
      pointImgsTemp.push (utils.bufferToBase64 (json.pointImage[i]));
    }
    json.pointImage = pointImgsTemp;
    json.getWardImage = utils.bufferToBase64 (json.getWardImage);

    if (await points.isCardBuilder (req, res)){
      json.sendPoint = await points.builderHistroy (req, res);
    } else {
      json.sendPoint = await points.managerHistroy (req, res);
    }

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
      let url = 'https://liff.line.me/' + config.get ('line.liffId') + '/getPoint/' + req.body.pointCode;
      qrcode.toDataURL (url, (err, qrCode) => {
        let json = {
          img: qrCode,
          url: url,
          pointNum: req.body.pointNum,
          cardName: req.body.cardName
        };
    
        res.send (utils.response (json));
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
    res.send (utils.response ('無效點數', '0004'));
  }});


//轉送點 QRCode
router.post ('/sharePoint', async(req, res) => {
  if (utils.checkAuthApi (req, res)){
    req.body.pointCode = utils.getRandomCode ();
    let check = await points.sharePoint (req, res);
    if (check){
      let url = 'https://liff.line.me/' + config.get ('line.liffId') + '/getSharePoint/' + req.body.pointCode;
      qrcode.toDataURL (url, (err, qrCode) => {
        let json = {
          img: qrCode,
          url: url,
          pointNum: req.body.pointNum,
          cardName: req.body.cardName
        };
    
        res.send (utils.response (json));
      });
    } else {
      res.send (utils.response ('無法轉送，請確認是否有轉送中點數', '0004'));

    }
   
  }
});

//收點 掃描操作 轉收
router.get ('/getSharePoint/:pointCode', async(req, res) => {

  let json = await points.getSharePoint (req, res);
  if (json != null){
    res.send (utils.response (json ));
  } else {
    res.send (utils.response ('無效點數', '0004'));
  }});


//取得卡片清單(使用者)
router.get ('/pointList', async(req, res) => {
  if (utils.checkAuthApi (req, res)){
    let json = await points.pointList (req, res);
    if (json != null){
      res.send (utils.response (json ));
    } else {
      res.send (utils.response ('查詢失敗', '0004'));
    }
  }
});

//取得卡片詳細(使用者)
router.post ('/pointDetail', async(req, res) => {
  if (utils.checkAuthApi (req, res)){
    let json = await points.pointDetail (req, res);
    if (json != null){
      res.send (utils.response (json ));
    } else {
      res.send (utils.response ('查詢失敗', '0004'));
    }
  }
});


//兌換 QRCode
router.post ('/wantWard', async(req, res) => {
  if (utils.checkAuthApi (req, res)){
    req.body.pointCode = utils.getRandomCode ();
    let check = await points.wantWard (req, res);
    if (check){
      let url = 'https://liff.line.me/' + config.get ('line.liffId') + '/sendWard/' + req.body.pointCode;
      qrcode.toDataURL (url, (err, qrCode) => {
        let json = {
          img: qrCode,
          url: url,
          cardName: req.body.cardName
        };
    
        res.send (utils.response (json));
      });
    } else {
      res.send (utils.response ('無法兌換，請確認點數充足 或 是否有進行中點數', '0004'));

    }
   
  }
});

//送禮 掃描操作
router.get ('/sendWard/:pointCode', async(req, res) => {

  let json = await points.sendWard (req, res);
  if (json != null){
    res.send (utils.response (json ));
  } else {
    res.send (utils.response ('無權限兌換', '0004'));
  }});

//移除進行中
router.post ('/delShare', async(req, res) => {
  if (utils.checkAuthApi (req, res)){
    let check = await points.delShare (req, res);
    if (check){
      res.send (utils.response ('完成'));
    } else {
      res.send (utils.response ('移除失敗', '0004'));

    }
   
  }
});




module.exports = router ;