const DB = require('./index')

module.exports = class DBAnswer {

    static async getCountByAnswer(quizID, answer){
        var query = `SELECT count(DISTINCT ip) AS count FROM answers WHERE quizID = ? and answer = ?`
        var values = [quizID, answer]
        var result = await DB.query(query, values)
        return result[0].count
    }

    static async insertAnswer(quizID, answer, ip){
        var query = `INSERT INTO answers (quizID, answer, ip) VALUES (?, ?, ?)`
        var values = [quizID, answer, ip]
        await DB.query(query, values)
    }
}