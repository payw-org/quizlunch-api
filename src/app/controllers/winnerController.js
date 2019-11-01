const connection = require('../db/DBConnector').getConnection();


  exports.create = (req, res) => {
    

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

    connection.query("insert into winners(quizID,nickname,text,ip,time) VALUES ('"+ winner.quizID + "', '" + winner.nickname + "','"+ winner.text + "', '" + winner.ip+ "', '" + winner.time + "') ", function(err,result){
        if (err) {
            console.error(err);
            throw err;
        }
        res.send(200,'success');
    });

  };