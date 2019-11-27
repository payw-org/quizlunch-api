const DBConnector = require('../db/DBConnector');


  exports.create = async (req, res) => {
    var dateNow = new Date()
    var YYYY = dateNow.getFullYear()
    var MM = ('0'+(dateNow.getMonth()+1)).slice(-2)
    var DD = ('0'+(dateNow.getDate())).slice(-2)
    var hh = ('0'+(dateNow.getHours())).slice(-2)
    var mm = ('0'+(dateNow.getMinutes())).slice(-2)
    var ss = ('0'+(dateNow.getSeconds())).slice(-2)
    var YYYYMMDDhhmmss = `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`

    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

    
    var quizStartAt = dateNow
    if(quizStartAt.getHours() < 12)
      quizStartAt.setDay(quizStartAt.getDate()-1)
    quizStartAt.setHours(12)
    quizStartAt.setMinutes(0)
    quizStartAt.setSeconds(0)
    var money = Math.floor((Date.now()-quizStartAt)/1000/20)

    var winner = {
                'quizID':req.body.quizID,
                'money':money,
                'nickname':req.body.nickname,
                'text':req.body.text,
                'ip':ip,
                'time':YYYYMMDDhhmmss
            };

    await DBConnector.insertWinner(winner)
    res.send("winner create sucsess")
  };
