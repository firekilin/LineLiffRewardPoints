const db = require ('./getDB');
const session = require ('express-session');
const MySQLStore = require ('express-mysql-session') (session);
const crypto = require ('crypto');


exports.credentials = { sessionSecret: '123456789ABBCCC', MD5_SUFFIX: 'V$XFjOTClp7yj2qWYON$^3LC0wS', };

exports.md5 = (str) => {
  var obj = crypto.createHash ('md5');
  obj.update (str);
  return obj.digest ('hex');}; 

exports.session = session;

exports.sessionStore = new MySQLStore ({
  expiration: 10800000,
  createDatabaseTable: true,
  schema: { tableName: 'session_table',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data'
    } }

}, db.sessionConnection);

module.exports = exports;