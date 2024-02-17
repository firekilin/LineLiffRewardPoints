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

  let test = await axios.post ('https://api.line.me/oauth2/v2.1/verify', 
    new URLSearchParams ({ 'id_token': req.body.IDtoken }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

  console.log (test);
  res.json (test);
});


module.exports = router;