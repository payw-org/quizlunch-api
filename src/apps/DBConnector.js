const mysql = require('mysql2/promise');
const config = require('../configs/environments');

class DBConnector {

  static async getConnection(){
    if(!this.connection)
      this.connection = await mysql.createConnection(config)

    return this.connection
  }
}

module.exports = DBConnector