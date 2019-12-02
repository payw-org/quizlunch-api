const DBQuiz = require('../../db/DBQuizs')
const DBComments = require('../../db/DBComments')
const DBNicknames = require('../../db/DBNicknames')
const WSConnector = require('../../websocket/WSConnector')

exports.create = async (req, res) => {
  const axios = require('axios');
  const quizID = await DBQuiz.getIDByTime()
  var result

  if(req.body.quizID !== quizID){
    res.send('504')
    return
  }

  // ip
  var ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  // nickname
  var nickname = await DBNicknames.getNicknameByIP(ip)
  if(nickname === null){
    result = await axios.get('http://rng.api.quizlunch.com/new');
    nickname = result.data
    await DBNicknames.insertNickname({ip:ip, name:nickname})
  }

  // admin
  if(req.body.password == 'welovequizlunch1')
    nickname = 'Quizlunch Manager'
  if(req.body.password == 'welovequizlunch2')
    nickname = 'Quizlunch Developer'
  // time
  var today = new Date()
  var hh = ('0'+(today.getHours())).slice(-2)
  var mm = ('0'+(today.getMinutes())).slice(-2)
  var hhmm = `${hh}:${mm}`

  var comment = {
    'quizID':req.body.quizID,
    'nickname':nickname,
    'password':req.body.password,
    'text':req.body.text,
    'ip':ip,
    'time':hhmm 
  }
  await DBComments.insertComment(comment)
  comment.commentID = await DBComments.getIDByComment(comment)
  comment.password = '';
  comment.ip = comment.ip.substring(0,7) + '.***.***'
  WSConnector.broadcast('insert comment', comment)
  res.sendStatus(200)
}

exports.more = async (req, res) => {
  const result = await DBComments.getCommentsByQuizID(req.query.quizID, req.query.numOfComments)
  res.send(result)
}

exports.delete = async (req, res) => {
  const password = await DBComments.getPasswordByID(req.body.commentID)
  if(password === req.body.password){
    await DBComments.deleteCommentByID(req.body.commentID)
    WSConnector.broadcast('delete comment', req.body.commentID)
  }
  else{
    res.send(200,'wrong password');
  }
}


  
    

  