const router = require ('express').Router ();
const points = require ('../dao/RewardPoints');
const utils = require ('./utils');

//登入會員
router.post ('/createCard', async(req, res) => {
  console.log ('createCard');
  if (utils.checkAuth (req, res)){
    res.send (utils.response (await points.createCard (req, res)));
  } else {
    res.send (utils.response ('登入錯誤', '0001'));
  }
});


module.exports = router ;