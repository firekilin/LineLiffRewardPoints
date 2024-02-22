const router = require ('express').Router ();
const points = require ('../dao/RewardPoints/index');
const config = require ('config');
const axios = require ('axios');
const utils = require ('./utils');



const liffId = config.get ('line.liffId');


//api liffId get
router.get ('/send-id', async(req, res) => {
  res.json ({ id: liffId });
});


//dev account
router.get ('/dev', async(req, res) => {
  req.session.userId = config.get ('dev').userId;
  req.session.displayName = config.get ('dev').displayName;
  res.send (utils.response (config.get ('dev')));
});

//初次登入驗證保存
router.post ('/login', async(req, res) => {
  try {
    const response = await axios.get ('https://api.line.me/v2/profile',
      { headers: { 'Authorization': `Bearer ${req.body.accessToken}` } });
    req.session.userId = response.data.userId;
    req.session.displayName = response.data.displayName;
    res.send (utils.response (response.data));
  } catch (error) {
    res.send (utils.response ('登入錯誤', '0001'));
  }

});


//登入Line頁面 (首頁)
router.get ('/', async(req, res) => {
  res.render ('index');
});

//製作集點卡
router.get ('/create', async(req, res) => {
  if (utils.checkAuth (req, res)){
    res.render ('create');
  } else {
    res.redirect ('/');
  }
});


//管理集點卡
router.get ('/manage/:id', async(req, res) => {
  const id = req.params.id;
  res.render ('edit', { id: id });
});


//收點 掃描操作
router.get ('/getPoint/:getPoint', async(req, res) => {
  const getPoint = req.params.getPoint;
  res.render ('getPoint', { getPoint: getPoint });

});

//收點 掃描操作
router.get ('/getSharePoint/:getPoint', async(req, res) => {
  const getPoint = req.params.getPoint;
  res.render ('getSharePoint', { getPoint: getPoint });

});



//查看集點卡(使用者)
router.get ('/pointList', async(req, res) => {
  res.render ('pointList');

});

//兌換 掃描操作
router.get ('/sendWard/:getWard', async(req, res) => {
  const getWard = req.params.getWard;
  res.render ('sendWard', { getWard: getWard });

});

module.exports = router;