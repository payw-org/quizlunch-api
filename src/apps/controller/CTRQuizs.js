const WSConnector = require('../../websocket/WSConnector');
const DBQuizs = require('../../db/DBQuizs');
const DBComments = require('../../db/DBComments');

exports.getPreviousPage = async (req, res) => {
  const quizID = await DBQuizs.getPreviousIDByID(req.params.quizID)
  const quiz = await DBQuizs.getQuizByID(quizID)
  const comments = await DBComments.getCommentsByQuizID(quizID)
  WSConnector.broadcast('renew quiz', quiz)
  WSConnector.broadcast('renew comments', comments)
  res.send(200)
}

exports.getNextPage = async (req, res) => {
  const quizID = await DBQuizs.getNextIDByID(req.params.quizID)
  const quiz = await DBQuizs.getQuizByID(quizID)
  const comments = await DBComments.getCommentsByQuizID(quizID)
  WSConnector.broadcast('renew quiz', quiz)
  WSConnector.broadcast('renew comments', comments)
  res.send(200)
}

exports.createQuiz = async (req, res) => {
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
  res.send(200)
}

exports.checkAnswer = async (req, res) => {
  const answer = await DBQuizs.getAnswerByID(req.params.quizID)
  if(answer == req.params.answer){
    // quiz is solved
    await DBQuizs.updateGotAnswerByID(req.params.quizID)
    const quiz = await DBQuizs.getQuizByID(req.params.quizID)
    WSConnector.broadcast('renew quiz', quiz)
    res.send("correct")
  }
  else{
    res.send("wrong")
  }
}