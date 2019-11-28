const DB = require('./index')

module.exports = class DBComments{
    static async getCommentsByQuizID(quizID, startIndex=0 ,numOfComments=20){
        var query = `SELECT commentID, quizID, nickname, text, ip, time FROM comments where quizID = ? ORDER BY commentID DESC LIMIT ?, ?`
        var values = [parseInt(quizID), parseInt(startIndex), parseInt(numOfComments)]
        var result = await DB.query(query, values)
        for(var i = 0; i<result.length; i++)
            result[i].ip = result[i].ip.substring(0,7) + '.***.***'
        return result
    }
    
    static async getPasswordByID(commentID){
        var query = `SELECT password from comments where commentID = ?`
        var values = [commentID]
        var result = await DB.query(query, values)
        return result[0].password
    }
    
    static async getIDByComment(comment){
        var query = `SELECT commentID FROM comments WHERE quizID = ? and nickname = ? and password = ? and text = ? and ip = ? and time = ? ORDER BY commentID DESC`
        var values = [comment.quizID, comment.nickname, comment.password, comment.text, comment.ip, comment.time]
        var result = await DB.query(query, values)
        return result[0].commentID
    }
    
    static async insertComment(comment){
        var query = `insert into comments (quizID ,nickname, password, text, ip ,time ) VALUES (?, ?, ?, ?, ?, ?)`
        var values = [comment.quizID, comment.nickname, comment.password, comment.text, comment.ip, comment.time]
        await DB.query(query, values)
    }
    
    static async deleteCommentByID(commentID){
        var query = `DELETE FROM comments WHERE commentID = ?`
        var values = [commentID]
        await DB.query(query, values)
    }   
}