var mysql = require('mysql');
var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'abcd1',
    database : 'develop'
  });
db.connect();

module.exports = db;