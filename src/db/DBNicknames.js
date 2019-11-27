const DB = require('./index')

module.exports = class DBNicknames{
    static async getNicknameByIP(ip){
        var query = `SELECT name FROM nicknames where ip = ? `
        var values = [ip]
        var [result] = await DB.query(query, values)
        return result
    }
    
    static async getIPAll(){
        var query = `SELECT ip FROM nicknames`
        var [result] = await DB.query(query)
        return result
    }
    
    static async insertNickname(nickname){
        var query = `INSERT INTO nicknames (ip, name) VALUES (?, ?)`
        var values = [nickname.ip, nickname.name]
        await DB.query(query, values)
    }
}
