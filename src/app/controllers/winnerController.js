const DBConnector = require('../db/DBConnector');


  exports.create = async (req, res) => {
    
    var nowTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Seoul"});
    nowTime = new Date(nowTime);
    var date = nowTime.getFullYear()+'-'+(nowTime.getMonth()+1)+'-'+nowTime.getDate();
    var time = nowTime.getHours() + ":" + nowTime.getMinutes() + ":" + nowTime.getSeconds();
    var ip = req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
    var dateTime = date + ' ' + time;

    const defaultMoney=1000;
    const quiz = await DBConnector.getQuiz(req.body.quizID)
    var quizTime = new Date(quiz.time)
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

    var winner = {
                'quizID':req.body.quizID,
                'money':nowMoney,
                'nickname':req.body.nickname,
                'text':req.body.text,
                'ip':ip,
                'time':dateTime 
            };

    await DBConnector.insertWinner(winner)
    res.send("winner create sucsess")
  };
