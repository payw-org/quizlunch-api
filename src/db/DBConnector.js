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
      var today = new Date()
      if(today.getHours() < 12)
        today.setDate(today.getDate()-1)
      var YYYY = today.getFullYear()
      var MM = ('0'+(today.getMonth()+1)).slice(-2)
      var DD = ('0'+(today.getDate())).slice(-2)
      
      var YYYYMMDD = `${YYYY}-${MM}-${DD}`
      var [result]= await this.connection.query(`SELECT quizID from quizs WHERE time<='${YYYYMMDD}' ORDER BY quizID ASC`)
      
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

  static async getComments(quizID, startIndex=0 ,numOfComments=20){
    if(!this.connection)
      await this.connect()

    try{
      var [result]= await this.connection.query(`SELECT * from comments where quizID='${quizID}' ORDER BY commentID DESC LIMIT ${startIndex},${numOfComments}`)
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
      await this.connection.query(`insert into nicknames (ip ,nickname) VALUES ('${ip}', '${nickname}') `)
    }catch(e){
      console.log(`>Error - ${e} `)
    }
  }

  static async insertComment(comment){
    if(!this.connection)
      await this.connect()
    try{
      await this.connection.query(`insert into comments (quizID ,nickname, password, text, ip ,time ) VALUES ('${comment.quizID}', '${comment.nickname}', '${comment.password}', '${comment.text}', '${comment.ip}', '${comment.time}') `)
      var [result] = await this.connection.query(`SELECT commentID FROM comments WHERE quizID='${comment.quizID}' and nickname='${comment.nickname}' and password='${comment.password}' and text='${comment.text}' and ip='${comment.ip}' and time='${comment.time}'`)
      return result[0].commentID
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

    var quizStartAt = dateNow
    if(quizStartAt.getHours() < 12)
      quizStartAt.setDay(quizStartAt.getDate()-1)
    quizStartAt.setHours(12)
    quizStartAt.setMinutes(0)
    quizStartAt.setSeconds(0)
    var money = Math.floor((Date.now()-quizStartAt)/1000/20)

    await this.connection.query(`UPDATE quizs set gotAnswer ='1' , money='${money}' where quizID='${quizID}'`)
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

  static async getLeftQuizID(curQuizID){
    if(!this.connection)
      await this.connect()

    const [quizID]= await this.connection.query(`SELECT quizID from quizs WHERE quizID <' ${curQuizID}' ORDER BY quizID DESC`)
    if(quizID.length==0)
    {
      return curQuizID
    }
    return quizID[0].quizID
  }

  static async getRightQuizID(curQuizID){
    if(!this.connection)
      await this.connect()

    const [quizID]= await this.connection.query(`SELECT quizID from quizs WHERE quizID >' ${curQuizID}' ORDER BY quizID ASC`)
    if(quizID.length==0)
    {
      return curQuizID
    }
    return quizID[0].quizID
  }
}

module.exports = DBConnector