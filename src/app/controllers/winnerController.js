const DBConnector = require('../db/DBConnector');


  exports.create = async (req, res) => {
    
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var ip = req.headers['x-forwarded-for'] ||
     req.connection.remoteAddress ||
     req.socket.remoteAddress ||
     req.connection.socket.remoteAddress;
    var dateTime = date + ' ' + time;


    var winner = {
                'quizID':req.body.quizID,
                'nickname':req.body.nickname,
                'text':req.body.text,
                'ip':ip,
                'time':dateTime 
            };

    const [result] = await DBConnector.insertWinner
    
    res.send("winner create sucsess")
  };