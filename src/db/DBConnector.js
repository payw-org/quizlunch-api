const mysql = require('mysql2/promise');
const config = require('../configs/environments');

class DBConnector {
  
  static async connect(){
    this.connection = await mysql.createConnection(config) 
  }

  static async getConnection(){
    if(!this.connection)
      await this.connect()

    return this.connection
  }

  static async getQuiz(quizID){
    if(!this.connection)
      await this.connect()

    try{
      var [result]= await this.connection.query(`SELECT * from quizs where quizID='${quizID}'`)
      if(result[0].gotAnswer==0)
      {
        result[0].answer = '';
      }
  
      return result[0]
    }catch(e){
      console.log(`>Error - ${e} `)
    }

  }

  static async getTodayQuizID(){
    if(!this.connection)
      await this.connect()

    try{
      var today = Date()
      var [result]= await this.connection.query(`SELECT quizID from quizs WHERE time=${today}`)
      if( result.length == 0){
        ;[result]= await this.connection.query("SELECT quizID from quizs ORDER BY quizID DESC")
      }
      return result[0].quizID
    }catch(e){
      console.log(`>Error - ${e} `)
    }
  }

  static async getMoney(quizID){
    if(!this.connection)
      await this.connect()

    try{
      var [result]= await this.connection.query(`SELECT money FROM quizs WHERE quizID='${quizID}'`)
      return result[0].money
    }catch(e){
      console.log(`>Error - ${e} `)
    }
  }

  static async getAnswer(quizID){
    if(!this.connection)
      await this.connect()

    try{
      const [result]= await this.connection.query(`SELECT answer FROM quizs WHERE quizID='${quizID}'`)
      return result[0].answer
    }catch(e){
      console.log(`>Error - ${e} `)
    }
  }

  static async getComments(quizID, numOfComments=20){
    if(!this.connection)
      await this.connect()

    try{
      var [result]= await this.connection.query(`SELECT * from comments where quizID='${quizID}' ORDER BY commentID DESC LIMIT ${numOfComments}`)
      for(var i=0; i<result.length; i++)
      {
        delete result[i].password;
        result[i].ip = result[i].ip.substring(0,7) + '.***.***'
      }
    }catch(e){
      console.log(`>Error - ${e} `)
    }

    return result
  }

  static async getNickname(ip){
    if(!this.connection)
      await this.connect()

    try{
      const [result]= await this.connection.query(`SELECT nickname from nicknames where ip='${ip}'`)
      return result
    }catch(e){
      console.log(`>Error - ${e} `)
    }
  }

  static async getIps(){
    if(!this.connection)
      await this.connect()

    try{
      const [result]= await this.connection.query(`SELECT ip from nicknames`)
      return result
    }catch(e){
      console.log(`>Error - ${e} `)
    }
  }

  static async getPassword(commentID){
    if(!this.connection)
      await this.connect()

    try{
      const [result]= await this.connection.query(`SELECT password from comments where commentID='${commentID}'`)
      return result
    }catch(e){
      console.log(`>Error - ${e} `)
    }
  }

  static async insertNickname(ip, nickname){
    if(!this.connection)
      await this.connect()

    try{
      await this.connection.query(`insert into nicknames (ip ,nickname) VALUES ('${ip}', '${nickname}') `);
    }catch(e){
      console.log(`>Error - ${e} `)
    }
  }

  static async insertComment(comment){
    if(!this.connection)
      await this.connect()
    try{
      await this.connection.query(`insert into comments (quizID ,nickname, password, text, ip ,time ) VALUES ('${comment.quizID}', '${comment.nickname}', '${comment.password}', '${comment.text}', '${comment.ip}', '${comment.time}') `)
    }catch(e){
      console.log(`>Error - ${e} `)
    }
  }

  static async insertQuiz(quiz){
    if(!this.connection)
      await this.connect()
    try{
      await this.connection.query(`insert into quizs(title,picture,information,answer,time,gotAnswer) VALUES ('${title}', '${picture}','${information}', '${answer}', '${time}', '${gotAnswer}')`)
    }catch(e){
      console.log(`>Error - ${e} `)
    }
  }
  
  static async insertWinner(winner){
    if(!this.connection)
      await this.connect()

    try{
      await this.connection.query(`insert into winners(quizID,nickname,text,ip,time) VALUES ('${quizID}','${nickname}','${text}','${ip}','${time}') `)
    }catch(e){
      console.log(`>Error - ${e} `)
    }
  }

  static async updateQuizSolved(quizID){
    if(!this.connection)
      await this.connect()
    try{
      await this.connection.query(`UPDATE quizs set gotAnswer ='1' where quizID='${quizID}'`)
    }catch(e){
      console.log(`>Error - ${e} `)
    }
  }
  
  static async updateNickname(ip, nickname){
    if(!this.connection)
      await this.connect()
      
    try{
      await this.connection.query(`UPDATE nicknames set nickname ='${nickname}' where ip='${ip}'`)
    }catch(e){
      console.log(`>Error - ${e} `)
    }
  }

  static async deleteComment(commentID){
    if(!this.connection)
      await this.connect()
    try{
      await this.connection.query(`DELETE FROM comments WHERE commentID ='${commentID}'`)
    }catch(e){
      console.log(`>Error - ${e} `)
    }
  }


}

module.exports = DBConnector