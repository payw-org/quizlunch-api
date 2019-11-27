const DB = require('./index')

module.exports = class DBNicknames{
    static async getNicknameByIP(ip){
        var query = `SELECT name FROM nicknames where ip = ? `
        var values = [ip]
        var result = await DB.query(query, values)
        if(result.length === 0)
            return null
        return result[0].name
    }
    
    static async getIPAll(){
        var query = `SELECT ip FROM nicknames`
        var result = await DB.query(query)
        return result
    }
    
    static async insertNickname(nickname){
        var query = `INSERT INTO nicknames (ip, name) VALUES (?, ?)`
        var values = [nickname.ip, nickname.name]
        await DB.query(query, values)
    }

    static async updateNickname(nickname){
        var query = `UPDATE nicknames SET name = ? WHERE ip = ?`
        var values = [nickname.name, nickname.ip]
        await DB.query(query, values)
    }
}
