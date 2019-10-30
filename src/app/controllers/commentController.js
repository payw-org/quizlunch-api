const connection = require('../db/DBConnector').connector;



exports.getOneQuizComments = (req, res) => {
    
  connection.query("SELECT * from Comments where quizID='"+req.body.quizID+"'", function(err,  rows, fields) {
         if (!err)
        {
          console.log('Select comments', rows);
          res.json(rows)
        }
        else
          console.log('Error while performing Select comments Query.', err);
      });


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
        console.log('Select password', rows);
      }
      else
        console.log('Error while performing Select comments password Query.', err);
    });

    

    connection.query("DELETE FROM Comments WHERE commentID ='"+req.body.commentID+"'", function(err,  rows, fields) {
    if (!err)
    {
        console.log('delete Comments', rows);
        res.send(200,'success');
    }
    else
        console.log('Error while delete comments performing Query.', err);
    });
  };