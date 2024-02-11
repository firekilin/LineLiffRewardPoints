const mysql = require ('mysql');
const config = require ('config');

const myPool = mysql.createPool ({
  connectionLimit: 200,
  host: config.get ('db.host'),
  user: config.get ('db.user'),
  port: config.get ('db.port'),
  password: config.get ('db.password'),
  database: config.get ('db.database'),
  'useConnectionPooling': true //增加该配置
});

exports.sessionConnection = mysql.createConnection ({
  host: config.get ('db.host'),
  user: config.get ('db.user'),
  port: config.get ('db.port'),
  password: config.get ('db.password'),
  database: config.get ('db.database'),
  'useConnectionPooling': true //增加该配置
});

exports.query = (sql, values) => {
  return new Promise ((resolve, reject) => {
    myPool.query (sql, values, (err, rows) => {
      if (err) {
        resolve (false);
        console.log (err + ' , ' + rows);
      } else {
        resolve (rows);
      }
    });
  });
};

module.exports = exports;