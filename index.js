const express = require ('express');
const app = express ();
const main = require ('./app/main.js');
const api = require ('./app/api.js');
const plugins = require ('./app/plugins.js');
const config = require ('config');
const port = config.get ('app.port');
const cors = require ('cors');
const usesession = require ('./dao/session');
const credentials = require ('./dao/credential.js');
const cookieParser = require ('cookie-parser');

app.use (cors ());

app.use (usesession.session ({
  key: 'aid',
  secret: usesession.credentials.sessionSecret,
  store: usesession.sessionStore,
  resave: false,
  saveUninitialized: true,
  cookie: ('name', 'value', { 
    maxAge: 10 * 365 * 24 * 60 * 60, secure: false, name: 'seName', resave: false 
  })
}
));

app.listen (port, () => {
  console.log ('listen on port:' + port);
});


app.use (cookieParser (credentials.cookieSecret));
app.set ('views', './views');
app.set ('view engine', 'ejs');


const bodyParser = require ('body-parser'); //設定取得req.body
app.use ( bodyParser.json () ); //req.body支援json格式
app.use ( bodyParser.urlencoded ( { extended: true } ) ); //解析內容 


app.use ('/', main); //頁面用
app.use ('/public', express.static ('./public'));

app.use ('/api', api); //api
app.use ('/plugins', plugins); //使用套件


app.use (function(req, res){
  
  res.status (404).send ('查無此頁');
});