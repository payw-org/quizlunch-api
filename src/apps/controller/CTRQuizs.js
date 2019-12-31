const WSConnector = require('../../websocket/WSConnector');
const DBQuizs = require('../../db/DBQuizs');
const DBComments = require('../../db/DBComments');
const DBNicknames = require('../../db/DBNicknames')
const DBWinners = require('../../db/DBWinners')
const DBAnswers = require('../../db/DBAnswers')
const config = require('../../configs/environments');


exports.getPreviousPage = async (req, res) => {
  var quizID = await DBQuizs.getPreviousIDByID(req.params.quizID)
  const quiz = await DBQuizs.getQuizByID(quizID)
  const comments = await DBComments.getCommentsByQuizID(quizID)
  var data = {}
  data['quiz'] = quiz
  data['comments'] = comments
  data['isFirst'] = false
  data['isLast'] = false
  
  quizID = await DBQuizs.getPreviousIDByID(quizID)
  if(quizID === null){
    data['isFirst'] = true
  }
  res.send(data)
}

exports.getNextPage = async (req, res) => {
  var quizID = await DBQuizs.getNextIDByID(req.params.quizID)
  var quizIDToday = await DBQuizs.getIDByTime()
  const quiz = await DBQuizs.getQuizByID(quizID)
  const comments = await DBComments.getCommentsByQuizID(quizID)
  var data = {}
  data['quiz'] = quiz
  data['comments'] = comments
  data['isFirst'] = false
  data['isLast'] = false
  
  if(quizID === quizIDToday){
    data['isLast'] = true
  }
  quizID = await DBQuizs.getNextIDByID(quizID)
  if(quizID === null){
    data['isLast'] = true
  }
  res.send(data)
}

exports.createQuiz = async (req, res) => {
  if(req.body.masterKey==config.password){
    const timeLast = await DBQuizs.getTimeLast()
    var today = new Date(timeLast)
    today.setDate(today.getDate()+1)
    var YYYY = today.getFullYear()
    var MM = ('0'+(today.getMonth()+1)).slice(-2)
    var DD = ('0'+(today.getDate())).slice(-2)
    var YYYYMMDD = `${YYYY}-${MM}-${DD}`

    var quiz = {
      'money': 0,
      'author':req.body.author,
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
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress
  const answer = await DBQuizs.getAnswerByID(req.params.quizID)
  if(answer == req.params.answer){
    // quiz is solved
    var nickname = await DBNicknames.getNicknameByIP(ip)
    await DBWinners.insertWinner({quizID:req.params.quizID, nickname:nickname, ip:ip})
    await DBQuizs.updateGotAnswerByID(req.params.quizID)
    const quiz = await DBQuizs.getQuizByID(req.params.quizID)
    WSConnector.broadcast('renew quiz', quiz)
    res.send('200')
  }
  else{
    var count = await DBAnswers.getCountByAnswer(req.params.quizID, req.params.answer)
    await DBAnswers.insertAnswer(req.params.quizID, req.params.answer, ip)
    res.send({state:'504', count: count})
  }
}
