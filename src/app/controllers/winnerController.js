const DBConnector = require('../db/DBConnector');


  exports.create = async (req, res) => {
    

    const connection = await DBConnector.getConnection()

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;


    var winner = {
                'quizID':req.body.quizID,
                'nickname':req.body.nickname,
                'text':req.body.text,
                'ip':req.body.ip,
                'time':dateTime 
            };

    const [result] = await connection.query("insert into winners(quizID,nickname,text,ip,time) VALUES ('"+ winner.quizID + "', '" + winner.nickname + "','"+ winner.text + "', '" + winner.ip+ "', '" + winner.time + "') ")
    
    res.send(result)
  };