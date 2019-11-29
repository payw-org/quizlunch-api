const WSConnector = require('../../websocket/WSConnector');
const DBQuizs = require('../../db/DBQuizs');
const DBComments = require('../../db/DBComments');
const DBNicknames = require('../../db/DBNicknames')
const DBWinners = require('../../db/DBWinners')
const config = require('../../configs/environments');


exports.getPreviousPage = async (req, res) => {
  const quizID = await DBQuizs.getPreviousIDByID(req.params.quizID)
  const quiz = await DBQuizs.getQuizByID(quizID)
  const comments = await DBComments.getCommentsByQuizID(quizID)
  WSConnector.broadcast('renew quiz', quiz)
  WSConnector.broadcast('renew comments', comments)
  res.send('200')
}

exports.getNextPage = async (req, res) => {
  const quizID = await DBQuizs.getNextIDByID(req.params.quizID)
  const quiz = await DBQuizs.getQuizByID(quizID)
  const comments = await DBComments.getCommentsByQuizID(quizID)
  WSConnector.broadcast('renew quiz', quiz)
  WSConnector.broadcast('renew comments', comments)
  res.send('200')
}

exports.createQuiz = async (req, res) => {
  console.log(req.body.masterKey)
  console.log(config.password)
  if(req.body.masteKey==config.password){

    var today = new Date()
    if(today.getHours() < 12)
        today.setDate(today.getDate()-1)
    var YYYY = today.getFullYear()
    var MM = ('0'+(today.getMonth()+1)).slice(-2)
    var DD = ('0'+(today.getDate())).slice(-2)
    var YYYYMMDD = `${YYYY}-${MM}-${DD}`

    var quiz = {
      'title':req.body.title,
      'picture':req.body.picture,
      'information':req.body.information,
      'answer':req.body.answer,
      'time':YYYYMMDD,
      'gotAnswer': 0
    }

    await DBQuizs.insertQuiz(quiz)
    res.send('200')
  }
  else{
    res.send('fail')
  }


}

exports.checkAnswer = async (req, res) => {
  const answer = await DBQuizs.getAnswerByID(req.params.quizID)
  if(answer == req.params.answer){
    // quiz is solved
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress
    var nickname = await DBNicknames.getNicknameByIP(ip)
    await DBWinners.insertWinner({quizID:req.params.quizID, nickname:nickname, ip:ip})
    await DBQuizs.updateGotAnswerByID(req.params.quizID)
    const quiz = await DBQuizs.getQuizByID(req.params.quizID)
    WSConnector.broadcast('renew quiz', quiz)
    res.send('200')
  }
  else{
    res.send('504')
  }
}
