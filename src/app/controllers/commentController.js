const DBConnector = require('../db/DBConnector');



exports.getOneQuizComments = async (req, res) => {
  const connection = await DBConnector.getConnection()

  const [result] = await connection.query("SELECT * from comments")
  res.send(result)
};

  
exports.create = (req, res) => {
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;


    var comment = {
                'quizID':req.body.quizID,
                'nickname':req.body.nickname,
                'password':req.body.password,
                'text':req.body.text,
                'ip':req.body.ip,
                'time':dateTime 
            };
 
    connection.query("insert into Comments (quizID ,nickname, password, text, ip ,time ) VALUES ('"+ comment.quizID + "', '" + comment.nickname + "', '" + comment.password+ "', '" + comment.text+ "', '" + comment.ip+ "', '" + comment.time+ "') ", function(err,result){
        if (err) {
            console.error(err);
            throw err;
        }
        res.send(200,'success');
    });

};


exports.delete = (req, res) => {

      connection.query("SELECT password from Comments where commentID='"+req.body.commentID+"'", function(err,  rows, fields) {
      if (!err)
      {
        var pwd=rows[0].password
        console.log('Select password', rows);

        if(pwd==req.body.password)
        {
          connection.query("DELETE FROM Comments WHERE commentID ='"+req.body.commentID+"'", function(err,  rows, fields) {
            if (!err)
            {
                console.log('delete Comments');
                res.send(200,'suecess deleting');
            }
            else
                console.log('Error while delete comments performing Query.', err);
            });
        }
        else 
        {
          res.send(200,'wrong password');
        }
      }
      else
        console.log('Error while performing Select comments password Query.', err);
    });


    

    
  };