const mysql = require('mysql2/promise');
const config = require('../configs/environments');
// const MoneyManager = require("../money/moneyManager")

class DBConnector {
  
  static async connect(){
    this.connection = await mysql.createConnection(config) 
  }

  static async getConnection(){
    if(!this.connection)
      await this.connect()

    return this.connection
  }
  
  static async getComments(quizID, numOfComments=20){
    if(!this.connection)
      await this.connect()

    var [comments]= await this.connection.query(`SELECT * from comments where quizID='${quizID}' ORDER BY commentID DESC LIMIT ${numOfComments}`)
    for(var i=0; i<comments.length; i++)//hide IP and password
    {
      delete comments[i].password;
      comments[i].ip = comments[i].ip.substring(0,7) + '.***.***'
    }

    return comments
  }

  static async insertNickname(ip, nickname){
    if(!this.connection)
      await this.connect()

    await this.connection.query(`insert into nicknames (ip ,nickname) VALUES ('${ip}', '${nickname}') `);
  }

  static async updateNickname(ip, nickname){
    if(!this.connection)
      await this.connect()

      await this.connection.query(`UPDATE nicknames set nickname ='${nickname}' where ip='${ip}'`)
    }

  static async getNickname(ip){
    if(!this.connection)
      await this.connect()

    const [result]= await this.connection.query(`SELECT nickname from nicknames where ip='${ip}'`)
    return result
  }

  static async insertComment(comment){
    if(!this.connection)
      await this.connect()

    await this.connection.query(`insert into comments (quizID ,nickname, password, text, ip ,time ) VALUES ('${comment.quizID}', '${comment.nickname}', '${comment.password}', '${comment.text}', '${comment.ip}', '${comment.time}') `)
  }

  static async getPassword(commentID){
    if(!this.connection)
      await this.connect()

    const [result]= await this.connection.query(`SELECT password from comments where commentID='${commentID}'`)
    return result
  }

  static async deleteComment(commentID){
    if(!this.connection)
      await this.connect()

    await this.connection.query(`DELETE FROM comments WHERE commentID ='${commentID}'`)
  }

  static async getLatestQuizID(){
    if(!this.connection)
      await this.connect()

    var [quizID]= await this.connection.query("SELECT quizID from quizs ORDER BY quizID DESC")
    return quizID[0].quizID
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

  static async getLatestQuiz(){
    if(!this.connection)
      await this.connect()

    var [quizID]= await this.connection.query("SELECT * from quizs ORDER BY quizID DESC")
    return quizID[0]
  }


  static async getQuiz(quizID){
    if(!this.connection)
      await this.connect()

    var [quiz]= await this.connection.query(`SELECT * from quizs where quizID='${quizID}'`)
    if(quiz[0].gotAnswer==0)
    {
      quiz[0].answer = '';
    }

    return quiz[0]
  }

  static async insertQuiz(quiz){
    if(!this.connection)
      await this.connect()

    await this.connection.query(`insert into quizs(money,title,picture,information,answer,time,gotAnswer) VALUES ('${quiz.money}', '${quiz.title}', '${quiz.picture}','${quiz.information}', '${quiz.answer}', '${quiz.time}', '${quiz.gotAnswer}')`)
  }

  static async getAnswer(quizID){
    if(!this.connection)
      await this.connect()

    const [result]= await this.connection.query(`SELECT answer from quizs where quizID='${quizID}'`)
    return result[0].answer
  }

  static async updateQuizSolved(quizID){

    if(!this.connection)
      await this.connect()

    const defaultMoney=1000;
    const quiz = await DBConnector.getQuiz(quizID)
    var quizTime = new Date(quiz.time)
    var nowTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Seoul"});
    nowTime = new Date(nowTime);
    var timeMoney=0
    if(nowTime.getDate()!=quizTime.getDate())
    {
      timeMoney=60*24
    }
    timeMoney=timeMoney+((nowTime.getHours() * 60  + nowTime.getMinutes() * 1 ) - (quizTime.getHours() * 60  + quizTime.getMinutes()*1))*2
    if(timeMoney<0)
    {
      timeMoney=0
    }
    var nowMoney=defaultMoney+timeMoney
    await this.connection.query(`UPDATE quizs set gotAnswer ='1' , money='${nowMoney}' where quizID='${quizID}'`)
  }
  
  static async insertWinner(winner){
    if(!this.connection)
      await this.connect()

    await this.connection.query(`insert into winners(quizID,money,nickname,text,ip,time) VALUES ('${winner.quizID}','${winner.money}','${winner.nickname}','${winner.text}','${winner.ip}','${winner.time}') `)
  }
}

module.exports = DBConnector