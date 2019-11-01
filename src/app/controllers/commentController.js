const DBConnector = require('../db/DBConnector');



exports.getOneQuizComments = async (req, res) => {
  const connection = await DBConnector.getConnection()

  const [result] = await connection.query("SELECT * from comments")
  res.send(result)
};

  
exports.create = async (req, res) => {
    const connection = await DBConnector.getConnection()
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
 
    const [result] = await connection.query("insert into comments (quizID ,nickname, password, text, ip ,time ) VALUES ('"+ comment.quizID + "', '" + comment.nickname + "', '" + comment.password+ "', '" + comment.text+ "', '" + comment.ip+ "', '" + comment.time+ "') ")

    res.send(result)
};


exports.delete = async (req, res) => {

  const connection = await DBConnector.getConnection()

   await connection.query("SELECT password from comments where commentID='"+req.body.commentID+"'", function(err,  rows, fields) {
    if (!err)
    {
      var pwd=rows[0].password
      console.log('Select password', rows);

      if(pwd==req.body.password)
      {
          connection.query("DELETE FROM comments WHERE commentID ='"+req.body.commentID+"'", function(err,  rows, fields) {
          if (!err)
          {
              console.log('delete comments');
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


      

    //   const [result] = await connection.query("DELETE FROM comments WHERE commentID in (SELECT commentID from comments where commentID='"+req.body.commentID+"' and password='"+req.body.password+"')", function(err,  rows, fields) {
    //   if (!err)
    //   {
    //     res.send(result)
    //   }
    //   else
    //     console.log('Error while performing Select comments password Query.', err);
    // });


    

    
  };