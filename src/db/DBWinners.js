const DB = require('./index')

module.exports = class DBWinners{

    static async getWinnerByQuizID(quizID){
        var query = `SELECT * FROM winners WHERE quizID = ?`
        var values = [quizID]
        var result = await DB.query(query, values)
        return result[0]
    }

    static async updateWinner(winner){
        var query = `UPDATE winners SET fullname = ?, bank = ?, account = ? WHERE quizID = ?`
        var values = [winner.fullName, winner.bank, winner.account, winner.quizID]
        await DB.query(query, values)
    }

    static async insertWinner(winner){
        var query = `INSERT INTO winners(quizID, nickname, ip, time, account, money) VALUES (?, ?, ?, ?, ?, ?, ?) `
        
        // calc date
        var dateNow = new Date()
        var YYYY = dateNow.getFullYear()
        var MM = ('0'+(dateNow.getMonth()+1)).slice(-2)
        var DD = ('0'+(dateNow.getDate())).slice(-2)
        var hh = ('0'+(dateNow.getHours())).slice(-2)
        var mm = ('0'+(dateNow.getMinutes())).slice(-2)
        var ss = ('0'+(dateNow.getSeconds())).slice(-2)
        var YYYYMMDDhhmmss = `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`
        
        // calc money
        var quizStartAt = new Date()
        if(quizStartAt.getHours() < 12)
            quizStartAt.setDay(quizStartAt.getDate()-1)
        quizStartAt.setHours(12)
        quizStartAt.setMinutes(0)
        quizStartAt.setSeconds(0)
        var money = Math.floor((Date.now()-quizStartAt)/1000/20)

        var values = [winner.quizID, winner.nickname, winner.ip, YYYYMMDDhhmmss, '', money]
        await DB.query(query, values)
    }
}
