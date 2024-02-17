const router = require ('express').Router ();
const points = require ('../dao/RewardPoints/index');
const config = require ('config');
const axios = require ('axios');



const liffId = config.get ('line.liffId');

//登入Line頁面 (首頁)
router.get ('/', async(req, res) => {
  res.render ('index');
});

//api liffId get
router.get ('/send-id', async(req, res) => {
  res.json ({ id: liffId });
});


//dev account
router.get ('/dev', async(req, res) => {
  res.json (config.get ('dev'));
});

//初次登入驗證保存
router.post ('/login', async(req, res) => {

  const response = await axios.get ('https://api.line.me/v2/profile',
    { headers: { 'Authorization': `Bearer ${req.body.accessToken}` } });
  console.log (response.data);
  res.json (response.data);
});


module.exports = router;