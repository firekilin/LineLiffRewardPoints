const router = require ('express').Router ();
const points = require ('../dao/RewardPoints/index');
const config = require ('config');
const axios = require ('axios');
const utils = require ('./utils');



const liffId = config.get ('line.liffId');

//登入Line頁面 (首頁)
router.get ('/', async(req, res) => {
  res.render ('index');
});

//製作集點卡
router.get ('/edit', async(req, res) => {
  if (utils.checkAuth (req, res)){
    res.render ('edit');
  } else {
    res.redirect ('/');
  }
});

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


module.exports = router;