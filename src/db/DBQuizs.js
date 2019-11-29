const DB = require('./index')

module.exports = class DBQuizs{

    static async getQuizByID(quizID){
        var query = `SELECT information, money, picture, quizID, time, title, answer, gotAnswer FROM quizs where quizID = ? `
        var values = [quizID]
        var result = await DB.query(query, values)
        if(result[0].gotAnswer === 0)
            result[0].answer = ''
        if(result[0].money === 0){ // Not solved quiz
            var quizStartAt = new Date()
            if(quizStartAt.getHours() < 12)
                quizStartAt.setDate(quizStartAt.getDate()-1)
            quizStartAt.setHours(12)
            quizStartAt.setMinutes(0)
            quizStartAt.setSeconds(0)
            result[0].money = parseFloat(((Date.now()-quizStartAt)/1000/20).toFixed(4))
        }
        return result[0]
    }

    static async getPreviousIDByID(quizID){
        var query = `SELECT quizID FROM quizs WHERE quizID < ? ORDER BY quizID DESC`
        var values = [quizID]
        var result = await DB.query(query, values)
        return result[0].quizID
    }

    static async getNextIDByID(quizID){
        var query = `SELECT quizID FROM quizs WHERE quizID > ? ORDER BY quizID DESC`
        var values = [quizID]
        var result = await DB.query(query, values)
        return result[0].quizID
    }

    static async getIDByTime(time = null){
        var query = `SELECT quizID from quizs WHERE time <= ?  ORDER BY quizID DESC`
        var values = [time]

        if(time === null){
            var today = new Date()
            if(today.getHours() < 12)
                today.setDate(today.getDate()-1)
            var YYYY = today.getFullYear()
            var MM = ('0'+(today.getMonth()+1)).slice(-2)
            var DD = ('0'+(today.getDate())).slice(-2)
            var YYYYMMDD = `${YYYY}-${MM}-${DD}`
            values = [YYYYMMDD]
        }
        var result = await DB.query(query, values)
        return result[0].quizID
    }

    static async getAnswerByID(quizID){
        var query = `SELECT answer FROM quizs WHERE quizID = ? `
        var values = [quizID]
        var result = await DB.query(query, values)
        return result[0].answer
    }

    static async insertQuiz(quiz){
        var query = `insert into quizs(title, picture, information, answer, time, gotAnswer) VALUES (?, ?, ?, ?, ?, ?)`
        var values = [quiz.title, quiz.picture, quiz.information, quiz.answer, quiz.time, quiz.gotAnswer]
        await DB.query(query, values)
    }

    static async updateGotAnswerByID(quizID){
        var query = `UPDATE quizs SET gotAnswer ='1', money = ? WHERE quizID = ?`
        // calc money
        var quizStartAt = new Date()
        if(quizStartAt.getHours() < 12)
            quizStartAt.setDate(quizStartAt.getDate()-1)
        quizStartAt.setHours(12)
        quizStartAt.setMinutes(0)
        quizStartAt.setSeconds(0)
        var money = Math.floor((Date.now()-quizStartAt)/1000/20)
        var values = [money, quizID]
        await DB.query(query, values)
    }
}