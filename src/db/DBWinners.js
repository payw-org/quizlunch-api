const DB = require('./index')

module.exports = class DBWinners{
    static async insertWinner(winner){
        var query = `insert into winners(quizID, nickname, text, ip, time) VALUES (?, ?, ?, ?, ?) `
        var values = [winner.quizID, winner.nickname, winner.text, winner.ip, winner.time]
        await DB.query(query, values)
    }
}
