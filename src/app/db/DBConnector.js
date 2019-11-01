const mysql = require('mysql2/promise');
const config = require('../configs/environments');

class DBConnector {
  
  static async getConnection(){
    if(!this.connection){
      this.connection = await mysql.createConnection(config)      
    }

    return this.connection
  }
}

module.exports = DBConnector

// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : config.user,
//   password : config.password,
//   database : config.database
// });
// exports.connect = function(callback){
//     connection.connect(function(err) {
//         if (err) {
//             console.error('mysql connection error');
//             console.error(err);
//             throw err;
//         }
//         console.log("connected db")
//         callback();
//       });    
// }
// exports.connector = connection;
