const DB = require('./index')

module.exports = class DBQuizs{

    static async getQuizByID(quizID){
        var query = `SELECT information, money, picture, quizID, time, title FROM quizs where quizID = ? `
        var values = [quizID]
        var [result] = await DB.query(query, values)

        return result
    }

    static async getPreviousIDByID(commentID){
        var query = `SELECT quizID FROM quizs WHERE quizID < ? ORDER BY quizID DESC`
        var values = [commentID]
        var [result] = await DB.query(query, values)
        return result
    }

    static async getNextIDByID(commentID){
        var query = `SELECT quizID FROM quizs WHERE quizID > ? ORDER BY quizID DESC`
        var values = [commentID]
        var [result] = await DB.query(query, values)
        return result
    }

    static async getIDByTime(time){
        var query = `SELECT quizID from quizs WHERE time <= ?  ORDER BY quizID ASC`
        var values = [time]
        var [result] = await DB.query(query, values)
        return result
    }

    static async getAnswerByID(quizID){
        var query = `SELECT answer FROM quizs WHERE quizID = ? `
        var values = [quizID]
        var [result] = await DB.query(query, values)
        return result
    }

    static async insertQuiz(quiz){
        var query = `insert into quizs(title, picture, information, answer, time, gotAnswer) VALUES (?, ?, ?, ?, ?, ?)`
        var values = [quiz.title, quiz.picture, quiz.information, quiz.answer, quiz.time, quiz.gotAnswer]
        var [result] = await DB.query(query, values)
        return result
    }

    static async updateGotAnswerByID(quizID){
        // var quizStartAt = new Date()
        // if(quizStartAt.getHours() < 12)
        //   quizStartAt.setDay(quizStartAt.getDate()-1)
        // quizStartAt.setHours(12)
        // quizStartAt.setMinutes(0)
        // quizStartAt.setSeconds(0)
        // var money = Math.floor((Date.now()-quizStartAt)/1000/20)
        var query = `UPDATE quizs SET gotAnswer ='1', money = ? WHERE quizID = ?`
        var values = [money, quizID]
        await DB.query(query, values)
    }
}