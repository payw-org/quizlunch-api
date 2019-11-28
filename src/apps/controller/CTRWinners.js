const DBWinners = require('../../db/DBWinners');
const DBQuizs = require('../../db/DBQuizs')

exports.update = async (req, res) => {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
  var quizID = await DBQuizs.getIDByTime()
  var winner = await DBWinners.getWinnerByQuizID(quizID)
  if(winner !== null && winner.ip === ip && winner.account === null){
    winner['fullName'] = req.body.fullName
    winner['bank'] = req.body.bank
    winner['account'] = req.body.account
    await DBWinners.updateWinner(winner)
    res.send('200')
  }
  else{
    res.send('504')
  }
}
